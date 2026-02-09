import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Users, MapPin, DollarSign, Award, BookOpen, Target } from 'lucide-react';
import { FormationService, CategorieFormationService } from '../../services/formationService';
import type { Formation, CategorieFormation } from '../../types/formations';

const FormationsPage: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [categories, setCategories] = useState<CategorieFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [filtreCategorie, setFiltreCategorie] = useState<string>('toutes');
  const [filtreNiveau, setFiltreNiveau] = useState<string>('tous');
  const [filtreMethode, setFiltreMethode] = useState<string>('toutes');
  const [filtrePrix, setFiltrePrix] = useState<string>('tous');

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      const [formationsData, categoriesData] = await Promise.all([
        FormationService.getFormationsPubliees(),
        CategorieFormationService.getCategoriesActives()
      ]);
      setFormations(formationsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur chargement formations:', error);
    } finally {
      setLoading(false);
    }
  };

  const rechercherFormations = async () => {
    if (recherche.trim()) {
      try {
        setLoading(true);
        const filtres: any = {};
        
        if (filtreCategorie !== 'toutes') filtres.categorie = filtreCategorie;
        if (filtreNiveau !== 'tous') filtres.niveau = filtreNiveau;
        if (filtreMethode !== 'toutes') filtres.methode = filtreMethode;
        if (filtrePrix !== 'tous') {
          if (filtrePrix === 'gratuit') filtres.prixMax = 0;
          else if (filtrePrix === 'payant') filtres.prixMax = 10000;
        }

        const resultats = await FormationService.rechercherFormations(recherche, filtres);
        setFormations(resultats);
      } catch (error) {
        console.error('Erreur recherche formations:', error);
      } finally {
        setLoading(false);
      }
    } else {
      chargerDonnees();
    }
  };

  useEffect(() => {
    rechercherFormations();
  }, [recherche, filtreCategorie, filtreNiveau, filtreMethode, filtrePrix]);

  const getNiveauColor = (niveau: string) => {
    switch (niveau) {
      case 'debutant': return 'bg-green-100 text-green-800';
      case 'intermediaire': return 'bg-yellow-100 text-yellow-800';
      case 'avance': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodeIcon = (methode: string) => {
    switch (methode) {
      case 'presentiel': return <MapPin className="w-4 h-4" />;
      case 'en_ligne': return <BookOpen className="w-4 h-4" />;
      case 'hybride': return <Users className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const formaterDuree = (duree: string) => {
    return duree.charAt(0).toUpperCase() + duree.slice(1);
  };

  const formaterDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des formations...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Formations RADC</h1>
              <p className="mt-1 text-sm text-gray-600">
                Développez vos compétences avec nos formations professionnelles
              </p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              + Proposer une formation
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
                  placeholder="Rechercher une formation..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex gap-2">
              <select
                value={filtreCategorie}
                onChange={(e) => setFiltreCategorie(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="toutes">Toutes les catégories</option>
                {categories.map(categorie => (
                  <option key={categorie.id} value={categorie.id}>
                    {categorie.nom}
                  </option>
                ))}
              </select>

              <select
                value={filtreNiveau}
                onChange={(e) => setFiltreNiveau(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Tous les niveaux</option>
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
                <option value="expert">Expert</option>
              </select>

              <select
                value={filtreMethode}
                onChange={(e) => setFiltreMethode(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="toutes">Toutes les méthodes</option>
                <option value="presentiel">Présentiel</option>
                <option value="en_ligne">En ligne</option>
                <option value="hybride">Hybride</option>
              </select>

              <select
                value={filtrePrix}
                onChange={(e) => setFiltrePrix(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tous">Tous les prix</option>
                <option value="gratuit">Gratuit</option>
                <option value="payant">Payant</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des formations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {formations.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune formation trouvée</h3>
            <p className="text-gray-600">
              {recherche || filtreCategorie !== 'toutes' || filtreNiveau !== 'tous' || filtreMethode !== 'toutes' || filtrePrix !== 'tous'
                ? 'Essayez d\'ajuster vos filtres de recherche.'
                : 'Soyez le premier à proposer une formation !'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {formations.map(formation => (
              <div key={formation.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {/* Image */}
                {formation.image && (
                  <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={formation.image} 
                      alt={formation.titre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* En-tête */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNiveauColor(formation.niveau)}`}>
                          {formation.niveau}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                          {getMethodeIcon(formation.methode)}
                          <span className="ml-1">{formation.methode.replace('_', ' ')}</span>
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {formation.titre}
                      </h3>
                    </div>
                    {formation.certification.disponible && (
                      <div className="flex items-center text-green-600">
                        <Award className="h-4 w-4 mr-1" />
                        <span className="text-xs">Certifiant</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {formation.description}
                  </p>

                  {/* Objectifs */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      Objectifs
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {formation.programme.modules.slice(0, 3).map((module, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span>{module.objectifs.slice(0, 1).join(', ')}</span>
                        </li>
                      ))}
                      {formation.programme.modules.length > 3 && (
                        <li className="text-xs text-gray-500">
                          +{formation.programme.modules.length - 3} autres objectifs
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Informations */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {formaterDuree(formation.duree)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formaterDate(formation.dates.debut)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {formation.capacite.inscrits}/{formation.capacite.max} places
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formation.cout.montant === 0 ? 'Gratuit' : `${formation.cout.montant} ${formation.cout.devise}`}
                    </div>
                  </div>

                  {/* Tags */}
                  {formation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {formation.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700"
                        >
                          #{tag}
                        </span>
                      ))}
                      {formation.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{formation.tags.length - 3} autres
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

export default FormationsPage;
