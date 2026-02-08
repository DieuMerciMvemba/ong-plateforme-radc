import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Book, Heart, Briefcase, Palette, Users, Home, Shield, Droplet, Truck, Sprout, Wheat, Building, Mountain, TrendingUp, Gem } from 'lucide-react';
import { domainesIntervention } from '../data';

const Domaines: React.FC = () => {
  const getIcon = (icone: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      book: <Book className="w-8 h-8" />,
      heart: <Heart className="w-8 h-8" />,
      briefcase: <Briefcase className="w-8 h-8" />,
      palette: <Palette className="w-8 h-8" />,
      users: <Users className="w-8 h-8" />,
      home: <Home className="w-8 h-8" />,
      shield: <Shield className="w-8 h-8" />,
      droplet: <Droplet className="w-8 h-8" />,
      truck: <Truck className="w-8 h-8" />,
      sprout: <Sprout className="w-8 h-8" />,
      wheat: <Wheat className="w-8 h-8" />,
      building: <Building className="w-8 h-8" />,
      mountain: <Mountain className="w-8 h-8" />,
      trendingUp: <TrendingUp className="w-8 h-8" />,
      gem: <Gem className="w-8 h-8" />,
    };
    return iconMap[icone] || <Book className="w-8 h-8" />;
  };

  const getColorClasses = (couleur: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
    };
    return colorMap[couleur] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Domaines d'Intervention
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              RADC intervient dans tous les domaines de la vie quotidienne pour un développement durable et inclusif
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                15 Domaines d'Expertise
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                Impact National
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                Approche Intégrée
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Domaines Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {domainesIntervention.map((domaine) => {
            const colors = getColorClasses(domaine.couleur);
            return (
              <div
                key={domaine.id}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className={`p-6 ${colors.bg} ${colors.border} border-b`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.bg} mb-4`}>
                    <div className={colors.text}>
                      {getIcon(domaine.icone)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {domaine.titre}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {domaine.description}
                  </p>
                </div>
                
                <div className="p-6">
                  {domaine.services && domaine.services.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Services:</h4>
                      <ul className="space-y-1">
                        {domaine.services.map((service, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <ArrowRight className="w-3 h-3 mr-2 text-blue-500" />
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Domaine #{domaine.id}
                    </span>
                    <Link
                      to={`/projets?domaine=${domaine.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Voir les projets
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Rejoignez Notre Action
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Contribuez au développement communautaire dans votre domaine d'intérêt
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Nous Contacter
              </Link>
              <Link
                to="/projets"
                className="bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors border border-green-600"
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

export default Domaines;
