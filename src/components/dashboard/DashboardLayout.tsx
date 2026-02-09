import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  DollarSign,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Calendar,
  Megaphone,
  HeartHandshake,
  PenTool,
  Image,
  Mail,
  Bell,
  Building,
  FileText,
  Terminal,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state, logout } = useAuth();

  // Navigation complète par rôle
  const getNavigationByRole = () => {
    const userRole = state.utilisateur?.role;
    
    // Navigation Admin - Accès complet
    if (userRole === 'admin') {
      return [
        // Vue d'ensemble
        { name: 'Vue d\'ensemble', href: '/dashboard', icon: LayoutDashboard },
        
        // Gestion principale
        { name: 'Utilisateurs', href: '/dashboard/users', icon: Users },
        { name: 'Projets', href: '/dashboard/projects', icon: FolderOpen },
        { name: 'Donations', href: '/dashboard/donations', icon: DollarSign },
        { name: 'Formations', href: '/dashboard/formations', icon: BookOpen },
        
        // Communauté
        { name: 'Événements', href: '/dashboard/events', icon: Calendar },
        { name: 'Annonces', href: '/dashboard/announcements', icon: Megaphone },
        { name: 'Bénévolat', href: '/dashboard/volunteer', icon: HeartHandshake },
        { name: 'Forum', href: '/dashboard/forum', icon: MessageCircle },
        
        // Contenu
        { name: 'Blog', href: '/dashboard/blog', icon: PenTool },
        { name: 'Médias', href: '/dashboard/media', icon: Image },
        
        // Communication
        { name: 'Newsletter', href: '/dashboard/newsletter', icon: Mail },
        { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
        
        // Organisation
        { name: 'Organisation', href: '/dashboard/organization', icon: Building },
        { name: 'Rapports', href: '/dashboard/reports', icon: FileText },
        
        // Système
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
        { name: 'Logs', href: '/dashboard/logs', icon: Terminal },
      ];
    }
    
    // Navigation Gestionnaire - Fonctionnalités de gestion
    if (userRole === 'gestionnaire') {
      return [
        { name: 'Vue d\'ensemble', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Projets', href: '/dashboard/projects', icon: FolderOpen },
        { name: 'Donations', href: '/dashboard/donations', icon: DollarSign },
        { name: 'Formations', href: '/dashboard/formations', icon: BookOpen },
        { name: 'Événements', href: '/dashboard/events', icon: Calendar },
        { name: 'Annonces', href: '/dashboard/announcements', icon: Megaphone },
        { name: 'Bénévolat', href: '/dashboard/volunteer', icon: HeartHandshake },
        { name: 'Blog', href: '/dashboard/blog', icon: PenTool },
        { name: 'Newsletter', href: '/dashboard/newsletter', icon: Mail },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      ];
    }
    
    // Navigation Bénévole - Fonctionnalités communautaires
    if (userRole === 'benevole') {
      return [
        { name: 'Vue d\'ensemble', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Événements', href: '/dashboard/events', icon: Calendar },
        { name: 'Bénévolat', href: '/dashboard/volunteer', icon: HeartHandshake },
        { name: 'Forum', href: '/dashboard/forum', icon: MessageCircle },
        { name: 'Formations', href: '/dashboard/formations', icon: BookOpen },
      ];
    }
    
    // Navigation par défaut pour les autres rôles
    return [
      { name: 'Vue d\'ensemble', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Formations', href: '/dashboard/formations', icon: BookOpen },
    ];
  };

  const navigation = getNavigationByRole();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-col bg-white pt-5 pb-4 shadow-xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-blue-600">RADC Admin</h1>
          </div>

          <div className="mt-5 flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{state.utilisateur?.email}</p>
                <p className="text-xs text-gray-500 capitalize">{state.utilisateur?.role || 'Utilisateur'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-blue-600">RADC Admin</h1>
          </div>

          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{state.utilisateur?.email}</p>
                <p className="text-xs text-gray-500 capitalize">{state.utilisateur?.role || 'Utilisateur'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow border-b border-gray-200">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <label htmlFor="search-field" className="sr-only">
                  Rechercher
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                    placeholder="Rechercher..."
                    type="search"
                    name="search"
                  />
                </div>
              </div>
            </div>

            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
