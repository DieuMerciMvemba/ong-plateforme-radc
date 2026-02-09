import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from './components/Header';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Domaines from './pages/Domaines';
import Projets from './pages/Projets';
import APropos from './pages/APropos';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Donations from './pages/Donations';
import CommunautePage from './pages/Communaute';
import Formations from './pages/Formations';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Profile from './pages/Profile';
import DashboardRoutes from './components/dashboard/DashboardRoutes';

// Configuration Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Composant pour gérer le layout conditionnel
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header seulement pour les pages non-dashboard */}
      {!isDashboard && <Header />}
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/domaines" element={<Domaines />} />
          <Route path="/projets" element={<Projets />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/communaute" element={<CommunautePage />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Article />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
          
          {/* Routes protégées */}
          
        </Routes>
      </main>
      
      {/* Footer seulement pour les pages non-dashboard */}
      {!isDashboard && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Router>
          <AppLayout />
        </Router>
      </Elements>
    </AuthProvider>
  );
};

export default App;
