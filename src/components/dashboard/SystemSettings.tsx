import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Settings, 
  Save, 
  Globe, 
  Shield, 
  Bell, 
  Palette, 
  AlertTriangle,
  Key,
  Server,
  CheckCircle
} from 'lucide-react';

interface SystemConfig {
  general: {
    nomApplication: string;
    version: string;
    environnement: 'development' | 'staging' | 'production';
    fuseauHoraire: string;
    langue: string;
    maintenance: boolean;
    messageMaintenance?: string;
  };
  securite: {
    sessionTimeout: number;
    passwordMinLength: number;
    passwordRequireSpecial: boolean;
    deuxFacteurs: boolean;
    loginAttempts: number;
    lockoutDuration: number;
  };
  notification: {
    emailActif: boolean;
    smsActif: boolean;
    pushActif: boolean;
    emailFrom: string;
    emailReplyTo: string;
    smsProvider: string;
    pushProvider: string;
  };
  apparence: {
    theme: 'light' | 'dark' | 'auto';
    couleurPrimaire: string;
    couleurSecondaire: string;
    logoUrl?: string;
    faviconUrl?: string;
    customCSS?: string;
  };
  performance: {
    cacheEnabled: boolean;
    cacheDuration: number;
    compressionEnabled: boolean;
    lazyLoading: boolean;
    monitoringEnabled: boolean;
  };
  integration: {
    stripeActif: boolean;
    stripeMode: 'test' | 'live';
    firebaseActif: boolean;
    analyticsActif: boolean;
    apiRateLimit: number;
  };
}

