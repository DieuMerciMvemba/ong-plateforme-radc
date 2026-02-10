import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Bell, 
  Send, 
  Target,
  Info,
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Eye,
  CheckCircle,
  AlertCircle,
  Mail,
  Smartphone
} from 'lucide-react';

interface Notification {
  id: string;
  titre: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  categorie: 'systeme' | 'utilisateur' | 'evenement' | 'formation' | 'donation' | 'general';
  canaux: ('email' | 'push' | 'sms' | 'inapp')[];
  cible: 'tous' | 'admin' | 'gestionnaire' | 'benevole' | 'donateur' | 'visiteur' | 'personnalise';
  utilisateursCibles?: string[];
  statut: 'brouillon' | 'programme' | 'envoye' | 'annule';
  dateEnvoi?: Date;
  stats: {
    envoyes: number;
    lus: number;
    cliques: number;
    erreurs: number;
  };
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  expireLe?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  auteur: {
    id: string;
    nom: string;
    email: string;
  };
  vues: number;
  reponses: number;
  likes: number;
  signalements: number;
}

interface TemplateNotification {
  id: string;
  nom: string;
  sujet: string;
  contenu: string;
  variables: string[];
  categorie: string;
  actif: boolean;
}

const NotificationsManagement: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<TemplateNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [activeTab, setActiveTab] = useState<'notifications' | 'templates'>('notifications');
  const [formData, setFormData] = useState({
    titre: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    categorie: 'general' as 'systeme' | 'utilisateur' | 'evenement' | 'formation' | 'donation' | 'general',
    canaux: ['email'] as ('email' | 'push' | 'sms' | 'inapp')[],
    cible: 'tous' as 'tous' | 'admin' | 'gestionnaire' | 'benevole' | 'donateur' | 'visiteur' | 'personnalise',
    statut: 'brouillon' as 'brouillon' | 'programme' | 'envoye' | 'annule',
    dateEnvoi: '',
    priorite: 'normale' as 'basse' | 'normale' | 'haute' | 'urgente',
    expireLe: '',
    tags: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger les notifications
      const notificationsQuery = query(
        collection(db, 'notifications'),
        orderBy('createdAt', 'desc')
      );
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const notificationsData = notificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        dateEnvoi: doc.data().dateEnvoi?.toDate(),
        expireLe: doc.data().expireLe?.toDate()
      })) as Notification[];
      setNotifications(notificationsData);

      // Charger les templates
      const templatesQuery = query(
        collection(db, 'templatesNotification'),
        orderBy('nom', 'asc')
      );
      const templatesSnapshot = await getDocs(templatesQuery);
      const templatesData = templatesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TemplateNotification[];
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
      const notificationData = {
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

      if (selectedNotification) {
        await updateDoc(doc(db, 'notifications', selectedNotification.id), {
          ...formData,
          updatedAt: new Date(),
          ...(formData.dateEnvoi && { dateEnvoi: new Date(formData.dateEnvoi) }),
          ...(formData.expireLe && { expireLe: new Date(formData.expireLe) })
        });
      } else {
        await addDoc(collection(db, 'notifications'), notificationData);
      }

      setShowModal(false);
      setSelectedNotification(null);
      setFormData({
        titre: '',
        message: '',
        type: 'info',
        categorie: 'general',
        canaux: ['email'],
        cible: 'tous',
        statut: 'brouillon',
        dateEnvoi: '',
        priorite: 'normale',
        expireLe: '',
        tags: ''
      });
      loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      try {
        await deleteDoc(doc(db, 'notifications', id));
        loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setFormData({
      titre: notification.titre,
      message: notification.message,
      type: notification.type,
      categorie: notification.categorie,
      canaux: notification.canaux,
      cible: notification.cible,
      statut: notification.statut,
      dateEnvoi: notification.dateEnvoi ? notification.dateEnvoi.toISOString().slice(0, 16) : '',
      priorite: notification.priorite,
      expireLe: notification.expireLe ? notification.expireLe.toISOString().slice(0, 16) : '',
      tags: notification.tags.join(', ')
    });
    setShowModal(true);
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || notification.statut === filterStatus;
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesChannel = filterChannel === 'all' || notification.canaux.includes(filterChannel as any);
    return matchesSearch && matchesStatus && matchesType && matchesChannel;
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      info: <Info className="h-4 w-4" />,
      success: <CheckCircle className="h-4 w-4" />,
      warning: <AlertCircle className="h-4 w-4" />,
      error: <AlertCircle className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <Info className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      basse: 'bg-gray-100 text-gray-800',
      normale: 'bg-blue-100 text-blue-800',
      haute: 'bg-orange-100 text-orange-800',
      urgente: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getChannelIcon = (channel: string) => {
    const icons = {
      email: <Mail className="h-4 w-4" />,
      push: <Smartphone className="h-4 w-4" />,
      sms: <Smartphone className="h-4 w-4" />,
      inapp: <Bell className="h-4 w-4" />
    };
    return icons[channel as keyof typeof icons] || <Bell className="h-4 w-4" />;
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Notifications</h1>
          <p className="text-gray-600">Gérez les notifications et alertes système</p>
        </div>
        {activeTab === 'notifications' && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nouvelle Notification
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notifications ({notifications.length})
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
            <Send className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Envoyées</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.statut === 'envoye').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lues</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.reduce((sum, n) => sum + n.stats.lus, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taux Lecture</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.reduce((sum, n) => sum + n.stats.envoyes, 0) > 0
                  ? Math.round(
                      notifications.reduce((sum, n) => sum + n.stats.lus, 0) / 
                      notifications.reduce((sum, n) => sum + n.stats.envoyes, 0) * 100
                    ) + '%'
                  : '0%'
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.priorite === 'urgente').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {activeTab === 'notifications' && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher une notification..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="info">Info</option>
              <option value="success">Succès</option>
              <option value="warning">Attention</option>
              <option value="error">Erreur</option>
            </select>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les canaux</option>
              <option value="email">Email</option>
              <option value="push">Push</option>
              <option value="sms">SMS</option>
              <option value="inapp">In-app</option>
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'notifications' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Canaux
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cible
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{notification.titre}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{notification.message}</div>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priorite)}`}>
                              {notification.priorite}
                            </span>
                            {notification.expireLe && (
                              <span className="text-xs text-gray-400">
                                Expire: {new Date(notification.expireLe).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {notification.canaux.map((channel, index) => (
                          <div key={index} className="text-gray-400" title={channel}>
                            {getChannelIcon(channel)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 text-gray-400 mr-1" />
                        {notification.cible}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        notification.statut === 'envoye' ? 'bg-green-100 text-green-800' :
                        notification.statut === 'programme' ? 'bg-blue-100 text-blue-800' :
                        notification.statut === 'annule' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {notification.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-1" />
                          {notification.stats.envoyes}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {notification.stats.lus}
                        </div>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          {notification.stats.cliques}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(notification)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(notification.id)}
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
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variables
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
                        <div className="text-sm text-gray-500">{template.sujet}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {template.categorie}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 3).map((variable, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {variable}
                          </span>
                        ))}
                        {template.variables.length > 3 && (
                          <span className="text-xs text-gray-500">+{template.variables.length - 3}</span>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedNotification ? 'Modifier la notification' : 'Nouvelle notification'}
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
                      <option value="info">Information</option>
                      <option value="success">Succès</option>
                      <option value="warning">Attention</option>
                      <option value="error">Erreur</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                      <option value="general">Général</option>
                      <option value="systeme">Système</option>
                      <option value="utilisateur">Utilisateur</option>
                      <option value="evenement">Événement</option>
                      <option value="formation">Formation</option>
                      <option value="donation">Donation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priorité</label>
                    <select
                      value={formData.priorite}
                      onChange={(e) => setFormData({ ...formData, priorite: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="basse">Basse</option>
                      <option value="normale">Normale</option>
                      <option value="haute">Haute</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Canaux de diffusion</label>
                  <div className="mt-2 space-y-2">
                    {[
                      { value: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
                      { value: 'push', label: 'Push', icon: <Smartphone className="h-4 w-4" /> },
                      { value: 'sms', label: 'SMS', icon: <Smartphone className="h-4 w-4" /> },
                      { value: 'inapp', label: 'In-app', icon: <Bell className="h-4 w-4" /> }
                    ].map((channel) => (
                      <label key={channel.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.canaux.includes(channel.value as any)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, canaux: [...formData.canaux, channel.value as any] });
                            } else {
                              setFormData({ ...formData, canaux: formData.canaux.filter(c => c !== channel.value) });
                            }
                          }}
                          className="mr-2"
                        />
                        {channel.icon}
                        <span className="ml-2">{channel.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cible</label>
                    <select
                      value={formData.cible}
                      onChange={(e) => setFormData({ ...formData, cible: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="tous">Tous les utilisateurs</option>
                      <option value="admin">Admins</option>
                      <option value="gestionnaire">Gestionnaires</option>
                      <option value="benevole">Bénévoles</option>
                      <option value="donateur">Donateurs</option>
                      <option value="visiteur">Visiteurs</option>
                      <option value="personnalise">Personnalisé</option>
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
                    <label className="block text-sm font-medium text-gray-700">Date d'expiration</label>
                    <input
                      type="datetime-local"
                      value={formData.expireLe}
                      onChange={(e) => setFormData({ ...formData, expireLe: e.target.value })}
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
                    setSelectedNotification(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedNotification ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsManagement;
