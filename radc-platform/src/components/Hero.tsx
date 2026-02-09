import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Users, Target } from 'lucide-react';
import { appelsAction } from '../data';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      titre: "Bienvenue chez RADC",
      description: "RADC s'engage pour le développement durable et l'amélioration des conditions de vie. Rejoignez-nous pour un changement positif.",
      image: "/medias/evenements/conference-hygiene-menstruelle-01.jpg",
      icone: <Users className="w-8 h-8" />
    },
    {
      id: 2,
      titre: "Nos Objectifs",
      description: "Nous œuvrons pour l'environnement, le développement social et économique, et soutenons les droits de l'homme.",
      image: "/medias/projets/assainissement-mbanza-lemba-01.jpg",
      icone: <Target className="w-8 h-8" />
    },
    {
      id: 3,
      titre: "Engagement Communautaire",
      description: "RADC agit dans l'éducation, la santé et l'entreprenariat pour construire un avenir meilleur.",
      image: "/medias/formations/decoration-evenementielle-01.jpg",
      icone: <Play className="w-8 h-8" />
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <img 
                src="/logo-hero.png" 
                alt="RADC Logo" 
                className="w-16 h-16 rounded-xl shadow-2xl"
              />
            </div>

            {/* Title */}
            <h1 className="display-font text-4xl md:text-6xl font-bold text-white mb-6 fade-in">
              {slides[currentSlide].titre}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto fade-in">
              {slides[currentSlide].description}
            </p>

            {/* CTA Button */}
            <div className="fade-in">
              <button className="group inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <span>En Savoir Plus</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Call to Action Banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-green-600 p-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 md:mb-0">
              <h3 className="font-bold text-lg">{appelsAction[0].titre}</h3>
              <p className="text-white/90 text-sm">{appelsAction[0].message}</p>
            </div>
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold transition-colors">
              {appelsAction[0].action}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
