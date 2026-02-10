import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';

interface Report {
  id: string;
  titre: string;
  description: string;
  type: 'financier' | 'activite' | 'performance' | 'utilisateur' | 'donation' | 'evenement' | 'custom';
  categorie: string;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  periode: {
    debut: Date;
    fin: Date;
  };
  statut: 'generation' | 'pret' | 'erreur' | 'archive';
  fichier?: {
    nom: string;
    url: string;
    taille: number;
    dateGeneration: Date;
  };
  parametres: Record<string, any>;
  auteur: string;
  telechargements: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ReportTemplate {
  id: string;
  nom: string;
  description: string;
  type: string;
  categorie: string;
  format: string;
  parametres: {
    nom: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean';
    obligatoire: boolean;
    options?: string[];
    defaultValue?: any;
  }[];
  actif: boolean;
}

const ReportsManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<'reports' | 'templates'>('reports');
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'activite' as 'financier' | 'activite' | 'performance' | 'utilisateur' | 'donation' | 'evenement' | 'custom',
    categorie: '',
    format: 'pdf' as 'pdf' | 'excel' | 'csv' | 'json',
    periode: {
      debut: '',
      fin: ''
    },
    parametres: {} as Record<string, any>
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger les rapports
      const reportsQuery = query(
        collection(db, 'rapports'),
        orderBy('createdAt', 'desc')
      );
      const reportsSnapshot = await getDocs(reportsQuery);
      const reportsData = reportsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        periode: {
          debut: doc.data().periode?.debut?.toDate() || new Date(),
          fin: doc.data().periode?.fin?.toDate() || new Date()
        },
        ...(doc.data().fichier && {
          fichier: {
            ...doc.data().fichier,
            dateGeneration: doc.data().fichier.dateGeneration?.toDate() || new Date()
          }
        })
      })) as Report[];
      setReports(reportsData);

      // Charger les templates
      const templatesQuery = query(
        collection(db, 'templatesRapport'),
        orderBy('nom', 'asc')
      );
      const templatesSnapshot = await getDocs(templatesQuery);
      const templatesData = templatesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ReportTemplate[];
      setTemplates(templatesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reportData = {
        ...formData,
        periode: {
          debut: new Date(formData.periode.debut),
          fin: new Date(formData.periode.fin)
        },
        statut: 'generation',
        auteur: 'Admin RADC',
        telechargements: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'rapports'), reportData);
      
      // Simuler la génération du rapport
      setTimeout(async () => {
        await updateDoc(doc(db, 'rapports', docRef.id), {
          statut: 'pret',
          fichier: {
            nom: `${formData.titre.replace(/\s+/g, '_')}.${formData.format}`,
            url: `https://example.com/reports/${docRef.id}.${formData.format}`,
            taille: Math.floor(Math.random() * 1000000) + 100000,
            dateGeneration: new Date()
          },
          updatedAt: new Date()
        });
        loadData();
      }, 3000);

      setShowModal(false);
      setSelectedReport(null);
      setFormData({
        titre: '',
        description: '',
        type: 'activite',
        categorie: '',
        format: 'pdf',
        periode: {
          debut: '',
          fin: ''
        },
        parametres: {}
      });
      loadData();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
      try {
        await deleteDoc(doc(db, 'rapports', id));
        loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (report: Report) => {
    setSelectedReport(report);
    setFormData({
      titre: report.titre,
      description: report.description,
      type: report.type,
      categorie: report.categorie,
      format: report.format,
      periode: {
        debut: report.periode.debut.toISOString().split('T')[0],
        fin: report.periode.fin.toISOString().split('T')[0]
      },
      parametres: report.parametres
    });
    setShowModal(true);
  };

  const handleDownload = (report: Report) => {
    if (report.fichier) {
      // Simuler le téléchargement
      console.log('Téléchargement de:', report.fichier.url);
      // Mettre à jour le compteur de téléchargements
      updateDoc(doc(db, 'rapports', report.id), {
        telechargements: report.telechargements + 1
      });
      loadData();
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.statut === filterStatus;
    const matchesFormat = filterFormat === 'all' || report.format === filterFormat;
    return matchesSearch && matchesType && matchesStatus && matchesFormat;
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      financier: <DollarSign className="h-5 w-5" />,
      activite: <Activity className="h-5 w-5" />,
      performance: <TrendingUp className="h-5 w-5" />,
      utilisateur: <Users className="h-5 w-5" />,
      donation: <DollarSign className="h-5 w-5" />,
      evenement: <Calendar className="h-5 w-5" />,
      custom: <FileText className="h-5 w-5" />
    };
    return icons[type as keyof typeof icons] || <FileText className="h-5 w-5" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      financier: 'bg-green-100 text-green-800',
      activite: 'bg-blue-100 text-blue-800',
      performance: 'bg-purple-100 text-purple-800',
      utilisateur: 'bg-orange-100 text-orange-800',
      donation: 'bg-yellow-100 text-yellow-800',
      evenement: 'bg-red-100 text-red-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      generation: 'bg-yellow-100 text-yellow-800',
      pret: 'bg-green-100 text-green-800',
      erreur: 'bg-red-100 text-red-800',
      archive: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Rapports</h1>
          <p className="text-gray-600">Générez et consultez les rapports de la plateforme</p>
        </div>
        {activeTab === 'reports' && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nouveau Rapport
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rapports ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Templates ({templates.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Rapports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.statut === 'pret').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Download className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Téléchargements</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.reduce((sum, r) => sum + r.telechargements, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.statut === 'generation').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {activeTab === 'reports' && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un rapport..."
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
              <option value="financier">Financier</option>
              <option value="activite">Activité</option>
              <option value="performance">Performance</option>
              <option value="utilisateur">Utilisateur</option>
              <option value="donation">Donation</option>
              <option value="evenement">Événement</option>
              <option value="custom">Personnalisé</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="generation">En cours</option>
              <option value="pret">Disponible</option>
              <option value="erreur">Erreur</option>
              <option value="archive">Archivé</option>
            </select>
            <select
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les formats</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'reports' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rapport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fichier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {getTypeIcon(report.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.titre}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{report.description}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            Par {report.auteur} • {new Date(report.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <div>
                          <div>{new Date(report.periode.debut).toLocaleDateString('fr-FR')}</div>
                          <div className="text-xs text-gray-500">
                            au {new Date(report.periode.fin).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.statut)}`}>
                        {report.statut === 'generation' && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 animate-spin" />
                            En cours
                          </div>
                        )}
                        {report.statut === 'pret' && (
                          <div className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Disponible
                          </div>
                        )}
                        {report.statut === 'erreur' && (
                          <div className="flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Erreur
                          </div>
                        )}
                        {report.statut === 'archive' && 'Archivé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.fichier ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">{report.fichier.nom}</span>
                          <span className="text-xs text-gray-500">({formatFileSize(report.fichier.taille)})</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Non généré</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {report.fichier && (
                          <button
                            onClick={() => handleDownload(report)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Télécharger"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(report)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Modifier"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
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
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paramètres
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{template.nom}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{template.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(template.type)}`}>
                        {template.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 uppercase">
                      {template.format}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {template.parametres.slice(0, 3).map((param, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {param.nom}
                          </span>
                        ))}
                        {template.parametres.length > 3 && (
                          <span className="text-xs text-gray-500">+{template.parametres.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        template.actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.actif ? 'Actif' : 'Inactif'}
                      </span>
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
              {selectedReport ? 'Modifier le rapport' : 'Nouveau rapport'}
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
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="financier">Financier</option>
                      <option value="activite">Activité</option>
                      <option value="performance">Performance</option>
                      <option value="utilisateur">Utilisateur</option>
                      <option value="donation">Donation</option>
                      <option value="evenement">Événement</option>
                      <option value="custom">Personnalisé</option>
                    </select>
                  </div>
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
                      value={formData.categorie}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ex: Mensuel, Annuel, Spécial"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Format</label>
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de début</label>
                    <input
                      type="date"
                      required
                      value={formData.periode.debut}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        periode: { ...formData.periode, debut: e.target.value }
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                    <input
                      type="date"
                      required
                      value={formData.periode.fin}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        periode: { ...formData.periode, fin: e.target.value }
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedReport(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedReport ? 'Modifier' : 'Générer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;
