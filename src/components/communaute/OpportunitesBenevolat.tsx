import React, { useState, useEffect } from 'react';
import { Heart, Clock, MapPin, Briefcase, Search } from 'lucide-react';
import { BenevolatService } from '../../services/communauteService';
import type { OpportuniteBenevolat } from '../../types/communaute';

const OpportunitesBenevolat: React.FC = () => {
  const [opportunites, setOpportunites] = useState<OpportuniteBenevolat[]>([]);
  const [filtreDomaine, setFiltreDomaine] = useState<string>('tous');
  const [filtreType, setFiltreType] = useState<string>('tous');
  const [recherche, setRecherche] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerOpportunites();
  }, []);

  const chargerOpportunites = async () => {
    try {
      setLoading(true);
      const data = await BenevolatService.getOpportunitesDisponibles();
      setOpportunites(data);
    } catch (error) {
      console.error('Erreur chargement opportunités:', error);
    } finally {
      setLoading(false);
    }
  };

  const domaines = [
    { value: 'tous', label: 'Tous les domaines' },
    { value: 'education', label: 'Éducation' },
    { value: 'sante', label: 'Santé' },
    { value: 'environnement', label: 'Environnement' },
    { value: 'social', label: 'Social' },
    { value: 'culture', label: 'Culture' },
    { value: 'sport', label: 'Sport' },
    { value: 'technologie', label: 'Technologie' }
  ];

  const types = [
    { value: 'tous', label: 'Tous les types' },
    { value: 'presentiel', label: 'Présentiel' },
    { value: 'distance', label: 'À distance' },
    { value: 'hybride', label: 'Hybride' }
  ];

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'pourvu': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'presentiel': return '🏢';
      case 'distance': return '💻';
      case 'hybride': return '🔄';
      default: return '❓';
    }
  };

  const opportunitesFiltrees = opportunites.filter(opp => {
    const matchDomaine = filtreDomaine === 'tous' || opp.domaine === filtreDomaine;
    const matchType = filtreType === 'tous' || opp.type === filtreType;
    const matchRecherche = recherche === '' || 
      opp.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      opp.description.toLowerCase().includes(recherche.toLowerCase()) ||
      opp.competences.some(comp => comp.toLowerCase().includes(recherche.toLowerCase()));
    
    return matchDomaine && matchType && matchRecherche;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des opportunités...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Opportunités de Bénévolat</h1>
              <p className="mt-1 text-sm text-gray-600">
                Contribuez aux projets de la communauté RADC
              </p>
            </div>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              + Proposer une opportunité
            </button>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une opportunité..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex gap-2">
              <select
                value={filtreDomaine}
                onChange={(e) => setFiltreDomaine(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {domaines.map(domaine => (
                  <option key={domaine.value} value={domaine.value}>
                    {domaine.label}
                  </option>
                ))}
              </select>

              <select
                value={filtreType}
                onChange={(e) => setFiltreType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des opportunités */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {opportunitesFiltrees.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune opportunité trouvée</h3>
            <p className="text-gray-600">
              {recherche || filtreDomaine !== 'tous' || filtreType !== 'tous'
                ? 'Essayez d\'ajuster vos filtres de recherche.'
                : 'Soyez le premier à proposer une opportunité de bénévolat !'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunitesFiltrees.map(opportunite => (
              <div key={opportunite.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* En-tête */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {opportunite.titre}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(opportunite.statut)}`}>
                          {opportunite.statut.replace('_', ' ')}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                          {getTypeIcon(opportunite.type)} {opportunite.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {opportunite.description}
                  </p>

                  {/* Informations */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {opportunite.domaine}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {opportunite.duree} • {opportunite.tempsRequis}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {opportunite.lieu}
                    </div>
                    {opportunite.dateLimite && (
                      <div className="flex items-center text-sm text-orange-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Date limite: {opportunite.dateLimite.toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>

                  {/* Compétences requises */}
                  {opportunite.competences.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Compétences requises:</h4>
                      <div className="flex flex-wrap gap-1">
                        {opportunite.competences.slice(0, 4).map((competence, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700"
                          >
                            {competence}
                          </span>
                        ))}
                        {opportunite.competences.length > 4 && (
                          <span className="text-xs text-gray-500">
                            +{opportunite.competences.length - 4} autres
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Avantages */}
                  {opportunite.avantages && opportunite.avantages.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Avantages:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {opportunite.avantages.slice(0, 2).map((avantage, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {avantage}
                          </li>
                        ))}
                        {opportunite.avantages.length > 2 && (
                          <li className="text-xs text-gray-500">
                            +{opportunite.avantages.length - 2} autres avantages
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Postuler
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitesBenevolat;
