import { loadStripe } from '@stripe/stripe-js';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { 
  Donation, 
  Donateur, 
  Campaign, 
  PaymentIntent, 
  PaymentStatus, 
  ManualDonationForm,
  DonationStats,
  ImpactMetrics
} from '../types/donations';

// Configuration Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Service de donation Stripe
export class StripeDonationService {
  static async createPaymentIntent(
    amount: number, 
    currency: string = 'EUR',
    projectId?: string,
    donateurId?: string
  ): Promise<PaymentIntent> {
    try {
      // Créer le payment intent via votre backend ou fonction cloud
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Stripe utilise les centimes
          currency,
          projectId,
          donateurId
        })
      });

      const paymentIntent = await response.json();
      
      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status
      };
    } catch (error) {
      console.error('Erreur création payment intent:', error);
      throw new Error('Impossible de créer le paiement Stripe');
    }
  }

  static async confirmPayment(paymentIntentId: string): Promise<PaymentStatus> {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe non initialisé');

      const response = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId })
      });

      const result = await response.json();
      
      return {
        success: result.status === 'succeeded',
        paymentId: result.id,
        receiptUrl: result.receipt_url
      };
    } catch (error) {
      console.error('Erreur confirmation paiement:', error);
      return {
        success: false,
        error: 'Erreur lors de la confirmation du paiement'
      };
    }
  }
}

// Service de donation PayPal
export class PayPalDonationService {
  static async createOrder(amount: number, currency: string = 'EUR'): Promise<any> {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency })
      });

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Erreur création ordre PayPal:', error);
      throw new Error('Impossible de créer l\'ordre PayPal');
    }
  }

  static async capturePayment(orderId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID: orderId })
      });

      const result = await response.json();
      
      return {
        success: result.status === 'COMPLETED',
        paymentId: result.id,
        error: result.error
      };
    } catch (error) {
      console.error('Erreur capture paiement PayPal:', error);
      return {
        success: false,
        error: 'Erreur lors de la capture du paiement PayPal'
      };
    }
  }
}

// Service principal de donation
export class DonationService {
  // Créer une donation
  static async createDonation(donationData: Omit<Donation, 'id' | 'dateDon'>): Promise<string> {
    try {
      const donation = {
        ...donationData,
        dateDon: serverTimestamp(),
        montantNet: donationData.montant - (donationData.fraisTransaction || 0)
      };

      const docRef = await addDoc(collection(db, 'donations'), donation);
      
      // Mettre à jour les statistiques du donateur
      await this.updateDonateurStats(donationData.donateurId, donationData.montant);
      
      // Mettre à jour la campagne si applicable
      if (donationData.campagneId) {
        await this.updateCampaignStats(donationData.campagneId, donationData.montant);
      }

      return docRef.id;
    } catch (error) {
      console.error('Erreur création donation:', error);
      throw new Error('Impossible de créer la donation');
    }
  }

  // Créer une donation manuelle (pour les dons en espèces/virement)
  static async createManualDonation(formData: ManualDonationForm): Promise<string> {
    try {
      // Créer ou retrouver le donateur
      let donateurId: string;
      
      if (formData.donateur.email) {
        // Chercher si le donateur existe déjà
        const q = query(
          collection(db, 'donateurs'), 
          where('email', '==', formData.donateur.email)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          donateurId = querySnapshot.docs[0].id;
          // Mettre à jour les infos du donateur
          await updateDoc(doc(db, 'donateurs', donateurId), {
            ...formData.donateur,
            dernierDon: serverTimestamp()
          });
        } else {
          // Créer un nouveau donateur
          const donateurData = {
            ...formData.donateur,
            totalDonne: formData.donation.montant,
            nombreDons: 1,
            niveau: this.calculateDonorLevel(formData.donation.montant),
            badges: [],
            dateInscription: serverTimestamp(),
            verified: false,
            dernierDon: serverTimestamp()
          };
          
          const donateurRef = await addDoc(collection(db, 'donateurs'), donateurData);
          donateurId = donateurRef.id;
        }
      } else {
        // Créer un donateur sans email
        const donateurData = {
          ...formData.donateur,
          totalDonne: formData.donation.montant,
          nombreDons: 1,
          niveau: this.calculateDonorLevel(formData.donation.montant),
          badges: [],
          dateInscription: serverTimestamp(),
          verified: false,
          dernierDon: serverTimestamp()
        };
        
        const donateurRef = await addDoc(collection(db, 'donateurs'), donateurData);
        donateurId = donateurRef.id;
      }

      // Créer la donation
      const donationData: Omit<Donation, 'id' | 'dateDon'> = {
        donateurId,
        montant: formData.donation.montant,
        devise: 'EUR',
        methodePaiement: formData.donation.methodePaiement,
        statut: 'complete',
        projetId: formData.donation.projetId,
        campagneId: formData.donation.campagneId,
        referenceExterne: formData.donation.referenceExterne,
        notes: formData.donation.notes,
        recuGenere: false,
        fraisTransaction: 0,
        recuFiscal: formData.donation.recuFiscal,
        anonyme: formData.donation.anonyme,
        messagePublic: formData.donation.messagePublic,
        periodicite: 'ponctuel'
      };

      return await this.createDonation(donationData);
    } catch (error) {
      console.error('Erreur création donation manuelle:', error);
      throw new Error('Impossible de créer la donation manuelle');
    }
  }

