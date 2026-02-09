import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  FileText, 
  Calendar, 
  Eye, 
  MessageSquare, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  TrendingUp,
  Clock
} from 'lucide-react';

interface Article {
  id: string;
  titre: string;
  slug: string;
  contenu: string;
  auteur: string;
  categorie: string;
  tags: string[];
  image?: string;
  images: string[];
  statut: 'brouillon' | 'publie' | 'archive';
  vues: number;
  commentaires: number;
  likes: number;
  tempsLecture: number;
  metaDescription: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogManagement: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    slug: '',
    contenu: '',
    auteur: 'Admin RADC',
    categorie: '',
    tags: '',
    image: '',
    statut: 'brouillon' as 'brouillon' | 'publie' | 'archive',
    metaDescription: '',
    tempsLecture: 5
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const articlesQuery = query(
        collection(db, 'articles'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(articlesQuery);
      const articlesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        publishedAt: doc.data().publishedAt?.toDate()
      })) as Article[];
      setArticles(articlesData);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (titre: string) => {
    return titre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = formData.slug || generateSlug(formData.titre);
      const articleData = {
        ...formData,
        slug,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: formData.image ? [formData.image] : [],
        vues: 0,
        commentaires: 0,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(formData.statut === 'publie' && { publishedAt: new Date() })
      };

      if (selectedArticle) {
        await updateDoc(doc(db, 'articles', selectedArticle.id), {
          ...formData,
          slug,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          images: formData.image ? [formData.image] : [],
          updatedAt: new Date(),
          ...(formData.statut === 'publie' && !selectedArticle.publishedAt && { publishedAt: new Date() })
        });
      } else {
        await addDoc(collection(db, 'articles'), articleData);
      }

      setShowModal(false);
      setSelectedArticle(null);
      setFormData({
        titre: '',
        slug: '',
        contenu: '',
        auteur: 'Admin RADC',
        categorie: '',
        tags: '',
        image: '',
        statut: 'brouillon',
        metaDescription: '',
        tempsLecture: 5
      });
      loadArticles();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await deleteDoc(doc(db, 'articles', id));
        loadArticles();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      titre: article.titre,
      slug: article.slug,
      contenu: article.contenu,
      auteur: article.auteur,
      categorie: article.categorie,
      tags: article.tags.join(', '),
      image: article.image || '',
      statut: article.statut,
      metaDescription: article.metaDescription,
      tempsLecture: article.tempsLecture
    });
    setShowModal(true);
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || article.statut === filterStatus;
    const matchesCategory = filterCategory === 'all' || article.categorie === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Blog</h1>
          <p className="text-gray-600">Gérez tous les articles du blog RADC</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nouvel Article
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Publiés</p>
              <p className="text-2xl font-bold text-gray-900">
                {articles.filter(a => a.statut === 'publie').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Vues</p>
              <p className="text-2xl font-bold text-gray-900">
                {articles.reduce((sum, a) => sum + a.vues, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Commentaires</p>
              <p className="text-2xl font-bold text-gray-900">
                {articles.reduce((sum, a) => sum + a.commentaires, 0)}
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
                placeholder="Rechercher un article..."
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
            <option value="publie">Publiés</option>
            <option value="brouillon">Brouillons</option>
            <option value="archive">Archivés</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les catégories</option>
            {Array.from(new Set(articles.map(a => a.categorie))).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
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
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{article.titre}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{article.metaDescription}</div>
                      <div className="text-xs text-gray-400 mt-1">/{article.slug}</div>
                      {article.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{article.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.categorie}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(article.statut)}`}>
                      {article.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {article.vues}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {article.commentaires}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {article.tempsLecture}min
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <div>
                        <div>{new Date(article.createdAt).toLocaleDateString('fr-FR')}</div>
                        {article.publishedAt && (
                          <div className="text-xs text-green-600">
                            Publié: {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedArticle ? 'Modifier l\'article' : 'Nouvel article'}
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
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          titre: e.target.value,
                          slug: formData.slug || generateSlug(e.target.value)
                        });
                      }}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="url-de-l-article"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Meta description</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description pour SEO (160 caractères max)"
                  />
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
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <input
                      type="text"
                      required
                      value={formData.categorie}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ex: Actualités, Formations"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Auteur</label>
                    <input
                      type="text"
                      value={formData.auteur}
                      onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Temps de lecture (min)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.tempsLecture}
                      onChange={(e) => setFormData({ ...formData, tempsLecture: parseInt(e.target.value) || 5 })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image principale</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://..."
                    />
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
                    placeholder="ex: radc, développement, communauté, actualité"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedArticle(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedArticle ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
