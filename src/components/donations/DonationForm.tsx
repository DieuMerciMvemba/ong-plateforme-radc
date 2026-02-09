import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { DonationService } from '../../services/donationService';
import { useAuth } from '../../contexts/AuthContext';
import type { Donation, ManualDonationForm } from '../../types/donations';
import { CreditCard, Smartphone, Building2, DollarSign, Shield } from 'lucide-react';

interface DonationFormProps {
  onSuccess?: (donation: Donation) => void;
  onError?: (error: string) => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ onSuccess, onError }) => {
  const { state } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [montant, setMontant] = useState(50);
  const [methodePaiement, setMethodePaiement] = useState<'stripe' | 'paypal' | 'manuel'>('stripe');
  const [isLoading, setIsLoading] = useState(false);
  const [recuFiscal, setRecuFiscal] = useState(true);
  const [anonyme, setAnonyme] = useState(false);
  const [messagePublic, setMessagePublic] = useState('');

  // Pour les dons manuels
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualForm, setManualForm] = useState<ManualDonationForm>({
    donateur: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      typeDonateur: 'particulier'
    },
    donation: {
      montant: 50,
      devise: 'EUR',
      methodePaiement: 'especes',
      dateDon: new Date(),
      recuFiscal: true,
      anonyme: false
    }
  });

  const montantsSuggeres = [10, 25, 50, 100, 250, 500];

  const handleStripePayment = async () => {
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Élément de carte non trouvé');

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: state.utilisateur?.displayName || 'Donateur anonyme',
          email: state.utilisateur?.email
        }
      });

      if (error) throw new Error(error.message);

      // Créer la donation dans Firestore
      const donationData: Omit<Donation, 'id' | 'dateDon'> = {
        donateurId: state.utilisateur?.uid || 'anonymous',
        montant,
        devise: 'EUR',
        methodePaiement: 'stripe',
        statut: 'complete',
        referenceExterne: paymentMethod.id,
        projetId: undefined,
        campagneId: undefined,
        recuGenere: false,
        fraisTransaction: montant * 0.029 + 0.25,
        recuFiscal,
        anonyme,
        messagePublic,
        periodicite: 'ponctuel'
      };

      const donationId = await DonationService.createDonation(donationData);
      
      if (onSuccess) {
        onSuccess({
          id: donationId,
          ...donationData,
          dateDon: new Date()
        });
      }
    } catch (error: any) {
      console.error('Erreur paiement Stripe:', error);
      if (onError) onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualDonation = async () => {
    setIsLoading(true);
    try {
      const formData = {
        ...manualForm,
        donation: {
          ...manualForm.donation,
          montant,
          projetId: undefined,
          campagneId: undefined,
          recuFiscal,
          anonyme,
          messagePublic
        }
      };

      const donationId = await DonationService.createManualDonation(formData);
      
      if (onSuccess) {
        onSuccess({
          id: donationId,
          ...formData.donation,
          donateurId: donationId,
          dateDon: new Date(),
          statut: 'complete',
          recuGenere: false
        });
      }
      
      setShowManualForm(false);
      // Reset form
      setManualForm({
        donateur: {
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          adresse: '',
          typeDonateur: 'particulier'
        },
        donation: {
          montant: 50,
          devise: 'EUR',
          methodePaiement: 'especes',
          dateDon: new Date(),
          recuFiscal: true,
          anonyme: false
        }
      });
    } catch (error: any) {
      console.error('Erreur donation manuelle:', error);
      if (onError) onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const paypalOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: 'EUR'
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Faire un don</h2>
          <p className="text-gray-600">Votre contribution fait une réelle différence</p>
        </div>

        {/* Montant */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Montant du don (€)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
            {montantsSuggeres.map((amount) => (
              <button
                key={amount}
                onClick={() => setMontant(amount)}
                className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                  montant === amount
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {amount}€
              </button>
            ))}
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              value={montant}
              onChange={(e) => setMontant(Number(e.target.value))}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Montant personnalisé"
              min="1"
            />
          </div>
        </div>

        {/* Méthode de paiement */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Méthode de paiement
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setMethodePaiement('stripe')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                methodePaiement === 'stripe'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Carte bancaire</span>
            </button>
            
            <button
              onClick={() => setMethodePaiement('paypal')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                methodePaiement === 'paypal'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Smartphone className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">PayPal</span>
            </button>
            
            <button
              onClick={() => setShowManualForm(true)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                methodePaiement === 'manuel'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building2 className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">En espèces/Virement</span>
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="recu-fiscal"
              checked={recuFiscal}
              onChange={(e) => setRecuFiscal(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="recu-fiscal" className="ml-2 text-sm text-gray-700">
              <Shield className="inline w-4 h-4 mr-1" />
              Je souhaite recevoir un reçu fiscal
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonyme"
              checked={anonyme}
              onChange={(e) => setAnonyme(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="anonyme" className="ml-2 text-sm text-gray-700">
              Je souhaite rester anonyme
            </label>
          </div>
        </div>

        {/* Message public */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message public (optionnel)
          </label>
          <textarea
            value={messagePublic}
            onChange={(e) => setMessagePublic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Partagez votre motivation..."
          />
        </div>

        {/* Formulaire Stripe */}
        {methodePaiement === 'stripe' && (
          <div className="mb-6">
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
            <button
              onClick={handleStripePayment}
              disabled={isLoading || !stripe}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Traitement en cours...
                </div>
              ) : (
                `Donner ${montant}€`
              )}
            </button>
          </div>
        )}

        {/* Formulaire PayPal */}
        {methodePaiement === 'paypal' && (
          <div className="mb-6">
            <PayPalScriptProvider options={paypalOptions}>
              <PayPalButtons
                style={{ layout: 'vertical' }}
                createOrder={(_, actions) => {
                  return actions.order.create({
                    intent: 'CAPTURE',
                    purchase_units: [{
                      amount: {
                        currency_code: 'EUR',
                        value: montant.toString()
                      }
                    }]
                  });
                }}
                onApprove={async (data, actions) => {
                  if (actions.order) {
                    await actions.order.capture();
                    // Traiter le succès PayPal
                    const donationData: Omit<Donation, 'id' | 'dateDon'> = {
                      donateurId: state.utilisateur?.uid || 'anonymous',
                      montant,
                      devise: 'EUR',
                      methodePaiement: 'paypal',
                      statut: 'complete',
                      referenceExterne: data.orderID,
                      projetId: undefined,
                      campagneId: undefined,
                      recuGenere: false,
                      fraisTransaction: montant * 0.034 + 0.35,
                      recuFiscal,
                      anonyme,
                      messagePublic,
                      periodicite: 'ponctuel'
                    };

                    const donationId = await DonationService.createDonation(donationData);
                    
                    if (onSuccess) {
                      onSuccess({
                        id: donationId,
                        ...donationData,
                        dateDon: new Date()
                      });
                    }
                  }
                }}
                onError={(err) => {
                  console.error('Erreur PayPal:', err);
                  if (onError) onError('Erreur lors du paiement PayPal');
                }}
              />
            </PayPalScriptProvider>
          </div>
        )}

        {/* Modal pour donation manuelle */}
        {showManualForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h3 className="text-2xl font-bold mb-6">Enregistrer un don manuel</h3>
              
              <div className="space-y-6">
                {/* Infos donateur */}
                <div>
                  <h4 className="font-medium mb-4">Informations du donateur</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input
                        type="text"
                        value={manualForm.donateur.nom}
                        onChange={(e) => setManualForm({
                          ...manualForm,
                          donateur: { ...manualForm.donateur, nom: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                      <input
                        type="text"
                        value={manualForm.donateur.prenom}
                        onChange={(e) => setManualForm({
                          ...manualForm,
                          donateur: { ...manualForm.donateur, prenom: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={manualForm.donateur.email}
                        onChange={(e) => setManualForm({
                          ...manualForm,
                          donateur: { ...manualForm.donateur, email: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        value={manualForm.donateur.telephone}
                        onChange={(e) => setManualForm({
                          ...manualForm,
                          donateur: { ...manualForm.donateur, telephone: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Méthode de paiement manuel */}
                <div>
                  <h4 className="font-medium mb-4">Méthode de paiement</h4>
                  <select
                    value={manualForm.donation.methodePaiement}
                    onChange={(e) => setManualForm({
                      ...manualForm,
                      donation: { 
                        ...manualForm.donation, 
                        methodePaiement: e.target.value as 'especes' | 'virement' | 'cheque' | 'mobile_money'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="especes">Espèces</option>
                    <option value="virement">Virement bancaire</option>
                    <option value="cheque">Chèque</option>
                    <option value="mobile_money">Mobile Money</option>
                  </select>
                </div>

                {/* Référence externe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Référence (optionnel)</label>
                  <input
                    type="text"
                    value={manualForm.donation.referenceExterne}
                    onChange={(e) => setManualForm({
                      ...manualForm,
                      donation: { ...manualForm.donation, referenceExterne: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Numéro de chèque, référence de virement..."
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={manualForm.donation.notes}
                    onChange={(e) => setManualForm({
                      ...manualForm,
                      donation: { ...manualForm.donation, notes: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Notes internes..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowManualForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleManualDonation}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Enregistrement...' : 'Enregistrer le don'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationForm;
