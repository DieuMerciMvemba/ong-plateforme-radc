import type { 
  StatistiquesDashboard, 
  ProjetDashboard, 
  DomaineDashboard, 
  ActiviteRecente, 
  Alert,
  CartographiePoint 
} from '../types/dashboard';

export const statistiquesDashboard: StatistiquesDashboard = {
  totalProjets: 47,
  projetsActifs: 23,
  projetsTermines: 18,
  beneficiaires: 15420,
  domainesCouverts: 15,
  progressionGlobale: 67,
  budgetTotal: 2500000,
  budgetUtilise: 1675000
};

export const projetsDashboard: ProjetDashboard[] = [
  {
    id: 'proj-001',
    titre: 'Centre de Formation Professionnelle',
    description: 'Construction et équipement d\'un centre de formation pour les jeunes de Kinshasa',
    domaineId: 'education',
    domaineNom: 'Éducation',
    statut: 'en-cours',
    progression: 75,
    budget: 500000,
    budgetUtilise: 375000,
    beneficiaires: 250,
    dateDebut: '2024-01-15',
    dateFin: '2024-12-31',
    localisation: {
      latitude: -4.4419,
      longitude: 15.2663,
      adresse: 'Lemba, Kinshasa, RDC'
    },
    equipe: {
      coordinateur: 'Jean-Pierre Tshibanda',
      membres: 8,
      volontaires: 15
    },
    medias: [
      '/medias/projets/formation-01.jpg',
      '/medias/projets/formation-02.jpg'
    ],
    dernierMaj: '2024-02-08T14:30:00Z'
  },
  {
    id: 'proj-002',
    titre: 'Programme d\'Assainissement',
    description: 'Installation de systèmes d\'assainissement dans les quartiers défavorisés',
    domaineId: 'sante',
    domaineNom: 'Santé',
    statut: 'en-cours',
    progression: 45,
    budget: 300000,
    budgetUtilise: 135000,
    beneficiaires: 1200,
    dateDebut: '2024-02-01',
    dateFin: '2024-08-31',
    localisation: {
      latitude: -4.3225,
      longitude: 15.3134,
      adresse: 'Kalamu, Kinshasa, RDC'
    },
    equipe: {
      coordinateur: 'Marie Lwamba',
      membres: 5,
      volontaires: 20
    },
    medias: [
      '/medias/projets/assainissement-01.jpg'
    ],
    dernierMaj: '2024-02-07T10:15:00Z'
  },
  {
    id: 'proj-003',
    titre: 'Incubation d\'Entreprises',
    description: 'Accompagnement des jeunes entrepreneurs dans le lancement de leurs activités',
    domaineId: 'entrepreneuriat',
    domaineNom: 'Entreprenariat',
    statut: 'en-cours',
    progression: 60,
    budget: 200000,
    budgetUtilise: 120000,
    beneficiaires: 80,
    dateDebut: '2024-01-10',
    dateFin: '2024-06-30',
    localisation: {
      latitude: -4.4030,
      longitude: 15.3280,
      adresse: 'Gombe, Kinshasa, RDC'
    },
    equipe: {
      coordinateur: 'Claude Mukendi',
      membres: 4,
      volontaires: 10
    },
    medias: [
      '/medias/projets/incubation-01.jpg',
      '/medias/projets/incubation-02.jpg'
    ],
    dernierMaj: '2024-02-06T16:45:00Z'
  },
  {
    id: 'proj-004',
    titre: 'Forêt Communautaire',
    description: 'Projet de reboisement et de gestion durable des ressources forestières',
    domaineId: 'environnement',
    domaineNom: 'Environnement',
    statut: 'planifie',
    progression: 10,
    budget: 150000,
    budgetUtilise: 15000,
    beneficiaires: 500,
    dateDebut: '2024-03-01',
    dateFin: '2024-12-31',
    localisation: {
      latitude: -4.3512,
      longitude: 15.2742,
      adresse: 'Mont-Ngafula, Kinshasa, RDC'
    },
    equipe: {
      coordinateur: 'Pierre Kambale',
      membres: 3,
      volontaires: 25
    },
    medias: [],
    dernierMaj: '2024-02-05T09:30:00Z'
  }
];

