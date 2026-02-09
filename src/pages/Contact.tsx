import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Send, Clock, Users, MessageSquare, CheckCircle } from 'lucide-react';
import { infosRADC } from '../data';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: '',
    type: 'particulier' // particulier, entreprise, partenaire, autre
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi du formulaire
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: '',
        type: 'particulier'
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contactez-Nous
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Nous sommes à votre écoute pour toute question, suggestion ou collaboration
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                Réponse sous 24h
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                Support Multicanal
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                Disponible 7j/7
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Informations de Contact */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Informations de Contact
            </h2>
            
            <div className="space-y-6">
              {/* Siège Social */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Siège Social</h3>
                    <p className="text-gray-600">
                      {infosRADC.siege.commune}<br />
                      {infosRADC.siege.ville}<br />
                      République Démocratique du Congo
                    </p>
                  </div>
                </div>
              </div>

              {/* Téléphone */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-3 mr-4">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Téléphone</h3>
                    <p className="text-gray-600">
                      {infosRADC.coordonnees.telephone}<br />
                      <span className="text-sm">Disponible 24h/24</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-3 mr-4">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600">
                      {infosRADC.coordonnees.email}<br />
                      <span className="text-sm">Réponse sous 24h</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Site Web */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="bg-orange-100 rounded-full p-3 mr-4">
                    <Globe className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Site Web</h3>
                    <p className="text-gray-600">
                      {infosRADC.coordonnees.siteWeb}<br />
                      <span className="text-sm">Informations complètes</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">Horaires de Disponibilité</h3>
              </div>
              <div className="text-blue-800 space-y-1">
                <p>Lundi - Vendredi: 8h00 - 18h00</p>
                <p>Samedi: 9h00 - 16h00</p>
                <p>Dimanche: 10h00 - 14h00</p>
                <p className="text-sm mt-2">Urgences: 24h/24, 7j/7</p>
              </div>
            </div>
          </div>

          {/* Formulaire de Contact */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Envoyez-nous un Message
            </h2>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  Message Envoyé avec Succès!
                </h3>
                <p className="text-green-700">
                  Nous vous remercions pour votre message. Notre équipe vous répondra dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Type de Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de Contact *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="particulier">Particulier</option>
                      <option value="entreprise">Entreprise</option>
                      <option value="partenaire">Partenaire</option>
                      <option value="benevole">Bénévole</option>
                      <option value="presse">Presse</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom Complet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      placeholder="Votre nom complet"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="votre.email@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="+243 XXX XXX XXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Sujet */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleInputChange}
                    required
                    placeholder="Sujet de votre message"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Décrivez votre demande, question ou suggestion..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Bouton d'envoi */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Envoyer le Message
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 mt-4 text-center">
                  Les champs marqués d'un astérisque (*) sont obligatoires
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Section FAQ */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trouvez rapidement des réponses à vos questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Comment devenir bénévole?</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Contactez-nous via le formulaire en sélectionnant "Bénévole" comme type de contact. 
                Notre équipe vous contactera pour discuter des opportunités disponibles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Comment devenir partenaire?</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Les entreprises et organisations intéressées peuvent nous contacter en sélectionnant 
                "Partenaire". Nous proposons différents types de collaborations selon vos objectifs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Quel délai de réponse?</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Nous nous engageons à répondre à tous les messages dans un délai de 24 heures 
                ouvrables. Pour les urgences, contactez-nous directement par téléphone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
