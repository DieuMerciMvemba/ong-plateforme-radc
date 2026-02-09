import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import type { Utilisateur } from '../firebase/config';

// État initial
interface AuthState {
  utilisateur: Utilisateur | null;
  estAuthentifie: boolean;
  isLoading: boolean;
  erreur: string | null;
}

const initialState: AuthState = {
  utilisateur: null,
  estAuthentifie: false,
  isLoading: true,
  erreur: null
};

// Types d'actions
type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: Utilisateur }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<Utilisateur> };

// Reducer pour la gestion d'état
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        erreur: null
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        utilisateur: action.payload,
        estAuthentifie: true,
        isLoading: false,
        erreur: null
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        utilisateur: null,
        estAuthentifie: false,
        isLoading: false,
        erreur: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        utilisateur: null,
        estAuthentifie: false,
        isLoading: false,
        erreur: null
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        erreur: null
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        utilisateur: state.utilisateur ? { ...state.utilisateur, ...action.payload } : null
      };
    
    default:
      return state;
  }
};

// Context
interface AuthContextType {
  state: AuthState;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (data: Partial<Utilisateur>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Convertir Firebase User en Utilisateur
  const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<Utilisateur> => {
    const userRef = doc(db, 'utilisateurs', firebaseUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as Utilisateur;
      
      // Mettre à jour le dernier accès
      await updateDoc(userRef, {
        dernierAcces: serverTimestamp()
      });
      
      return {
        ...userData,
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName!,
        photoURL: firebaseUser.photoURL || undefined,
        dernierAcces: new Date()
      };
    } else {
      // Nouvel utilisateur - créer le document
      const newUser: Utilisateur = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName!,
        photoURL: firebaseUser.photoURL || undefined,
        role: 'visiteur', // Rôle par défaut
        dateInscription: new Date(),
        dernierAcces: new Date(),
        verified: firebaseUser.emailVerified || false,
        permissions: [] // Sera mis à jour selon le rôle
      };
      
      await setDoc(userRef, {
        ...newUser,
        dateInscription: serverTimestamp(),
        dernierAcces: serverTimestamp()
      });
      
      return newUser;
    }
  };

  // Login avec Google
  const loginWithGoogle = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const result = await signInWithPopup(auth, googleProvider);
      const utilisateur = await convertFirebaseUser(result.user);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: utilisateur });
    } catch (error: any) {
      console.error('Erreur login Google:', error);
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: error.message || 'Erreur lors de la connexion' 
      });
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'LOGOUT' });
    } catch (error: any) {
      console.error('Erreur logout:', error);
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: error.message || 'Erreur lors de la déconnexion' 
      });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Update user
  const updateUser = async (data: Partial<Utilisateur>) => {
    if (!state.utilisateur) return;
    
    try {
      const userRef = doc(db, 'utilisateurs', state.utilisateur.uid);
      await updateDoc(userRef, {
        ...data,
        dernierAcces: serverTimestamp()
      });
      
      dispatch({ type: 'UPDATE_USER', payload: data });
    } catch (error: any) {
      console.error('Erreur update user:', error);
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: error.message || 'Erreur lors de la mise à jour' 
      });
    }
  };

  // Écouter les changements d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const utilisateur = await convertFirebaseUser(firebaseUser);
          dispatch({ type: 'AUTH_SUCCESS', payload: utilisateur });
        } catch (error: any) {
          console.error('Erreur conversion user:', error);
          dispatch({ 
            type: 'AUTH_FAILURE', 
            payload: error.message || 'Erreur lors du chargement utilisateur' 
          });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return unsubscribe;
  }, []);

  // Fonctions d'autorisation
  const hasRole = (requiredRole: string): boolean => {
    return state.utilisateur?.role === requiredRole;
  };

  const hasPermission = (requiredPermission: string): boolean => {
    if (!state.utilisateur) return false;
    
    const userRole = state.utilisateur.role;
    const userPermissions = state.utilisateur.permissions || [];
    
    // Permissions par rôle
    const rolePermissions: Record<string, string[]> = {
      admin: ['dashboard_view', 'user_management', 'project_management', 'donation_management', 'formation_management', 'analytics_view'],
      gestionnaire: ['dashboard_view', 'project_management', 'donation_management', 'formation_management'],
      benevole: ['project_view', 'formation_view'],
      donateur: ['donation_view', 'project_view']
    };
    
    const permissions = rolePermissions[userRole] || [];
    return permissions.includes(requiredPermission) || userPermissions.includes(requiredPermission);
  };

  return (
    <AuthContext.Provider value={{
      state,
      loginWithGoogle,
      logout,
      clearError,
      updateUser,
      hasPermission,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Hook pour les routes protégées
export const useRequireAuth = (requiredRole?: string) => {
  const { state } = useAuth();
  
  if (state.isLoading) {
    return { loading: true, authorized: false };
  }
  
  if (!state.estAuthentifie) {
    return { loading: false, authorized: false };
  }
  
  if (requiredRole && state.utilisateur?.role !== requiredRole) {
    return { loading: false, authorized: false };
  }
  
  return { loading: false, authorized: true };
};

export default AuthContext;
