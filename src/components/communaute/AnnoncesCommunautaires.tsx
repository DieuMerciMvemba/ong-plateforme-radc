import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2, Search, Plus, FileText, Tag } from 'lucide-react';
import { AnnonceService } from '../../services/communauteService';
import type { AnnonceCommunautaire } from '../../types/communaute';

const AnnoncesCommunautaires: React.FC = () => {
  const [annonces, setAnnonces] = useState<AnnonceCommunautaire[]>([]);
  const [filtreCategorie, setFiltreCategorie] = useState<string>('toutes');
  const [recherche, setRecherche] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerAnnonces();
  }, []);

  const chargerAnnonces = async () => {
    try {
      setLoading(true);
      const data = await AnnonceService.getAnnoncesPubliees();
      setAnnonces(data);
    } catch (error) {
      console.error('Erreur chargement annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'toutes', label: 'Toutes les catégories', icone: '📢' },
    { value: 'information', label: 'Informations', icone: 'ℹ️' },
    { value: 'partage', label: 'Partages', icone: '🤝' },
    { value: 'aide', label: 'Demandes d\'aide', icone: '🆘' },
    { value: 'collaboration', label: 'Collaborations', icone: '🤝' },
    { value: 'actualite', label: 'Actualités', icone: '📰' }
  ];

  const getCategorieColor = (categorie: string) => {
    switch (categorie) {
      case 'information': return 'bg-blue-100 text-blue-800';
      case 'partage': return 'bg-green-100 text-green-800';
      case 'aide': return 'bg-orange-100 text-orange-800';
      case 'collaboration': return 'bg-purple-100 text-purple-800';
      case 'actualite': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const annoncesFiltrees = annonces.filter(annonce => {
    const matchCategorie = filtreCategorie === 'toutes' || annonce.categorie === filtreCategorie;
    const matchRecherche = recherche === '' || 
      annonce.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      annonce.contenu.toLowerCase().includes(recherche.toLowerCase()) ||
      annonce.tags.some(tag => tag.toLowerCase().includes(recherche.toLowerCase()));
    
    return matchCategorie && matchRecherche;
  });

  const formaterDate = (date: Date) => {
    const maintenant = new Date();
    const difference = maintenant.getTime() - date.getTime();
    const jours = Math.floor(difference / (1000 * 60 * 60 * 24));
    
    if (jours === 0) return 'Aujourd\'hui';
    if (jours === 1) return 'Hier';
    if (jours < 7) return `Il y a ${jours} jours`;
    if (jours < 30) return `Il y a ${Math.floor(jours / 7)} semaine(s)`;
    return `Il y a ${Math.floor(jours / 30)} mois`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des annonces...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Annonces Communautaires</h1>
              <p className="mt-1 text-sm text-gray-600">
                Partagez des informations et collaborez avec la communauté
              </p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2 inline" />
              Publier une annonce
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
                  placeholder="Rechercher une annonce..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtre catégorie */}
            <div className="flex gap-2">
              <select
                value={filtreCategorie}
                onChange={(e) => setFiltreCategorie(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(categorie => (
                  <option key={categorie.value} value={categorie.value}>
                    {categorie.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des annonces */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {annoncesFiltrees.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
            <p className="text-gray-600">
              {recherche || filtreCategorie !== 'toutes'
                ? 'Essayez d\'ajuster vos filtres de recherche.'
                : 'Soyez le premier à publier une annonce communautaire !'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {annoncesFiltrees.map(annonce => (
              <div key={annonce.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* En-tête */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategorieColor(annonce.categorie)}`}>
                          {annonce.categorie}
                        </span>
                        {annonce.important && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                            ⚠️ Important
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {annonce.titre}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {formaterDate(annonce.datePublication)}
                      </p>
                      <p className="text-xs text-gray-400">
                        par {annonce.auteur.nom}
                      </p>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="text-gray-700 mb-4">
                    <p className="line-clamp-3">
                      {annonce.contenu}
                    </p>
                  </div>

                  {/* Tags */}
                  {annonce.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {annonce.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Pièce jointe */}
                  {annonce.pieceJointe && (
                    <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Pièce jointe disponible</span>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Télécharger
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{annonce.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">{annonce.reponses}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm">Partager</span>
                      </button>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Voir les détails →
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

export default AnnoncesCommunautaires;
