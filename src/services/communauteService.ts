import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { 
  Evenement, 
  OpportuniteBenevolat, 
  AnnonceCommunautaire,
  ProjetCommunautaire,
  RessourcePartagee,
  ForumCategorie,
  ForumSujet,
  ForumMessage
} from '../types/communaute';

// Service pour la gestion des événements
export class EvenementService {
  static async creerEvenement(evenement: Omit<Evenement, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'evenements'), {
      ...evenement,
      date: Timestamp.fromDate(evenement.date),
      dateCreation: serverTimestamp(),
      dateModification: serverTimestamp()
    });
    return docRef.id;
  }

  static async getEvenementsAVenir(): Promise<Evenement[]> {
    const q = query(
      collection(db, 'evenements'),
      where('statut', 'in', ['a_venir', 'en_cours']),
      where('date', '>=', Timestamp.fromDate(new Date())),
      orderBy('date', 'asc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Evenement;
      return {
        ...data,
        id: doc.id,
        date: data.date instanceof Timestamp ? data.date.toDate() : new Date()
      };
    });
  }

  static async getEvenementsParType(type: string): Promise<Evenement[]> {
    const q = query(
      collection(db, 'evenements'),
      where('type', '==', type),
      where('statut', '!=', 'archive'),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Evenement;
      return {
        ...data,
        id: doc.id,
        date: data.date instanceof Timestamp ? data.date.toDate() : new Date()
      };
    });
  }

  static async inscrireEvenement(evenementId: string): Promise<void> {
    const evenementRef = doc(db, 'evenements', evenementId);
    const evenementDoc = await getDoc(evenementRef);
    
    if (evenementDoc.exists()) {
      const evenement = evenementDoc.data() as Evenement;
      await updateDoc(evenementRef, {
        inscrits: evenement.inscrits + 1
      });
    }
  }
}

// Service pour les opportunités de bénévolat
export class BenevolatService {
  static async creerOpportunite(opportunite: Omit<OpportuniteBenevolat, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'opportunites_benevolat'), {
      ...opportunite,
      dateCreation: serverTimestamp(),
      dateModification: serverTimestamp(),
      dateLimite: opportunite.dateLimite ? Timestamp.fromDate(opportunite.dateLimite) : null
    });
    return docRef.id;
  }

  static async getOpportunitesDisponibles(): Promise<OpportuniteBenevolat[]> {
    const q = query(
      collection(db, 'opportunites_benevolat'),
      where('statut', '==', 'disponible'),
      orderBy('dateCreation', 'desc'),
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as OpportuniteBenevolat;
      return {
        ...data,
        id: doc.id,
        dateLimite: data.dateLimite instanceof Timestamp ? data.dateLimite.toDate() : undefined
      };
    });
  }

  static async postulerOpportunite(opportuniteId: string, message: string): Promise<void> {
    await addDoc(collection(db, 'candidatures_benevolat'), {
      opportuniteId,
      message,
      dateCandidature: serverTimestamp(),
      statut: 'en_attente'
    });
  }
}

// Service pour les annonces communautaires
export class AnnonceService {
  static async creerAnnonce(annonce: Omit<AnnonceCommunautaire, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'annonces'), {
      ...annonce,
      datePublication: Timestamp.fromDate(annonce.datePublication),
      dateCreation: serverTimestamp(),
      dateModification: serverTimestamp()
    });
    return docRef.id;
  }

  static async getAnnoncesPubliees(): Promise<AnnonceCommunautaire[]> {
    const q = query(
      collection(db, 'annonces'),
      where('statut', '==', 'publie'),
      orderBy('datePublication', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as AnnonceCommunautaire;
      return {
        ...data,
        id: doc.id,
        datePublication: data.datePublication instanceof Timestamp ? data.datePublication.toDate() : new Date()
      };
    });
  }

  static async aimerAnnonce(annonceId: string): Promise<void> {
    await addDoc(collection(db, 'annonces_likes'), {
      annonceId,
      dateLike: serverTimestamp()
    });
  }

  static async getAnnonesParCategorie(categorie: string): Promise<AnnonceCommunautaire[]> {
    const q = query(
      collection(db, 'annonces'),
      where('categorie', '==', categorie),
      where('statut', '==', 'publie'),
      orderBy('datePublication', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as AnnonceCommunautaire;
      return {
        ...data,
        id: doc.id,
        datePublication: data.datePublication instanceof Timestamp ? data.datePublication.toDate() : new Date()
      };
    });
  }
}

// Service pour les projets communautaires
export class ProjetCommunautaireService {
  static async creerProjet(projet: Omit<ProjetCommunautaire, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'projets_communautaires'), {
      ...projet,
      dateDebut: Timestamp.fromDate(projet.dateDebut),
      dateFinPrevue: projet.dateFinPrevue ? Timestamp.fromDate(projet.dateFinPrevue) : null,
      dateCreation: serverTimestamp(),
      dateModification: serverTimestamp()
    });
    return docRef.id;
  }

  static async getProjetsActifs(): Promise<ProjetCommunautaire[]> {
    const q = query(
      collection(db, 'projets_communautaires'),
      where('statut', 'in', ['en_preparation', 'en_cours']),
      orderBy('dateCreation', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as ProjetCommunautaire;
      return {
        ...data,
        id: doc.id,
        dateDebut: data.dateDebut instanceof Timestamp ? data.dateDebut.toDate() : new Date(),
        dateFinPrevue: data.dateFinPrevue instanceof Timestamp ? data.dateFinPrevue.toDate() : undefined
      };
    });
  }

  static async rejoindreProjet(projetId: string, competences: string[]): Promise<void> {
    await addDoc(collection(db, 'projets_participants'), {
      projetId,
      competences,
      dateInscription: serverTimestamp(),
      statut: 'actif'
    });
  }
}

