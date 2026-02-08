import React, { useState, useEffect } from 'react';
import { DonationService } from '../../services/donationService';
import type { DonationStats, ImpactMetrics, Donation } from '../../types/donations';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Download,
  Filter,
  Search,
  Eye,
  FileText,
  Plus
} from 'lucide-react';

const DonationDashboard: React.FC = () => {
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [impact, setImpact] = useState<ImpactMetrics | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethode, setFilterMethode] = useState<string>('all');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [showManualForm, setShowManualForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [donationStats, impactMetrics] = await Promise.all([
        DonationService.getDonationStats(),
        DonationService.getImpactMetrics()
      ]);
      
      setStats(donationStats);
      setImpact(impactMetrics);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.referenceExterne?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donateurId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethode = filterMethode === 'all' || donation.methodePaiement === filterMethode;
    const matchesStatut = filterStatut === 'all' || donation.statut === filterStatut;
    
    return matchesSearch && matchesMethode && matchesStatut;
  });

  const getMethodeIcon = (methode: string) => {
    switch (methode) {
      case 'stripe': return <CreditCard className="w-4 h-4" />;
      case 'paypal': return <Smartphone className="w-4 h-4" />;
      case 'especes':
      case 'virement':
      case 'cheque':
      case 'mobile_money': return <Building2 className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getMethodeColor = (methode: string) => {
    switch (methode) {
      case 'stripe': return 'bg-blue-100 text-blue-800';
      case 'paypal': return 'bg-yellow-100 text-yellow-800';
      case 'especes': return 'bg-green-100 text-green-800';
      case 'virement': return 'bg-purple-100 text-purple-800';
      case 'cheque': return 'bg-orange-100 text-orange-800';
      case 'mobile_money': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'annule': return 'bg-red-100 text-red-800';
      case 'rembourse': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard des Donations</h1>
        <p className="text-gray-600">Suivi et gestion des donations en temps réel</p>
      </div>

      {/* Statistiques principales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.total.montant.toLocaleString('fr-FR')} €
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {stats.total.nombreDons} donations
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Aujourd'hui</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.aujourdHui.montant.toLocaleString('fr-FR')} €
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {stats.aujourdHui.nombreDons} donations
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Ce mois</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.ceMois.montant.toLocaleString('fr-FR')} €
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {stats.ceMois.nombreDons} donations
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 rounded-lg p-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Cette année</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats.cetteAnnee.montant.toLocaleString('fr-FR')} €
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {stats.cetteAnnee.nombreDons} donations
            </p>
          </div>
        </div>
      )}

      {/* Impact */}
      {impact && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Projets financés</h3>
            <p className="text-3xl font-bold">{impact.projetsFinances}</p>
            <p className="text-blue-100 mt-2">Projets actifs grâce à vos donations</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Bénéficiaires aidés</h3>
            <p className="text-3xl font-bold">{impact.beneficiairesAides.toLocaleString('fr-FR')}</p>
            <p className="text-green-100 mt-2">Personnes impactées directement</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Don moyen</h3>
            <p className="text-3xl font-bold">{impact.montantMoyen.toFixed(2)} €</p>
            <p className="text-purple-100 mt-2">Montant moyen par donation</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setShowManualForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un don manuel
          </button>
          
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exporter les données
          </button>
        </div>

        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterMethode}
            onChange={(e) => setFilterMethode(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les méthodes</option>
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="especes">Espèces</option>
            <option value="virement">Virement</option>
            <option value="cheque">Chèque</option>
            <option value="mobile_money">Mobile Money</option>
          </select>

          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="complete">Complété</option>
            <option value="en_attente">En attente</option>
            <option value="annule">Annulé</option>
            <option value="rembourse">Remboursé</option>
          </select>
        </div>
      </div>

      {/* Tableau des donations */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Dernières donations</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Aucune donation trouvée
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.dateDon.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.anonyme ? 'Anonyme' : donation.donateurId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {donation.montant.toLocaleString('fr-FR')} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getMethodeColor(donation.methodePaiement)}`}>
                        {getMethodeIcon(donation.methodePaiement)}
                        <span className="ml-1">{donation.methodePaiement}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(donation.statut)}`}>
                        {donation.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal pour donation manuelle - sera intégré plus tard */}
      {showManualForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Ajouter un don manuel</h3>
            <p className="text-gray-600 mb-4">
              Cette fonctionnalité sera disponible dans le composant DonationForm.
            </p>
            <button
              onClick={() => setShowManualForm(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDashboard;
