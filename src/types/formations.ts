export interface Formation {
  id: string;
  titre: string;
  description: string;
  objectif: string;
  duree: string; // ex: "2 jours", "1 semaine", "3 mois"
  niveau: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  categorie: string;
  formateur: {
    nom: string;
    bio?: string;
    photo?: string;
    specialites: string[];
  };
  programme: {
    modules: {
      titre: string;
      description: string;
      duree: string;
      objectifs: string[];
      contenu: string[];
    }[];
    projetFinal?: {
      description: string;
      duree: string;
      livrables: string[];
    };
  };
  prerequis: string[];
  competencesVisees: string[];
  methode: 'presentiel' | 'en_ligne' | 'hybride';
  lieu?: {
    adresse: string;
    ville: string;
    pays: string;
    coordonnees?: {
      latitude: number;
      longitude: number;
    };
  };
  dates: {
    debut: Date;
    fin: Date;
    horaires?: string;
  };
  capacite: {
    min: number;
    max: number;
    inscrits: number;
    listeAttente: number;
  };
  cout: {
    montant: number;
    devise: string;
    inclut: string[];
    options?: {
      nom: string;
      prix: number;
      description: string;
    }[];
  };
  certification: {
    disponible: boolean;
    nom?: string;
    description?: string;
    delivrance: 'automatique' | 'evaluation' | 'presence';
  };
  ressources: {
    type: 'document' | 'video' | 'lien' | 'outil';
    titre: string;
    url?: string;
    contenu?: string;
    taille?: string;
    format?: string;
  }[];
  evaluation: {
    methode: 'quiz' | 'projet' | 'presentation' | 'entretien';
    criteres: {
      nom: string;
      ponderation: number;
      description: string;
    }[];
    noteReussite: number;
  };
  statut: 'brouillon' | 'publie' | 'en_cours' | 'termine' | 'annule';
  visibilite: 'public' | 'prive' | 'membres_seulement';
  tags: string[];
  image?: string;
  videoPresentation?: string;
  dateCreation: Date;
  dateModification: Date;
  createurId: string;
}

export interface InscriptionFormation {
  id: string;
  formationId: string;
  participantId: string;
  dateInscription: Date;
  statut: 'en_attente' | 'confirme' | 'en_cours' | 'termine' | 'abandonne' | 'refuse';
  progression: {
    modulesTermines: string[];
    moduleEnCours?: string;
    pourcentage: number;
    tempsPasse: number; // en minutes
  };
  paiement: {
    statut: 'en_attente' | 'complete' | 'partiel' | 'rembourse';
    montant: number;
    methode: 'stripe' | 'paypal' | 'virement' | 'especes';
    datePaiement?: Date;
    referenceTransaction?: string;
  };
  notes?: {
    formateur: string;
    contenu: string;
    date: Date;
  }[];
  certificat?: {
    delivre: boolean;
    dateDelivrance?: Date;
    url?: string;
    reference?: string;
  };
  feedback?: {
    noteGenerale: number;
    commentaires: string;
    recommandations: string[];
    dateFeedback: Date;
  };
}

export interface ModuleFormation {
  id: string;
  formationId: string;
  titre: string;
  description: string;
  ordre: number;
  duree: string;
  objectifs: string[];
  contenu: {
    type: 'texte' | 'video' | 'document' | 'exercice' | 'quiz';
    titre: string;
    contenu: string;
    url?: string;
    duree?: string;
    obligatoire: boolean;
  }[];
  ressources: {
    type: 'document' | 'video' | 'lien' | 'outil';
    titre: string;
    url?: string;
    contenu?: string;
  }[];
  evaluation?: {
    type: 'quiz' | 'exercice' | 'projet';
    questions: {
      question: string;
      type: 'choix_multiple' | 'vrai_faux' | 'texte_libre';
      options?: string[];
      reponseCorrecte: string | string[];
      points: number;
    }[];
    noteReussite: number;
    tentativesMax?: number;
  };
  prerequis?: string[];
  statut: 'brouillon' | 'publie';
  dateCreation: Date;
  dateModification: Date;
}

export interface Certificat {
  id: string;
  participantId: string;
  formationId: string;
  reference: string;
  dateDelivrance: Date;
  url: string;
  format: 'pdf' | 'png' | 'jpg';
  valide: boolean;
  dateValidite?: Date;
  qrCode?: string;
  verificateurUrl: string;
  signatureNumerique?: string;
  metadonnees: {
    nomParticipant: string;
    nomFormation: string;
    dureeFormation: string;
    competencesAcquises: string[];
    niveauAtteint: string;
    noteFinale?: number;
  };
}

export interface Formateur {
  id: string;
  userId: string;
  profil: {
    nom: string;
    bio: string;
    photo?: string;
    specialites: string[];
    experience: {
      domaine: string;
      annees: number;
      description: string;
    }[];
    formations: {
      titre: string;
      organisme: string;
      annee: number;
    }[];
  };
  disponibilites: {
    jours: string[];
    horaires: string;
    fuseauHoraire: string;
  };
  notation: {
    moyenne: number;
    nombreAvis: number;
    dernierAvis?: Date;
  };
  statut: 'actif' | 'inactif' | 'en_pause';
  dateCreation: Date;
}

export interface CategorieFormation {
  id: string;
  nom: string;
  description: string;
  icone: string;
  couleur: string;
  ordre: number;
  parent?: string;
  formations: string[]; // IDs des formations
  statut: 'actif' | 'inactif';
}
