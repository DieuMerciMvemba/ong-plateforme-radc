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
  Formation, 
  InscriptionFormation, 
  Certificat, 
  CategorieFormation
} from '../types/formations';

// Service pour la gestion des formations
export class FormationService {
  static async creerFormation(formation: Omit<Formation, 'id' | 'dateCreation' | 'dateModification'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'formations'), {
      ...formation,
      dates: {
        ...formation.dates,
        debut: Timestamp.fromDate(formation.dates.debut),
        fin: Timestamp.fromDate(formation.dates.fin)
      },
      dateCreation: serverTimestamp(),
      dateModification: serverTimestamp()
    });
    return docRef.id;
  }

  static async getFormationsPubliees(): Promise<Formation[]> {
    const q = query(
      collection(db, 'formations'),
      where('statut', '==', 'publie'),
      where('visibilite', '==', 'public'),
      orderBy('dates.debut', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Formation;
      return {
        ...data,
        id: doc.id,
        dates: {
          ...data.dates,
          debut: data.dates.debut instanceof Timestamp ? data.dates.debut.toDate() : new Date(),
          fin: data.dates.fin instanceof Timestamp ? data.dates.fin.toDate() : new Date()
        },
        dateCreation: data.dateCreation instanceof Timestamp ? data.dateCreation.toDate() : new Date(),
        dateModification: data.dateModification instanceof Timestamp ? data.dateModification.toDate() : new Date()
      };
    });
  }

  static async getFormationsParCategorie(categorieId: string): Promise<Formation[]> {
    const q = query(
      collection(db, 'formations'),
      where('categorie', '==', categorieId),
      where('statut', '==', 'publie'),
      where('visibilite', '==', 'public'),
      orderBy('dates.debut', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Formation;
      return {
        ...data,
        id: doc.id,
        dates: {
          ...data.dates,
          debut: data.dates.debut instanceof Timestamp ? data.dates.debut.toDate() : new Date(),
          fin: data.dates.fin instanceof Timestamp ? data.dates.fin.toDate() : new Date()
        },
        dateCreation: data.dateCreation instanceof Timestamp ? data.dateCreation.toDate() : new Date(),
        dateModification: data.dateModification instanceof Timestamp ? data.dateModification.toDate() : new Date()
      };
    });
  }

  static async getFormationParId(formationId: string): Promise<Formation | null> {
    const docRef = doc(db, 'formations', formationId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data() as Formation;
    return {
      ...data,
      id: docSnap.id,
      dates: {
        ...data.dates,
        debut: data.dates.debut instanceof Timestamp ? data.dates.debut.toDate() : new Date(),
        fin: data.dates.fin instanceof Timestamp ? data.dates.fin.toDate() : new Date()
      },
      dateCreation: data.dateCreation instanceof Timestamp ? data.dateCreation.toDate() : new Date(),
      dateModification: data.dateModification instanceof Timestamp ? data.dateModification.toDate() : new Date()
    };
  }

  static async rechercherFormations(terme: string, filtres?: {
    categorie?: string;
    niveau?: string;
    methode?: string;
    prixMax?: number;
  }): Promise<Formation[]> {
    let q = query(
      collection(db, 'formations'),
      where('statut', '==', 'publie'),
      where('visibilite', '==', 'public')
    );

    // Appliquer les filtres
    if (filtres?.categorie) {
      q = query(q, where('categorie', '==', filtres.categorie));
    }
    if (filtres?.niveau) {
      q = query(q, where('niveau', '==', filtres.niveau));
    }
    if (filtres?.methode) {
      q = query(q, where('methode', '==', filtres.methode));
    }
    if (filtres?.prixMax) {
      q = query(q, where('cout.montant', '<=', filtres.prixMax));
    }

    q = query(q, orderBy('dates.debut', 'asc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Formation;
      return {
        ...data,
        id: doc.id,
        dates: {
          ...data.dates,
          debut: data.dates.debut instanceof Timestamp ? data.dates.debut.toDate() : new Date(),
          fin: data.dates.fin instanceof Timestamp ? data.dates.fin.toDate() : new Date()
        },
        dateCreation: data.dateCreation instanceof Timestamp ? data.dateCreation.toDate() : new Date(),
        dateModification: data.dateModification instanceof Timestamp ? data.dateModification.toDate() : new Date()
      };
    }).filter(formation => 
      formation.titre.toLowerCase().includes(terme.toLowerCase()) ||
      formation.description.toLowerCase().includes(terme.toLowerCase()) ||
      formation.tags.some(tag => tag.toLowerCase().includes(terme.toLowerCase()))
    );
  }

  static async mettreAJourFormation(formationId: string, updates: Partial<Formation>): Promise<void> {
    const docRef = doc(db, 'formations', formationId);
    await updateDoc(docRef, {
      ...updates,
      dateModification: serverTimestamp()
    });
  }

  static async supprimerFormation(formationId: string): Promise<void> {
    const docRef = doc(db, 'formations', formationId);
    await updateDoc(docRef, { 
      statut: 'annule',
      dateModification: serverTimestamp()
    });
  }
}

