import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Book, Heart, Briefcase, Palette, Users, Home, Shield, Droplet, Truck, Sprout, Wheat, Building, Mountain, TrendingUp, Gem } from 'lucide-react';
import type { DomaineIntervention } from '../types';

interface DomainesCardProps {
  domaines: DomaineIntervention[];
  title?: string;
  subtitle?: string;
  showAll?: boolean;
  limit?: number;
}

const DomainesCard: React.FC<DomainesCardProps> = ({ 
  domaines, 
  title = "Domaines d'Intervention", 
  subtitle = "RADC intervient dans tous les domaines de la vie quotidienne",
  showAll = true,
  limit = 6 
}) => {
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
      'trending-up': <TrendingUp className="w-8 h-8" />,
      gem: <Gem className="w-8 h-8" />
    };
    return iconMap[icone] || <Book className="w-8 h-8" />;
  };

  const getColorClasses = (couleur: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; hover: string } } = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', hover: 'hover:bg-red-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-200' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', hover: 'hover:bg-pink-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-200' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hover: 'hover:bg-indigo-200' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', hover: 'hover:bg-cyan-200' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', hover: 'hover:bg-yellow-200' },
      lime: { bg: 'bg-lime-100', text: 'text-lime-600', hover: 'hover:bg-lime-200' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-600', hover: 'hover:bg-amber-200' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-600', hover: 'hover:bg-gray-200' },
      stone: { bg: 'bg-stone-100', text: 'text-stone-600', hover: 'hover:bg-stone-200' },
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', hover: 'hover:bg-emerald-200' },
      slate: { bg: 'bg-slate-100', text: 'text-slate-600', hover: 'hover:bg-slate-200' }
    };
    return colorMap[couleur] || colorMap.blue;
  };

  const displayDomaines = showAll ? domaines : domaines.slice(0, limit);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="display-font text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Domaines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayDomaines.map((domaine) => {
            const colors = getColorClasses(domaine.couleur);
            return (
              <Link
                key={domaine.id}
                to={`/domaines/${domaine.id}`}
                className={`group p-6 rounded-xl bg-white shadow-lg radc-card-hover border border-gray-100`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {getIcon(domaine.icone)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {domaine.titre}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {domaine.description}
                </p>

                {/* Services */}
                {domaine.services && domaine.services.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {domaine.services.slice(0, 2).map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600">{service}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Arrow */}
                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  <span>En savoir plus</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Show All Button */}
        {!showAll && domaines.length > limit && (
          <div className="text-center">
            <Link
              to="/domaines"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              <span>Voir tous les domaines</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default DomainesCard;