const SystemSettings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>({
    general: {
      nomApplication: 'RADC Platform',
      version: '1.0.0',
      environnement: 'development',
      fuseauHoraire: 'Europe/Paris',
      langue: 'fr',
      maintenance: false
    },
    securite: {
      sessionTimeout: 3600,
      passwordMinLength: 8,
      passwordRequireSpecial: true,
      deuxFacteurs: false,
      loginAttempts: 5,
      lockoutDuration: 900
    },
    notification: {
      emailActif: true,
      smsActif: false,
      pushActif: true,
      emailFrom: 'contact@radc.org',
      emailReplyTo: 'noreply@radc.org',
      smsProvider: 'twilio',
      pushProvider: 'firebase'
    },
    apparence: {
      theme: 'light',
      couleurPrimaire: '#3B82F6',
      couleurSecondaire: '#10B981',
      logoUrl: '',
      faviconUrl: ''
    },
    performance: {
      cacheEnabled: true,
      cacheDuration: 3600,
      compressionEnabled: true,
      lazyLoading: true,
      monitoringEnabled: true
    },
    integration: {
      stripeActif: false,
      stripeMode: 'test',
      firebaseActif: true,
      analyticsActif: true,
      apiRateLimit: 100
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof SystemConfig>('general');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Simulation - les paramètres seront chargés depuis Firestore
      console.log('Settings loaded');
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Sauvegarder la configuration
      await updateDoc(doc(db, 'systemSettings', 'config'), {
        ...config,
        modifieLe: new Date(),
        modifiePar: 'Admin RADC'
      });

      setHasChanges(false);
      
      // Afficher une notification de succès
      alert('Paramètres sauvegardés avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (categorie: keyof SystemConfig, champ: string, valeur: any) => {
    setConfig(prev => ({
      ...prev,
      [categorie]: {
        ...prev[categorie],
        [champ]: valeur
      }
    }));
    setHasChanges(true);
  };

  const getTabIcon = (tab: string) => {
    const icons = {
      general: <Settings className="h-5 w-5" />,
      securite: <Shield className="h-5 w-5" />,
      notification: <Bell className="h-5 w-5" />,
      apparence: <Palette className="h-5 w-5" />,
      performance: <Server className="h-5 w-5" />,
      integration: <Key className="h-5 w-5" />
    };
    return icons[tab as keyof typeof icons] || <Settings className="h-5 w-5" />;
  };

  const getTabColor = (tab: string) => {
    const colors = {
      general: 'text-blue-600',
      securite: 'text-red-600',
      notification: 'text-purple-600',
      apparence: 'text-green-600',
      performance: 'text-orange-600',
      integration: 'text-indigo-600'
    };
    return colors[tab as keyof typeof colors] || 'text-gray-600';
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
          <h1 className="text-2xl font-bold text-gray-900">Paramètres Système</h1>
          <p className="text-gray-600">Configurez les paramètres de la plateforme</p>
        </div>
        <div className="flex space-x-2">
          {hasChanges && (
            <div className="flex items-center text-sm text-orange-600 mr-4">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Modifications non sauvegardées
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {(Object.keys(config) as Array<keyof SystemConfig>).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className={getTabColor(tab)}>{getTabIcon(tab)}</span>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Informations générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de l'application</label>
                  <input
                    type="text"
                    value={config.general.nomApplication}
                    onChange={(e) => updateConfig('general', 'nomApplication', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Version</label>
                  <input
                    type="text"
                    value={config.general.version}
                    onChange={(e) => updateConfig('general', 'version', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Environnement</label>
                  <select
                    value={config.general.environnement}
                    onChange={(e) => updateConfig('general', 'environnement', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="development">Développement</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fuseau horaire</label>
                  <select
                    value={config.general.fuseauHoraire}
                    onChange={(e) => updateConfig('general', 'fuseauHoraire', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Langue</label>
                  <select
                    value={config.general.langue}
                    onChange={(e) => updateConfig('general', 'langue', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenance"
                    checked={config.general.maintenance}
                    onChange={(e) => updateConfig('general', 'maintenance', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="maintenance" className="ml-2 block text-sm text-gray-900">
                    Mode maintenance
                  </label>
                </div>
              </div>
              {config.general.maintenance && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Message de maintenance</label>
                  <textarea
                    rows={3}
                    value={config.general.messageMaintenance || ''}
                    onChange={(e) => updateConfig('general', 'messageMaintenance', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Message affiché aux utilisateurs pendant la maintenance..."
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'securite' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Sécurité
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Timeout de session (secondes)</label>
                  <input
                    type="number"
                    value={config.securite.sessionTimeout}
                    onChange={(e) => updateConfig('securite', 'sessionTimeout', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Longueur minimale du mot de passe</label>
                  <input
                    type="number"
                    value={config.securite.passwordMinLength}
                    onChange={(e) => updateConfig('securite', 'passwordMinLength', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tentatives de connexion max</label>
                  <input
                    type="number"
                    value={config.securite.loginAttempts}
                    onChange={(e) => updateConfig('securite', 'loginAttempts', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durée de verrouillage (secondes)</label>
                  <input
                    type="number"
                    value={config.securite.lockoutDuration}
                    onChange={(e) => updateConfig('securite', 'lockoutDuration', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="passwordRequireSpecial"
                    checked={config.securite.passwordRequireSpecial}
                    onChange={(e) => updateConfig('securite', 'passwordRequireSpecial', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="passwordRequireSpecial" className="ml-2 block text-sm text-gray-900">
                    Exiger caractères spéciaux
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="deuxFacteurs"
                    checked={config.securite.deuxFacteurs}
                    onChange={(e) => updateConfig('securite', 'deuxFacteurs', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="deuxFacteurs" className="ml-2 block text-sm text-gray-900">
                    Authentification à deux facteurs
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notification' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-600" />
                Notifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email expéditeur</label>
                  <input
                    type="email"
                    value={config.notification.emailFrom}
                    onChange={(e) => updateConfig('notification', 'emailFrom', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email de réponse</label>
                  <input
                    type="email"
                    value={config.notification.emailReplyTo}
                    onChange={(e) => updateConfig('notification', 'emailReplyTo', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fournisseur SMS</label>
                  <select
                    value={config.notification.smsProvider}
                    onChange={(e) => updateConfig('notification', 'smsProvider', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="twilio">Twilio</option>
                    <option value="sinch">Sinch</option>
                    <option value="messagebird">MessageBird</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fournisseur Push</label>
                  <select
                    value={config.notification.pushProvider}
                    onChange={(e) => updateConfig('notification', 'pushProvider', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="firebase">Firebase</option>
                    <option value="onesignal">OneSignal</option>
                    <option value="pusher">Pusher</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailActif"
                    checked={config.notification.emailActif}
                    onChange={(e) => updateConfig('notification', 'emailActif', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailActif" className="ml-2 block text-sm text-gray-900">
                    Notifications email actives
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsActif"
                    checked={config.notification.smsActif}
                    onChange={(e) => updateConfig('notification', 'smsActif', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="smsActif" className="ml-2 block text-sm text-gray-900">
                    Notifications SMS actives
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pushActif"
                    checked={config.notification.pushActif}
                    onChange={(e) => updateConfig('notification', 'pushActif', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="pushActif" className="ml-2 block text-sm text-gray-900">
                    Notifications push actives
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === 'apparence' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5 text-green-600" />
                Apparence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thème</label>
                  <select
                    value={config.apparence.theme}
                    onChange={(e) => updateConfig('apparence', 'theme', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Couleur primaire</label>
                  <input
                    type="color"
                    value={config.apparence.couleurPrimaire}
                    onChange={(e) => updateConfig('apparence', 'couleurPrimaire', e.target.value)}
                    className="mt-1 block w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Couleur secondaire</label>
                  <input
                    type="color"
                    value={config.apparence.couleurSecondaire}
                    onChange={(e) => updateConfig('apparence', 'couleurSecondaire', e.target.value)}
                    className="mt-1 block w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL du logo</label>
                  <input
                    type="url"
                    value={config.apparence.logoUrl || ''}
                    onChange={(e) => updateConfig('apparence', 'logoUrl', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL du favicon</label>
                  <input
                    type="url"
                    value={config.apparence.faviconUrl || ''}
                    onChange={(e) => updateConfig('apparence', 'faviconUrl', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">CSS personnalisé</label>
                  <textarea
                    rows={4}
                    value={config.apparence.customCSS || ''}
                    onChange={(e) => updateConfig('apparence', 'customCSS', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="CSS personnalisé..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Settings */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Server className="h-5 w-5 text-orange-600" />
                Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durée du cache (secondes)</label>
                  <input
                    type="number"
                    value={config.performance.cacheDuration}
                    onChange={(e) => updateConfig('performance', 'cacheDuration', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Limite de l'API (req/min)</label>
                  <input
                    type="number"
                    value={config.integration.apiRateLimit}
                    onChange={(e) => updateConfig('integration', 'apiRateLimit', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cacheEnabled"
                    checked={config.performance.cacheEnabled}
                    onChange={(e) => updateConfig('performance', 'cacheEnabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cacheEnabled" className="ml-2 block text-sm text-gray-900">
                    Cache activé
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="compressionEnabled"
                    checked={config.performance.compressionEnabled}
                    onChange={(e) => updateConfig('performance', 'compressionEnabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="compressionEnabled" className="ml-2 block text-sm text-gray-900">
                    Compression activée
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lazyLoading"
                    checked={config.performance.lazyLoading}
                    onChange={(e) => updateConfig('performance', 'lazyLoading', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="lazyLoading" className="ml-2 block text-sm text-gray-900">
                    Lazy loading activé
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="monitoringEnabled"
                    checked={config.performance.monitoringEnabled}
                    onChange={(e) => updateConfig('performance', 'monitoringEnabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="monitoringEnabled" className="ml-2 block text-sm text-gray-900">
                    Monitoring activé
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integration Settings */}
        {activeTab === 'integration' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Key className="h-5 w-5 text-indigo-600" />
                Intégrations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mode Stripe</label>
                  <select
                    value={config.integration.stripeMode}
                    onChange={(e) => updateConfig('integration', 'stripeMode', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="test">Test</option>
                    <option value="live">Production</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="stripeActif"
                    checked={config.integration.stripeActif}
                    onChange={(e) => updateConfig('integration', 'stripeActif', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="stripeActif" className="ml-2 block text-sm text-gray-900">
                    Stripe activé
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="firebaseActif"
                    checked={config.integration.firebaseActif}
                    onChange={(e) => updateConfig('integration', 'firebaseActif', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="firebaseActif" className="ml-2 block text-sm text-gray-900">
                    Firebase activé
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="analyticsActif"
                    checked={config.integration.analyticsActif}
                    onChange={(e) => updateConfig('integration', 'analyticsActif', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="analyticsActif" className="ml-2 block text-sm text-gray-900">
                    Analytics activé
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Système opérationnel
            </div>
            <div className="text-sm text-gray-600">
              Version: {config.general.version}
            </div>
            <div className="text-sm text-gray-600">
              Environnement: <span className="font-medium">{config.general.environnement}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Dernière sauvegarde: {new Date().toLocaleString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
