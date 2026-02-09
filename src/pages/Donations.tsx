import React, { useState } from 'react';
import DonationForm from '../components/donations/DonationForm';
import { Heart, Target, Users, Shield, Award, TrendingUp } from 'lucide-react';

const Donations: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const handleDonationSuccess = () => {
    setDonationSuccess(true);
    setShowForm(false);
    setTimeout(() => setDonationSuccess(false), 5000);
  };

  const impactData = [
    {
      icon: <Users className="w-8 h-8" />,
      nombre: "15,420+",
      description: "Bénéficiaires directs",
      detail: "Personnes aidées chaque année"
    },
    {
      icon: <Target className="w-8 h-8" />,
      nombre: "47",
      description: "Projets actifs",
      detail: "Interventions sur le terrain"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      nombre: "100%",
      description: "Transparence",
      detail: "Chaque euro tracé"
    },
    {
      icon: <Award className="w-8 h-8" />,
      nombre: "15",
      description: "Années d'expérience",
      detail: "Au service des communautés"
    }
  ];

  const niveauxDon = [
    {
      niveau: "Bronze",
      seuil: "50€ - 499€",
      couleur: "bg-amber-100 text-amber-800",
      avantages: [
        "Reçu fiscal automatique",
        "Newsletter mensuelle",
        "Accès aux rapports d'impact"
      ]
    },
    {
      niveau: "Silver",
      seuil: "500€ - 999€",
      couleur: "bg-gray-100 text-gray-800",
      avantages: [
        "Avantages Bronze +",
        "Badge Silver exclusif",
        "Invitation aux événements",
        "Rapports détaillés personnalisés"
      ]
    },
    {
      niveau: "Gold",
      seuil: "1,000€ - 4,999€",
      couleur: "bg-yellow-100 text-yellow-800",
      avantages: [
        "Avantages Silver +",
        "Badge Gold premium",
        "Rencontre avec l'équipe",
        "Visites de projets sur le terrain"
      ]
    },
    {
      niveau: "Platinum",
      seuil: "5,000€+",
      couleur: "bg-purple-100 text-purple-800",
      avantages: [
        "Avantages Gold +",
        "Badge Platinum VIP",
        "Conseil consultatif",
        "Impact personnalisé sur mesure"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Faire un Don à RADC
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Chaque contribution transforme des vies. Ensemble, construisons un avenir meilleur 
            pour les communautés les plus vulnérables.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
          >
            Faire un don maintenant
          </button>
        </div>
      </div>

      {/* Message de succès */}
      {donationSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 z-50 max-w-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">
                Merci pour votre générosité ! Votre donation a été enregistrée avec succès.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Impact */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez comment vos donations transforment réellement des vies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactData.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.nombre}</h3>
                <p className="text-lg font-semibold text-gray-800 mb-1">{item.description}</p>
                <p className="text-sm text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Niveaux de donation */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Niveaux de Donation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Rejoignez notre communauté de donateurs et bénéficiez d'avantages exclusifs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {niveauxDon.map((niveau, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${niveau.couleur} mb-4`}>
                  {niveau.niveau}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{niveau.seuil}</h3>
                <ul className="space-y-2">
                  {niveau.avantages.map((avantage, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {avantage}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Méthodes de paiement */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Méthodes de Paiement</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choisissez la méthode qui vous convient le mieux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="bg-blue-100 rounded-lg p-4 mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Carte bancaire</h3>
              <p className="text-gray-600 mb-4">
                Paiement sécurisé via Stripe. Visa, Mastercard, American Express acceptées.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sécurité SSL</li>
                <li>• Paiement instantané</li>
                <li>• Reçu immédiat</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="bg-yellow-100 rounded-lg p-4 mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 2.419c.067-.39.397-.643.747-.568l1.57.348c.35.075.565.44.498.83l-2.865 16.23h2.902c.36 0 .65.325.65.725v.328c0 .4-.29.725-.65.725z"/>
                  <path d="M18.613 21.337h4.605a.641.641 0 00.633-.74l-3.106-18.178c-.067-.39-.397-.643-.747-.568l-1.57.348c-.35.075-.565.44-.498.83l2.865 16.23h-2.902c-.36 0-.65.325-.65.725v.328c0 .4.29.725.65.725z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">PayPal</h3>
              <p className="text-gray-600 mb-4">
                Paiement rapide et sécurisé via votre compte PayPal.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Compte PayPal</li>
                <li>• Carte via PayPal</li>
                <li>• Protection acheteur</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="bg-green-100 rounded-lg p-4 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Virement / Espèces</h3>
              <p className="text-gray-600 mb-4">
                Virement bancaire ou donation en espèces au bureau RADC.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Virement bancaire</li>
                <li>• Espèces au bureau</li>
                <li>• Chèque bancaire</li>
                <li>• Mobile Money</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Prêt à faire la différence ?</h2>
          <p className="text-xl mb-8">
            Votre donation, quelle que soit sa taille, a un impact réel et mesurable.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
          >
            Faire un don maintenant
          </button>
        </div>
      </div>

      {/* Formulaire de donation */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Faire un don</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <DonationForm onSuccess={handleDonationSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations;
