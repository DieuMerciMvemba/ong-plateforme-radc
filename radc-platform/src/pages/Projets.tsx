import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Target, Search, ArrowRight } from 'lucide-react';
import { projets, domainesIntervention } from '../data';

const Projets: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filteredProjets, setFilteredProjets] = useState(projets);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');

  useEffect(() => {
    // Get domaine filter from URL
    const domaineParam = searchParams.get('domaine');
    if (domaineParam) {
      setSelectedDomaine(domaineParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = projets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(projet =>
        projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.objectif.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by domaine
    if (selectedDomaine) {
      filtered = filtered.filter(projet =>
        projet.categorie === selectedDomaine
      );
    }

    // Filter by statut
    if (selectedStatut) {
      filtered = filtered.filter(projet =>
        projet.statut === selectedStatut
      );
    }

    setFilteredProjets(filtered);
  }, [searchTerm, selectedDomaine, selectedStatut]);

  const getStatutColor = (statut: string) => {
    const colorMap: { [key: string]: string } = {
      'en-cours': 'bg-blue-100 text-blue-800',
      'termine': 'bg-green-100 text-green-800',
      'en-attente': 'bg-yellow-100 text-yellow-800',
      'planifie': 'bg-purple-100 text-purple-800',
    };
    return colorMap[statut] || 'bg-gray-100 text-gray-800';
  };

  const getStatutLabel = (statut: string) => {
    const labelMap: { [key: string]: string } = {
      'en-cours': 'En Cours',
      'termine': 'Terminé',
      'en-attente': 'En Attente',
      'planifie': 'Planifié',
    };
    return labelMap[statut] || statut;
  };

  const getProgressColor = (progression: number) => {
    if (progression >= 80) return 'bg-green-500';
    if (progression >= 50) return 'bg-blue-500';
    if (progression >= 30) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nos Projets
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Découvrez nos réalisations et projets en cours pour un impact durable
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                {projets.length} Projets Actifs
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                {domainesIntervention.length} Domaines
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                Impact Communautaire
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Domaine Filter */}
            <select
              value={selectedDomaine}
              onChange={(e) => setSelectedDomaine(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Tous les domaines</option>
              {domainesIntervention.map((domaine) => (
                <option key={domaine.id} value={domaine.id}>
                  {domaine.titre}
                </option>
              ))}
            </select>

            {/* Statut Filter */}
            <select
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="en-cours">En Cours</option>
              <option value="termine">Terminé</option>
              <option value="en-attente">En Attente</option>
              <option value="planifie">Planifié</option>
            </select>

            {/* Results Count */}
            <div className="text-sm text-gray-600 whitespace-nowrap">
              {filteredProjets.length} résultat{filteredProjets.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-12">
        {filteredProjets.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun projet trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDomaine('');
                setSelectedStatut('');
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjets.map((projet) => (
              <div
                key={projet.id}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100">
                  {projet.images && projet.images.length > 0 ? (
                    <img
                      src={projet.images[0]}
                      alt={projet.titre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Target className="w-12 h-12 text-green-600" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(projet.statut)}`}>
                      {getStatutLabel(projet.statut)}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {projet.titre}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {projet.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progression</span>
                      <span className="text-sm font-medium text-gray-900">{projet.progression}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(projet.progression || 0)}`}
                        style={{ width: `${projet.progression || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {projet.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {projet.lieu}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2 text-gray-400" />
                      {projet.objectif}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {domainesIntervention.find(d => d.id === projet.categorie)?.titre || projet.categorie}
                    </span>
                    <Link
                      to={`/projets/${projet.id}`}
                      className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Voir détails
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Participez à Nos Projets
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contribuez directement au développement communautaire
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Devenir Partenaire
              </Link>
              <Link
                to="/domaines"
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-600"
              >
                Explorer les Domaines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projets;
