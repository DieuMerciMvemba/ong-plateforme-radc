import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  X,
  Search,
  Grid,
  List,
  FileImage,
  Loader,
  Check
} from 'lucide-react';
import { DriveService } from '../../services/blogService';
import type { ImageDrive } from '../../types/blog';

interface GoogleDriveImageSelectorProps {
  onImageSelect: (image: ImageDrive) => void;
  onClose: () => void;
  categorie?: string;
  multiple?: boolean;
  selectedImages?: ImageDrive[];
}

const GoogleDriveImageSelector: React.FC<GoogleDriveImageSelectorProps> = ({
  onImageSelect,
  onClose,
  categorie = 'blog',
  multiple = false,
  selectedImages = []
}) => {
  const [images, setImages] = useState<ImageDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categorie);
  const [filteredImages, setFilteredImages] = useState<ImageDrive[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chargerImages();
  }, [selectedCategory]);

  useEffect(() => {
    filtrerImages();
  }, [images, searchTerm]);

  const chargerImages = async () => {
    try {
      setLoading(true);
      const imagesData = await DriveService.getImagesParCategorie(selectedCategory);
      setImages(imagesData);
    } catch (error) {
      console.error('Erreur chargement images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrerImages = () => {
    let filtered = images;

    if (searchTerm) {
      filtered = filtered.filter(image =>
        image.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        image.altText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.legende?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        return await DriveService.uploaderImage(file, {
          categorie: selectedCategory,
          auteurId: 'current-user-id', // TODO: Get from auth context
          tags: [],
          altText: '',
          legende: ''
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);

      // Ajouter les nouvelles images à la liste
      setImages(prev => [...uploadedImages, ...prev]);

      // Sélectionner automatiquement la première image uploadée si single mode
      if (!multiple && uploadedImages.length > 0) {
        onImageSelect(uploadedImages[0]);
        onClose();
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageSelect = (image: ImageDrive) => {
    if (multiple) {
      // TODO: Implémenter la sélection multiple
      console.log('Sélection multiple pas encore implémentée');
    } else {
      onImageSelect(image);
      onClose();
    }
  };

  const isImageSelected = (image: ImageDrive) => {
    return selectedImages.some(selected => selected.id === image.id);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const categories = [
    { id: 'blog', nom: 'Blog', couleur: '#3B82F6' },
    { id: 'projets', nom: 'Projets', couleur: '#10B981' },
    { id: 'evenements', nom: 'Événements', couleur: '#F59E0B' },
    { id: 'formations', nom: 'Formations', couleur: '#8B5CF6' },
    { id: 'equipe', nom: 'Équipe', couleur: '#EF4444' },
    { id: 'partenaires', nom: 'Partenaires', couleur: '#06B6D4' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />

      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <ImageIcon className="h-6 w-6 text-gray-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Sélectionner une image
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Catégories */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {/* Bouton upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {uploading ? 'Upload...' : 'Uploader'}
            </button>

            {/* Vue grille/liste */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des images...</p>
              </div>
            </div>
          ) : (
            <div className="h-96 overflow-y-auto p-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {filteredImages.map(image => (
                    <div
                      key={image.id}
                      className="relative group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
                      onClick={() => handleImageSelect(image)}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={image.url}
                          alt={image.altText || image.nom}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                        {isImageSelected(image) && (
                          <Check className="h-8 w-8 text-white" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-2 bg-white">
                        <p className="text-xs text-gray-900 truncate" title={image.nom}>
                          {image.nom}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(image.taille)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredImages.map(image => (
                    <div
                      key={image.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                      onClick={() => handleImageSelect(image)}
                    >
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded mr-4">
                        <img
                          src={image.url}
                          alt={image.altText || image.nom}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {image.nom}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(image.taille)} • {formatDate(image.dateUpload)}
                        </p>
                        {image.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {image.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {isImageSelected(image) && (
                        <Check className="h-5 w-5 text-blue-600 mr-3" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {filteredImages.length === 0 && (
                <div className="text-center py-12">
                  <FileImage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune image trouvée
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm ? 'Essayez avec d\'autres termes de recherche.' : 'Commencez par uploader des images.'}
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader une image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} trouvée{filteredImages.length !== 1 ? 's' : ''}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default GoogleDriveImageSelector;