  // Mettre à jour les statistiques du donateur
  private static async updateDonateurStats(donateurId: string, montant: number): Promise<void> {
    try {
      const donateurRef = doc(db, 'donateurs', donateurId);
      const donateurDoc = await getDoc(donateurRef);
      
      if (donateurDoc.exists()) {
        const donateur = donateurDoc.data() as Donateur;
        const nouveauTotal = donateur.totalDonne + montant;
        const nouveauNombre = donateur.nombreDons + 1;
        const nouveauNiveau = this.calculateDonorLevel(nouveauTotal);
        
        await updateDoc(donateurRef, {
          totalDonne: nouveauTotal,
          nombreDons: nouveauNombre,
          niveau: nouveauNiveau,
          dernierDon: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Erreur mise à jour stats donateur:', error);
    }
  }

  // Mettre à jour les statistiques de la campagne
  private static async updateCampaignStats(campagneId: string, montant: number): Promise<void> {
    try {
      const campagneRef = doc(db, 'campagnes', campagneId);
      const campagneDoc = await getDoc(campagneRef);
      
      if (campagneDoc.exists()) {
        const campagne = campagneDoc.data() as Campaign;
        await updateDoc(campagneRef, {
          montantActuel: campagne.montantActuel + montant,
          nombreDonateurs: campagne.nombreDonateurs + 1
        });
      }
    } catch (error) {
      console.error('Erreur mise à jour stats campagne:', error);
    }
  }

  // Calculer le niveau du donateur
  private static calculateDonorLevel(totalAmount: number): 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' {
    if (totalAmount >= 10000) return 'diamond';
    if (totalAmount >= 5000) return 'platinum';
    if (totalAmount >= 1000) return 'gold';
    if (totalAmount >= 500) return 'silver';
    return 'bronze';
  }

  // Récupérer les donations d'un donateur
  static async getDonateurDonations(donateurId: string): Promise<Donation[]> {
    try {
      const q = query(
        collection(db, 'donations'),
        where('donateurId', '==', donateurId),
        orderBy('dateDon', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const donation = doc.data() as Donation;
        return {
          ...donation,
          id: doc.id,
          dateDon: donation.dateDon instanceof Timestamp ? donation.dateDon.toDate() : new Date(),
          dateConfirmation: donation.dateConfirmation instanceof Timestamp ? donation.dateConfirmation.toDate() : undefined
        };
      }) as Donation[];
    } catch (error) {
      console.error('Erreur récupération donations donateur:', error);
      return [];
    }
  }

  // Récupérer les statistiques de donations
  static async getDonationStats(): Promise<DonationStats> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
      const yearAgo = new Date(now.getFullYear(), 0, 1);

      const stats: DonationStats = {
        aujourdHui: { montant: 0, nombreDons: 0 },
        cetteSemaine: { montant: 0, nombreDons: 0 },
        ceMois: { montant: 0, nombreDons: 0 },
        cetteAnnee: { montant: 0, nombreDons: 0 },
        total: { montant: 0, nombreDons: 0 }
      };

      // Récupérer toutes les donations
      const querySnapshot = await getDocs(collection(db, 'donations'));
      
      querySnapshot.docs.forEach(doc => {
        const donation = doc.data() as Donation;
        const donationDate = donation.dateDon instanceof Timestamp ? donation.dateDon.toDate() : new Date();
        const montant = donation.montantNet || donation.montant;

        stats.total.montant += montant;
        stats.total.nombreDons++;

        if (donationDate >= today) {
          stats.aujourdHui.montant += montant;
          stats.aujourdHui.nombreDons++;
        }

        if (donationDate >= weekAgo) {
          stats.cetteSemaine.montant += montant;
          stats.cetteSemaine.nombreDons++;
        }

        if (donationDate >= monthAgo) {
          stats.ceMois.montant += montant;
          stats.ceMois.nombreDons++;
        }

        if (donationDate >= yearAgo) {
          stats.cetteAnnee.montant += montant;
          stats.cetteAnnee.nombreDons++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Erreur récupération stats donations:', error);
      return this.getEmptyStats();
    }
  }

  private static getEmptyStats(): DonationStats {
    return {
      aujourdHui: { montant: 0, nombreDons: 0 },
      cetteSemaine: { montant: 0, nombreDons: 0 },
      ceMois: { montant: 0, nombreDons: 0 },
      cetteAnnee: { montant: 0, nombreDons: 0 },
      total: { montant: 0, nombreDons: 0 }
    };
  }

  // Récupérer les métriques d'impact
  static async getImpactMetrics(): Promise<ImpactMetrics> {
    try {
      const stats = await this.getDonationStats();
      
      // Calculer le montant moyen
      const montantMoyen = stats.total.nombreDons > 0 
        ? stats.total.montant / stats.total.nombreDons 
        : 0;

      // Récupérer le nombre de projets financés
      const projetsQuery = query(collection(db, 'projets'));
      const projetsSnapshot = await getDocs(projetsQuery);
      const projetsFinances = projetsSnapshot.docs.length;

      // Estimer les bénéficiaires (basé sur le montant total)
      const beneficiairesAides = Math.floor(stats.total.montant / 50); // ~50€ par bénéficiaire

      // Progression mensuelle (simplifié)
      const progressionMensuelle = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const mois = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        
        progressionMensuelle.push({
          mois,
          montant: Math.floor(Math.random() * 10000) + 5000, // Simulé pour l'instant
          nombreDons: Math.floor(Math.random() * 50) + 10
        });
      }

      return {
        totalDonne: stats.total.montant,
        nombreDonateurs: stats.total.nombreDons,
        montantMoyen,
        projetsFinances,
        beneficiairesAides,
        progressionMensuelle
      };
    } catch (error) {
      console.error('Erreur récupération métriques impact:', error);
      return {
        totalDonne: 0,
        nombreDonateurs: 0,
        montantMoyen: 0,
        projetsFinances: 0,
        beneficiairesAides: 0,
        progressionMensuelle: []
      };
    }
  }
}
