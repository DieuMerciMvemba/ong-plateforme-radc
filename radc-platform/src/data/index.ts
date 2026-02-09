import type { 
  DomaineIntervention, 
  Projet, 
  Evenement, 
  temoignage, 
  Actualite, 
  InfosRADC,
  Caracteristique,
  Atout,
  AppelAction,
  NavigationItem
} from '../types';

export const infosRADC: InfosRADC = {
  nom: "Réseau Actif pour le Développement Communautaire",
  statutJuridique: {
    type: "Association à caractère scientifique, culturel et humanitaire",
    but: "Sans but lucratif et apolitique",
    creation: "10 Août 2018 à Kinshasa",
    enregistrement: "F92/58.207",
    personnaliteJuridique: "Arrêté ministériel : N° 545/CAB/MIN/J&GS/2024 du 12/02/2024"
  },
  siege: {
    commune: "Lemba",
    ville: "Kinshasa",
    pays: "RDC"
  },
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

export const domainesIntervention: DomaineIntervention[] = [
  {
    id: "education",
    titre: "Éducation",
    description: "Initiatives pour améliorer l'accès à l'éducation et la qualité de l'enseignement",
    services: [
      "Formations et programmes éducatifs destinés à renforcer les compétences des jeunes",
      "Promotion de l'éducation pour tous"
    ],
    icone: "book",
    couleur: "blue"
  },
  {
    id: "sante",
    titre: "Santé",
    description: "Initiatives visant à améliorer l'accès aux soins de santé et à promouvoir le bien-être au sein des communautés",
    icone: "heart",
    couleur: "red"
  },
  {
    id: "entreprenariat",
    titre: "Entreprenariat",
    description: "Accompagnement des entrepreneurs dans le développement de leurs projets et entreprises",
    services: [
      "Soutien aux entrepreneurs locaux avec des formations et des ressources",
      "Développement d'activités et création d'emplois"
    ],
    icone: "briefcase",
    couleur: "green"
  },
  {
    id: "culture-art",
    titre: "Culture et Art",
    description: "Promotion des arts et de la culture à travers des événements et des programmes divers",
    services: [
      "Promotion de la culture locale et des arts",
      "Renforcement de l'identité communautaire et favorisation de l'expression artistique"
    ],
    icone: "palette",
    couleur: "purple"
  },
  {
    id: "leadership-femme",
    titre: "Leadership de la Femme",
    description: "Encouragement du leadership féminin pour renforcer la participation des femmes dans tous les domaines",
    icone: "users",
    couleur: "pink"
  },
  {
    id: "genre-famille",
    titre: "Genre et Famille",
    description: "Programmes visant à promouvoir l'égalité des genres et le bien-être des familles",
    icone: "home",
    couleur: "orange"
  },
  {
    id: "droits-homme",
    titre: "Droits de l'Homme",
    description: "Promotion et défense des droits humains à travers des actions et des sensibilisations",
    icone: "shield",
    couleur: "indigo"
  },
  {
    id: "forage-eau",
    titre: "Forage d'Eau",
    description: "Accès à l'eau potable pour les communautés",
    icone: "droplet",
    couleur: "cyan"
  },
  {
    id: "transport",
    titre: "Transport",
    description: "Solutions de transport adaptées aux besoins communautaires",
    icone: "truck",
    couleur: "yellow"
  },
  {
    id: "agriculture",
    titre: "Agriculture",
    description: "Promotion de pratiques agricoles durables et modernes",
    icone: "sprout",
    couleur: "lime"
  },
  {
    id: "elevage",
    titre: "Élevage",
    description: "Développement de l'élevage pour la sécurité alimentaire",
    icone: "cow",
    couleur: "amber"
  },
  {
    id: "batiment-travaux-publics",
    titre: "Bâtiment et Travaux Publics",
    description: "Infrastructures communautaires et travaux publics",
    icone: "building",
    couleur: "gray"
  },
  {
    id: "geotechnique",
    titre: "Géotechnique",
    description: "Études géotechniques pour les projets de développement",
    icone: "mountain",
    couleur: "stone"
  },
  {
    id: "economie",
    titre: "Économie",
    description: "Développement économique local et initiatives économiques",
    icone: "trending-up",
    couleur: "emerald"
  },
  {
    id: "mines",
    titre: "Mines",
    description: "Exploitation responsable des ressources minières",
    icone: "gem",
    couleur: "slate"
  }
];

export const projets: Projet[] = [
  {
    id: "formation-auto-ecole",
    titre: "Formation Auto-École",
    description: "Formation dans le but d'apprentissage de métier aux jeunes",
    date: "2025-06-18",
    lieu: "Kinshasa",
    objectif: "Permettre aux jeunes d'acquérir des compétences professionnelles",
    categorie: "education",
    images: [
      "/medias/formations/decoration-evenementielle-01.jpg",
      "/medias/formations/decoration-evenementielle-02.jpg"
    ],
    statut: "termine",
    progression: 100
  },
  {
    id: "formation-decoration",
    titre: "Formation en Décoration Événementielle",
    description: "Formation en décoration événementielle dans le cadre de l'apprentissage de métier aux jeunes",
    date: "2025-12-28",
    lieu: "Kinshasa",
    objectif: "Développer les compétences en décoration et organisation d'événements",
    categorie: "culture-art",
    images: [
      "/medias/formations/decoration-evenementielle-01.jpg",
      "/medias/formations/decoration-evenementielle-02.jpg",
      "/medias/formations/decoration-evenementielle-03.jpg"
    ],
    statut: "termine",
    progression: 100
  },
  {
    id: "etude-hydrogeologique",
    titre: "Étude Hydrogéologique",
    description: "Étude hydrogéologique lors de l'exécution d'un forage d'eau",
    date: "2025-12-11",
    lieu: "Kinshasa",
    objectif: "Assurer l'accès à l'eau potable pour les communautés",
    categorie: "forage-eau",
    images: [
      "/medias/projets/assainissement-mbanza-lemba-01.jpg",
      "/medias/projets/assainissement-mbanza-lemba-02.jpg"
    ],
    statut: "termine",
    progression: 100
  },
  {
    id: "travaux-assainissement",
    titre: "Travaux d'Assainissement",
    description: "Travaux d'assainissement du quartier Mbanza-lemba",
    date: "2025-01-15",
    lieu: "Mbanza-lemba",
    objectif: "Améliorer les conditions d'hygiène et de salubrité",
    categorie: "batiment-travaux-publics",
    images: [
      "/medias/projets/assainissement-mbanza-lemba-01.jpg",
      "/medias/projets/assainissement-mbanza-lemba-02.jpg",
      "/medias/projets/assainissement-mbanza-lemba-03.jpg"
    ],
    statut: "en-cours",
    progression: 75
  }
];

export const evenements: Evenement[] = [
  {
    id: "conference-hygiene-menstruelle",
    titre: "Conférence sur l'Hygiène Menstruelle",
    date: "2025-05-28",
    lieu: "Mbanza-lemba",
    description: "Conférence de sensibilisation sur l'hygiène menstruelle",
    images: [
      "/medias/evenements/conference-hygiene-menstruelle-01.jpg",
      "/medias/evenements/conference-hygiene-menstruelle-02.jpg",
      "/medias/evenements/conference-hygiene-menstruelle-03.jpg"
    ],
    type: "conference"
  },
  {
    id: "remise-brevets",
    titre: "Remise des Brevets",
    date: "2026-12-31",
    lieu: "Lemba, Salongo Centre",
    description: "Cérémonie de remise des brevets aux participants",
    images: [
      "/medias/evenements/remise-brevets-01.jpg",
      "/medias/evenements/remise-brevets-02.jpg",
      "/medias/evenements/remise-brevets-03.jpg"
    ],
    type: "remise-brevets"
  }
];

export const temoignages: temoignage[] = [
  {
    id: "koffi-ngonda",
    nom: "Koffi Ngonda",
    poste: "Coordinateur de Projet de Gestion des Déchets",
    temoignage: "Grâce à RADC, notre projet de gestion des déchets a atteint de nouveaux sommets. Leur expertise est inestimable.",
    note: 5
  },
  {
    id: "amina-kambale",
    nom: "Amina Kambale",
    poste: "Chef de Projet Énergies Renouvelables",
    temoignage: "Le soutien de RADC pour notre initiative d'énergies renouvelables a été essentiel. Leur approche est inspirante.",
    note: 5
  },
  {
    id: "mokolo-mbuyi",
    nom: "Mokolo Mbuyi",
    poste: "Directeur de Développement Durable",
    temoignage: "RADC a transformé notre approche de la durabilité en intégrant des pratiques éthiques et responsables dans notre entreprise.",
    note: 5
  },
  {
    id: "chantal-lwamba",
    nom: "Chantal Lwamba",
    poste: "Consultante en Sensibilisation Environnementale",
    temoignage: "Le partenariat avec RADC sur des projets de sensibilisation environnementale a été incroyablement enrichissant.",
    note: 5
  },
  {
    id: "jean-pierre-tshibanda",
    nom: "Jean-Pierre Tshibanda",
    poste: "Entrepreneur en Agriculture Durable",
    temoignage: "RADC a été un pilier pour notre projet d'agriculture durable. Leur expertise a fait la différence.",
    note: 5
  }
];

export const actualites: Actualite[] = [
  {
    id: "formation-auto-ecole-actualite",
    titre: "Formation Auto-École : Lancement du Programme",
    contenu: "RADC lance son programme de formation auto-école pour permettre aux jeunes d'acquérir des compétences professionnelles dans le secteur de l'automobile...",
    date: "2025-06-18",
    auteur: "RADC Team",
    categorie: "education",
    image: "/medias/formations/decoration-evenementielle-01.jpg",
    tags: ["formation", "jeunes", "education", "competences"]
  },
  {
    id: "conference-hygiene-actualite",
    titre: "Sensibilisation sur l'Hygiène Menstruelle à Mbanza-lemba",
    contenu: "RADC a organisé avec succès une conférence de sensibilisation sur l'hygiène menstruelle le 28 mai 2025 à Mbanza-lemba...",
    date: "2025-05-28",
    auteur: "RADC Team",
    categorie: "sante",
    image: "/medias/evenements/conference-hygiene-menstruelle-01.jpg",
    tags: ["sante", "hygiene", "femmes", "sensibilisation"]
  }
];

export const caracteristiques: Caracteristique[] = [
  {
    id: "engagement-communautaire",
    titre: "Engagement envers la communauté",
    description: "RADC met un point d'honneur à impliquer les membres de la communauté dans la conception et la mise en œuvre de ses projets.",
    details: [
      "Participation Active : Nous encourageons la participation des citoyens à toutes les étapes de nos projets",
      "Écoute des Besoins : Nous réalisons des enquêtes pour identifier les besoins réels des communautés"
    ],
    icone: "users",
    couleur: "blue"
  },
  {
    id: "expertise-diversifiee",
    titre: "Expertise Diversifiée dans le Développement",
    description: "Notre équipe possède une expertise dans plusieurs domaines clés pour un développement intégré et durable.",
    details: [
      "Compétences Pluridisciplinaires : Nos experts interviennent dans l'éducation, la santé, l'agriculture, et plus encore",
      "Formation Continue : Nous assurons que notre équipe est formée aux meilleures pratiques et tendances"
    ],
    icone: "award",
    couleur: "green"
  },
  {
    id: "qualite-impact",
    titre: "Qualité et Impact Durable",
    description: "La qualité est au cœur de notre mission. Nous veillons à ce que chaque projet ait un impact durable sur la communauté.",
    details: [
      "Processus Rigoureux : Des procédures strictes sont mises en place pour garantir la qualité à chaque étape",
      "Évaluations d'Impact : Nous réalisons des évaluations pour mesurer l'impact de nos initiatives",
      "Satisfaction Communautaire : Nous recueillons des retours pour améliorer constamment nos services et projets"
    ],
    icone: "star",
    couleur: "yellow"
  }
];

export const atouts: Atout[] = [
  {
    id: "engagement-communautaire-atout",
    titre: "Engagement Communautaire",
    description: "RADC est profondément enraciné dans la communauté et travaille main dans la main avec les populations locales.",
    pointsForts: [
      "Partenariats avec les acteurs locaux",
      "Projets basés sur les besoins des communautés",
      "Évaluation continue de notre impact"
    ],
    icone: "heart"
  },
  {
    id: "innovation-sociale",
    titre: "Innovation Sociale",
    description: "Nous mettons en œuvre des solutions créatives pour répondre aux défis sociaux et environnementaux.",
    pointsForts: [],
    icone: "lightbulb"
  },
  {
    id: "durabilite",
    titre: "Durabilité",
    description: "Nos projets sont conçus pour avoir un impact durable et positif sur les communautés.",
    pointsForts: [],
    icone: "leaf"
  },
  {
    id: "collaboration",
    titre: "Collaboration",
    description: "Nous croyons en la force de la collaboration pour atteindre nos objectifs communs.",
    pointsForts: [],
    icone: "handshake"
  }
];

export const appelsAction: AppelAction[] = [
  {
    id: "principal",
    titre: "Rejoignez le RADC dès aujourd'hui !",
    message: "Devenez un acteur du changement et contribuez au développement durable de notre communauté. Votre participation est essentielle pour atteindre nos objectifs communs.",
    action: "Devenir membre",
    type: "principal"
  },
  {
    id: "newsletter",
    titre: "Rejoignez Notre Newsletter",
    message: "Abonnez-vous à notre newsletter et recevez les dernières nouvelles sur nos initiatives et événements !",
    action: "S'abonner",
    type: "newsletter"
  }
];

export const navigationItems: NavigationItem[] = [
  {
    id: "accueil",
    titre: "Accueil",
    lien: "/"
  },
  {
    id: "a-propos",
    titre: "À Propos",
    lien: "/a-propos"
  },
  {
    id: "domaines",
    titre: "Domaines d'Intervention",
    lien: "/domaines",
    sousItems: domainesIntervention.slice(0, 8).map(domaine => ({
      id: domaine.id,
      titre: domaine.titre,
      lien: `/domaines/${domaine.id}`
    }))
  },
  {
    id: "projets",
    titre: "Projets",
    lien: "/projets"
  },
  {
    id: "actualites",
    titre: "Actualités",
    lien: "/actualites"
  },
  {
    id: "equipe",
    titre: "Équipe",
    lien: "/equipe"
  },
  {
    id: "contact",
    titre: "Contact",
    lien: "/contact"
  }
];
