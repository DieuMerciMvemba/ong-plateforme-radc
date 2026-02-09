import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Megaphone, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  Search,
  TrendingUp
} from 'lucide-react';

interface Annonce {
  id: string;
  titre: string;
  contenu: string;
  auteur: string;
  categorie: 'information' | 'opportunite' | 'evenement' | 'appel-action';
  statut: 'publie' | 'brouillon' | 'archive';
  likes: number;
  commentaires: number;
  vues: number;
  image?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementsManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    categorie: 'information' as 'information' | 'opportunite' | 'evenement' | 'appel-action',
    statut: 'brouillon' as 'publie' | 'brouillon' | 'archive',
    tags: ''
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const announcementsQuery = query(
        collection(db, 'annonces'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(announcementsQuery);
      const announcementsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Annonce[];
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const announcementData = {
        ...formData,
        auteur: 'Admin RADC',
        likes: 0,
        commentaires: 0,
        vues: 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (selectedAnnonce) {
        await updateDoc(doc(db, 'annonces', selectedAnnonce.id), {
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'annonces'), announcementData);
      }

      setShowModal(false);
      setSelectedAnnonce(null);
      setFormData({
        titre: '',
        contenu: '',
        categorie: 'information',
        statut: 'brouillon',
        tags: ''
      });
      loadAnnouncements();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await deleteDoc(doc(db, 'annonces', id));
        loadAnnouncements();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (annonce: Annonce) => {
    setSelectedAnnonce(annonce);
    setFormData({
      titre: annonce.titre,
      contenu: annonce.contenu,
      categorie: annonce.categorie,
      statut: annonce.statut,
      tags: annonce.tags.join(', ')
    });
    setShowModal(true);
  };

  const filteredAnnouncements = announcements.filter(annonce => {
    const matchesSearch = annonce.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         annonce.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         annonce.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || annonce.categorie === filterCategory;
    const matchesStatus = filterStatus === 'all' || annonce.statut === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      information: 'bg-blue-100 text-blue-800',
      opportunite: 'bg-green-100 text-green-800',
      evenement: 'bg-purple-100 text-purple-800',
      'appel-action': 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      publie: 'bg-green-100 text-green-800',
      brouillon: 'bg-yellow-100 text-yellow-800',
      archive: 'bg-gray-100 text-gray-800'
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Annonces</h1>
          <p className="text-gray-600">Gérez toutes les annonces communautaires</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nouvelle Annonce
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Megaphone className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Annonces</p>
              <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Publiées</p>
              <p className="text-2xl font-bold text-gray-900">
                {announcements.filter(a => a.statut === 'publie').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">
                {announcements.reduce((sum, a) => sum + a.likes, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Commentaires</p>
              <p className="text-2xl font-bold text-gray-900">
                {announcements.reduce((sum, a) => sum + a.commentaires, 0)}
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
                placeholder="Rechercher une annonce..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les catégories</option>
            <option value="information">Informations</option>
            <option value="opportunite">Opportunités</option>
            <option value="evenement">Événements</option>
            <option value="appel-action">Appels à l'action</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="publie">Publiées</option>
            <option value="brouillon">Brouillons</option>
            <option value="archive">Archivées</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annonce
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAnnouncements.map((annonce) => (
                <tr key={annonce.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{annonce.titre}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{annonce.contenu}</div>
                      {annonce.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {annonce.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                          {annonce.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{annonce.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(annonce.categorie)}`}>
                      {annonce.categorie}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(annonce.statut)}`}>
                      {annonce.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {annonce.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {annonce.commentaires}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {annonce.vues}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {new Date(annonce.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(annonce)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(annonce.id)}
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
              {selectedAnnonce ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700">Contenu</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.contenu}
                    onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <select
                      value={formData.categorie}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="information">Information</option>
                      <option value="opportunite">Opportunité</option>
                      <option value="evenement">Événement</option>
                      <option value="appel-action">Appel à l'action</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="brouillon">Brouillon</option>
                      <option value="publie">Publié</option>
                      <option value="archive">Archivé</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags (séparés par des virgules)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="ex: radc, communauté, développement"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAnnonce(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedAnnonce ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsManagement;
