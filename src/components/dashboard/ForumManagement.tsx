import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  MessageCircle, 
  ThumbsUp, 
  MessageSquare, 
  Eye, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Calendar,
  Pin, 
  Lock, 
  Unlock,
  AlertCircle,
  Users
} from 'lucide-react';

interface ForumPost {
  id: string;
  titre: string;
  contenu: string;
  auteur: {
    id: string;
    nom: string;
    email: string;
    avatar?: string;
  };
  categorie: string;
  tags: string[];
  statut: 'actif' | 'verrouille' | 'archive' | 'signale';
  priorite: 'normal' | 'important' | 'urgent';
  epingler: boolean;
  modere: boolean;
  vues: number;
  reponses: number;
  likes: number;
  signalements: number;
  dernierMessage?: {
    auteur: string;
    date: Date;
    extrait: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface ForumCategorie {
  id: string;
  nom: string;
  description: string;
  couleur: string;
  icone: string;
  ordre: number;
  actif: boolean;
  modere: boolean;
  postsCount: number;
}

const ForumManagement: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'categories' | 'moderation'>('posts');
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    categorie: '',
    tags: '',
    priorite: 'normal' as 'normal' | 'important' | 'urgent',
    epingler: false,
    modere: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger les posts
      const postsQuery = query(
        collection(db, 'forumPosts'),
        orderBy('createdAt', 'desc')
      );
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        ...(doc.data().dernierMessage && {
          dernierMessage: {
            ...doc.data().dernierMessage,
            date: doc.data().dernierMessage.date?.toDate() || new Date()
          }
        })
      })) as ForumPost[];
      setPosts(postsData);

      // Charger les catégories
      const categoriesQuery = query(
        collection(db, 'forumCategories'),
        orderBy('ordre', 'asc')
      );
      const categoriesSnapshot = await getDocs(categoriesQuery);
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ForumCategorie[];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        auteur: {
          id: 'admin',
          nom: 'Admin RADC',
          email: 'admin@radc.org'
        },
        statut: 'actif' as 'actif' | 'verrouille' | 'archive' | 'signale',
        vues: 0,
        reponses: 0,
        likes: 0,
        signalements: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (selectedPost) {
        await updateDoc(doc(db, 'forumPosts', selectedPost.id), {
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'forumPosts'), postData);
      }

      setShowModal(false);
      setSelectedPost(null);
      setFormData({
        titre: '',
        contenu: '',
        categorie: '',
        tags: '',
        priorite: 'normal',
        epingler: false,
        modere: false
      });
      loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      try {
        await deleteDoc(doc(db, 'forumPosts', id));
        loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (post: ForumPost) => {
    setSelectedPost(post);
    setFormData({
      titre: post.titre,
      contenu: post.contenu,
      categorie: post.categorie,
      tags: post.tags.join(', '),
      priorite: post.priorite,
      epingler: post.epingler,
      modere: post.modere
    });
    setShowModal(true);
  };

  const handleTogglePin = async (id: string, currentPin: boolean) => {
    try {
      await updateDoc(doc(db, 'forumPosts', id), {
        epingler: !currentPin,
        updatedAt: new Date()
      });
      loadData();
    } catch (error) {
      console.error('Erreur lors du changement de statut épinglé:', error);
    }
  };

  const handleToggleLock = async (id: string, currentLock: boolean) => {
    try {
      await updateDoc(doc(db, 'forumPosts', id), {
        statut: currentLock ? 'actif' : 'verrouille',
        updatedAt: new Date()
      });
      loadData();
    } catch (error) {
      console.error('Erreur lors du changement de statut verrouillé:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || post.statut === filterStatus;
    const matchesCategory = filterCategory === 'all' || post.categorie === filterCategory;
    const matchesPriority = filterPriority === 'all' || post.priorite === filterPriority;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      actif: 'bg-green-100 text-green-800',
      verrouille: 'bg-yellow-100 text-yellow-800',
      archive: 'bg-gray-100 text-gray-800',
      signale: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      normal: 'bg-gray-100 text-gray-800',
      important: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.nom === categoryName);
    return category?.couleur || '#3B82F6';
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Forum</h1>
          <p className="text-gray-600">Modérez les discussions et catégories du forum</p>
        </div>
        {activeTab === 'posts' && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nouveau Post
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Posts ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Catégories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'moderation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Modération ({posts.filter(p => p.signalements > 0).length})
            </button>
          </nav>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Réponses</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.reduce((sum, p) => sum + p.reponses, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(posts.map(p => p.auteur.id)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Signalements</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.reduce((sum, p) => sum + p.signalements, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {activeTab === 'posts' && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un post..."
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
              <option value="actif">Actifs</option>
              <option value="verrouille">Verrouillés</option>
              <option value="archive">Archivés</option>
              <option value="signale">Signalés</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.nom}>{cat.nom}</option>
              ))}
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les priorités</option>
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'posts' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistiques
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
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {post.epingler && <Pin className="h-4 w-4 text-blue-600" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{post.titre}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{post.contenu}</div>
                          {post.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {post.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  #{tag}
                                </span>
                              ))}
                              {post.tags.length > 2 && (
                                <span className="text-xs text-gray-500">+{post.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                          {post.priorite !== 'normal' && (
                            <div className="mt-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(post.priorite)}`}>
                                {post.priorite}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <div className="text-sm text-gray-900">
                          <div>{post.auteur.nom}</div>
                          <div className="text-xs text-gray-500">{post.auteur.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full text-white"
                        style={{ backgroundColor: getCategoryColor(post.categorie) }}
                      >
                        {post.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.statut)}`}>
                        {post.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.vues}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {post.reponses}
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {post.likes}
                        </div>
                        {post.signalements > 0 && (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {post.signalements}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <div>
                          <div>{new Date(post.createdAt).toLocaleDateString('fr-FR')}</div>
                          {post.dernierMessage && (
                            <div className="text-xs text-gray-500">
                              Dernier: {new Date(post.dernierMessage.date).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTogglePin(post.id, post.epingler)}
                          className={post.epingler ? "text-blue-600 hover:text-blue-900" : "text-gray-400 hover:text-blue-600"}
                          title={post.epingler ? "Désépingler" : "Épingler"}
                        >
                          <Pin className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleLock(post.id, post.statut === 'verrouille')}
                          className={post.statut === 'verrouille' ? "text-yellow-600 hover:text-yellow-900" : "text-gray-400 hover:text-yellow-600"}
                          title={post.statut === 'verrouille' ? "Déverrouiller" : "Verrouiller"}
                        >
                          {post.statut === 'verrouille' ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
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
      ) : activeTab === 'categories' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded mr-3"
                          style={{ backgroundColor: category.couleur }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{category.nom}</div>
                          <div className="text-xs text-gray-500">{category.icone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.postsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        category.actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.actif ? 'Actif' : 'Inactif'}
                      </span>
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
                    Post signalé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Signalements
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
                {posts.filter(p => p.signalements > 0).map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{post.titre}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{post.contenu}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.auteur.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {post.signalements}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
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
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {selectedPost ? 'Modifier le post' : 'Nouveau post'}
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
                    rows={6}
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
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.filter(cat => cat.actif).map(cat => (
                        <option key={cat.id} value={cat.nom}>{cat.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priorité</label>
                    <select
                      value={formData.priorite}
                      onChange={(e) => setFormData({ ...formData, priorite: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="important">Important</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags (séparés par des virgules)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ex: aide, question, technique"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="epingler"
                      checked={formData.epingler}
                      onChange={(e) => setFormData({ ...formData, epingler: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="epingler" className="ml-2 block text-sm text-gray-900">
                      Épingler ce post
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="modere"
                      checked={formData.modere}
                      onChange={(e) => setFormData({ ...formData, modere: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="modere" className="ml-2 block text-sm text-gray-900">
                      Modérer les réponses
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPost(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedPost ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumManagement;
