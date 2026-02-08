import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Target } from 'lucide-react';
import type { Projet } from '../types';

interface ProjetsGridProps {
  projets: Projet[];
  title?: string;
  subtitle?: string;
  showAll?: boolean;
  limit?: number;
}

const ProjetsGrid: React.FC<ProjetsGridProps> = ({ 
  projets, 
  title = "Projets Récents", 
  subtitle = "Découvrez nos dernières réalisations et projets en cours",
  showAll = true,
  limit = 6 
}) => {
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en-cours':
        return 'bg-blue-100 text-blue-700';
      case 'termine':
        return 'bg-green-100 text-green-700';
      case 'planifie':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'en-cours':
        return 'En cours';
      case 'termine':
        return 'Terminé';
      case 'planifie':
        return 'Planifié';
      default:
        return statut;
    }
  };

  const displayProjets = showAll ? projets : projets.slice(0, limit);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="display-font text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Projets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayProjets.map((projet) => (
            <Link
              key={projet.id}
              to={`/projets/${projet.id}`}
              className="group bg-white rounded-xl shadow-lg overflow-hidden radc-card-hover border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {projet.images && projet.images.length > 0 && (
                  <img
                    src={projet.images[0]}
                    alt={projet.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(projet.statut)}`}>
                    {getStatusText(projet.statut)}
                  </span>
                </div>

                {/* Progress Bar */}
                {projet.progression !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${projet.progression}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {projet.titre}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {projet.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                  {/* Date */}
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(projet.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>

                  {/* Location */}
                  {projet.lieu && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{projet.lieu}</span>
                    </div>
                  )}

                  {/* Objective */}
                  <div className="flex items-start text-sm text-gray-500">
                    <Target className="w-4 h-4 mr-2 mt-0.5" />
                    <span className="line-clamp-2">{projet.objectif}</span>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {projet.categorie}
                  </span>
                  
                  {/* Arrow */}
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                    <span className="text-sm font-medium">Détails</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Show All Button */}
        {!showAll && projets.length > limit && (
          <div className="text-center">
            <Link
              to="/projets"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              <span>Voir tous les projets</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjetsGrid;
