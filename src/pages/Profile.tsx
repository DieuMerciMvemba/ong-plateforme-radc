import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { User, Mail, Calendar, Shield } from 'lucide-react';

const Profile: React.FC = () => {
  const { state } = useAuth();

  // Rediriger vers login si non connecté
  if (!state.estAuthentifie) {
    return <Navigate to="/login" replace />;
  }

  const utilisateur = state.utilisateur;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-white">
                  {utilisateur?.displayName || utilisateur?.email}
                </h1>
                <p className="text-blue-100">
                  Membre de la communauté RADC
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informations personnelles */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations personnelles
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="text-sm font-medium text-gray-900">
                        {utilisateur?.displayName || utilisateur?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {utilisateur?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Membre depuis</p>
                      <p className="text-sm font-medium text-gray-900">
                        {utilisateur?.dateInscription ? new Date(utilisateur.dateInscription).toLocaleDateString('fr-FR') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Rôle</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {utilisateur?.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions rapides
                </h2>
                <div className="space-y-3">
                  {utilisateur?.role === 'admin' || utilisateur?.role === 'gestionnaire' ? (
                    <a
                      href="/dashboard"
                      className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
                    >
                      Accéder au tableau de bord
                    </a>
                  ) : null}

                  <button className="block w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors">
                    Modifier mon profil
                  </button>

                  <button className="block w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors">
                    Mes donations
                  </button>

                  <button className="block w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors">
                    Mes formations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
