import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type {
  Article,
  CategorieArticle,
  CommentaireArticle,
  Newsletter,
  AbonnementNewsletter,
  ImageDrive,
  RechercheArticle,
  ResultatRechercheArticle
} from '../types/blog';

// Configuration Google Drive API
const DRIVE_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const DRIVE_CLIENT_ID = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID;

// Déclaration de type pour Google Drive API
declare global {
  interface Window {
    gapi: any;
  }
}

// Service pour la gestion des articles
export class ArticleService {
  static async creerArticle(article: Omit<Article, 'id' | 'dateCreation' | 'dateModification' | 'slug'>): Promise<string> {
    const slug = this.genererSlug(article.titre);

    const docRef = await addDoc(collection(db, 'articles'), {
      ...article,
      slug,
      dateCreation: serverTimestamp(),
      dateModification: serverTimestamp(),
      vues: 0,
      likes: 0,
      commentaires: 0,
      tempsLecture: this.calculerTempsLecture(article.contenu)
    });

    return docRef.id;
  }

  // Convertir les liens Google Drive en liens directs d'images
  static convertGoogleDriveUrl(url: string): string {
    if (!url) return '';
    
    // Pattern pour les liens Google Drive
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      // Essayer le format thumbnail (plus fiable)
      return `https://drive.google.com/thumbnail?id=${fileId}`;
      // Alternative: https://drive.google.com/thumbnail?id=${fileId}
    }
    
