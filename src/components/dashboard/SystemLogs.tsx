import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where, startAfter } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Terminal, 
  Search, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  Clock,
  User,
  Server,
  Database,
  Shield,
  Activity,
  Calendar,
  Eye
} from 'lucide-react';

interface SystemLog {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
  userId?: string;
  userEmail?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  action?: string;
  resource?: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
}

interface LogStats {
  total: number;
  byLevel: Record<string, number>;
  bySource: Record<string, number>;
  last24h: number;
  last7d: number;
  critical: number;
}

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('24h');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [stats, setStats] = useState<LogStats>({
    total: 0,
    byLevel: {},
    bySource: {},
    last24h: 0,
    last7d: 0,
    critical: 0
  });

  useEffect(() => {
    loadLogs();
    loadStats();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadLogs();
        loadStats();
      }, 30000) as unknown as number;
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh]);

  const loadLogs = async (loadMore = false) => {
    try {
      setLoading(true);
      let logsQuery = query(
        collection(db, 'systemLogs'),
        orderBy('timestamp', 'desc')
      );

      // Apply filters
      if (filterLevel !== 'all') {
        logsQuery = query(logsQuery, where('level', '==', filterLevel));
      }
      if (filterSource !== 'all') {
        logsQuery = query(logsQuery, where('source', '==', filterSource));
      }

      // Apply date range
      const now = new Date();
      let startDate: Date;
      switch (filterDateRange) {
        case '1h':
          startDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }
      logsQuery = query(logsQuery, where('timestamp', '>=', startDate));

      // Pagination
      if (loadMore && lastVisible) {
        logsQuery = query(logsQuery, startAfter(lastVisible));
      }

      const snapshot = await getDocs(logsQuery);
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as SystemLog[];

      if (loadMore) {
        setLogs(prev => [...prev, ...logsData]);
      } else {
        setLogs(logsData);
      }

      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 50);
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get total count
      const totalQuery = query(collection(db, 'systemLogs'));
      const totalSnapshot = await getDocs(totalQuery);
      const total = totalSnapshot.size;

      // Get last 24h count
      const last24hQuery = query(
        collection(db, 'systemLogs'),
        where('timestamp', '>=', last24h)
      );
      const last24hSnapshot = await getDocs(last24hQuery);
      const last24hCount = last24hSnapshot.size;

      // Get last 7d count
      const last7dQuery = query(
        collection(db, 'systemLogs'),
        where('timestamp', '>=', last7d)
      );
      const last7dSnapshot = await getDocs(last7dQuery);
      const last7dCount = last7dSnapshot.size;

      // Get critical count
      const criticalQuery = query(
        collection(db, 'systemLogs'),
        where('level', '==', 'critical')
      );
      const criticalSnapshot = await getDocs(criticalQuery);
      const criticalCount = criticalSnapshot.size;

      // Get stats by level
      const levelStats: Record<string, number> = {};
      const sourceStats: Record<string, number> = {};

      totalSnapshot.forEach(doc => {
        const log = doc.data();
        levelStats[log.level] = (levelStats[log.level] || 0) + 1;
        sourceStats[log.source] = (sourceStats[log.source] || 0) + 1;
      });

      setStats({
        total,
        byLevel: levelStats,
        bySource: sourceStats,
        last24h: last24hCount,
        last7d: last7dCount,
        critical: criticalCount
      });
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    }
  };

  const handleRefresh = () => {
    setLogs([]);
    setLastVisible(null);
    loadLogs();
    loadStats();
  };

  const handleExport = () => {
    // Export logs to CSV
    const headers = ['Timestamp', 'Level', 'Source', 'Message', 'User', 'Action', 'Resource'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.level,
        log.source,
        `"${log.message.replace(/"/g, '""')}"`,
        log.userEmail || '',
        log.action || '',
        log.resource || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.userEmail && log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getLevelIcon = (level: string) => {
    const icons = {
      debug: <Terminal className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      error: <AlertCircle className="h-4 w-4" />,
      critical: <AlertCircle className="h-4 w-4" />
    };
    return icons[level as keyof typeof icons] || <Info className="h-4 w-4" />;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      debug: 'text-gray-600 bg-gray-100',
      info: 'text-blue-600 bg-blue-100',
      warning: 'text-yellow-600 bg-yellow-100',
      error: 'text-red-600 bg-red-100',
      critical: 'text-red-800 bg-red-200'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getSourceIcon = (source: string) => {
    const icons = {
      auth: <Shield className="h-4 w-4" />,
      database: <Database className="h-4 w-4" />,
      server: <Server className="h-4 w-4" />,
      api: <Activity className="h-4 w-4" />,
      user: <User className="h-4 w-4" />
    };
    return icons[source as keyof typeof icons] || <Terminal className="h-4 w-4" />;
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(timestamp);
  };

  if (loading && logs.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Logs Système</h1>
          <p className="text-gray-600">Consultez et analysez les logs de la plateforme</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              autoRefresh 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <RefreshCw className={`h-5 w-5 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh
          </button>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <RefreshCw className="h-5 w-5" />
            Actualiser
          </button>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <Download className="h-5 w-5" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Terminal className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">24 dernières heures</p>
              <p className="text-2xl font-bold text-gray-900">{stats.last24h}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">7 derniers jours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.last7d}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Erreurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.byLevel.error || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-800" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critiques</p>
              <p className="text-2xl font-bold text-gray-900">{stats.critical}</p>
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
                placeholder="Rechercher dans les logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les niveaux</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les sources</option>
            <option value="auth">Authentification</option>
            <option value="database">Base de données</option>
            <option value="server">Serveur</option>
            <option value="api">API</option>
            <option value="user">Utilisateur</option>
          </select>
          <select
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">Dernière heure</option>
            <option value="24h">24 dernières heures</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      {formatTimestamp(log.timestamp)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(log.level)}`}>
                      {getLevelIcon(log.level)}
                      <span className="ml-1">{log.level.toUpperCase()}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-gray-600">
                      {getSourceIcon(log.source)}
                      <span className="ml-1">{log.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md truncate">
                      {log.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.userEmail || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.action || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        // Show log details in a modal or expandable row
                        alert(`Détails du log:\n\nMessage: ${log.message}\nSource: ${log.source}\nUser: ${log.userEmail || 'N/A'}\nAction: ${log.action || 'N/A'}\nResource: ${log.resource || 'N/A'}\nIP: ${log.ip || 'N/A'}\nSession: ${log.sessionId || 'N/A'}\n\n${log.stackTrace ? `Stack Trace:\n${log.stackTrace}` : ''}`);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Load More */}
        {hasMore && (
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => loadLogs(true)}
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : 'Charger plus de logs'}
            </button>
          </div>
        )}
      </div>

      {/* Level Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Distribution par niveau</h3>
        <div className="space-y-2">
          {Object.entries(stats.byLevel).map(([level, count]) => (
            <div key={level} className="flex items-center">
              <div className="w-20 text-sm font-medium text-gray-700 capitalize">{level}</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      level === 'critical' ? 'bg-red-600' :
                      level === 'error' ? 'bg-red-500' :
                      level === 'warning' ? 'bg-yellow-500' :
                      level === 'info' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-sm text-gray-600 text-right">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
