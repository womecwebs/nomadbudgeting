import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Search, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [footerCity, setFooterCity] = useState('');
  const [footerCountry, setFooterCountry] = useState('');

  const handleFooterSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (footerCity && footerCountry) {
      navigate(`/budget/${footerCountry.toLowerCase()}/${footerCity.toLowerCase()}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <h3 className="text-2xl font-serif italic tracking-tight">NomadBudget</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering digital nomads and budget travelers with real-time cost data and smart travel planning since 2024.
            </p>
            <form onSubmit={handleFooterSearch} className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Quick Search</p>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="City" 
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-8 pr-3 text-xs outline-none focus:border-gray-600 transition-colors"
                    value={footerCity}
                    onChange={(e) => setFooterCity(e.target.value)}
                    required
                  />
                </div>
                <div className="relative flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Country" 
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-lg py-2 px-3 text-xs outline-none focus:border-gray-600 transition-colors"
                    value={footerCountry}
                    onChange={(e) => setFooterCountry(e.target.value)}
                    required
                  />
                  <button type="submit" className="bg-white text-black p-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Column 2: Top Cities */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Top Destinations</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/budget/thailand/bangkok" className="hover:text-white transition-colors">Bangkok, Thailand</Link></li>
              <li><Link to="/budget/indonesia/bali" className="hover:text-white transition-colors">Bali, Indonesia</Link></li>
              <li><Link to="/budget/portugal/lisbon" className="hover:text-white transition-colors">Lisbon, Portugal</Link></li>
              <li><Link to="/budget/mexico/mexico-city" className="hover:text-white transition-colors">Mexico City, Mexico</Link></li>
              <li><Link to="/budget/vietnam/hanoi" className="hover:text-white transition-colors">Hanoi, Vietnam</Link></li>
            </ul>
          </div>

          {/* Column 3: Blog Categories */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Blog Categories</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/blog" className="hover:text-white transition-colors">Digital Nomad Tips</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Budget Guides</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Travel Hacks</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Hidden Gems</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Remote Work</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Support */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-500">
              &copy; {currentYear} NomadBudget. All rights reserved.
            </p>
            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl max-w-xl">
              <p className="text-[10px] text-gray-500 leading-relaxed italic">
                Disclaimer: We use affiliate links for Viator, Booking.com, Expedia, and others. We may earn a commission at no extra cost to you. This helps us keep the data free and accurate for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
