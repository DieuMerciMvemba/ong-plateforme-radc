import React from 'react';
import { domainesIntervention, projets, temoignages } from '../data';
import Hero from '../components/Hero';
import DomainesCard from '../components/DomainesCard';
import ProjetsGrid from '../components/ProjetsGrid';
import Temoignages from '../components/Temoignages';

const Accueil: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Domaines d'Intervention */}
      <DomainesCard 
        domaines={domainesIntervention}
        limit={6}
      />

      {/* Projets Récents */}
      <ProjetsGrid 
        projets={projets}
        limit={3}
      />

      {/* Témoignages */}
      <Temoignages 
        temoignages={temoignages}
        limit={3}
      />
    </div>
  );
};

export default Accueil;
