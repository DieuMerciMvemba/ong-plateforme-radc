import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  Users,
  FolderOpen,
  DollarSign,
  BookOpen,
  TrendingUp,
  Calendar,
  Eye,
  Activity
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getBgColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50';
      case 'green': return 'bg-green-50';
      case 'purple': return 'bg-purple-50';
      default: return 'bg-gray-50';
    }
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-700';
      case 'green': return 'text-green-700';
      case 'purple': return 'text-purple-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${getIconColor(color)}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
      <div className={`px-5 py-3 ${getBgColor(color)}`}>
        <div className="text-sm">
          <span className={`font-medium ${getTextColor(color)}`}>{change}</span>
          <span className="text-gray-500"> depuis le mois dernier</span>
        </div>
      </div>
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    totalAmount: 0,
    activeProjects: 0,
    totalFormations: 0,
    activeEvents: 0,
    monthlyGrowth: {
      users: '+12%',
      donations: '+8%',
      amount: '+15%',
      projects: '+5%'
    }
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Récupération des vraies données depuis Firestore
      const now = new Date();
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Comptage des utilisateurs
      const usersQuery = query(collection(db, 'utilisateurs'));
      const usersSnapshot = await getDocs(usersQuery);
      const totalUsers = usersSnapshot.size;

      // Comptage des utilisateurs du mois dernier pour le calcul de croissance
      const usersLastMonthQuery = query(
        collection(db, 'utilisateurs'),
        where('dateInscription', '>=', Timestamp.fromDate(oneMonthAgo))
      );
      const usersLastMonthSnapshot = await getDocs(usersLastMonthQuery);
      const usersLastMonth = usersLastMonthSnapshot.size;
      const usersGrowth = totalUsers > 0 ? ((usersLastMonth / totalUsers) * 100).toFixed(1) : '0';

      // Comptage des donations
      const donationsQuery = query(collection(db, 'donations'));
      const donationsSnapshot = await getDocs(donationsQuery);
      const totalDonations = donationsSnapshot.size;

      // Calcul du montant total des donations
      let totalAmount = 0;
      donationsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.montant) {
          totalAmount += data.montant;
        }
      });

      // Comptage des projets actifs
      const projectsQuery = query(
        collection(db, 'projets'),
        where('statut', '==', 'actif')
      );
      const projectsSnapshot = await getDocs(projectsQuery);
      const activeProjects = projectsSnapshot.size;

      // Comptage des formations
      const formationsQuery = query(collection(db, 'formations'));
      const formationsSnapshot = await getDocs(formationsQuery);
      const totalFormations = formationsSnapshot.size;

      // Comptage des événements actifs
      const eventsQuery = query(
        collection(db, 'evenements'),
        where('statut', '==', 'actif')
      );
      const eventsSnapshot = await getDocs(eventsQuery);
      const activeEvents = eventsSnapshot.size;

      // Récupération de l'activité récente (derniers 10 éléments)
      const recentActivityQuery = query(
        collection(db, 'activite'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const activitySnapshot = await getDocs(recentActivityQuery);
      const recentActivity = activitySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));

      setStats({
        totalUsers,
        totalDonations,
        totalAmount,
        activeProjects,
        totalFormations,
        activeEvents,
        monthlyGrowth: {
          users: `+${usersGrowth}%`,
          donations: '+8%', // À calculer avec de vraies données
          amount: '+15%', // À calculer avec de vraies données
          projects: '+5%' // À calculer avec de vraies données
        }
      });

      setRecentActivity(recentActivity);

    } catch (error) {
      console.error('❌ DashboardOverview: Erreur chargement dashboard:', error);
      // En cas d'erreur, utiliser des données par défaut
      setStats({
        totalUsers: 0,
        totalDonations: 0,
        totalAmount: 0,
        activeProjects: 0,
        totalFormations: 0,
        activeEvents: 0,
        monthlyGrowth: {
          users: '+0%',
          donations: '+0%',
          amount: '+0%',
          projects: '+0%'
        }
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `il y a ${minutes} min`;
    if (hours < 24) return `il y a ${hours}h`;
    return `il y a ${days}j`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donation': return DollarSign;
      case 'inscription': return BookOpen;
      case 'project': return FolderOpen;
      case 'event': return Calendar;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'donation': return 'green';
      case 'inscription': return 'blue';
      case 'project': return 'purple';
      case 'event': return 'orange';
      default: return 'gray';
    }
  };

  const getActivityBgColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100';
      case 'blue': return 'bg-blue-100';
      case 'purple': return 'bg-purple-100';
      case 'orange': return 'bg-orange-100';
      default: return 'bg-gray-100';
    }
  };

  const getActivityTextColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600';
      case 'blue': return 'text-blue-600';
      case 'purple': return 'text-purple-600';
      case 'orange': return 'text-orange-600';
      default: return 'text-gray-600';
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="mt-1 text-sm text-gray-600">
          Vue d'ensemble des activités de la plateforme RADC
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Utilisateurs actifs"
          value={stats.totalUsers.toLocaleString('fr-FR')}
          change={stats.monthlyGrowth.users}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Total donations"
          value={stats.totalDonations}
          change={stats.monthlyGrowth.donations}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Montant collecté"
          value={formatAmount(stats.totalAmount)}
          change={stats.monthlyGrowth.amount}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Projets actifs"
          value={stats.activeProjects}
          change={stats.monthlyGrowth.projects}
          icon={FolderOpen}
          color="purple"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Formations actives</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalFormations}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Événements actifs</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.activeEvents}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Visiteurs ce mois</dt>
                  <dd className="text-lg font-medium text-gray-900">8,432</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Activité récente
          </h3>

          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                const color = getActivityColor(activity.type);

                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== recentActivity.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getActivityBgColor(color)}`}>
                            <Icon className={`h-4 w-4 ${getActivityTextColor(color)}`} />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">{activity.user}</span>{' '}
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Actions rapides
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="relative block w-full bg-white border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Users className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Nouveau projet
              </span>
            </button>

            <button className="relative block w-full bg-white border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Créer formation
              </span>
            </button>

            <button className="relative block w-full bg-white border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Calendar className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Nouvel événement
              </span>
            </button>

            <button className="relative block w-full bg-white border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Activity className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Voir rapports
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
