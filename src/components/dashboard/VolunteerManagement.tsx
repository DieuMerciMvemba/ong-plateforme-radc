import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  HeartHandshake, 
  Users, 
  Clock, 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Calendar,
  Target,
  CheckCircle
} from 'lucide-react';

interface OpportuniteBenevolat {
  id: string;
  titre: string;
  description: string;
  organisation: string;
  lieu: string;
  dateDebut: string;
  dateFin: string;
  type: 'ponctuel' | 'regulier' | 'evenementiel' | 'projet';
  domaine: string;
  competences: string[];
  tempsRequis: string;
  statut: 'ouvert' | 'en-cours' | 'complet' | 'ferme';
  candidats: string[];
  selected: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerManagement: React.FC = () => {
  const [opportunites, setOpportunites] = useState<OpportuniteBenevolat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedOpportunite, setSelectedOpportunite] = useState<OpportuniteBenevolat | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    organisation: '',
    lieu: '',
    dateDebut: '',
    dateFin: '',
    type: 'ponctuel' as 'ponctuel' | 'regulier' | 'evenementiel' | 'projet',
    domaine: '',
    competences: '',
    tempsRequis: '',
    statut: 'ouvert' as 'ouvert' | 'en-cours' | 'complet' | 'ferme'
  });

  useEffect(() => {
    loadOpportunites();
  }, []);

  const loadOpportunites = async () => {
    try {
      const opportunitesQuery = query(
        collection(db, 'opportunitesBenevolat'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(opportunitesQuery);
      const opportunitesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as OpportuniteBenevolat[];
      setOpportunites(opportunitesData);
    } catch (error) {
      console.error('Erreur lors du chargement des opportunités:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const opportuniteData = {
        ...formData,
        competences: formData.competences.split(',').map(comp => comp.trim()).filter(comp => comp),
        candidats: [],
        selected: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (selectedOpportunite) {
        await updateDoc(doc(db, 'opportunitesBenevolat', selectedOpportunite.id), {
          ...formData,
          competences: formData.competences.split(',').map(comp => comp.trim()).filter(comp => comp),
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'opportunitesBenevolat'), opportuniteData);
      }

      setShowModal(false);
      setSelectedOpportunite(null);
      setFormData({
        titre: '',
        description: '',
        organisation: '',
        lieu: '',
        dateDebut: '',
        dateFin: '',
        type: 'ponctuel',
        domaine: '',
        competences: '',
        tempsRequis: '',
        statut: 'ouvert'
      });
      loadOpportunites();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette opportunité ?')) {
      try {
        await deleteDoc(doc(db, 'opportunitesBenevolat', id));
        loadOpportunites();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (opportunite: OpportuniteBenevolat) => {
    setSelectedOpportunite(opportunite);
    setFormData({
      titre: opportunite.titre,
      description: opportunite.description,
      organisation: opportunite.organisation,
      lieu: opportunite.lieu,
      dateDebut: opportunite.dateDebut,
      dateFin: opportunite.dateFin,
      type: opportunite.type,
      domaine: opportunite.domaine,
      competences: opportunite.competences.join(', '),
      tempsRequis: opportunite.tempsRequis,
      statut: opportunite.statut
    });
    setShowModal(true);
  };

  const filteredOpportunites = opportunites.filter(opportunite => {
    const matchesSearch = opportunite.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunite.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunite.domaine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || opportunite.type === filterType;
    const matchesStatus = filterStatus === 'all' || opportunite.statut === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      ponctuel: 'bg-blue-100 text-blue-800',
      regulier: 'bg-green-100 text-green-800',
      evenementiel: 'bg-purple-100 text-purple-800',
      projet: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ouvert: 'bg-green-100 text-green-800',
      'en-cours': 'bg-blue-100 text-blue-800',
      complet: 'bg-yellow-100 text-yellow-800',
      ferme: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Bénévolat</h1>
          <p className="text-gray-600">Gérez toutes les opportunités de bénévolat</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nouvelle Opportunité
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <HeartHandshake className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Opportunités</p>
              <p className="text-2xl font-bold text-gray-900">{opportunites.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ouvertes</p>
              <p className="text-2xl font-bold text-gray-900">
                {opportunites.filter(o => o.statut === 'ouvert').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Cours</p>
              <p className="text-2xl font-bold text-gray-900">
                {opportunites.filter(o => o.statut === 'en-cours').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Candidats</p>
              <p className="text-2xl font-bold text-gray-900">
                {opportunites.reduce((sum, o) => sum + o.candidats.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher une opportunité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="ponctuel">Ponctuel</option>
            <option value="regulier">Régulier</option>
            <option value="evenementiel">Événementiel</option>
            <option value="projet">Projet</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="ouvert">Ouvert</option>
            <option value="en-cours">En cours</option>
            <option value="complet">Complet</option>
            <option value="ferme">Fermé</option>
          </select>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lieu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOpportunites.map((opportunite) => (
                <tr key={opportunite.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{opportunite.titre}</div>
                      <div className="text-sm text-gray-500">{opportunite.organisation}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{opportunite.description}</div>
                      {opportunite.competences.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {opportunite.competences.slice(0, 2).map((comp, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              {comp}
                            </span>
                          ))}
                          {opportunite.competences.length > 2 && (
                            <span className="text-xs text-gray-500">+{opportunite.competences.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(opportunite.type)}`}>
                      {opportunite.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      {opportunite.lieu}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <div>
                        <div>{new Date(opportunite.dateDebut).toLocaleDateString('fr-FR')}</div>
                        <div className="text-xs text-gray-500">
                          au {new Date(opportunite.dateFin).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(opportunite.statut)}`}>
                      {opportunite.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {opportunite.candidats.length} candidats
                      {opportunite.selected.length > 0 && (
                        <span className="ml-2 text-green-600">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          {opportunite.selected.length} sélectionnés
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(opportunite)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(opportunite.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {selectedOpportunite ? 'Modifier l\'opportunité' : 'Nouvelle opportunité'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Titre</label>
                    <input
                      type="text"
                      required
                      value={formData.titre}
                      onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organisation</label>
                    <input
                      type="text"
                      required
                      value={formData.organisation}
                      onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lieu</label>
                    <input
                      type="text"
                      required
                      value={formData.lieu}
                      onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Domaine</label>
                    <input
                      type="text"
                      required
                      value={formData.domaine}
                      onChange={(e) => setFormData({ ...formData, domaine: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de début</label>
                    <input
                      type="date"
                      required
                      value={formData.dateDebut}
                      onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                    <input
                      type="date"
                      required
                      value={formData.dateFin}
                      onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ponctuel">Ponctuel</option>
                      <option value="regulier">Régulier</option>
                      <option value="evenementiel">Événementiel</option>
                      <option value="projet">Projet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ouvert">Ouvert</option>
                      <option value="en-cours">En cours</option>
                      <option value="complet">Complet</option>
                      <option value="ferme">Fermé</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Compétences requises (séparées par des virgules)</label>
                  <input
                    type="text"
                    value={formData.competences}
                    onChange={(e) => setFormData({ ...formData, competences: e.target.value })}
                    placeholder="ex: communication, organisation, événementiel"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Temps requis</label>
                  <input
                    type="text"
                    value={formData.tempsRequis}
                    onChange={(e) => setFormData({ ...formData, tempsRequis: e.target.value })}
                    placeholder="ex: 5h/semaine, week-end, 2 jours/mois"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedOpportunite(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedOpportunite ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerManagement;
