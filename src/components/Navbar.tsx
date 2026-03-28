import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Journal', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Globe className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-serif italic tracking-tight text-[#1A1A1A]">NomadBudget</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                  location.pathname === link.path ? 'text-[#1A1A1A]' : 'text-gray-400 hover:text-[#1A1A1A]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/" 
              className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Search
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-[#1A1A1A]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`block text-lg font-serif italic ${
                    location.pathname === link.path ? 'text-[#1A1A1A]' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/" 
                className="block bg-[#1A1A1A] text-white px-6 py-4 rounded-xl text-center font-bold uppercase tracking-widest"
              >
                Search Destinations
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
