import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Search, Plus, MapPin, Calendar, Users, Target } from 'lucide-react';

interface Project {
  id: string;
  titre: string;
  description: string;
  domaine: string;
  statut: 'brouillon' | 'en_attente_validation' | 'en_cours' | 'termine' | 'annule';
  budget: number;
  budgetActuel: number;
  dateCreation: Date;
  dateDebut?: Date;
  dateFinPrevue?: Date;
  porteurProjet: {
    nom: string;
    email: string;
    telephone: string;
  };
  localisation: {
    ville: string;
    region: string;
    pays: string;
  };
  beneficiaires: number;
  objectifs: string[];
  partenaires: string[];
  documents: {
    nom: string;
    type: string;
    taille: string;
    url: string;
  }[];
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState<string>('tous');
  const [filterStatus, setFilterStatus] = useState<string>('tous');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);

      // Récupération des vrais projets depuis Firestore
      const projectsQuery = query(collection(db, 'projets'), orderBy('dateCreation', 'desc'));
      const projectsSnapshot = await getDocs(projectsQuery);

      const projectsData = projectsSnapshot.docs.map(doc => {
        const data = doc.data();

        return {
          id: doc.id,
          titre: data.titre || '',
          description: data.description || '',
          domaine: data.domaine || 'social',
          statut: data.statut || 'brouillon',
          budget: data.budget || 0,
          budgetActuel: data.budgetActuel || 0,
          dateCreation: data.dateCreation?.toDate() || new Date(),
          dateDebut: data.dateDebut?.toDate(),
          dateFinPrevue: data.dateFinPrevue?.toDate(),
          porteurProjet: {
            nom: data.porteurProjet?.nom || '',
            email: data.porteurProjet?.email || '',
            telephone: data.porteurProjet?.telephone || ''
          },
          localisation: {
            ville: data.localisation?.ville || '',
            region: data.localisation?.region || '',
            pays: data.localisation?.pays || ''
          },
          beneficiaires: data.beneficiaires || 0,
          objectifs: Array.isArray(data.objectifs) ? data.objectifs : [],
          partenaires: Array.isArray(data.partenaires) ? data.partenaires : [],
          documents: Array.isArray(data.documents) ? data.documents.map(doc => ({
            nom: doc.nom || '',
            type: doc.type || '',
            taille: doc.taille || '',
            url: doc.url || ''
          })) : []
        };
      });

      setProjects(projectsData);
    } catch (error) {
      console.error('Erreur chargement projets:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'tous' || project.domaine === filterDomain;
    const matchesStatus = filterStatus === 'tous' || project.statut === filterStatus;

    return matchesSearch && matchesDomain && matchesStatus;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'brouillon': return 'bg-gray-100 text-gray-800';
      case 'en_attente_validation': return 'bg-yellow-100 text-yellow-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'termine': return 'bg-green-100 text-green-800';
      case 'annule': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDomainColor = (domaine: string) => {
    switch (domaine) {
      case 'education': return 'bg-purple-100 text-purple-800';
      case 'sante': return 'bg-red-100 text-red-800';
      case 'formation': return 'bg-blue-100 text-blue-800';
      case 'environnement': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-orange-100 text-orange-800';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleEditProject = (project: Project) => {
    // TODO: Implémenter la modal d'édition
    console.log('Modifier projet:', project);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (error) {
        console.error('Erreur suppression projet:', error);
      }
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Projets</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gérez les projets communautaires et leur avancement
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau projet
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="tous">Tous les domaines</option>
            <option value="education">Éducation</option>
            <option value="sante">Santé</option>
            <option value="formation">Formation</option>
            <option value="environnement">Environnement</option>
            <option value="social">Social</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="tous">Tous les statuts</option>
            <option value="brouillon">Brouillon</option>
            <option value="en_attente_validation">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
            <option value="annule">Annulé</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDomainColor(project.domaine)}`}>
                      {project.domaine}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.statut)}`}>
                      {project.statut.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                    {project.titre}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                {project.localisation.ville}, {project.localisation.pays}
              </div>

              {/* Budget Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-medium">{formatCurrency(project.budgetActuel)} / {formatCurrency(project.budget)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(project.budgetActuel / project.budget) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center text-gray-600 mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-xs">Bénéficiaires</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{project.beneficiaires}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-gray-600 mb-1">
                    <Target className="h-4 w-4 mr-1" />
                    <span className="text-xs">Objectifs</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{project.objectifs.length}</div>
                </div>
              </div>

              {/* Dates */}
              {project.dateDebut && (
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  Début: {formatDate(project.dateDebut)}
                  {project.dateFinPrevue && ` - Fin: ${formatDate(project.dateFinPrevue)}`}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProject(project)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-sm">
            Aucun projet trouvé
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
