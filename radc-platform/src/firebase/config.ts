import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuration Firebase depuis les variables d'environnement
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Provider pour Google Auth
export const googleProvider = new GoogleAuthProvider();

// Types pour les utilisateurs et rôles
export interface Utilisateur {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'gestionnaire' | 'benevole' | 'donateur' | 'visiteur';
  telephone?: string;
  adresse?: string;
  dateInscription: Date;
  dernierAcces: Date;
  verified: boolean;
  permissions: string[];
}

export interface SessionUtilisateur {
  utilisateur: Utilisateur;
  token: string;
  estAuthentifie: boolean;
}

// Configuration des rôles et permissions
export const ROLES = {
  ADMIN: 'admin',
  GESTIONNAIRE: 'gestionnaire',
  BENEVOLE: 'benevole',
  DONATEUR: 'donateur',
  VISITEUR: 'visiteur'
} as const;

export const PERMISSIONS = {
  // Dashboard et gestion
  DASHBOARD_VIEW: 'dashboard_view',
  DASHBOARD_MANAGE: 'dashboard_manage',
  PROJETS_CREATE: 'projets_create',
  PROJETS_EDIT: 'projets_edit',
  PROJETS_DELETE: 'projets_delete',
  PROJETS_VIEW: 'projets_view',
  
  // Donations
  DONATIONS_VIEW: 'donations_view',
  DONATIONS_MANAGE: 'donations_manage',
  DONATIONS_PROCESS: 'donations_process',
  
  // Communauté
  FORUM_VIEW: 'forum_view',
  FORUM_MODERATE: 'forum_moderate',
  EVENTS_CREATE: 'events_create',
  EVENTS_MANAGE: 'events_manage',
  
  // Formation
  COURSES_VIEW: 'courses_view',
  COURSES_CREATE: 'courses_create',
  COURSES_MANAGE: 'courses_manage',
  
  // Administration
  USERS_MANAGE: 'users_manage',
  SYSTEM_CONFIG: 'system_config',
  ANALYTICS_VIEW: 'analytics_view'
} as const;

// Mapping des permissions par rôle
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  
  [ROLES.GESTIONNAIRE]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_MANAGE,
    PERMISSIONS.PROJETS_CREATE,
    PERMISSIONS.PROJETS_EDIT,
    PERMISSIONS.DONATIONS_VIEW,
    PERMISSIONS.DONATIONS_MANAGE,
    PERMISSIONS.FORUM_VIEW,
    PERMISSIONS.EVENTS_CREATE,
    PERMISSIONS.EVENTS_MANAGE,
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.COURSES_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW
  ],
  
  [ROLES.BENEVOLE]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJETS_VIEW,
    PERMISSIONS.DONATIONS_VIEW,
    PERMISSIONS.FORUM_VIEW,
    PERMISSIONS.EVENTS_CREATE,
    PERMISSIONS.COURSES_VIEW
  ],
  
  [ROLES.DONATEUR]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJETS_VIEW,
    PERMISSIONS.DONATIONS_VIEW,
    PERMISSIONS.FORUM_VIEW,
    PERMISSIONS.EVENTS_CREATE,
    PERMISSIONS.COURSES_VIEW
  ],
  
  [ROLES.VISITEUR]: [
    PERMISSIONS.PROJETS_VIEW,
    PERMISSIONS.FORUM_VIEW,
    PERMISSIONS.COURSES_VIEW
  ]
} as const;

export default app;
