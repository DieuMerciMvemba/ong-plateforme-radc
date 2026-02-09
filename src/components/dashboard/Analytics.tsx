import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Download
} from 'lucide-react';

interface AnalyticsData {
  visitors: {
    total: number;
    monthly: number[];
    growth: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  donations: {
    total: number;
    monthly: number[];
    average: number;
    growth: number;
  };
  formations: {
    total: number;
    active: number;
    inscriptions: number;
    completion: number;
  };
  projects: {
    total: number;
    active: number;
    funded: number;
    completion: number;
  };
  events: {
    total: number;
    upcoming: number;
    participants: number;
    attendance: number;
  };
  topPages: {
    page: string;
    views: number;
    bounceRate: number;
  }[];
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  geoStats: {
    country: string;
    visitors: number;
    percentage: number;
  }[];
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // Simuler le chargement des données analytics
      const mockAnalytics: AnalyticsData = {
        visitors: {
          total: 15420,
          monthly: [1200, 1350, 1420, 1580, 1650, 1720, 1850, 1920, 2100, 2280, 2350, 2420],
          growth: 12.5
        },
        users: {
          total: 1250,
          active: 890,
          new: 45,
          growth: 8.2
        },
        donations: {
          total: 45600,
          monthly: [3200, 3500, 3800, 4100, 4300, 4500, 4700, 4900, 5100, 5300, 5500, 5700],
          average: 185,
          growth: 15.3
        },
        formations: {
          total: 8,
          active: 6,
          inscriptions: 145,
          completion: 78
        },
        projects: {
          total: 12,
          active: 8,
          funded: 6,
          completion: 65
        },
        events: {
          total: 5,
          upcoming: 3,
          participants: 280,
          attendance: 85
        },
        topPages: [
          { page: '/accueil', views: 5420, bounceRate: 25 },
          { page: '/formations', views: 3210, bounceRate: 18 },
          { page: '/projets', views: 2890, bounceRate: 22 },
          { page: '/communaute', views: 2150, bounceRate: 30 },
          { page: '/donations', views: 1890, bounceRate: 15 }
        ],
        deviceStats: {
          desktop: 65,
          mobile: 28,
          tablet: 7
        },
        geoStats: [
          { country: 'France', visitors: 8420, percentage: 54.6 },
          { country: 'Sénégal', visitors: 3150, percentage: 20.4 },
          { country: 'Canada', visitors: 1280, percentage: 8.3 },
          { country: 'Belgique', visitors: 920, percentage: 6.0 },
          { country: 'Suisse', visitors: 650, percentage: 4.2 }
        ]
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Analysez les performances de votre plateforme
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
            <option value="1y">1 an</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Visiteurs totaux</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatNumber(analytics.visitors.total)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{analytics.visitors.growth}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Utilisateurs actifs</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatNumber(analytics.users.active)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{analytics.users.growth}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Dons collectés</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(analytics.donations.total)}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{analytics.donations.growth}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Taux de conversion</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {((analytics.donations.total / analytics.visitors.total) * 100).toFixed(1)}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visitors Chart */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Évolution des visiteurs
            </h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.visitors.monthly.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(value / Math.max(...analytics.visitors.monthly)) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    M{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donations Chart */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Évolution des dons
            </h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.donations.monthly.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${(value / Math.max(...analytics.donations.monthly)) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    M{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Pages */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Pages les plus visitées
            </h3>
            <div className="space-y-4">
              {analytics.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {page.page}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatNumber(page.views)} vues
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {page.bounceRate}% bounce
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Device Stats */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Appareils utilisés
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Desktop</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${analytics.deviceStats.desktop}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">{analytics.deviceStats.desktop}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Mobile</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${analytics.deviceStats.mobile}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">{analytics.deviceStats.mobile}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Tablette</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                    <div
                      className="h-2 bg-purple-500 rounded-full"
                      style={{ width: `${analytics.deviceStats.tablet}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">{analytics.deviceStats.tablet}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Stats */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Origine géographique
            </h3>
            <div className="space-y-4">
              {analytics.geoStats.slice(0, 5).map((geo, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {geo.country}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatNumber(geo.visitors)} visiteurs
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {geo.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formations Stats */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Statistiques Formations
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics.formations.total}</div>
                <div className="text-sm text-gray-500">Total formations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analytics.formations.active}</div>
                <div className="text-sm text-gray-500">Formations actives</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{analytics.formations.inscriptions}</div>
                <div className="text-sm text-gray-500">Total inscriptions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{analytics.formations.completion}%</div>
                <div className="text-sm text-gray-500">Taux complétion</div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Stats */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Statistiques Projets
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics.projects.total}</div>
                <div className="text-sm text-gray-500">Total projets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analytics.projects.active}</div>
                <div className="text-sm text-gray-500">Projets actifs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{analytics.projects.funded}</div>
                <div className="text-sm text-gray-500">Projets financés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{analytics.projects.completion}%</div>
                <div className="text-sm text-gray-500">Taux achèvement</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
