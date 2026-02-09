import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import UserMenu from './auth/UserMenu';

// Interfaces pour la navigation
interface SubNavigationItem {
  label: string;
  href: string;
}

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  type: 'link' | 'dropdown';
  items?: SubNavigationItem[];
}

// Configuration de la navigation
const navigationItems: NavigationItem[] = [
  {
    id: 'accueil',
    label: 'Accueil',
    href: '/',
    type: 'link'
  },
  {
    id: 'actions',
    label: 'Actions',
    type: 'dropdown',
    items: [
      { label: 'Domaines', href: '/domaines' },
      { label: 'Projets', href: '/projets' },
      { label: 'Formations', href: '/formations' },
      { label: 'Communauté', href: '/communaute' }
    ]
  },
  {
    id: 'blog',
    label: 'Blog',
    href: '/blog',
    type: 'link'
  },
  {
    id: 'about',
    label: 'À propos',
    href: '/a-propos',
    type: 'link'
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '/contact',
    type: 'link'
  }
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleDropdownToggle = (itemId: string) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <img 
              src="/logo-header.png" 
              alt="RADC Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <span className={`font-bold text-xl transition-colors group-hover:text-blue-600 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              RADC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Navigation principale organisée */}
            {navigationItems.map((item) => (
              <div key={item.id} className="relative">
                {item.type === 'dropdown' ? (
                  <div>
                    <button
                      onMouseEnter={() => handleDropdownToggle(item.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 ${
                        isScrolled ? 'text-gray-700' : 'text-white hover:text-blue-600'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${
                        activeDropdown === item.id ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === item.id && (
                      <div
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                        onMouseEnter={() => setActiveDropdown(item.id)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="py-2">
                          {item.items?.map((subItem) => (
                            <Link
                              key={subItem.href}
                              to={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  item.href ? (
                    <Link
                      to={item.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 ${
                        isScrolled ? 'text-gray-700' : 'text-white hover:text-blue-600'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : null
                )}
              </div>
            ))}

            {/* Donation Button */}
            <Link
              to="/donations"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium ml-4"
            >
              Faire un don
            </Link>
            
            {/* User Menu */}
            <UserMenu />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Overlay avec animation */}
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-in-out lg:hidden"
            onClick={() => setIsMenuOpen(false)}
            style={{
              animation: isMenuOpen ? 'fade-in 0.3s ease-out' : 'fade-in 0.3s ease-out reverse'
            }}
          />

          {/* Menu mobile avec animation */}
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out sm:max-w-sm lg:hidden">
            <div className="flex min-h-full flex-col">
              {/* Header mobile */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                    <span className="text-xl font-bold text-blue-600">RADC</span>
                  </Link>
                </div>
                <button
                  type="button"
                  className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation mobile organisée */}
              <div className="space-y-2">
                {/* Liens principaux */}
                <div className="space-y-1">
                  <Link
                    to="/"
                    className="block rounded-lg px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Accueil
                  </Link>

                  {/* Section Actions */}
                  <div className="border-t border-gray-200 pt-2 mt-4">
                    <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Actions
                    </div>
                    <Link
                      to="/domaines"
                      className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors ml-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Domaines
                    </Link>
                    <Link
                      to="/projets"
                      className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors ml-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Projets
                    </Link>
                    <Link
                      to="/formations"
                      className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors ml-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Formations
                    </Link>
                    <Link
                      to="/communaute"
                      className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors ml-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Communauté
                    </Link>
                  </div>

                  <Link
                    to="/blog"
                    className="block rounded-lg px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    to="/a-propos"
                    className="block rounded-lg px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    À propos
                  </Link>
                  <Link
                    to="/contact"
                    className="block rounded-lg px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </div>

              {/* Footer mobile avec bouton don */}
              <div className="border-t border-gray-200 p-4">
                <Link
                  to="/donations"
                  className="flex w-full items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Faire un don
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
