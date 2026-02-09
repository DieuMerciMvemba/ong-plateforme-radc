import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { infosRADC, appelsAction } from '../data';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simuler l'inscription à la newsletter
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubmitting(false);
      setEmail('');
      
      // Réinitialiser le message après 3 secondes
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }, 1000);
  };

  const domainesPrincipaux = [
    "Éducation", "Santé", "Entreprenariat", "Culture et Art"
  ];

  const liensUtiles = [
    { titre: "Accueil", lien: "/" },
    { titre: "À Propos", lien: "/a-propos" },
    { titre: "Interventions", lien: "/domaines" },
    { titre: "Conditions d'utilisation", lien: "/conditions" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              {appelsAction[1].titre}
            </h3>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              {appelsAction[1].message}
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Inscription...' : isSubscribed ? 'Inscrit !' : appelsAction[1].action}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/logo-footer.png" 
                alt="RADC Logo" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="font-bold text-xl">RADC</span>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              {infosRADC.objectifs.global}
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{infosRADC.siege.commune}, {infosRADC.siege.ville}</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                <span>{infosRADC.coordonnees.telephone}</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                <span>{infosRADC.coordonnees.email}</span>
              </div>
            </div>
          </div>

          {/* Liens Utiles */}
          <div>
            <h4 className="font-bold text-lg mb-4">Liens Utiles</h4>
            <ul className="space-y-2">
              {liensUtiles.map((lien) => (
                <li key={lien.titre}>
                  <a
                    href={lien.lien}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {lien.titre}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Domaines d'Intervention */}
          <div>
            <h4 className="font-bold text-lg mb-4">Domaines d'Interventions</h4>
            <ul className="space-y-2">
              {domainesPrincipaux.map((domaine) => (
                <li key={domaine}>
                  <a
                    href="/domaines"
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {domaine}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Suivez-nous */}
          <div>
            <h4 className="font-bold text-lg mb-4">Suivez-nous</h4>
            <p className="text-gray-300 mb-6 text-sm">
              Restez informé sur nos projets et initiatives à travers nos réseaux sociaux.
            </p>
            <div className="flex space-x-4">
              {infosRADC.coordonnees.facebook && (
                <a
                  href={infosRADC.coordonnees.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              <span>2025</span> | <strong className="text-white">RADC</strong> | <span>Tous Droits Réservés</span>
            </p>
            <div className="text-gray-400 text-sm">
              Conçu par{' '}
              <a 
                href="https://tmlcds.web.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors font-medium"
              >
                TMLcd
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
