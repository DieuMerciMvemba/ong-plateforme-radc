import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Tag } from 'lucide-react';
import { EvenementService } from '../../services/communauteService';
import type { Evenement } from '../../types/communaute';

const EvenementsCommunautaires: React.FC = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [filtreType, setFiltreType] = useState<string>('tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerEvenements();
  }, []);

  const chargerEvenements = async () => {
    try {
      setLoading(true);
      const data = await EvenementService.getEvenementsAVenir();
      setEvenements(data);
    } catch (error) {
      console.error('Erreur chargement événements:', error);
    } finally {
      setLoading(false);
    }
  };

  const typesEvenements = [
    { value: 'tous', label: 'Tous les événements', icone: '📅' },
    { value: 'formation', label: 'Formations', icone: '🎓' },
    { value: 'reunion', label: 'Réunions', icone: '👥' },
    { value: 'evenement_social', label: 'Événements sociaux', icone: '🎉' },
    { value: 'atelier', label: 'Ateliers', icone: '🛠️' },
    { value: 'conference', label: 'Conférences', icone: '🎤' }
  ];

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'a_venir': return 'bg-blue-100 text-blue-800';
      case 'en_cours': return 'bg-green-100 text-green-800';
      case 'termine': return 'bg-gray-100 text-gray-800';
      case 'annule': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'formation': return 'bg-purple-100 text-purple-800';
      case 'reunion': return 'bg-blue-100 text-blue-800';
      case 'evenement_social': return 'bg-pink-100 text-pink-800';
      case 'atelier': return 'bg-orange-100 text-orange-800';
      case 'conference': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const evenementsFiltres = filtreType === 'tous' 
    ? evenements 
    : evenements.filter(e => e.type === filtreType);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des événements...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Événements Communautaires</h1>
              <p className="mt-1 text-sm text-gray-600">
                Participez aux activités et formations de la communauté RADC
              </p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              + Créer un événement
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {typesEvenements.map(type => (
              <button
                key={type.value}
                onClick={() => setFiltreType(type.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filtreType === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{type.icone}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des événements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {evenementsFiltres.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-600">
              {filtreType === 'tous' 
                ? 'Soyez le premier à créer un événement communautaire !'
                : `Aucun événement de type "${filtreType}" pour le moment.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {evenementsFiltres.map(evenement => (
              <div key={evenement.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {/* Image */}
                {evenement.image && (
                  <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={evenement.image} 
                      alt={evenement.titre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* En-tête */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(evenement.type)}`}>
                        {evenement.type.replace('_', ' ')}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">
                        {evenement.titre}
                      </h3>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(evenement.statut)}`}>
                      {evenement.statut.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {evenement.description}
                  </p>

                  {/* Informations */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {evenement.date.toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {evenement.lieu}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {evenement.inscrits}/{evenement.capacite} participants
                    </div>
                    {evenement.frais && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Tag className="h-4 w-4 mr-2" />
                        {evenement.frais}€
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {evenement.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {evenement.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          #{tag}
                        </span>
                      ))}
                      {evenement.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{evenement.tags.length - 3} autres
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      S'inscrire
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

export default EvenementsCommunautaires;
