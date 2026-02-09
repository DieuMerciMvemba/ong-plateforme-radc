import type { StatutProjet } from '../types';
export const appelsAction = [
  {
    titre: "Rejoignez le RADC dès aujourd'hui !",
    description: "Devenez un acteur du changement et contribuez au développement durable de notre communauté.",
    lien: "/contact",
    icone: "users",
    message: "Devenez un acteur du changement et contribuez au développement durable de notre communauté. Votre participation est essentielle pour atteindre nos objectifs communs.",
    action: "Devenir membre"
  },
  {
    titre: "Rejoignez Notre Newsletter",
    description: "Abonnez-vous à notre newsletter et recevez les dernières nouvelles sur nos initiatives et événements !",
    lien: "#newsletter",
    icone: "mail",
    message: "Abonnez-vous à notre newsletter et recevez les dernières nouvelles sur nos initiatives et événements !",
    action: "S'abonner avec son email"
  }
];

export const infosRADC = {
  nom: "Réseau Actif pour le Développement Communautaire (RADC)",
  coordonnees: {
    telephone: "+243 820 067 687",
    email: "radc924@gmail.com",
    siteWeb: "https://radcvision.web.app/",
    facebook: "https://www.facebook.com/profile.php?id=100064832019708"
  },
  objectifs: {
    global: "Promouvoir le développement durable de la société",
    specifics: [
      "Contribuer à la remédiation de l'environnement et à la gestion des ressources naturelles",
      "Contribuer au développement social",
      "Contribuer au développement économique"
    ]
  },
  siege: {
    commune: "Lemba",
    ville: "Kinshasa",
    pays: "RDC"
  },
  statutJuridique: {
    enregistrement: "Enregistrée sous le F92/58.207",
    personnaliteJuridique: "Association à caractère scientifique, culturel et humanitaire - Personnalité juridique suivant l'Arrêté ministériel : N° 545/CAB/MIN/J&GS/2024 du 12/02/2024",
    creation: "Créée le 10 Août 2018 à Kinshasa"
  },
  valeurs: [
    {
      titre: "Transparence",
      description: "Communication claire et ouverte pour informer tous les membres et partenaires"
    },
    {
      titre: "Engagement Communautaire",
      description: "Participation active des membres pour construire ensemble un avenir meilleur"
    },
    {
      titre: "Adaptabilité",
      description: "Flexibilité et réactivité aux besoins de la communauté et aux défis environnementaux"
    },
    {
      titre: "Collaboration",
      description: "Travail en étroite collaboration avec toutes les parties prenantes"
    }
  ]
};

