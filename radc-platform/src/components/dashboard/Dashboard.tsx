import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  MapPin,
  Bell,
  Activity,
  Search,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';
import { 
  statistiquesDashboard, 
  projetsDashboard, 
  domainesDashboard, 
  activitesRecentes, 
  alerts 
} from '../../data/dashboard';
import type { ProjetDashboard, FiltrerProjets } from '../../types/dashboard';

const Dashboard: React.FC = () => {
  const [projetsFiltres, setProjetsFiltres] = useState<ProjetDashboard[]>(projetsDashboard);
  const [filtres, setFiltres] = useState<FiltrerProjets>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState<'overview' | 'projets' | 'cartographie' | 'analytics'>('overview');

  useEffect(() => {
    let filtered = projetsDashboard;

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(projet =>
        projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par domaine
    if (filtres.domaine) {
      filtered = filtered.filter(projet => projet.domaineId === filtres.domaine);
    }

    // Filtrer par statut
    if (filtres.statut) {
      filtered = filtered.filter(projet => projet.statut === filtres.statut);
    }

    setProjetsFiltres(filtered);
  }, [searchTerm, filtres]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Portail de Gestion</h1>
              <div className="ml-4 flex items-center space-x-2">
                <button
                  onClick={() => setSelectedView('overview')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedView === 'overview' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Vue d'ensemble
                </button>
                <button
                  onClick={() => setSelectedView('projets')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedView === 'projets' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Projets
                </button>
                <button
                  onClick={() => setSelectedView('cartographie')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedView === 'cartographie' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Cartographie
                </button>
                <button
                  onClick={() => setSelectedView('analytics')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedView === 'analytics' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-400" />
                {alerts.filter(alert => !alert.lue).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {alerts.filter(alert => !alert.lue).length}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {formatDate(new Date().toISOString())}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Vue d'ensemble */}
        {selectedView === 'overview' && (
          <div className="space-y-8">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Projets</p>
                    <p className="text-2xl font-bold text-gray-900">{statistiquesDashboard.totalProjets}</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">{statistiquesDashboard.projetsActifs} actifs</span>
                  <span className="text-gray-500 ml-2">sur {statistiquesDashboard.totalProjets}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bénéficiaires</p>
                    <p className="text-2xl font-bold text-gray-900">{statistiquesDashboard.beneficiaires.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">+15%</span>
                  <span className="text-gray-500 ml-2">ce mois</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Budget Total</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(statistiquesDashboard.budgetTotal)}</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-yellow-600 font-medium">{Math.round((statistiquesDashboard.budgetUtilise / statistiquesDashboard.budgetTotal) * 100)}% utilisé</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progression Globale</p>
                    <p className="text-2xl font-bold text-gray-900">{statistiquesDashboard.progressionGlobale}%</p>
                  </div>
                  <div className="bg-orange-100 rounded-full p-3">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">En avance</span>
                  <span className="text-gray-500 ml-2">sur le planning</span>
                </div>
              </div>
            </div>

            {/* Domaines et Activités */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Domaines */}
              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Domaines d'Intervention</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 space-y-4">
                    {domainesDashboard.slice(0, 5).map((domaine) => (
                      <div key={domaine.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full bg-${domaine.couleur}-100 flex items-center justify-center`}>
                            <Target className={`w-6 h-6 text-${domaine.couleur}-600`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{domaine.nom}</h3>
                            <p className="text-sm text-gray-600">{domaine.projetsCount} projets • {domaine.beneficiaires.toLocaleString()} bénéficiaires</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{domaine.progression}%</div>
                          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${getProgressColor(domaine.progression)}`}
                              style={{ width: `${domaine.progression}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activités Récentes */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Activités Récentes</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 space-y-4">
                    {activitesRecentes.slice(0, 4).map((activite) => (
                      <div key={activite.id} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activite.importance === 'haute' ? 'bg-red-500' :
                          activite.importance === 'moyenne' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{activite.titre}</h4>
                          <p className="text-sm text-gray-600 mt-1">{activite.description}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-2">
                            <span>{activite.auteur}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(activite.date)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vue Projets */}
        {selectedView === 'projets' && (
          <div className="space-y-6">
            {/* Filtres */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un projet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filtres.domaine || ''}
                  onChange={(e) => setFiltres(prev => ({ ...prev, domaine: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les domaines</option>
                  {domainesDashboard.map((domaine) => (
                    <option key={domaine.id} value={domaine.id}>{domaine.nom}</option>
                  ))}
                </select>
                <select
                  value={filtres.statut || ''}
                  onChange={(e) => setFiltres(prev => ({ ...prev, statut: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="en-cours">En Cours</option>
                  <option value="termine">Terminé</option>
                  <option value="en-attente">En Attente</option>
                  <option value="planifie">Planifié</option>
                </select>
              </div>
            </div>

            {/* Liste des Projets */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Domaine
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progression
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bénéficiaires
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projetsFiltres.map((projet) => (
                      <tr key={projet.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{projet.titre}</div>
                            <div className="text-sm text-gray-500">{projet.localisation.adresse}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{projet.domaineNom}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(projet.statut)}`}>
                            {getStatutLabel(projet.statut)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm text-gray-900 mr-2">{projet.progression}%</div>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getProgressColor(projet.progression)}`}
                                style={{ width: `${projet.progression}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(projet.budget)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {projet.beneficiaires.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Vue Cartographie */}
        {selectedView === 'cartographie' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cartographie des Projets</h2>
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Carte interactive des projets</p>
                  <p className="text-sm text-gray-500 mt-2">Affichage des {projetsDashboard.length} projets sur la carte</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {projetsDashboard.map((projet) => (
                  <div key={projet.id} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 text-sm">{projet.titre}</h4>
                    <p className="text-xs text-gray-600 mt-1">{projet.localisation.adresse}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatutColor(projet.statut)}`}>
                        {getStatutLabel(projet.statut)}
                      </span>
                      <span className="text-xs text-gray-500">{projet.progression}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vue Analytics */}
        {selectedView === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics et Rapports</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Graphique de progression</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Tendance des activités</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