    return url;
  }

  static async getArticlesPublies(page: number = 1, limite: number = 10): Promise<ResultatRechercheArticle> {
    // Utiliser une requête simple sans ordre pour éviter l'erreur d'index
    const q = query(
      collection(db, 'articles'),
      where('statut', '==', 'publie'),
      limit(limite)
    );

    const querySnapshot = await getDocs(q);
    
    const articles = querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      
      try {
        // Normaliser les données pour le blog public
        const normalizedArticle: Article = {
          id: doc.id,
          titre: data.titre,
          slug: data.slug,
          contenu: data.contenu,
          excerpt: data.metaDescription || data.contenu.substring(0, 150) + '...',
          auteur: {
            id: 'admin',
            nom: data.auteur || 'Admin RADC',
            email: 'admin@radc.org'
          },
          categorie: {
            id: data.categorie || 'general',
            nom: data.categorie || 'Général',
            couleur: '#3B82F6',
            description: '',
            slug: data.categorie || 'general',
            ordre: 1,
            sousCategories: [],
            nombreArticles: 0,
            statut: 'actif'
          },
          tags: Array.isArray(data.tags) ? data.tags : (data.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
          images: {
            principale: this.convertGoogleDriveUrl(data.image || data.images?.[0] || ''),
            gallerie: Array.isArray(data.images) ? data.images.map((img: string) => this.convertGoogleDriveUrl(img)) : [],
            miniature: this.convertGoogleDriveUrl(data.image || data.images?.[0] || '')
          },
          statut: data.statut,
          vues: data.vues || 0,
          likes: data.likes || 0,
          commentaires: data.commentaires || 0,
          tempsLecture: data.tempsLecture || 5,
          estVedette: false,
          datePublication: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : new Date(),
          dateModification: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
          dateCreation: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
          seo: {
            metaDescription: data.metaDescription || data.contenu.substring(0, 150),
            motsCles: Array.isArray(data.tags) ? data.tags : (data.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
          },
          estPopulaire: false
        };
        
        return normalizedArticle;
      } catch (error) {
        return null;
      }
    }).filter(article => article !== null) as Article[];

    return {
      articles,
      total: articles.length,
      page,
      totalPages: Math.ceil(articles.length / limite),
      filtresAppliquees: {
        terme: '',
        statut: 'publie',
        tri: 'date_desc',
        page,
        limite
      }
    };
  }

  static async getArticleParSlug(slug: string): Promise<Article | null> {
    const q = query(
      collection(db, 'articles'),
      where('slug', '==', slug),
      where('statut', '==', 'publie')
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const data = querySnapshot.docs[0].data() as any;
    
    // Normaliser les données pour le blog public
    const normalizedArticle: Article = {
      id: querySnapshot.docs[0].id,
      titre: data.titre,
      slug: data.slug,
      contenu: data.contenu,
      excerpt: data.metaDescription || data.contenu.substring(0, 150) + '...',
      auteur: {
        id: 'admin',
        nom: data.auteur || 'Admin RADC',
        email: 'admin@radc.org'
      },
      categorie: {
        id: data.categorie || 'general',
        nom: data.categorie || 'Général',
        couleur: '#3B82F6',
        description: '',
        slug: data.categorie || 'general',
        ordre: 1,
        sousCategories: [],
        nombreArticles: 0,
        statut: 'actif'
      },
      tags: Array.isArray(data.tags) ? data.tags : (data.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
      images: {
        principale: data.image || data.images?.[0] || '',
        gallerie: Array.isArray(data.images) ? data.images : [],
        miniature: data.image || data.images?.[0] || ''
      },
      statut: data.statut,
      vues: data.vues || 0,
      likes: data.likes || 0,
      commentaires: data.commentaires || 0,
      tempsLecture: data.tempsLecture || 5,
      estVedette: false,
      datePublication: data.publishedAt instanceof Timestamp ? data.publishedAt.toDate() : new Date(),
      dateModification: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
      dateCreation: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      seo: {
        metaDescription: data.metaDescription || data.contenu.substring(0, 150),
        motsCles: Array.isArray(data.tags) ? data.tags : (data.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      },
      estPopulaire: false
    };
    
    return normalizedArticle;
  }

  static async rechercherArticles(recherche: RechercheArticle): Promise<ResultatRechercheArticle> {
    let q = query(collection(db, 'articles'));

    // Appliquer les filtres
    if (recherche.statut !== 'tous') {
      q = query(q, where('statut', '==', recherche.statut));
    }

    if (recherche.categorie) {
      q = query(q, where('categorie.id', '==', recherche.categorie));
    }

    if (recherche.auteur) {
      q = query(q, where('auteur.id', '==', recherche.auteur));
    }

    // Appliquer le tri
    const orderField = recherche.tri.startsWith('date') ? 'datePublication' :
                      recherche.tri.startsWith('titre') ? 'titre' : 'vues';
    const orderDirection = recherche.tri.includes('desc') ? 'desc' : 'asc';

    q = query(q, orderBy(orderField, orderDirection), limit(recherche.limite));

    const querySnapshot = await getDocs(q);
    let articles = querySnapshot.docs.map(doc => {
      const data = doc.data() as Article;
      return {
        ...data,
        id: doc.id,
        datePublication: data.datePublication instanceof Timestamp ? data.datePublication.toDate() : new Date(),
        dateModification: data.dateModification instanceof Timestamp ? data.dateModification.toDate() : new Date(),
        dateCreation: data.dateCreation instanceof Timestamp ? data.dateCreation.toDate() : new Date()
      };
    });

    // Filtrage côté client pour les recherches textuelles et dates
    if (recherche.terme) {
      articles = articles.filter(article =>
        article.titre.toLowerCase().includes(recherche.terme.toLowerCase()) ||
        article.contenu.toLowerCase().includes(recherche.terme.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(recherche.terme.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(recherche.terme.toLowerCase()))
      );
    }

    if (recherche.dateDebut) {
      articles = articles.filter(article => article.datePublication >= recherche.dateDebut!);
    }

    if (recherche.dateFin) {
      articles = articles.filter(article => article.datePublication <= recherche.dateFin!);
    }

    return {
      articles: articles.slice(recherche.page * recherche.limite, (recherche.page + 1) * recherche.limite),
      total: articles.length,
      page: recherche.page,
      totalPages: Math.ceil(articles.length / recherche.limite),
      filtresAppliquees: recherche
    };
  }

  static async mettreAJourArticle(articleId: string, updates: Partial<Article>): Promise<void> {
    const docRef = doc(db, 'articles', articleId);
    await updateDoc(docRef, {
      ...updates,
      dateModification: serverTimestamp()
    });
  }

  static async incrementerVues(articleId: string): Promise<void> {
    const docRef = doc(db, 'articles', articleId);
    await updateDoc(docRef, {
      vues: increment(1)
    });
  }

  static async supprimerArticle(articleId: string): Promise<void> {
    const docRef = doc(db, 'articles', articleId);
    await deleteDoc(docRef);
  }

  static genererSlug(titre: string): string {
    return titre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  static calculerTempsLecture(contenu: string): number {
    const motsParMinute = 200;
    const nombreMots = contenu.split(/\s+/).length;
    return Math.ceil(nombreMots / motsParMinute);
  }
}

// Service pour la gestion des catégories
export class CategorieService {
  static async creerCategorie(categorie: Omit<CategorieArticle, 'id' | 'sousCategories' | 'nombreArticles'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'categories_articles'), {
      ...categorie,
      sousCategories: [],
      nombreArticles: 0,
      statut: 'actif'
    });
    return docRef.id;
  }

  static async getCategoriesActives(): Promise<CategorieArticle[]> {
    const q = query(
      collection(db, 'categories_articles'),
      where('statut', '==', 'actif'),
      orderBy('ordre', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data() as CategorieArticle,
      id: doc.id
    }));
  }

  static async mettreAJourCategorie(categorieId: string, updates: Partial<CategorieArticle>): Promise<void> {
    const docRef = doc(db, 'categories_articles', categorieId);
    await updateDoc(docRef, updates);
  }
}

// Service pour la gestion des commentaires
export class CommentaireService {
  static async ajouterCommentaire(commentaire: Omit<CommentaireArticle, 'id' | 'dateCreation' | 'statut' | 'reponses' | 'likes'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'commentaires_articles'), {
      ...commentaire,
      dateCreation: serverTimestamp(),
      statut: 'en_attente',
      reponses: [],
      likes: 0
    });

    // Incrémenter le compteur de commentaires de l'article
    await ArticleService.mettreAJourArticle(commentaire.articleId, {
      commentaires: increment(1)
    } as any);

    return docRef.id;
  }

  static async getCommentairesParArticle(articleId: string, statut: 'approuve' | 'tous' = 'approuve'): Promise<CommentaireArticle[]> {
    let q = query(
      collection(db, 'commentaires_articles'),
      where('articleId', '==', articleId),
      where('parentId', '==', null), // Commentaires principaux seulement
      orderBy('dateCreation', 'desc')
    );

    if (statut !== 'tous') {
      q = query(q, where('statut', '==', statut));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as CommentaireArticle;
      return {
        ...data,
        id: doc.id,
        dateCreation: data.dateCreation instanceof Timestamp ? data.dateCreation.toDate() : new Date(),
        dateModification: data.dateModification instanceof Timestamp ? data.dateModification.toDate() : new Date()
      };
    });
  }

  static async approuverCommentaire(commentaireId: string): Promise<void> {
    const docRef = doc(db, 'commentaires_articles', commentaireId);
    await updateDoc(docRef, {
      statut: 'approuve'
    });
  }

  static async rejeterCommentaire(commentaireId: string): Promise<void> {
    const docRef = doc(db, 'commentaires_articles', commentaireId);
    await updateDoc(docRef, {
      statut: 'rejete'
    });
  }
}