export const domainesIntervention = [
  {
    id: "education",
    nom: "Éducation",
    titre: "Éducation",
    description: "Initiatives pour améliorer l'accès à l'éducation et la qualité de l'enseignement",
    icone: "book-open",
    couleur: "blue",
    projets: 12,
    beneficiaires: 3500,
    services: [
      "Formations et programmes éducatifs destinés à renforcer les compétences des jeunes",
      "Promotion de l'éducation pour tous"
    ]
  },
  {
    id: "sante",
    nom: "Santé",
    titre: "Santé",
    description: "Initiatives visant à améliorer l'accès aux soins de santé et à promouvoir le bien-être au sein des communautés",
    icone: "heart",
    couleur: "red",
    projets: 8,
    beneficiaires: 4200,
    services: []
  },
  {
    id: "entreprenariat",
    nom: "Entreprenariat",
    titre: "Entreprenariat",
    description: "Accompagnement des entrepreneurs dans le développement de leurs projets et entreprises",
    icone: "briefcase",
    couleur: "green",
    projets: 6,
    beneficiaires: 180,
    services: [
      "Soutien aux entrepreneurs locaux avec des formations et des ressources",
      "Développement d'activités et création d'emplois"
    ]
  },
  {
    id: "culture-art",
    nom: "Culture et Art",
    titre: "Culture et Art",
    description: "Promotion des arts et de la culture à travers des événements et des programmes divers",
    icone: "palette",
    couleur: "purple",
    projets: 0,
    beneficiaires: 0,
    services: [
      "Promotion de la culture locale et des arts",
      "Renforcement de l'identité communautaire et favorisation de l'expression artistique"
    ]
  },
  {
    id: "leadership-femme",
    nom: "Leadership de la Femme",
    titre: "Leadership de la Femme",
    description: "Encouragement du leadership féminin pour renforcer la participation des femmes dans tous les domaines",
    icone: "users",
    couleur: "pink",
    projets: 0,
    beneficiaires: 0,
    services: []
  },
  {
    id: "genre-famille",
    nom: "Genre et Famille",
    titre: "Genre et Famille",
    description: "Programmes visant à promouvoir l'égalité des genres et le bien-être des familles",
    icone: "home",
    couleur: "orange",
    projets: 0,
    beneficiaires: 0,
    services: []
  },
  {
    id: "droits-homme",
    nom: "Droits de l'Homme",
    titre: "Droits de l'Homme",
    description: "Promotion et défense des droits humains à travers des actions et des sensibilisations",
    icone: "shield",
    couleur: "yellow",
    projets: 0,
    beneficiaires: 0,
    services: []
  },
  {
    id: "forage-eau",
    nom: "Forage d'Eau",
    titre: "Forage d'Eau",
    description: "Accès à l'eau potable pour les communautés",
    icone: "droplets",
    couleur: "blue",
    projets: 0,
    beneficiaires: 0,
    services: []
  },
  {
    id: "transport",
    nom: "Transport",
    titre: "Transport",
    description: "Solutions de transport adaptées aux besoins communautaires",
    icone: "truck",
    couleur: "gray",
    projets: 0,
    beneficiaires: 0,
    services: []
  },
  {
    id: "agriculture",
    nom: "Agriculture",
    titre: "Agriculture",
    description: "Promotion de pratiques agricoles durables et modernes",
    icone: "wheat",
    couleur: "green",
    projets: 0,
    beneficiaires: 0,
    services: []
  },
  {
    id: "elevage",
    nom: "Élevage",
    titre: "Élevage",
    description: "Développement de l'élevage pour la sécurité alimentaire",
    icone: "cow",
    couleur: "brown",
    projets: 0,
    beneficiaires: 0,
    services: []
  },
  {
    id: "batiment-travaux-publics",
    nom: "Bâtiment et Travaux Publics",
    titre: "Bâtiment et Travaux Publics",
    description: "Infrastructures communautaires et travaux publics",
    icone: "building",
    couleur: "slate",
    projets: 0,
    beneficiaires: 0,
    services: []
  },
  {
    id: "geotechnique",
    nom: "Géotechnique",
    titre: "Géotechnique",
    description: "Études géotechniques pour les projets de développement",
    icone: "mountain",
    couleur: "stone",
    projets: 0,
    beneficiaires: 0,
    services: []
  },
  {
    id: "economie",
    nom: "Économie",
    titre: "Économie",
    description: "Développement économique local et initiatives économiques",
    icone: "dollar-sign",
    couleur: "emerald",
    projets: 0,
    beneficiaires: 0,
    services: []
  },
  {
    id: "mines",
    nom: "Mines",
    titre: "Mines",
    description: "Exploitation responsable des ressources minières",
    icone: "pickaxe",
    couleur: "zinc",
    projets: 0,
    beneficiaires: 0,
    services: []
  }
];

export const projets = [
  {
    id: "centre-formation",
    titre: "Centre de Formation Professionnelle",
    description: "Construction d'un centre moderne pour former les jeunes aux métiers de l'avenir",
    domaine: "Éducation",
    categorie: "education",
    statut: "en-cours" as StatutProjet,
    budget: 150000,
    beneficiaires: 500,
    localisation: "Kinshasa",
    lieu: "Kinshasa, Quartier Industriel",
    objectif: "Former 500 jeunes aux métiers techniques et numériques d'ici 2025",
    date: "2024-01-15",
    progression: 75,
    images: ["/projets/centre-formation-1.jpg", "/projets/centre-formation-2.jpg"]
  },
  {
    id: "clinique-mobile",
    titre: "Clinique Mobile",
    description: "Déploiement de cliniques mobiles dans les zones rurales reculées",
    domaine: "Santé",
    categorie: "sante",
    statut: "en-cours" as StatutProjet,
    budget: 80000,
    beneficiaires: 2000,
    localisation: "Kongo Central",
    lieu: "Zone rurale de Kongo Central",
    objectif: "Fournir des soins médicaux à 2000 personnes dans 15 villages reculés",
    date: "2024-02-01",
    progression: 60,
    images: ["/projets/clinique-mobile-1.jpg", "/projets/clinique-mobile-2.jpg"]
  },
  {
    id: "jardin-solidaire",
    titre: "Jardin Solidaire Urbain",
    description: "Création de jardins communautaires pour l'autosuffisance alimentaire",
    domaine: "Environnement",
    categorie: "environnement",
    statut: "termine" as StatutProjet,
    budget: 25000,
    beneficiaires: 300,
    localisation: "Lubumbashi",
    lieu: "Quartiers populaires de Lubumbashi",
    objectif: "Créer 5 jardins communautaires produisant 2 tonnes de légumes par mois",
    date: "2023-10-01",
    progression: 100,
    images: ["/projets/jardin-solidaire-1.jpg", "/projets/jardin-solidaire-2.jpg"]
  }
];