// Service pour les ressources partagées
export class RessourceService {
  static async partagerRessource(ressource: Omit<RessourcePartagee, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'ressources'), {
      ...ressource,
      dateAjout: Timestamp.fromDate(ressource.dateAjout),
      dateCreation: serverTimestamp(),
      dateModification: serverTimestamp()
    });
    return docRef.id;
  }

  static async getRessourcesPopulaires(): Promise<RessourcePartagee[]> {
    const q = query(
      collection(db, 'ressources'),
      where('statut', '==', 'publie'),
      orderBy('telechargements', 'desc'),
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as RessourcePartagee;
      return {
        ...data,
        id: doc.id,
        dateAjout: data.dateAjout instanceof Timestamp ? data.dateAjout.toDate() : new Date()
      };
    });
  }

  static async getRessourcesParCategorie(categorie: string): Promise<RessourcePartagee[]> {
    const q = query(
      collection(db, 'ressources'),
      where('categorie', '==', categorie),
      where('statut', '==', 'publie'),
      orderBy('dateAjout', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as RessourcePartagee;
      return {
        ...data,
        id: doc.id,
        dateAjout: data.dateAjout instanceof Timestamp ? data.dateAjout.toDate() : new Date()
      };
    });
  }

  static async telechargerRessource(ressourceId: string): Promise<void> {
    await addDoc(collection(db, 'ressources_telechargements'), {
      ressourceId,
      dateTelechargement: serverTimestamp()
    });
  }

  static async evaluerRessource(ressourceId: string, note: number, commentaire: string): Promise<void> {
    await addDoc(collection(db, 'ressources_evaluations'), {
      ressourceId,
      note,
      commentaire,
      dateEvaluation: serverTimestamp()
    });
  }
}

// Service pour le forum
export class ForumService {
  static async creerCategorie(categorie: Omit<ForumCategorie, 'id' | 'nombreSujets' | 'nombreMessages'>): Promise<void> {
    await addDoc(collection(db, 'forum_categories'), {
      ...categorie,
      nombreSujets: 0,
      nombreMessages: 0,
      dateCreation: serverTimestamp()
    });
  }

  static async getCategories(): Promise<ForumCategorie[]> {
    const q = query(
      collection(db, 'forum_categories'),
      where('statut', '==', 'actif'),
      orderBy('ordre', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data() as ForumCategorie,
      id: doc.id
    }));
  }

  static async creerSujet(sujet: Omit<ForumSujet, 'id' | 'dateCreation' | 'dateDerniereActivite' | 'reponses' | 'vues' | 'votes'>): Promise<void> {
    await addDoc(collection(db, 'forum_sujets'), {
      ...sujet,
      dateCreation: serverTimestamp(),
      dateDerniereActivite: serverTimestamp(),
      reponses: 0,
      vues: 0,
      votes: 0
    });
  }

  static async getSujetsParCategorie(categorieId: string): Promise<ForumSujet[]> {
    const q = query(
      collection(db, 'forum_sujets'),
      where('categorie', '==', categorieId),
      where('statut', '!=', 'supprime'),
      orderBy('dateDerniereActivite', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as ForumSujet;
      return {
        ...data,
        id: doc.id,
        dateCreation: data.dateCreation instanceof Timestamp ? data.dateCreation.toDate() : new Date(),
        dateDerniereActivite: data.dateDerniereActivite instanceof Timestamp ? data.dateDerniereActivite.toDate() : new Date()
      };
    });
  }

  static async repondreSujet(message: Omit<ForumMessage, 'id' | 'datePublication' | 'dateModification' | 'votes'>): Promise<void> {
    await addDoc(collection(db, 'forum_messages'), {
      ...message,
      datePublication: serverTimestamp(),
      dateModification: serverTimestamp(),
      votes: 0
    });
  }

  static async getMessagesParSujet(sujetId: string): Promise<ForumMessage[]> {
    const q = query(
      collection(db, 'forum_messages'),
      where('sujetId', '==', sujetId),
      where('statut', '==', 'publie'),
      orderBy('datePublication', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as ForumMessage;
      return {
        ...data,
        id: doc.id,
        datePublication: data.datePublication instanceof Timestamp ? data.datePublication.toDate() : new Date(),
        dateModification: data.dateModification instanceof Timestamp ? data.dateModification.toDate() : undefined
      };
    });
  }

  static async voterMessage(messageId: string, type: 'positif' | 'negatif'): Promise<void> {
    await addDoc(collection(db, 'forum_votes'), {
      messageId,
      type,
      dateVote: serverTimestamp()
    });
  }
}
