import React, { useState } from 'react';
import { Calendar, Users, MessageSquare, Briefcase, FileText, Share2 } from 'lucide-react';
import EvenementsCommunautaires from './EvenementsCommunautaires';
import OpportunitesBenevolat from './OpportunitesBenevolat';
import AnnoncesCommunautaires from './AnnoncesCommunautaires';

type OngletCommunaute = 'evenements' | 'benevolat' | 'annonces' | 'projets' | 'ressources';

const EspaceCommunautaire: React.FC = () => {
  const [ongletActif, setOngletActif] = useState<OngletCommunaute>('evenements');

  const onglets = [
    {
      id: 'evenements' as OngletCommunaute,
      label: 'Événements',
      icone: Calendar,
      description: 'Formations, ateliers et rencontres',
      couleur: 'bg-blue-500'
    },
    {
      id: 'benevolat' as OngletCommunaute,
      label: 'Bénévolat',
      icone: Users,
      description: 'Opportunités de contribution',
      couleur: 'bg-green-500'
    },
    {
      id: 'annonces' as OngletCommunaute,
      label: 'Annonces',
      icone: MessageSquare,
      description: 'Informations et partages',
      couleur: 'bg-purple-500'
    },
    {
      id: 'projets' as OngletCommunaute,
      label: 'Projets',
      icone: Briefcase,
      description: 'Initiatives collaboratives',
      couleur: 'bg-orange-500'
    },
    {
      id: 'ressources' as OngletCommunaute,
      label: 'Ressources',
      icone: FileText,
      description: 'Documents et outils partagés',
      couleur: 'bg-indigo-500'
    }
  ];

  const renderContenuOnglet = () => {
    switch (ongletActif) {
      case 'evenements':
        return <EvenementsCommunautaires />;
      case 'benevolat':
        return <OpportunitesBenevolat />;
      case 'annonces':
        return <AnnoncesCommunautaires />;
      case 'projets':
        return (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Projets Communautaires</h3>
            <p className="text-gray-600">Cette fonctionnalité sera bientôt disponible.</p>
          </div>
        );
      case 'ressources':
        return (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ressources Partagées</h3>
            <p className="text-gray-600">Cette fonctionnalité sera bientôt disponible.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Espace Communautaire</h1>
            <p className="text-gray-600">
              Connectez-vous, collaborez et contribuez au développement de votre communauté
            </p>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {onglets.map(onglet => {
              const Icone = onglet.icone;
              const actif = ongletActif === onglet.id;
              
              return (
                <button
                  key={onglet.id}
                  onClick={() => setOngletActif(onglet.id)}
                  className={`flex items-center px-1 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    actif
                      ? `border-blue-500 text-blue-600`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${actif ? onglet.couleur : 'bg-gray-100'} text-white mr-3`}>
                    <Icone className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{onglet.label}</div>
                    <div className="text-xs text-gray-500">{onglet.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="flex-1">
        {renderContenuOnglet()}
      </div>

      {/* Footer communautaire */}
      <div className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Statistiques */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Vie Communautaire</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Membres actifs</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Événements ce mois</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between">
                  <span>Heures de bénévolat</span>
                  <span className="font-medium">8,456</span>
                </div>
                <div className="flex justify-between">
                  <span>Projets en cours</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm">
                  📅 Proposer un événement
                </button>
                <button className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm">
                  🤝 Offrir du bénévolat
                </button>
                <button className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm">
                  📢 Publier une annonce
                </button>
                <button className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm">
                  📂 Partager une ressource
                </button>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Besoin d'aide ?</h3>
              <p className="text-sm text-gray-300 mb-4">
                Notre équipe de modération est disponible pour vous accompagner dans vos démarches communautaires.
              </p>
              <div className="space-y-2">
                <a href="#" className="flex items-center text-sm text-gray-300 hover:text-white">
                  📧 communaute@radc.cd
                </a>
                <a href="#" className="flex items-center text-sm text-gray-300 hover:text-white">
                  💬 Guide de la communauté
                </a>
                <a href="#" className="flex items-center text-sm text-gray-300 hover:text-white">
                  📋 Règles de conduite
                </a>
              </div>
            </div>
          </div>

          {/* Partage social */}
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-400 mb-3">
              Partagez votre expérience communautaire
            </p>
            <div className="flex justify-center space-x-4">
              <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EspaceCommunautaire;
