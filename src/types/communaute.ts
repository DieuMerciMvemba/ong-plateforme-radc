export interface Evenement {
  id: string;
  titre: string;
  description: string;
  date: Date;
  lieu: string;
  type: 'formation' | 'reunion' | 'evenement_social' | 'atelier' | 'conference';
  capacite: number;
  inscrits: number;
  image?: string;
  statut: 'a_venir' | 'en_cours' | 'termine' | 'annule';
  organisateur: string;
  tags: string[];
  frais?: number;
}

export interface OpportuniteBenevolat {
  id: string;
  titre: string;
  description: string;
  domaine: string;
  duree: string; // ex: "3 mois", "6 mois"
  tempsRequis: string; // ex: "5h/semaine", "2j/mois"
  competences: string[];
  lieu: string;
  type: 'presentiel' | 'distance' | 'hybride';
  statut: 'disponible' | 'en_cours' | 'pourvu';
  dateLimite?: Date;
  contact: {
    email: string;
    telephone?: string;
  };
  descriptionTaches?: string;
  avantages?: string[];
}

export interface AnnonceCommunautaire {
  id: string;
  titre: string;
  contenu: string;
  categorie: 'information' | 'partage' | 'aide' | 'collaboration' | 'actualite';
  auteur: {
    nom: string;
    email: string;
    role?: string;
    avatar?: string;
  };
  datePublication: Date;
  tags: string[];
  likes: number;
  reponses: number;
  statut: 'publie' | 'moderation' | 'archive';
  pieceJointe?: string;
  important: boolean;
}

export interface ProjetCommunautaire {
  id: string;
  titre: string;
  description: string;
  porteur: string;
  objectif: string;
  progression: number;
  domaine: string;
  dateDebut: Date;
  dateFinPrevue?: Date;
  statut: 'en_preparation' | 'en_cours' | 'en_attente' | 'termine' | 'abandonne';
  participants: string[];
  competencesRequises: string[];
  ressources: {
    type: 'document' | 'lien' | 'outil';
    titre: string;
    url?: string;
    description?: string;
  }[];
  besoins?: string[];
}

export interface RessourcePartagee {
  id: string;
  titre: string;
  description: string;
  type: 'document' | 'guide' | 'outil' | 'modele' | 'video' | 'lien';
  categorie: string;
  auteur: string;
  dateAjout: Date;
  fichier?: string;
  lien?: string;
  tailleFichier?: string;
  format?: string;
  tags: string[];
  telechargements: number;
  noteMoyenne: number;
  evaluations: number;
  statut: 'publie' | 'moderation' | 'archive';
}

export interface MembreCommunaute {
  id: string;
  nom: string;
  email: string;
  role: string;
  specialites: string[];
  localisation: string;
  bio?: string;
  photo?: string;
  dateInscription: Date;
  contributions: {
    projets: number;
    evenements: number;
    ressources: number;
    heuresBenevolat: number;
  };
  competences: {
    nom: string;
    niveau: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  }[];
  disponibilites: {
    jour: string;
    heures: string;
  }[];
  reseauxSociaux?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface ForumCategorie {
  id: string;
  nom: string;
  description: string;
  icone: string;
  couleur: string;
  ordre: number;
  statut: 'actif' | 'inactif';
  nombreSujets: number;
  nombreMessages: number;
  dernierMessage?: {
    titre: string;
    auteur: string;
    date: Date;
  };
}

export interface ForumSujet {
  id: string;
  titre: string;
  contenu: string;
  categorie: string;
  auteur: {
    nom: string;
    email: string;
    avatar?: string;
  };
  dateCreation: Date;
  dateDerniereActivite: Date;
  statut: 'ouvert' | 'resolu' | 'ferme' | 'epingle';
  tags: string[];
  reponses: number;
  vues: number;
  votes: number;
}

export interface ForumMessage {
  id: string;
  sujetId: string;
  contenu: string;
  auteur: {
    nom: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  datePublication: Date;
  dateModification?: Date;
  statut: 'publie' | 'moderation' | 'supprime';
  votes: number;
  pieceJointe?: string;
  reponseA?: string; // ID du message auquel il répond
}
