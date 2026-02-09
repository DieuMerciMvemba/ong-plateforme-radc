import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Calendar, Target, Award, Heart, Shield, Building, CheckCircle } from 'lucide-react';
import { infosRADC, caracteristiques, atouts } from '../data';

const APropos: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              À Propos de RADC
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {infosRADC.objectifs.global}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                Depuis {infosRADC.statutJuridique.creation.split(' ')[2]}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                ONG Agréée
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                Impact National
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations Générales */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Présentation */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Qui Sommes-Nous ?
            </h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                {infosRADC.nom} est une organisation non gouvernementale dédiée au développement durable et communautaire en République Démocratique du Congo.
              </p>
              <p className="mb-4">
                Notre mission est de promouvoir le développement intégral des communautés à travers des interventions ciblées dans divers domaines essentiels à la vie quotidienne.
              </p>
              <p>
                Avec une approche participative et inclusive, nous œuvrons pour créer un impact durable et transformer positivement la vie des populations.
              </p>
            </div>
          </div>

          {/* Informations Légales */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Informations Légales
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <Building className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Nom Complet</h3>
                    <p className="text-gray-600">{infosRADC.nom}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Date de Création</h3>
                    <p className="text-gray-600">{infosRADC.statutJuridique.creation}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <Award className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Numéro d'Enregistrement</h3>
                    <p className="text-gray-600">{infosRADC.statutJuridique.enregistrement}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Personnalité Juridique</h3>
                    <p className="text-gray-600">{infosRADC.statutJuridique.personnaliteJuridique}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Objectifs */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Objectifs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des objectifs clairs pour un impact mesurable et durable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Objectif Global
              </h3>
              <p className="text-blue-800">
                {infosRADC.objectifs.global}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-green-900 mb-4">
                Objectifs Spécifiques
              </h3>
              <ul className="space-y-2 text-green-800">
                {infosRADC.objectifs.specifics.map((objectif, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{objectif}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Valeurs */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les principes qui guident notre action quotidienne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {infosRADC.valeurs.map((valeur, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{valeur.titre}</h3>
                <p className="text-gray-600 text-sm">
                  {valeur.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Caractéristiques */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Caractéristiques
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ce qui fait notre force et notre singularité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caracteristiques.map((caracteristique, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {caracteristique.titre}
                </h3>
                <p className="text-gray-600">
                  {caracteristique.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Atouts */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Nos Atouts Stratégiques
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Les avantages qui nous distinguent et garantissent notre succès
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {atouts.map((atout, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">{atout.titre}</h3>
                <p className="text-green-100">
                  {atout.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contactez-Nous
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous sommes à votre disposition pour toute information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Siège Social</h3>
              <p className="text-gray-600 text-sm">
                {infosRADC.siege.commune}, {infosRADC.siege.ville}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Téléphone</h3>
              <p className="text-gray-600">
                {infosRADC.coordonnees.telephone}<br />
                <span className="text-sm">Disponible 24h/24</span>
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                {infosRADC.coordonnees.email}<br />
                <span className="text-sm">Réponse sous 24h</span>
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Site Web</h3>
              <p className="text-gray-600">
                {infosRADC.coordonnees.siteWeb}<br />
                <span className="text-sm">Informations complètes</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Rejoignez Notre Mission
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contribuez au développement communautaire durable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Nous Contacter
              </Link>
              <Link
                to="/projets"
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-600"
              >
                Découvrir Nos Projets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APropos;
