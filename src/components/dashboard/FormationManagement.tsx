import React, { useState, useEffect } from 'react';
import { Search, Users, BookOpen, Calendar, Clock, Award, TrendingUp, Eye } from 'lucide-react';

interface Formation {
  id: string;
  titre: string;
  description: string;
  niveau: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  categorie: string;
  formateur: string;
  duree: string;
  cout: {
    montant: number;
    devise: string;
  };
  capacite: {
    max: number;
    inscrits: number;
  };
  dates: {
    debut: Date;
    fin: Date;
  };
  statut: 'brouillon' | 'publie' | 'en_cours' | 'termine' | 'annule';
  certification: boolean;
  image?: string;
  createurId: string;
  dateCreation: Date;
}

const FormationManagement: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('tous');
  const [filterNiveau, setFilterNiveau] = useState<string>('tous');
  const [filterCategorie, setFilterCategorie] = useState<string>('toutes');

  useEffect(() => {
    loadFormations();
  }, []);

  const loadFormations = async () => {
    try {
      setLoading(true);
      // Simuler le chargement des formations
      const mockFormations: Formation[] = [
        {
          id: '1',
          titre: 'Gestion de Projet Social',
          description: 'Apprendre à gérer des projets communautaires de A à Z',
          niveau: 'intermediaire',
          categorie: 'management',
          formateur: 'Dr. Marie Dubois',
          duree: '3 jours',
          cout: {
            montant: 150,
            devise: 'EUR'
          },
          capacite: {
            max: 25,
            inscrits: 18
          },
          dates: {
            debut: new Date('2024-02-15'),
            fin: new Date('2024-02-17')
          },
          statut: 'publie',
          certification: true,
          createurId: 'admin1',
          dateCreation: new Date('2024-01-10')
        },
        {
          id: '2',
          titre: 'Communication Digitale',
          description: 'Maîtriser les outils de communication numérique pour ONG',
          niveau: 'debutant',
          categorie: 'communication',
          formateur: 'Pierre Leroy',
          duree: '2 jours',
          cout: {
            montant: 100,
            devise: 'EUR'
          },
          capacite: {
            max: 20,
            inscrits: 15
          },
          dates: {
            debut: new Date('2024-03-01'),
            fin: new Date('2024-03-02')
          },
          statut: 'en_cours',
          certification: false,
          createurId: 'admin1',
          dateCreation: new Date('2024-01-15')
        },
        {
          id: '3',
          titre: 'Développement Durable Avancé',
          description: 'Stratégies avancées pour le développement durable',
          niveau: 'avance',
          categorie: 'environnement',
          formateur: 'Sophie Martin',
          duree: '5 jours',
          cout: {
            montant: 300,
            devise: 'EUR'
          },
          capacite: {
            max: 15,
            inscrits: 12
          },
          dates: {
            debut: new Date('2024-04-10'),
            fin: new Date('2024-04-14')
          },
          statut: 'publie',
          certification: true,
          createurId: 'admin1',
          dateCreation: new Date('2024-01-20')
        },
        {
          id: '4',
          titre: 'Fundraising et Collecte de Fonds',
          description: 'Techniques professionnelles de collecte de fonds',
          niveau: 'intermediaire',
          categorie: 'finance',
          formateur: 'Jean Dupont',
          duree: '3 jours',
          cout: {
            montant: 200,
            devise: 'EUR'
          },
          capacite: {
            max: 18,
            inscrits: 18
          },
          dates: {
            debut: new Date('2024-01-08'),
            fin: new Date('2024-01-10')
          },
          statut: 'termine',
          certification: true,
          createurId: 'admin1',
          dateCreation: new Date('2023-12-01')
        }
      ];
      setFormations(mockFormations);
    } catch (error) {
      console.error('Erreur chargement formations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.formateur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = filterStatut === 'tous' || formation.statut === filterStatut;
    const matchesNiveau = filterNiveau === 'tous' || formation.niveau === filterNiveau;
    const matchesCategorie = filterCategorie === 'toutes' || formation.categorie === filterCategorie;

    return matchesSearch && matchesStatut && matchesNiveau && matchesCategorie;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'publie': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'termine': return 'bg-gray-100 text-gray-800';
      case 'brouillon': return 'bg-yellow-100 text-yellow-800';
      case 'annule': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNiveauColor = (niveau: string) => {
    switch (niveau) {
      case 'debutant': return 'bg-green-100 text-green-800';
      case 'intermediaire': return 'bg-yellow-100 text-yellow-800';
      case 'avance': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategorieColor = (categorie: string) => {
    switch (categorie) {
      case 'management': return 'bg-purple-100 text-purple-800';
      case 'communication': return 'bg-blue-100 text-blue-800';
      case 'environnement': return 'bg-green-100 text-green-800';
      case 'finance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleEditFormation = (formation: Formation) => {
    // TODO: Implémenter la modal d'édition
    console.log('Modifier formation:', formation);
  };

  const handleViewInscriptions = (formation: Formation) => {
    // TODO: Implémenter la vue des inscriptions
    console.log('Voir inscriptions pour:', formation.titre);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Formations</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gérez les formations, inscriptions et certifications
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <BookOpen className="h-4 w-4 mr-2" />
          Nouvelle formation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Formations actives</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formations.filter(f => f.statut === 'publie' || f.statut === 'en_cours').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total inscrits</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formations.reduce((sum, f) => sum + f.capacite.inscrits, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Certifications</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formations.filter(f => f.certification).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Taux remplissage</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.round((formations.reduce((sum, f) => sum + f.capacite.inscrits, 0) /
                               formations.reduce((sum, f) => sum + f.capacite.max, 0)) * 100)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="tous">Tous statuts</option>
            <option value="publie">Publié</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
            <option value="brouillon">Brouillon</option>
            <option value="annule">Annulé</option>
          </select>

          <select
            value={filterNiveau}
            onChange={(e) => setFilterNiveau(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="tous">Tous niveaux</option>
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
            <option value="expert">Expert</option>
          </select>

          <select
            value={filterCategorie}
            onChange={(e) => setFilterCategorie(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="toutes">Toutes catégories</option>
            <option value="management">Management</option>
            <option value="communication">Communication</option>
            <option value="environnement">Environnement</option>
            <option value="finance">Finance</option>
          </select>
        </div>
      </div>

      {/* Formations Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFormations.map((formation) => (
          <div key={formation.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNiveauColor(formation.niveau)}`}>
                      {formation.niveau}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(formation.statut)}`}>
                      {formation.statut.replace('_', ' ')}
                    </span>
                    {formation.certification && (
                      <Award className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                    {formation.titre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Par {formation.formateur}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {formation.description}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategorieColor(formation.categorie)}`}>
                  {formation.categorie}
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center text-gray-600 mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-xs">Durée</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{formation.duree}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-gray-600 mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-xs">Inscrits</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formation.capacite.inscrits}/{formation.capacite.max}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(formation.dates.debut)} - {formatDate(formation.dates.fin)}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-600">Prix:</span>
                <span className="font-semibold text-gray-900">
                  {formation.cout.montant === 0 ? 'Gratuit' : formatCurrency(formation.cout.montant, formation.cout.devise)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditFormation(formation)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleViewInscriptions(formation)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFormations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-sm">
            Aucune formation trouvée
          </div>
        </div>
      )}
    </div>
  );
};

export default FormationManagement;
