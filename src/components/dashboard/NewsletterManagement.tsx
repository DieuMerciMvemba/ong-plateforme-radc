import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Mail, 
  Send, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Calendar,
  Eye,
  MousePointer
} from 'lucide-react';

interface Newsletter {
  id: string;
  titre: string;
  sujet: string;
  contenu: string;
  categorie: 'actualites' | 'evenements' | 'formations' | 'appels' | 'partenaires';
  statut: 'brouillon' | 'programme' | 'envoye' | 'annule';
  listeDiffusion: string[];
  dateEnvoi?: Date;
  stats: {
    envoyes: number;
    ouverts: number;
    clics: number;
    desabonnements: number;
  };
  template?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Abonne {
  id: string;
  email: string;
  nom?: string;
  statut: 'actif' | 'inactif' | 'desinscrit';
  categories: string[];
  dateInscription: Date;
}

const NewsletterManagement: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [abonnes, setAbonnes] = useState<Abonne[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [activeTab, setActiveTab] = useState<'newsletters' | 'abonnes'>('newsletters');
  const [formData, setFormData] = useState({
    titre: '',
    sujet: '',
    contenu: '',
    categorie: 'actualites' as 'actualites' | 'evenements' | 'formations' | 'appels' | 'partenaires',
    statut: 'brouillon' as 'brouillon' | 'programme' | 'envoye' | 'annule',
    dateEnvoi: '',
    template: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger les newsletters
      const newslettersQuery = query(
        collection(db, 'newsletters'),
        orderBy('createdAt', 'desc')
      );
      const newslettersSnapshot = await getDocs(newslettersQuery);
      const newslettersData = newslettersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        dateEnvoi: doc.data().dateEnvoi?.toDate()
      })) as Newsletter[];
      setNewsletters(newslettersData);

