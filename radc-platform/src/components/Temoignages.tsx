import React from 'react';
import { Quote, Star } from 'lucide-react';
import type { temoignage } from '../types';

interface TemoignagesProps {
  temoignages: temoignage[];
  title?: string;
  subtitle?: string;
  limit?: number;
}

const Temoignages: React.FC<TemoignagesProps> = ({ 
  temoignages, 
  title = "Témoignages", 
  subtitle = "Ce que les gens et nos partenaires disent de notre impact dans divers domaines",
  limit = 3 
}) => {
  const renderStars = (note: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

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

        {/* Temoignages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {temoignages.slice(0, limit).map((temoignage) => (
            <div
              key={temoignage.id}
              className="bg-white rounded-xl p-6 shadow-lg radc-card-hover border border-gray-100"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-blue-600" />
              </div>

              {/* Temoignage */}
              <blockquote className="text-gray-700 mb-6 italic line-clamp-4">
                "{temoignage.temoignage}"
              </blockquote>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {renderStars(temoignage.note)}
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                {temoignage.photo ? (
                  <img
                    src={temoignage.photo}
                    alt={temoignage.nom}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {temoignage.nom.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Name and Position */}
                <div>
                  <h4 className="font-bold text-gray-900">
                    {temoignage.nom}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {temoignage.poste}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        {temoignages.length > limit && (
          <div className="text-center mt-8">
            <button className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              <span>Voir tous les témoignages</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Temoignages;
