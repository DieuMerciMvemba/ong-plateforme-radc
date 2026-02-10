import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Image, 
  Download, 
  Eye, 
  Edit2, 
  Trash2, 
  Search,
  Plus,
  FileImage,
  Film,
  HardDrive,
  FileText,
  Video
} from 'lucide-react';

interface MediaFile {
  id: string;
  nom: string;
  type: 'image' | 'video' | 'document';
  url: string;
  taille: number;
  format: string;
  description?: string;
  tags: string[];
  categorie: string;
  auteur: string;
  statut: 'actif' | 'archive';
  telechargements: number;
  createdAt: Date;
  updatedAt: Date;
}

const MediaManagement: React.FC = () => {
  const [medias, setMedias] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    type: 'image' as 'image' | 'video' | 'document',
    url: '',
    description: '',
    tags: '',
    categorie: '',
    statut: 'actif' as 'actif' | 'archive'
  });

  useEffect(() => {
    loadMedias();
  }, []);

  const loadMedias = async () => {
    try {
      const mediasQuery = query(
        collection(db, 'medias'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(mediasQuery);
      const mediasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as MediaFile[];
      setMedias(mediasData);
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mediaData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        taille: 0, // À calculer lors de l'upload
        format: formData.url.split('.').pop() || '',
        auteur: 'Admin RADC',
        telechargements: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (selectedMedia) {
        await updateDoc(doc(db, 'medias', selectedMedia.id), {
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          format: formData.url.split('.').pop() || '',
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'medias'), mediaData);
      }

      setShowModal(false);
      setSelectedMedia(null);
      setFormData({
        nom: '',
        type: 'image',
        url: '',
        description: '',
        tags: '',
        categorie: '',
        statut: 'actif'
      });
      loadMedias();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
      try {
        await deleteDoc(doc(db, 'medias', id));
        loadMedias();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (media: MediaFile) => {
    setSelectedMedia(media);
    setFormData({
      nom: media.nom,
      type: media.type,
      url: media.url,
      description: media.description || '',
      tags: media.tags.join(', '),
      categorie: media.categorie,
      statut: media.statut
    });
    setShowModal(true);
  };

  const filteredMedias = medias.filter(media => {
    const matchesSearch = media.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         media.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         media.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || media.type === filterType;
    const matchesCategory = filterCategory === 'all' || media.categorie === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      image: <FileImage className="h-5 w-5" />,
      video: <Film className="h-5 w-5" />,
      document: <FileText className="h-5 w-5" />
    };
    return icons[type as keyof typeof icons] || <FileText className="h-5 w-5" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      image: 'bg-green-100 text-green-800',
      video: 'bg-purple-100 text-purple-800',
      document: 'bg-blue-100 text-blue-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Médias</h1>
          <p className="text-gray-600">Gérez tous les fichiers médias de la plateforme</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Ajouter un Média
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <HardDrive className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Médias</p>
              <p className="text-2xl font-bold text-gray-900">{medias.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Image className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Images</p>
              <p className="text-2xl font-bold text-gray-900">
                {medias.filter(m => m.type === 'image').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Video className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vidéos</p>
              <p className="text-2xl font-bold text-gray-900">
                {medias.filter(m => m.type === 'video').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Download className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Téléchargements</p>
              <p className="text-2xl font-bold text-gray-900">
                {medias.reduce((sum, m) => sum + m.telechargements, 0)}
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
                placeholder="Rechercher un média..."
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
            <option value="image">Images</option>
            <option value="video">Vidéos</option>
            <option value="document">Documents</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les catégories</option>
            {Array.from(new Set(medias.map(m => m.categorie))).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {filteredMedias.map((media) => (
            <div key={media.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Preview */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {media.type === 'image' && media.url ? (
                  <img 
                    src={media.url} 
                    alt={media.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    {getTypeIcon(media.type)}
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{media.nom}</h3>
                <p className="text-sm text-gray-500 truncate">{media.format.toUpperCase()}</p>
                
                {media.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{media.description}</p>
                )}
                
                {media.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {media.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                    {media.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{media.tags.length - 2}</span>
                    )}
                  </div>
                )}
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(media.type)}`}>
                      {media.type}
                    </span>
                    <span className="text-xs text-gray-500">{formatFileSize(media.taille)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => window.open(media.url, '_blank')}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(media)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(media.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-400">
                  {new Date(media.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {selectedMedia ? 'Modifier le média' : 'Ajouter un média'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="image">Image</option>
                      <option value="video">Vidéo</option>
                      <option value="document">Document</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL</label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <input
                      type="text"
                      required
                      value={formData.categorie}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ex: Actualités, Événements"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="actif">Actif</option>
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
                    placeholder="ex: radc, événement, 2024"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedMedia(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedMedia ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManagement;