      // Charger les abonnés
      const abonnesQuery = query(
        collection(db, 'abonnesNewsletter'),
        orderBy('dateInscription', 'desc')
      );
      const abonnesSnapshot = await getDocs(abonnesQuery);
      const abonnesData = abonnesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateInscription: doc.data().dateInscription?.toDate() || new Date()
      })) as Abonne[];
      setAbonnes(abonnesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newsletterData = {
        ...formData,
        listeDiffusion: abonnes.filter(a => a.statut === 'actif').map(a => a.id),
        stats: {
          envoyes: 0,
          ouverts: 0,
          clics: 0,
          desabonnements: 0
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(formData.dateEnvoi && { dateEnvoi: new Date(formData.dateEnvoi) })
      };

      if (selectedNewsletter) {
        await updateDoc(doc(db, 'newsletters', selectedNewsletter.id), {
          ...formData,
          updatedAt: new Date(),
          ...(formData.dateEnvoi && { dateEnvoi: new Date(formData.dateEnvoi) })
        });
      } else {
        await addDoc(collection(db, 'newsletters'), newsletterData);
      }

      setShowModal(false);
      setSelectedNewsletter(null);
      setFormData({
        titre: '',
        sujet: '',
        contenu: '',
        categorie: 'actualites',
        statut: 'brouillon',
        dateEnvoi: '',
        template: ''
      });
      loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette newsletter ?')) {
      try {
        await deleteDoc(doc(db, 'newsletters', id));
        loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
    setFormData({
      titre: newsletter.titre,
      sujet: newsletter.sujet,
      contenu: newsletter.contenu,
      categorie: newsletter.categorie,
      statut: newsletter.statut,
      dateEnvoi: newsletter.dateEnvoi ? newsletter.dateEnvoi.toISOString().split('T')[0] : '',
      template: newsletter.template || ''
    });
    setShowModal(true);
  };

  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsletter.sujet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || newsletter.statut === filterStatus;
    const matchesCategory = filterCategory === 'all' || newsletter.categorie === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredAbonnes = abonnes.filter(abonne => {
    const matchesSearch = abonne.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (abonne.nom && abonne.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      brouillon: 'bg-gray-100 text-gray-800',
      programme: 'bg-blue-100 text-blue-800',
      envoye: 'bg-green-100 text-green-800',
      annule: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      actualites: 'bg-purple-100 text-purple-800',
      evenements: 'bg-orange-100 text-orange-800',
      formations: 'bg-blue-100 text-blue-800',
      appels: 'bg-red-100 text-red-800',
      partenaires: 'bg-green-100 text-green-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getAbonneStatusColor = (status: string) => {
    const colors = {
      actif: 'bg-green-100 text-green-800',
      inactif: 'bg-yellow-100 text-yellow-800',
      desinscrit: 'bg-red-100 text-red-800'
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Newsletters</h1>
          <p className="text-gray-600">Gérez vos campagnes email et abonnés</p>
        </div>
        {activeTab === 'newsletters' && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nouvelle Newsletter
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('newsletters')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'newsletters'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Newsletters ({newsletters.length})
            </button>
            <button
              onClick={() => setActiveTab('abonnes')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'abonnes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Abonnés ({abonnes.filter(a => a.statut === 'actif').length})
            </button>
          </nav>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Envoyées</p>
              <p className="text-2xl font-bold text-gray-900">
                {newsletters.filter(n => n.statut === 'envoye').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Abonnés</p>
              <p className="text-2xl font-bold text-gray-900">
                {abonnes.filter(a => a.statut === 'actif').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taux Ouverture</p>
              <p className="text-2xl font-bold text-gray-900">
                {newsletters.length > 0 
                  ? Math.round(
                      newsletters.reduce((sum, n) => sum + (n.stats.ouverts / Math.max(n.stats.envoyes, 1)), 0) / 
                      newsletters.length * 100
                    ) + '%'
                  : '0%'
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <MousePointer className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taux Clics</p>
              <p className="text-2xl font-bold text-gray-900">
                {newsletters.length > 0 
                  ? Math.round(
                      newsletters.reduce((sum, n) => sum + (n.stats.clics / Math.max(n.stats.ouverts, 1)), 0) / 
                      newsletters.length * 100
                    ) + '%'
                  : '0%'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {activeTab === 'newsletters' && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher une newsletter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="brouillon">Brouillons</option>
              <option value="programme">Programmées</option>
              <option value="envoye">Envoyées</option>
              <option value="annule">Annulées</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              <option value="actualites">Actualités</option>
              <option value="evenements">Événements</option>
              <option value="formations">Formations</option>
              <option value="appels">Appels à action</option>
              <option value="partenaires">Partenaires</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 'abonnes' && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un abonné..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'newsletters' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Newsletter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
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
                {filteredNewsletters.map((newsletter) => (
                  <tr key={newsletter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{newsletter.titre}</div>
                        <div className="text-sm text-gray-500">{newsletter.sujet}</div>
                        <div className="text-xs text-gray-400 line-clamp-2 mt-1">{newsletter.contenu}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(newsletter.categorie)}`}>
                        {newsletter.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(newsletter.statut)}`}>
                        {newsletter.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-1" />
                          {newsletter.stats.envoyes}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {newsletter.stats.ouverts}
                        </div>
                        <div className="flex items-center">
                          <MousePointer className="h-4 w-4 mr-1" />
                          {newsletter.stats.clics}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <div>
                          <div>{new Date(newsletter.createdAt).toLocaleDateString('fr-FR')}</div>
                          {newsletter.dateEnvoi && (
                            <div className="text-xs text-green-600">
                              Envoyé: {new Date(newsletter.dateEnvoi).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(newsletter)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(newsletter.id)}
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
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Abonné
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAbonnes.map((abonne) => (
                  <tr key={abonne.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {abonne.nom || 'Non spécifié'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {abonne.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {abonne.categories.slice(0, 2).map((cat, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {cat}
                          </span>
                        ))}
                        {abonne.categories.length > 2 && (
                          <span className="text-xs text-gray-500">+{abonne.categories.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAbonneStatusColor(abonne.statut)}`}>
                        {abonne.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(abonne.dateInscription).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedNewsletter ? 'Modifier la newsletter' : 'Nouvelle newsletter'}
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
                    <label className="block text-sm font-medium text-gray-700">Sujet</label>
                    <input
                      type="text"
                      required
                      value={formData.sujet}
                      onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contenu</label>
                  <textarea
                    required
                    rows={8}
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
                      <option value="actualites">Actualités</option>
                      <option value="evenements">Événements</option>
                      <option value="formations">Formations</option>
                      <option value="appels">Appels à action</option>
                      <option value="partenaires">Partenaires</option>
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
                      <option value="programme">Programmé</option>
                      <option value="envoye">Envoyé</option>
                      <option value="annule">Annulé</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date d'envoi</label>
                    <input
                      type="datetime-local"
                      value={formData.dateEnvoi}
                      onChange={(e) => setFormData({ ...formData, dateEnvoi: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Template</label>
                    <input
                      type="text"
                      value={formData.template}
                      onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom du template (optionnel)"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedNewsletter(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedNewsletter ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterManagement;
