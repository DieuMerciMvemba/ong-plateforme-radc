export interface StatistiquesDashboard {
  totalProjets: number;
  projetsActifs: number;
  projetsTermines: number;
  beneficiaires: number;
  domainesCouverts: number;
  progressionGlobale: number;
  budgetTotal: number;
  budgetUtilise: number;
}

export interface ProjetDashboard {
  id: string;
  titre: string;
  description: string;
  domaineId: string;
  domaineNom: string;
  statut: 'en-cours' | 'termine' | 'en-attente' | 'planifie';
  progression: number;
  budget: number;
  budgetUtilise: number;
  beneficiaires: number;
  dateDebut: string;
  dateFin: string;
  localisation: {
    latitude: number;
    longitude: number;
    adresse: string;
  };
  equipe: {
    coordinateur: string;
    membres: number;
    volontaires: number;
  };
  medias: string[];
  dernierMaj: string;
}

export interface DomaineDashboard {
  id: string;
  nom: string;
  description: string;
  icone: string;
  couleur: string;
  projetsCount: number;
  beneficiaires: number;
  budget: number;
  progression: number;
  tendance: 'hausse' | 'baisse' | 'stable';
}

export interface ActiviteRecente {
  id: string;
  type: 'projet' | 'donation' | 'benevole' | 'evenement' | 'publication';
  titre: string;
  description: string;
  date: string;
  auteur: string;
  importance: 'haute' | 'moyenne' | 'faible';
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  titre: string;
  message: string;
  date: string;
  lue: boolean;
  action?: {
    texte: string;
    url: string;
  };
}

export interface FiltrerProjets {
  domaine?: string;
  statut?: string;
  periode?: string;
  localisation?: string;
  equipe?: string;
}

export interface CartographiePoint {
  id: string;
  projetId: string;
  titre: string;
  latitude: number;
  longitude: number;
  type: 'projet' | 'evenement' | 'partenaire';
  statut: string;
  description: string;
}
