import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDown, LogOut, User, Settings, CreditCard, Heart, BookOpen } from 'lucide-react';

const UserMenu: React.FC = () => {
  const { state, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleImageError = (userId: string) => {
    setImageError(prev => ({ ...prev, [userId]: true }));
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      admin: 'Administrateur',
      gestionnaire: 'Gestionnaire',
      benevole: 'Bénévole',
      donateur: 'Donateur',
      visiteur: 'Visiteur'
    };
    return roleLabels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const roleColors: { [key: string]: string } = {
      admin: 'bg-purple-100 text-purple-800',
      gestionnaire: 'bg-blue-100 text-blue-800',
      benevole: 'bg-green-100 text-green-800',
      donateur: 'bg-yellow-100 text-yellow-800',
      visiteur: 'bg-gray-100 text-gray-800'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };

  if (!state.utilisateur) {
    return (
      <Link
        to="/login"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Se connecter
      </Link>
    );
  }

  const userId = state.utilisateur.uid;
  const hasImageError = imageError[userId];

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
          {state.utilisateur.photoURL && !hasImageError ? (
            <img
              src={state.utilisateur.photoURL}
              alt={state.utilisateur.displayName}
              className="w-full h-full object-cover"
              onError={() => handleImageError(userId)}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-600">
              <span className="text-white text-sm font-medium">
                {state.utilisateur.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">
            {state.utilisateur.displayName}
          </p>
          <p className="text-xs text-gray-500">{getRoleLabel(state.utilisateur.role)}</p>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                {state.utilisateur.photoURL && !hasImageError ? (
                  <img
                    src={state.utilisateur.photoURL}
                    alt={state.utilisateur.displayName}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(userId)}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-600">
                    <span className="text-white font-medium">
                      {state.utilisateur.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {state.utilisateur.displayName}
                </p>
                <p className="text-sm text-gray-500">{state.utilisateur.email}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getRoleColor(state.utilisateur.role)}`}>
                  {getRoleLabel(state.utilisateur.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Dashboard (Admin/Gestionnaire) */}
            {(state.utilisateur.role === 'admin' || state.utilisateur.role === 'gestionnaire') && (
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4 mr-3" />
                Tableau de bord
              </Link>
            )}

            {/* Profile */}
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-3" />
              Mon profil
            </Link>

            {/* Settings */}
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-3" />
              Paramètres
            </Link>

            {/* Donations (Donateur) */}
            {state.utilisateur.role === 'donateur' && (
              <Link
                to="/donations"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <CreditCard className="w-4 h-4 mr-3" />
                Mes donations
              </Link>
            )}

            {/* Bénévolat (Bénévole) */}
            {state.utilisateur.role === 'benevole' && (
              <Link
                to="/benevolat"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="w-4 h-4 mr-3" />
                Mon bénévolat
              </Link>
            )}

            {/* Formations */}
            {(state.utilisateur.role === 'benevole' || state.utilisateur.role === 'donateur') && (
              <Link
                to="/formations"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <BookOpen className="w-4 h-4 mr-3" />
                Mes formations
              </Link>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
