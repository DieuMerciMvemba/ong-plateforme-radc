export interface DomaineIntervention {
  id: string;
  titre: string;
  description: string;
  services?: string[];
  icone: string;
  couleur: string;
  images?: string[];
}

export interface Projet {
  id: string;
  titre: string;
  description: string;
  date: string;
  lieu?: string;
  objectif: string;
  categorie: string;
  images: string[];
  statut: 'en-cours' | 'termine' | 'planifie';
  progression?: number;
}

export interface Evenement {
  id: string;
  titre: string;
  date: string;
  lieu: string;
  description: string;
  images: string[];
  type: 'conference' | 'formation' | 'remise-brevets' | 'reunion';
}

export interface temoignage {
  id: string;
  nom: string;
  poste: string;
  temoignage: string;
  photo?: string;
  note: number;
}

export interface Actualite {
  id: string;
  titre: string;
  contenu: string;
  date: string;
  auteur: string;
  categorie: string;
  image?: string;
  images?: string[];
  tags?: string[];
}

export interface Membre {
  id: string;
  nom: string;
  poste: string;
  bio: string;
  photo: string;
  email?: string;
  telephone?: string;
  domaines?: string[];
}

export interface InfosRADC {
  nom: string;
  statutJuridique: {
    type: string;
    but: string;
    creation: string;
    enregistrement: string;
    personnaliteJuridique: string;
  };
  siege: {
    commune: string;
    ville: string;
    pays: string;
  };
  coordonnees: {
    telephone: string;
    email: string;
    siteWeb: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  objectifs: {
    global: string;
    specifics: string[];
  };
  valeurs: {
    titre: string;
    description: string;
  }[];
}

export interface Caracteristique {
  id: string;
  titre: string;
  description: string;
  details: string[];
  icone: string;
  couleur: string;
}

export interface Atout {
  id: string;
  titre: string;
  description: string;
  pointsForts: string[];
  icone: string;
}

export interface AppelAction {
  id: string;
  titre: string;
  message: string;
  action: string;
  type: 'principal' | 'newsletter' | 'secondaire';
}

export interface NavigationItem {
  id: string;
  titre: string;
  lien: string;
  sousItems?: NavigationItem[];
}

export type CategorieProjet = 
  | 'education'
  | 'sante'
  | 'entreprenariat'
  | 'culture-art'
  | 'leadership-femme'
  | 'genre-famille'
  | 'droits-homme'
  | 'forage-eau'
  | 'transport'
  | 'agriculture'
  | 'elevage'
  | 'batiment-travaux-publics'
  | 'geotechnique'
  | 'economie'
  | 'mines';

export type StatutProjet = 'en-cours' | 'termine' | 'planifie';
export type TypeEvenement = 'conference' | 'formation' | 'remise-brevets' | 'reunion';