export const caracteristiques = [
  {
    titre: "Engagement envers la communauté",
    description: "RADC met un point d'honneur à impliquer les membres de la communauté dans la conception et la mise en œuvre de ses projets.",
    details: [
      "Participation Active : Nous encourageons la participation des citoyens à toutes les étapes de nos projets",
      "Écoute des Besoins : Nous réalisons des enquêtes pour identifier les besoins réels des communautés"
    ]
  },
  {
    titre: "Expertise Diversifiée dans le Développement",
    description: "Notre équipe possède une expertise dans plusieurs domaines clés pour un développement intégré et durable.",
    details: [
      "Compétences Pluridisciplinaires : Nos experts interviennent dans l'éducation, la santé, l'agriculture, et plus encore",
      "Formation Continue : Nous assurons que notre équipe est formée aux meilleures pratiques et tendances"
    ]
  },
  {
    titre: "Qualité et Impact Durable",
    description: "La qualité est au cœur de notre mission. Nous veillons à ce que chaque projet ait un impact durable sur la communauté.",
    details: [
      "Processus Rigoureux : Des procédures strictes sont mises en place pour garantir la qualité à chaque étape",
      "Évaluations d'Impact : Nous réalisons des évaluations pour mesurer l'impact de nos initiatives",
      "Satisfaction Communautaire : Nous recueillons des retours pour améliorer constamment nos services et projets"
    ]
  }
];

export const atouts = [
  {
    titre: "Engagement Communautaire",
    description: "RADC est profondément enraciné dans la communauté et travaille main dans la main avec les populations locales.",
    pointsForts: [
      "Partenariats avec les acteurs locaux",
      "Projets basés sur les besoins des communautés",
      "Évaluation continue de notre impact"
    ]
  },
  {
    titre: "Innovation Sociale",
    description: "Nous mettons en œuvre des solutions créatives pour répondre aux défis sociaux et environnementaux.",
    pointsForts: []
  },
  {
    titre: "Durabilité",
    description: "Nos projets sont conçus pour avoir un impact durable et positif sur les communautés.",
    pointsForts: []
  },
  {
    titre: "Collaboration",
    description: "Nous croyons en la force de la collaboration pour atteindre nos objectifs communs.",
    pointsForts: []
  }
];

export const temoignages = [
  {
    id: "koffi-ngonda",
    nom: "Koffi Ngonda",
    poste: "Coordinateur de Projet de Gestion des Déchets",
    temoignage: "Grâce à RADC, notre projet de gestion des déchets a atteint de nouveaux sommets. Leur expertise est inestimable.",
    note: 5,
    photo: "/testimonials/koffi-ngonda.jpg"
  },
  {
    id: "amina-kambale",
    nom: "Amina Kambale",
    poste: "Chef de Projet Énergies Renouvelables",
    temoignage: "Le soutien de RADC pour notre initiative d'énergies renouvelables a été essentiel. Leur approche est inspirante.",
    note: 5,
    photo: "/testimonials/amina-kambale.jpg"
  },
  {
    id: "mokolo-mbuyi",
    nom: "Mokolo Mbuyi",
    poste: "Directeur de Développement Durable",
    temoignage: "RADC a transformé notre approche de la durabilité en intégrant des pratiques éthiques et responsables dans notre entreprise.",
    note: 5,
    photo: "/testimonials/mokolo-mbuyi.jpg"
  },
  {
    id: "chantal-lwamba",
    nom: "Chantal Lwamba",
    poste: "Consultante en Sensibilisation Environnementale",
    temoignage: "Le partenariat avec RADC sur des projets de sensibilisation environnementale a été incroyablement enrichissant.",
    note: 5,
    photo: "/testimonials/chantal-lwamba.jpg"
  },
  {
    id: "jean-pierre-tshibanda",
    nom: "Jean-Pierre Tshibanda",
    poste: "Entrepreneur en Agriculture Durable",
    temoignage: "RADC a été un pilier pour notre projet d'agriculture durable. Leur expertise a fait la différence.",
    note: 5,
    photo: "/testimonials/jean-pierre-tshibanda.jpg"
  }
];