// Service pour la gestion des inscriptions
export class InscriptionService {
  static async inscrireFormation(inscription: Omit<InscriptionFormation, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'inscriptions_formations'), {
      ...inscription,
      dateInscription: Timestamp.fromDate(inscription.dateInscription),
      progression: {
        ...inscription.progression,
        modulesTermines: []
      }
    });
    return docRef.id;
  }

  static async getInscriptionsParParticipant(participantId: string): Promise<InscriptionFormation[]> {
    const q = query(
      collection(db, 'inscriptions_formations'),
      where('participantId', '==', participantId),
      orderBy('dateInscription', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as InscriptionFormation;
      return {
        ...data,
        id: doc.id,
        dateInscription: data.dateInscription instanceof Timestamp ? data.dateInscription.toDate() : new Date()
      };
    });
  }

  static async getInscriptionsParFormation(formationId: string): Promise<InscriptionFormation[]> {
    const q = query(
      collection(db, 'inscriptions_formations'),
      where('formationId', '==', formationId),
      orderBy('dateInscription', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as InscriptionFormation;
      return {
        ...data,
        id: doc.id,
        dateInscription: data.dateInscription instanceof Timestamp ? data.dateInscription.toDate() : new Date()
      };
    });
  }

  static async mettreAJourProgression(inscriptionId: string, progression: Partial<InscriptionFormation['progression']>): Promise<void> {
    const docRef = doc(db, 'inscriptions_formations', inscriptionId);
    await updateDoc(docRef, {
      progression: progression
    });
  }

  static async confirmerInscription(inscriptionId: string): Promise<void> {
    const docRef = doc(db, 'inscriptions_formations', inscriptionId);
    await updateDoc(docRef, {
      statut: 'confirme'
    });
  }

  static async terminerInscription(inscriptionId: string, feedback?: InscriptionFormation['feedback']): Promise<void> {
    const docRef = doc(db, 'inscriptions_formations', inscriptionId);
    const updates: Partial<InscriptionFormation> = {
      statut: 'termine'
    };
    
    if (feedback) {
      updates.feedback = feedback;
    }
    
    await updateDoc(docRef, updates);
  }
}

// Service pour la gestion des certificats
export class CertificatService {
  static async genererCertificat(certificat: Omit<Certificat, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'certificats'), {
      ...certificat,
      dateDelivrance: Timestamp.fromDate(certificat.dateDelivrance),
      valide: true
    });
    return docRef.id;
  }

  static async getCertificatsParParticipant(participantId: string): Promise<Certificat[]> {
    const q = query(
      collection(db, 'certificats'),
      where('participantId', '==', participantId),
      orderBy('dateDelivrance', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Certificat;
      return {
        ...data,
        id: doc.id,
        dateDelivrance: data.dateDelivrance instanceof Timestamp ? data.dateDelivrance.toDate() : new Date(),
        dateValidite: data.dateValidite instanceof Timestamp ? data.dateValidite.toDate() : undefined
      };
    });
  }

  static async validerCertificat(certificatId: string): Promise<void> {
    const docRef = doc(db, 'certificats', certificatId);
    await updateDoc(docRef, {
      valide: true
    });
  }

  static async verifierCertificat(reference: string): Promise<Certificat | null> {
    const q = query(
      collection(db, 'certificats'),
      where('reference', '==', reference),
      where('valide', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    const data = querySnapshot.docs[0].data() as Certificat;
    return {
      ...data,
      id: querySnapshot.docs[0].id,
      dateDelivrance: data.dateDelivrance instanceof Timestamp ? data.dateDelivrance.toDate() : new Date(),
      dateValidite: data.dateValidite instanceof Timestamp ? data.dateValidite.toDate() : undefined
    };
  }
}

// Service pour la gestion des catégories de formations
export class CategorieFormationService {
  static async creerCategorie(categorie: Omit<CategorieFormation, 'id' | 'formations'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'categories_formations'), {
      ...categorie,
      formations: [],
      statut: 'actif'
    });
    return docRef.id;
  }

  static async getCategoriesActives(): Promise<CategorieFormation[]> {
    const q = query(
      collection(db, 'categories_formations'),
      where('statut', '==', 'actif'),
      orderBy('ordre', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data() as CategorieFormation,
      id: doc.id
    }));
  }

  static async mettreAJourCategorie(categorieId: string, updates: Partial<CategorieFormation>): Promise<void> {
    const docRef = doc(db, 'categories_formations', categorieId);
    await updateDoc(docRef, updates);
  }
}
