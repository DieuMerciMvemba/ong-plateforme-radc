import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Domaines from './pages/Domaines';
import Projets from './pages/Projets';
import APropos from './pages/APropos';
import Contact from './pages/Contact';
import Login from './pages/Login';
import DashboardPage from './pages/Dashboard';
import Donations from './pages/Donations';

// Configuration Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Accueil />} />
                <Route path="/domaines" element={<Domaines />} />
                <Route path="/projets" element={<Projets />} />
                <Route path="/a-propos" element={<APropos />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/donations" element={<Donations />} />
                
                {/* Routes protégées */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="admin" requiredPermission="dashboard_view">
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </Elements>
    </AuthProvider>
  );
};

export default App;
