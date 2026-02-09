import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputLogo = path.join(__dirname, '../public/images/logo.png');
const outputDir = path.join(__dirname, '../public');

// Définir toutes les tailles nécessaires
const sizes = {
  // Favicon
  favicon: { size: 32, name: 'favicon.ico' },
  
  // Apple Touch Icons
  appleTouchIcon: { size: 180, name: 'apple-touch-icon.png' },
  
  // PWA Icons
  pwaIcons: [
    { size: 72, name: 'icon-72x72.png' },
    { size: 96, name: 'icon-96x96.png' },
    { size: 128, name: 'icon-128x128.png' },
    { size: 144, name: 'icon-144x144.png' },
    { size: 152, name: 'icon-152x152.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 384, name: 'icon-384x384.png' },
    { size: 512, name: 'icon-512x512.png' },
  ],
  
  // Social Media
  social: { size: 1200, name: 'social-share.png' },
  
  // Header Logo (plus grand)
  header: { size: 200, name: 'logo-header.png' },
  
  // Footer Logo (plus petit)
  footer: { size: 100, name: 'logo-footer.png' },
  
  // Logo pour le hero
  hero: { size: 300, name: 'logo-hero.png' }
};

async function generateLogos() {
  try {
    console.log('🎨 Génération des logos RADC en cours...');
    
    // Créer le dossier icons s'il n'existe pas
    const iconsDir = path.join(outputDir, 'icons');
    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir, { recursive: true });
    }
    
    // Générer le favicon (format spécial)
    console.log('📱 Génération du favicon...');
    await sharp(inputLogo)
      .resize(32, 32)
      .toFile(path.join(outputDir, 'favicon.png'));
    
    // Générer l'icône Apple Touch
    console.log('🍎 Génération de l\'icône Apple Touch...');
    await sharp(inputLogo)
      .resize(sizes.appleTouchIcon.size, sizes.appleTouchIcon.size)
      .png()
      .toFile(path.join(outputDir, sizes.appleTouchIcon.name));
    
    // Générer les icônes PWA
    console.log('📲 Génération des icônes PWA...');
    for (const icon of sizes.pwaIcons) {
      await sharp(inputLogo)
        .resize(icon.size, icon.size)
        .png()
        .toFile(path.join(iconsDir, icon.name));
    }
    
    // Générer le logo pour les réseaux sociaux
    console.log('🌐 Génération du logo pour réseaux sociaux...');
    await sharp(inputLogo)
      .resize(sizes.social.size, sizes.social.size)
      .png()
      .toFile(path.join(outputDir, sizes.social.name));
    
    // Générer les logos pour différentes parties du site
    console.log('🎯 Génération des logos pour le site...');
    
    // Header logo
    await sharp(inputLogo)
      .resize(sizes.header.size, sizes.header.size)
      .png()
      .toFile(path.join(outputDir, 'logo-header.png'));
    
    // Footer logo
    await sharp(inputLogo)
      .resize(sizes.footer.size, sizes.footer.size)
      .png()
      .toFile(path.join(outputDir, 'logo-footer.png'));
    
    // Hero logo
    await sharp(inputLogo)
      .resize(sizes.hero.size, sizes.hero.size)
      .png()
      .toFile(path.join(outputDir, 'logo-hero.png'));
    
    console.log('✅ Tous les logos RADC ont été générés avec succès !');
    console.log('\n📁 Fichiers créés :');
    console.log('  • favicon.png');
    console.log('  • apple-touch-icon.png');
    console.log('  • icons/ (8 icônes PWA)');
    console.log('  • social-share.png');
    console.log('  • logo-header.png');
    console.log('  • logo-footer.png');
    console.log('  • logo-hero.png');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération des logos:', error);
    process.exit(1);
  }
}

generateLogos();
