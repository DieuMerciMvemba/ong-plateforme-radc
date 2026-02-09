import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Search, Edit, Trash2, UserPlus, Mail, Phone } from 'lucide-react';

interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'admin' | 'moderateur' | 'utilisateur';
  statut: 'actif' | 'inactif' | 'suspendu';
  dateCreation: Date;
  dernierConnexion?: Date;
  telephone?: string;
  adresse?: string;
  totalDonations?: number;
  nombreFormations?: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('tous');
  const [filterStatus, setFilterStatus] = useState<string>('tous');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Récupération des vrais utilisateurs depuis Firestore
      const usersQuery = query(collection(db, 'utilisateurs'), orderBy('dateInscription', 'desc'));
      const usersSnapshot = await getDocs(usersQuery);

      const usersData = await Promise.all(
        usersSnapshot.docs.map(async (docSnapshot) => {
          const userData = docSnapshot.data();

          // Calculer les statistiques pour chaque utilisateur
          let totalDonations = 0;
          let nombreFormations = 0;

          try {
            // Comptage des donations de l'utilisateur
            const donationsQuery = query(
              collection(db, 'donations'),
              where('utilisateurId', '==', docSnapshot.id)
            );
            const donationsSnapshot = await getDocs(donationsQuery);
            donationsSnapshot.forEach((donationDoc) => {
              const donationData = donationDoc.data();
              if (donationData.montant) {
                totalDonations += donationData.montant;
              }
            });

            // Comptage des inscriptions aux formations
            const inscriptionsQuery = query(
              collection(db, 'inscriptions_formations'),
              where('utilisateurId', '==', docSnapshot.id)
            );
            const inscriptionsSnapshot = await getDocs(inscriptionsQuery);
            nombreFormations = inscriptionsSnapshot.size;
          } catch (error) {
            console.error(`Erreur chargement stats utilisateur ${docSnapshot.id}:`, error);
          }

          return {
            id: docSnapshot.id,
            email: userData.email || '',
            nom: userData.displayName?.split(' ')[1] || userData.nom || '',
            prenom: userData.displayName?.split(' ')[0] || userData.prenom || '',
            role: userData.role || 'visiteur',
            statut: userData.statut || 'actif',
            dateCreation: userData.dateInscription?.toDate() || new Date(),
            dernierConnexion: userData.dernierAcces?.toDate(),
            telephone: userData.telephone,
            adresse: userData.adresse,
            totalDonations,
            nombreFormations
          };
        })
      );

      setUsers(usersData);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.prenom} ${user.nom} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'tous' || user.role === filterRole;
    const matchesStatus = filterStatus === 'tous' || user.statut === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderateur': return 'bg-blue-100 text-blue-800';
      case 'utilisateur': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-yellow-100 text-yellow-800';
      case 'suspendu': return 'bg-red-100 text-red-800';
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

  const handleEditUser = (user: User) => {
    // TODO: Implémenter la modal d'édition
    console.log('Modifier utilisateur:', user);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        // Simuler la suppression
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Erreur suppression utilisateur:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gérez les utilisateurs, rôles et permissions
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau utilisateur
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
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="tous">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="moderateur">Modérateur</option>
            <option value="utilisateur">Utilisateur</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="tous">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="suspendu">Suspendu</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.prenom[0]}{user.nom[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.prenom} {user.nom}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                        {user.telephone && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.telephone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.statut)}`}>
                      {user.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.totalDonations ? `${user.totalDonations}€` : '0€'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.nombreFormations || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.dernierConnexion ? formatDate(user.dernierConnexion) : 'Jamais'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-sm">
              Aucun utilisateur trouvé
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Précédent
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Suivant
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredUsers.length}</span> sur{' '}
              <span className="font-medium">{filteredUsers.length}</span> résultats
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Précédent
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Suivant
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