// Service pour l'intégration Google Drive
export class DriveService {
  private static gapi: any = null;

  static async initialiserDrive(): Promise<void> {
    if (typeof window !== 'undefined' && window.gapi) {
      this.gapi = window.gapi;
      await this.gapi.load('client:auth2', async () => {
        await this.gapi.client.init({
          apiKey: DRIVE_API_KEY,
          clientId: DRIVE_CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          scope: 'https://www.googleapis.com/auth/drive.file'
        });
      });
    }
  }

  static async uploaderImage(fichier: File, metadonnees: Partial<ImageDrive>): Promise<ImageDrive> {
    if (!this.gapi) {
      throw new Error('Google Drive API non initialisé');
    }

    const metadata = {
      name: fichier.name,
      mimeType: fichier.type,
      description: metadonnees.legende || '',
      properties: {
        categorie: metadonnees.categorie || 'blog',
        altText: metadonnees.altText || '',
        auteurId: metadonnees.auteurId || ''
      }
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', fichier);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.gapi.auth.getToken().access_token}`
      },
      body: form
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload vers Google Drive');
    }

    const data = await response.json();

    // Créer l'entrée dans Firestore
    const imageData: Omit<ImageDrive, 'id'> = {
      nom: fichier.name,
      url: `https://drive.google.com/uc?id=${data.id}`,
      taille: fichier.size,
      type: fichier.type,
      largeur: 0, // TODO: Calculer depuis l'image
      hauteur: 0, // TODO: Calculer depuis l'image
      dateUpload: new Date(),
      auteurId: metadonnees.auteurId || '',
      tags: metadonnees.tags || [],
      altText: metadonnees.altText,
      legende: metadonnees.legende,
      categorie: metadonnees.categorie || 'blog'
    };

