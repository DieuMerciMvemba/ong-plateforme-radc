import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { navigationItems } from '../data';
import UserMenu from './auth/UserMenu';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            {navigationItems.map((item) => (
              <div key={item.id} className="relative">
                {item.sousItems ? (
                  <div className="relative">
                    <button
                      onClick={() => handleDropdownToggle(item.id)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 ${
                        isScrolled ? 'text-gray-700' : 'text-white hover:text-blue-600'
                      }`}
                    >
                      <span>{item.titre}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        activeDropdown === item.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {activeDropdown === item.id && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                        <div className="py-2">
                          {item.sousItems.map((subItem) => (
                            <Link
                              key={subItem.id}
                              to={subItem.lien}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            >
                              {subItem.titre}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.lien}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 ${
                      isScrolled ? 'text-gray-700' : 'text-white hover:text-blue-600'
                    }`}
                  >
                    {item.titre}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Donation Button */}
            <Link
              to="/donations"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
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
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            {navigationItems.map((item) => (
              <div key={item.id} className="mb-4">
                {item.sousItems ? (
                  <div>
                    <button
                      onClick={() => handleDropdownToggle(item.id)}
                      className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <span>{item.titre}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        activeDropdown === item.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {activeDropdown === item.id && (
                      <div className="mt-2 ml-4 space-y-2">
                        {item.sousItems.map((subItem) => (
                          <Link
                            key={subItem.id}
                            to={subItem.lien}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            {subItem.titre}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.lien}
                    className="block px-3 py-2 text-gray-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {item.titre}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Donation Link Mobile */}
            <div className="mb-4">
              <Link
                to="/donations"
                className="block px-3 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors text-center"
              >
                Faire un don
              </Link>
            </div>
            
            {/* User Menu Mobile */}
            <div className="mb-4">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
