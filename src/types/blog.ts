export interface Article {
  id: string;
  titre: string;
  slug: string;
  contenu: string;
  excerpt: string;
  auteur: {
    id: string;
    nom: string;
    email: string;
    avatar?: string;
  };
  categorie: CategorieArticle;
  tags: string[];
  images: {
    principale?: string;
    miniature?: string;
    gallerie: string[];
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    motsCles: string[];
  };
  statut: 'brouillon' | 'publie' | 'archive' | 'planifie';
  datePublication: Date;
  dateModification: Date;
  dateCreation: Date;
  vues: number;
  likes: number;
  commentaires: number;
  tempsLecture: number; // en minutes
  estVedette: boolean;
  estPopulaire: boolean;
}

export interface CategorieArticle {
  id: string;
  nom: string;
  slug: string;
  description?: string;
  couleur: string;
  icone?: string;
  ordre: number;
  parent?: string;
  sousCategories: string[];
  nombreArticles: number;
  statut: 'actif' | 'inactif';
}

export interface CommentaireArticle {
  id: string;
  articleId: string;
  auteur: {
    id: string;
    nom: string;
    email: string;
    avatar?: string;
  };
  contenu: string;
  dateCreation: Date;
  dateModification?: Date;
  statut: 'approuve' | 'en_attente' | 'rejete';
  reponses: CommentaireArticle[];
  likes: number;
  parentId?: string;
}

export interface TagArticle {
  id: string;
  nom: string;
  slug: string;
  description?: string;
  couleur: string;
  nombreArticles: number;
  statut: 'actif' | 'inactif';
}

export interface Newsletter {
  id: string;
  titre: string;
  contenu: string;
  destinataires: string[];
  statut: 'brouillon' | 'envoye' | 'planifie';
  dateCreation: Date;
  dateEnvoi?: Date;
  datePlanification?: Date;
  tauxOuverture: number;
  tauxClic: number;
  nombreDestinataires: number;
}

export interface AbonnementNewsletter {
  id: string;
  email: string;
  nom?: string;
  preferences: {
    categories: string[];
    frequence: 'quotidienne' | 'hebdomadaire' | 'mensuelle';
  };
  dateInscription: Date;
  dateDernierEmail?: Date;
  statut: 'actif' | 'inactif' | 'desabonne';
  tokenDesabonnement: string;
}

export interface ImageDrive {
  id: string;
  nom: string;
  url: string;
  taille: number;
  type: string;
  largeur: number;
  hauteur: number;
  dateUpload: Date;
  auteurId: string;
  tags: string[];
  altText?: string;
  legende?: string;
  categorie: string;
}

export interface GalerieArticle {
  id: string;
  articleId: string;
  images: ImageDrive[];
  ordre: number;
  titre?: string;
  description?: string;
}

export interface RechercheArticle {
  terme: string;
  categorie?: string;
  tag?: string;
  auteur?: string;
  dateDebut?: Date;
  dateFin?: Date;
  statut: 'tous' | 'publie' | 'brouillon';
  tri: 'date_desc' | 'date_asc' | 'populaire' | 'titre_asc' | 'titre_desc';
  page: number;
  limite: number;
}

export interface ResultatRechercheArticle {
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
  filtresAppliquees: RechercheArticle;
}
