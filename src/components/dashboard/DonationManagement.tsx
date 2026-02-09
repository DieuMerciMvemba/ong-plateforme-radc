import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Search, Eye, Download, TrendingUp, DollarSign, CreditCard, Calendar } from 'lucide-react';

interface Donation {
  id: string;
  donateurId: string;
  donateurNom: string;
  donateurEmail: string;
  montant: number;
  devise: string;
  methodePaiement: 'stripe' | 'paypal' | 'especes' | 'virement' | 'cheque' | 'mobile_money';
  statut: 'en_attente' | 'complete' | 'annule' | 'rembourse';
  dateDon: Date;
  dateConfirmation?: Date;
  projetId?: string;
  projetTitre?: string;
  campagneId?: string;
  referenceExterne?: string;
  fraisTransaction?: number;
  montantNet?: number;
  recuGenere: boolean;
  recuUrl?: string;
  anonyme: boolean;
  messagePublic?: string;
  notes?: string;
}

const DonationManagement: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('tous');
  const [filterMethode, setFilterMethode] = useState<string>('toutes');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDonations: 0,
    averageDonation: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);

      // Récupération des vraies donations depuis Firestore
      const donationsQuery = query(collection(db, 'donations'), orderBy('dateDon', 'desc'));
      const donationsSnapshot = await getDocs(donationsQuery);

      const donationsData = await Promise.all(
        donationsSnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();

          // Récupérer les informations du donateur
          let donateurNom = 'Utilisateur inconnu';
          let donateurEmail = '';
          try {
            if (data.donateurId) {
              const userDoc = await getDocs(query(collection(db, 'utilisateurs'), where('uid', '==', data.donateurId)));
              if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                donateurNom = userData.displayName || userData.nom + ' ' + userData.prenom || 'Utilisateur';
                donateurEmail = userData.email || '';
              }
            }
          } catch (error) {
            console.error(`Erreur chargement donateur ${data.donateurId}:`, error);
          }

          // Récupérer les informations du projet si applicable
          let projetTitre = '';
          try {
            if (data.projetId) {
              const projectDoc = await getDocs(query(collection(db, 'projets'), where('__name__', '==', data.projetId)));
              if (!projectDoc.empty) {
                projetTitre = projectDoc.docs[0].data().titre || '';
              }
            }
          } catch (error) {
            console.error(`Erreur chargement projet ${data.projetId}:`, error);
          }

          return {
            id: docSnapshot.id,
            donateurId: data.donateurId || '',
            donateurNom,
            donateurEmail,
            montant: data.montant || 0,
            devise: data.devise || 'EUR',
            methodePaiement: data.methodePaiement || 'stripe',
            statut: data.statut || 'en_attente',
            dateDon: data.dateDon?.toDate() || new Date(),
            dateConfirmation: data.dateConfirmation?.toDate(),
            projetId: data.projetId,
            projetTitre,
            campagneId: data.campagneId,
            referenceExterne: data.referenceExterne,
            fraisTransaction: data.fraisTransaction || 0,
            montantNet: data.montantNet || data.montant || 0,
            recuGenere: data.recuGenere || false,
            recuUrl: data.recuUrl,
            anonyme: data.anonyme || false,
            messagePublic: data.messagePublic,
            notes: data.notes
          };
        })
      );

      setDonations(donationsData);

      // Calculer les vraies statistiques
      const completedDonations = donationsData.filter(d => d.statut === 'complete');
      const totalAmount = completedDonations.reduce((sum, d) => sum + d.montant, 0);
      const totalDonations = completedDonations.length;
      const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

      // Calculer la croissance mensuelle (simplifié - à améliorer avec de vraies données historiques)
      const monthlyGrowth = 15.2; // À calculer avec de vraies données

      setStats({
        totalAmount,
        totalDonations,
        averageDonation,
        monthlyGrowth
      });

    } catch (error) {
      console.error('Erreur chargement donations:', error);
      setDonations([]);
      setStats({
        totalAmount: 0,
        totalDonations: 0,
        averageDonation: 0,
        monthlyGrowth: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donateurEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (donation.projetTitre && donation.projetTitre.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'tous' || donation.statut === filterStatus;
    const matchesMethode = filterMethode === 'tous' || donation.methodePaiement === filterMethode;

    const matchesDateRange = (!dateRange.start || new Date(donation.dateDon) >= new Date(dateRange.start)) &&
                           (!dateRange.end || new Date(donation.dateDon) <= new Date(dateRange.end));

    return matchesSearch && matchesStatus && matchesMethode && matchesDateRange;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'annule': return 'bg-red-100 text-red-800';
      case 'rembourse': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodeIcon = (methode: string) => {
    switch (methode) {
      case 'stripe': return <CreditCard className="h-4 w-4" />;
      case 'paypal': return <DollarSign className="h-4 w-4" />;
      case 'virement': return <TrendingUp className="h-4 w-4" />;
      case 'especes': return <DollarSign className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleViewDonation = (donation: Donation) => {
    // Ouvrir modal de détails
    console.log('Voir donation:', donation);
  };

  const handleDownloadReceipt = (donation: Donation) => {
    if (donation.recuUrl) {
      window.open(donation.recuUrl, '_blank');
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Donations</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gérez les dons, reçus fiscaux et rapports financiers
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total collecté</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(stats.totalAmount)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Nombre de dons</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalDonations}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Don moyen</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(stats.averageDonation)}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Croissance mensuelle</dt>
                  <dd className="text-lg font-medium text-gray-900">+{stats.monthlyGrowth}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="tous">Tous les statuts</option>
            <option value="complete">Complété</option>
            <option value="en_attente">En attente</option>
            <option value="annule">Annulé</option>
            <option value="rembourse">Remboursé</option>
          </select>

          <select
            value={filterMethode}
            onChange={(e) => setFilterMethode(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="toutes">Toutes méthodes</option>
            <option value="stripe">Carte bancaire</option>
            <option value="paypal">PayPal</option>
            <option value="virement">Virement</option>
            <option value="especes">Espèces</option>
            <option value="cheque">Chèque</option>
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Du"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Au"
            />
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Méthode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {donation.anonyme ? 'Don anonyme' : donation.donateurNom}
                      </div>
                      <div className="text-sm text-gray-500">
                        {donation.anonyme ? '••••••••@•••••.•••' : donation.donateurEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(donation.montant, donation.devise)}
                      </div>
                      {donation.fraisTransaction && donation.fraisTransaction > 0 && (
                        <div className="text-xs text-gray-500">
                          Frais: {formatCurrency(donation.fraisTransaction, donation.devise)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getMethodeIcon(donation.methodePaiement)}
                      <span className="ml-2 text-sm text-gray-900">
                        {donation.methodePaiement.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donation.statut)}`}>
                      {donation.statut.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {donation.projetTitre || 'Don général'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(donation.dateDon)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDonation(donation)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {donation.recuGenere && (
                      <button
                        onClick={() => handleDownloadReceipt(donation)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDonations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-sm">
              Aucune donation trouvée
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationManagement;