    const docRef = await addDoc(collection(db, 'images_drive'), imageData);

    return {
      id: docRef.id,
      ...imageData
    };
  }

  static async getImagesParCategorie(categorie: string, limite: number = 50): Promise<ImageDrive[]> {
    const q = query(
      collection(db, 'images_drive'),
      where('categorie', '==', categorie),
      orderBy('dateUpload', 'desc'),
      limit(limite)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data() as ImageDrive,
      id: doc.id
    }));
  }

  static async rechercherImages(terme: string): Promise<ImageDrive[]> {
    const q = query(collection(db, 'images_drive'));

    const querySnapshot = await getDocs(q);
    const images = querySnapshot.docs.map(doc => ({
      ...doc.data() as ImageDrive,
      id: doc.id
    }));

    return images.filter(image =>
      image.nom.toLowerCase().includes(terme.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(terme.toLowerCase())) ||
      image.altText?.toLowerCase().includes(terme.toLowerCase()) ||
      image.legende?.toLowerCase().includes(terme.toLowerCase())
    );
  }

  static async supprimerImage(imageId: string): Promise<void> {
    // Supprimer de Firestore
    const docRef = doc(db, 'images_drive', imageId);
    await deleteDoc(docRef);

    // TODO: Supprimer de Google Drive si nécessaire
  }
}

// Service pour la newsletter
export class NewsletterService {
  static async creerNewsletter(newsletter: Omit<Newsletter, 'id' | 'dateCreation' | 'tauxOuverture' | 'tauxClic'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'newsletters'), {
      ...newsletter,
      dateCreation: serverTimestamp(),
      tauxOuverture: 0,
      tauxClic: 0
    });
    return docRef.id;
  }

  static async getNewsletters(): Promise<Newsletter[]> {
    const q = query(
      collection(db, 'newsletters'),
      orderBy('dateCreation', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Newsletter;
      return {
        ...data,
        id: doc.id,
        dateCreation: data.dateCreation instanceof Timestamp ? data.dateCreation.toDate() : new Date(),
        dateEnvoi: data.dateEnvoi instanceof Timestamp ? data.dateEnvoi.toDate() : undefined,
        datePlanification: data.datePlanification instanceof Timestamp ? data.datePlanification.toDate() : undefined
      };
    });
  }

  static async envoyerNewsletter(newsletterId: string): Promise<void> {
    const docRef = doc(db, 'newsletters', newsletterId);
    await updateDoc(docRef, {
      statut: 'envoye',
      dateEnvoi: serverTimestamp()
    });
  }
}

// Service pour les abonnements newsletter
export class AbonnementService {
  static async sabonnerNewsletter(abonnement: Omit<AbonnementNewsletter, 'id' | 'dateInscription' | 'tokenDesabonnement' | 'statut'>): Promise<string> {
    const token = this.genererTokenDesabonnement();

    const docRef = await addDoc(collection(db, 'abonnements_newsletter'), {
      ...abonnement,
      dateInscription: serverTimestamp(),
      tokenDesabonnement: token,
      statut: 'actif'
    });

    return docRef.id;
  }

  static async desabonnerNewsletter(token: string): Promise<void> {
    const q = query(
      collection(db, 'abonnements_newsletter'),
      where('tokenDesabonnement', '==', token)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'abonnements_newsletter', querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        statut: 'desabonne'
      });
    }
  }

  static async getAbonnementsActifs(): Promise<AbonnementNewsletter[]> {
    const q = query(
      collection(db, 'abonnements_newsletter'),
      where('statut', '==', 'actif')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data() as AbonnementNewsletter,
      id: doc.id
    }));
  }

  static genererTokenDesabonnement(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