export const domainesDashboard: DomaineDashboard[] = [
  {
    id: 'education',
    nom: 'Éducation',
    description: 'Formation et éducation pour tous',
    icone: 'book',
    couleur: 'blue',
    projetsCount: 12,
    beneficiaires: 3500,
    budget: 800000,
    progression: 72,
    tendance: 'hausse'
  },
  {
    id: 'sante',
    nom: 'Santé',
    description: 'Accès aux soins de santé',
    icone: 'heart',
    couleur: 'red',
    projetsCount: 8,
    beneficiaires: 4200,
    budget: 600000,
    progression: 58,
    tendance: 'stable'
  },
  {
    id: 'entrepreneuriat',
    nom: 'Entreprenariat',
    description: 'Soutien aux entrepreneurs',
    icone: 'briefcase',
    couleur: 'green',
    projetsCount: 6,
    beneficiaires: 180,
    budget: 400000,
    progression: 65,
    tendance: 'hausse'
  },
  {
    id: 'environnement',
    nom: 'Environnement',
    description: 'Protection environnementale',
    icone: 'sprout',
    couleur: 'emerald',
    projetsCount: 5,
    beneficiaires: 1200,
    budget: 300000,
    progression: 45,
    tendance: 'baisse'
  },
  {
    id: 'eau',
    nom: 'Eau et Assainissement',
    description: 'Accès à l\'eau potable',
    icone: 'droplet',
    couleur: 'cyan',
    projetsCount: 4,
    beneficiaires: 2800,
    budget: 250000,
    progression: 80,
    tendance: 'hausse'
  }
];

export const activitesRecentes: ActiviteRecente[] = [
  {
    id: 'act-001',
    type: 'projet',
    titre: 'Avancement Centre de Formation',
    description: 'Les fondations du centre sont terminées, début de la construction des murs',
    date: '2024-02-08T14:30:00Z',
    auteur: 'Jean-Pierre Tshibanda',
    importance: 'haute'
  },
  {
    id: 'act-002',
    type: 'benevole',
    titre: 'Nouveaux Bénévoles',
    description: '15 nouveaux bénévoles ont rejoint le programme d\'assainissement',
    date: '2024-02-08T10:15:00Z',
    auteur: 'Marie Lwamba',
    importance: 'moyenne'
  },
  {
    id: 'act-003',
    type: 'evenement',
    titre: 'Atelier de Formation',
    description: 'Atelier sur la gestion de projet prévu pour le 15 février',
    date: '2024-02-07T16:45:00Z',
    auteur: 'Claude Mukendi',
    importance: 'moyenne'
  },
  {
    id: 'act-004',
    type: 'publication',
    titre: 'Rapport Mensuel Disponible',
    description: 'Le rapport d\'activités de janvier est maintenant disponible',
    date: '2024-02-07T09:30:00Z',
    auteur: 'Système',
    importance: 'faible'
  }
];

export const alerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'warning',
    titre: 'Budget Dépassé',
    message: 'Le projet d\'assainissement a utilisé 50% de son budget en seulement 1 mois',
    date: '2024-02-08T11:00:00Z',
    lue: false,
    action: {
      texte: 'Voir les détails',
      url: '/dashboard/projets/proj-002'
    }
  },
  {
    id: 'alert-002',
    type: 'success',
    titre: 'Objectif Atteint',
    message: 'Le centre de formation a atteint 75% de sa progression',
    date: '2024-02-08T09:30:00Z',
    lue: false,
    action: {
      texte: 'Féliciter l\'équipe',
      url: '/dashboard/equipe/proj-001'
    }
  },
  {
    id: 'alert-003',
    type: 'info',
    titre: 'Nouveau Partenaire',
    message: 'L\'entreprise XYZ souhaite devenir partenaire pour le projet environnement',
    date: '2024-02-07T15:20:00Z',
    lue: true,
    action: {
      texte: 'Contacter',
      url: '/dashboard/partenaires'
    }
  }
];

export const cartographiePoints: CartographiePoint[] = [
  {
    id: 'map-001',
    projetId: 'proj-001',
    titre: 'Centre de Formation Professionnelle',
    latitude: -4.4419,
    longitude: 15.2663,
    type: 'projet',
    statut: 'en-cours',
    description: 'Construction en cours - 75% complété'
  },
  {
    id: 'map-002',
    projetId: 'proj-002',
    titre: 'Programme d\'Assainissement',
    latitude: -4.3225,
    longitude: 15.3134,
    type: 'projet',
    statut: 'en-cours',
    description: 'Installation des systèmes - 45% complété'
  },
  {
    id: 'map-003',
    projetId: 'proj-003',
    titre: 'Incubation d\'Entreprises',
    latitude: -4.4030,
    longitude: 15.3280,
    type: 'projet',
    statut: 'en-cours',
    description: 'Accompagnement des entrepreneurs - 60% complété'
  },
  {
    id: 'map-004',
    projetId: 'proj-004',
    titre: 'Forêt Communautaire',
    latitude: -4.3512,
    longitude: 15.2742,
    type: 'projet',
    statut: 'planifie',
    description: 'Démarrage prévu mars 2024'
  }
];
