// Types pour le système de donations

export interface Donation {
  id: string;
  donateurId: string;
  montant: number;
  devise: string;
  methodePaiement: 'stripe' | 'paypal' | 'especes' | 'virement' | 'cheque' | 'mobile_money';
  statut: 'en_attente' | 'complete' | 'annule' | 'rembourse';
  dateDon: Date;
  dateConfirmation?: Date;
  projetId?: string;
  campagneId?: string;
  referenceExterne?: string;
  notes?: string;
  recuGenere: boolean;
  recuUrl?: string;
  fraisTransaction?: number;
  montantNet?: number;
  anonyme: boolean;
  messagePublic?: string;
  recuFiscal: boolean;
  periodicite?: 'ponctuel' | 'mensuel' | 'trimestriel' | 'annuel';
}

export interface Donateur {
  id: string;
  uid?: string; // Si lié à un utilisateur Firebase
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  pays?: string;
  typeDonateur: 'particulier' | 'entreprise' | 'organisation';
  entrepriseInfo?: {
    nomEntreprise: string;
    siret?: string;
    secteurActivite?: string;
  };
  preferences: {
    communication: 'email' | 'telephone' | 'postal' | 'aucune';
    anonymat: boolean;
    recuFiscal: boolean;
    publication: boolean;
  };
  totalDonne: number;
  nombreDons: number;
  dernierDon?: Date;
  niveau: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  badges: Badge[];
  dateInscription: Date;
  verified: boolean;
}

export interface Badge {
  id: string;
  nom: string;
  description: string;
  icone: string;
  couleur: string;
  condition: {
    type: 'montant_total' | 'nombre_dons' | 'anciennete' | 'projet_specifique';
    valeur: number;
  };
  dateObtention?: Date;
}

export interface Campaign {
  id: string;
  titre: string;
  description: string;
  objectif: number;
  montantActuel: number;
  nombreDonateurs: number;
  dateDebut: Date;
  dateFin: Date;
  projetId?: string;
  image?: string;
  statut: 'brouillon' | 'actif' | 'termine' | 'annule';
  visible: boolean;
  typeCampagne: 'urgence' | 'projet' | 'operationnel' | 'evenementiel';
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentStatus {
  success: boolean;
  paymentId?: string;
  error?: string;
  receiptUrl?: string;
}

export interface DonationReceipt {
  id: string;
  donationId: string;
  numero: string;
  dateGeneration: Date;
  urlPdf: string;
  envoye: boolean;
  dateEnvoi?: Date;
}

export interface ImpactMetrics {
  totalDonne: number;
  nombreDonateurs: number;
  montantMoyen: number;
  projetsFinances: number;
  beneficiairesAides: number;
  progressionMensuelle: {
    mois: string;
    montant: number;
    nombreDons: number;
  }[];
}

export interface DonationStats {
  aujourdHui: {
    montant: number;
    nombreDons: number;
  };
  cetteSemaine: {
    montant: number;
    nombreDons: number;
  };
  ceMois: {
    montant: number;
    nombreDons: number;
  };
  cetteAnnee: {
    montant: number;
    nombreDons: number;
  };
  total: {
    montant: number;
    nombreDons: number;
  };
}

export interface ManualDonationForm {
  donateur: {
    nom: string;
    prenom: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    typeDonateur: 'particulier' | 'entreprise' | 'organisation';
    entrepriseInfo?: {
      nomEntreprise: string;
      siret?: string;
    };
  };
  donation: {
    montant: number;
    devise: string;
    methodePaiement: 'especes' | 'virement' | 'cheque' | 'mobile_money';
    dateDon: Date;
    projetId?: string;
    campagneId?: string;
    referenceExterne?: string;
    notes?: string;
    recuFiscal: boolean;
    anonyme: boolean;
    messagePublic?: string;
  };
}

export interface DonationLevel {
  niveau: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  seuil: number;
  couleur: string;
  avantages: string[];
  icone: string;
}

export interface DonationSettings {
  fraisStripe: number; // Pourcentage
  fraisPayPal: number; // Pourcentage
  fraisFixes: number; // Montant fixe
  deviseDefaut: string;
  montantMinimum: number;
  montantMaximum: number;
  periodicitesAutorisees: ('ponctuel' | 'mensuel' | 'trimestriel' | 'annuel')[];
  methodePaiementAutorisees: ('stripe' | 'paypal' | 'especes' | 'virement' | 'cheque' | 'mobile_money')[];
}
