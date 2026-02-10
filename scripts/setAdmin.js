import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

// Configuration Firebase (valeurs réelles depuis .env)
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Permissions admin par défaut
const ADMIN_PERMISSIONS = [
  'dashboard_view',
  'user_management',
  'project_management',
  'donation_management',
  'formation_management',
  'analytics_view'
];

// Fonction pour définir un admin par UID
async function setAdminByUID(uid) {
  try {
    console.log(`🔄 Mise à jour du rôle pour l'utilisateur ${uid}...`);

    // Vérifier si l'utilisateur existe
    const userRef = doc(db, 'utilisateurs', uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.error(`❌ Utilisateur ${uid} introuvable dans la base de données`);
      return false;
    }

    const userData = userDoc.data();
    console.log(`📋 Utilisateur trouvé: ${userData.displayName || userData.email}`);

    // Mise à jour du rôle et permissions
    await updateDoc(userRef, {
      role: 'admin',
      permissions: ADMIN_PERMISSIONS
    });

    console.log(`✅ Utilisateur ${uid} défini comme administrateur avec succès !`);
    console.log('🔑 Permissions accordées :', ADMIN_PERMISSIONS);
    console.log('📊 Nouveau rôle : admin');

    return true;

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    return false;
  }
}

// Fonction pour afficher l'aide
function showHelp() {
  console.log(`
🚀 Script de définition des administrateurs RADC

📖 Utilisation:
  node scripts/setAdmin.js <UID>

📝 Arguments:
  <UID>  : ID Firebase de l'utilisateur (obligatoire)

📋 Exemples:
  node scripts/setAdmin.js 4lA9auyxFdSh4saD8dU5wEtAmzc2
  node scripts/setAdmin.js --help

🔍 Trouver l'UID:
  1. Allez dans Firebase Console > Firestore Database
  2. Collection 'utilisateurs'
  3. Copiez l'ID du document utilisateur

⚠️  Important:
  - L'utilisateur doit déjà être inscrit dans l'application
  - Le script met à jour le rôle et les permissions automatiquement
  - L'utilisateur devra se reconnecter pour voir les changements
`);
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);

  // Afficher l'aide si demandé ou pas d'arguments
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return;
  }

  const targetUID = args[0];

  // Validation basique de l'UID
  if (!targetUID || targetUID.length < 20) {
    console.error('❌ UID invalide. Utilisez un UID Firebase valide (au moins 20 caractères)');
    console.log('💡 Utilisez --help pour voir les instructions');
    process.exit(1);
  }

  console.log('🚀 Script de définition des administrateurs RADC');
  console.log('=' .repeat(50));

  const success = await setAdminByUID(targetUID);

  if (success) {
    console.log('\n🎉 Opération terminée avec succès !');
    console.log('🔄 L\'utilisateur devra se reconnecter pour accéder au dashboard admin.');
  } else {
    console.log('\n❌ Échec de l\'opération.');
    process.exit(1);
  }
}

// Exécuter le script
main().catch(error => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});





// Exécuter le script
//                      : node scripts/setAdmin.js UID
