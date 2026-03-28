import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Globe, ArrowRight, Wallet, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

const destinations = [
  { city: 'Tokyo', country: 'Japan', img: 'https://picsum.photos/seed/tokyo/400/300' },
  { city: 'Paris', country: 'France', img: 'https://picsum.photos/seed/paris/400/300' },
  { city: 'Bali', country: 'Indonesia', img: 'https://picsum.photos/seed/bali/400/300' },
  { city: 'Lisbon', country: 'Portugal', img: 'https://picsum.photos/seed/lisbon/400/300' },
  { city: 'Bangkok', country: 'Thailand', img: 'https://picsum.photos/seed/bangkok/400/300' },
  { city: 'Mexico City', country: 'Mexico', img: 'https://picsum.photos/seed/mexicocity/400/300' },
  { city: 'Hanoi', country: 'Vietnam', img: 'https://picsum.photos/seed/hanoi/400/300' },
  { city: 'Berlin', country: 'Germany', img: 'https://picsum.photos/seed/berlin/400/300' },
  { city: 'Cape Town', country: 'South Africa', img: 'https://picsum.photos/seed/capetown/400/300' },
  { city: 'Buenos Aires', country: 'Argentina', img: 'https://picsum.photos/seed/buenosaires/400/300' },
  { city: 'Seoul', country: 'South Korea', img: 'https://picsum.photos/seed/seoul/400/300' },
  { city: 'Prague', country: 'Czech Republic', img: 'https://picsum.photos/seed/prague/400/300' },
  { city: 'Athens', country: 'Greece', img: 'https://picsum.photos/seed/athens/400/300' },
  { city: 'Chiang Mai', country: 'Thailand', img: 'https://picsum.photos/seed/chiangmai/400/300' },
  { city: 'Medellin', country: 'Colombia', img: 'https://picsum.photos/seed/medellin/400/300' },
];

const features = [
  {
    icon: <Zap className="w-8 h-8 text-orange-500" />,
    title: "Real-Time Cost Intelligence",
    description: "Stop relying on outdated blog posts. Our engine aggregates live data from thousands of local sources to give you the exact cost of a coffee, a bed, or a beer right now."
  },
  {
    icon: <Wallet className="w-8 h-8 text-green-500" />,
    title: "Smart Budget Personas",
    description: "Whether you're a shoestring backpacker, a mid-range digital nomad, or a luxury seeker, we tailor every calculation to your specific spending habits."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
    title: "Verified Value, No Hidden Fees",
    description: "We don't just show you prices; we find the best value for your journey. Our system scans thousands of local options to ensure you get the most competitive rates available, helping you stretch your budget further."
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
    title: "Generative Trip Planning",
    description: "Powered by advanced AI, NomadBudget predicts price fluctuations and suggests the optimal time to visit based on your financial constraints."
  }
];

export default function HomePage() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city && country) {
      navigate(`/budget/${country.toLowerCase()}/${city.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full text-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-[#1A1A1A]">
              NomadBudget
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-light max-w-xl mx-auto">
              Plan your next escape with real-time cost data for over 10,000 cities worldwide.
            </p>
          </div>

          <form 
            onSubmit={handleSearch}
            className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-4 py-3 gap-3 border-b md:border-b-0 md:border-r border-gray-100">
              <MapPin className="text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="City (e.g. Bangkok)"
                className="w-full outline-none text-gray-700 placeholder:text-gray-300"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 gap-3">
              <Globe className="text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Country (e.g. Thailand)"
                className="w-full outline-none text-gray-700 placeholder:text-gray-300"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit"
              className="bg-[#1A1A1A] text-white px-8 py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
            >
              Calculate <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </section>

      {/* Destination Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-32">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-serif italic">Trending Destinations</h2>
            <p className="text-gray-500">Curated by our community of budget experts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {destinations.map((dest, idx) => (
            <motion.button
              key={dest.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/budget/${dest.country.toLowerCase()}/${dest.city.toLowerCase()}`)}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img 
                src={dest.img} 
                alt={dest.city}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-4 left-4 text-white text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-70 mb-1">{dest.country}</p>
                <p className="text-lg font-serif italic">{dest.city}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Explanatory Sections */}
      <section className="bg-white py-32 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 space-y-40">
          {/* Section 1: Real-Time Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="text-5xl font-serif italic leading-tight text-[#1A1A1A]">
                Real-Time Cost <br /> Intelligence.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Stop relying on outdated blog posts from 2019. Our engine aggregates live data from thousands of local sources to give you the exact cost of a coffee, a bed, or a beer right now. We track inflation and exchange rates so you don't have to.
              </p>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  Live price tracking for 10,000+ cities
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  Daily exchange rate updates
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  Local inflation adjustments
                </li>
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square bg-[#FDFCFB] rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl"
            >
              <img src="https://picsum.photos/seed/data/800/800" alt="Data" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
            </motion.div>
          </div>

          {/* Section 2: Smart Personas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 relative aspect-square bg-[#FDFCFB] rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl"
            >
              <img src="https://picsum.photos/seed/persona/800/800" alt="Personas" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 space-y-8"
            >
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                <Wallet className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-5xl font-serif italic leading-tight text-[#1A1A1A]">
                Budgets That <br /> Match Your Vibe.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Whether you're a shoestring backpacker, a mid-range digital nomad, or a luxury seeker, we tailor every calculation to your specific spending habits. No more "one size fits all" travel estimates.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="font-bold text-[#1A1A1A]">Backpacker</p>
                  <p className="text-xs text-gray-500">Hostels & Street Food</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="font-bold text-[#1A1A1A]">Nomad</p>
                  <p className="text-xs text-gray-500">Co-living & Cafes</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Section 3: Verified Deals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-5xl font-serif italic leading-tight text-[#1A1A1A]">
                Verified Value, <br /> No Hidden Fees.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                We don't just show you prices; we find the best value for your journey. Our system scans thousands of local options to ensure you get the most competitive rates available, helping you stretch your budget further without compromising on the experience.
              </p>
              <div className="flex gap-4">
                <div className="px-6 py-3 bg-blue-50 text-blue-700 rounded-full text-sm font-bold uppercase tracking-widest">Best Rates</div>
                <div className="px-6 py-3 bg-blue-50 text-blue-700 rounded-full text-sm font-bold uppercase tracking-widest">Verified Value</div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square bg-[#FDFCFB] rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl"
            >
              <img src="https://picsum.photos/seed/deals/800/800" alt="Deals" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
            </motion.div>
          </div>

          {/* Section 4: AI Planning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 relative aspect-square bg-[#FDFCFB] rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl"
            >
              <img src="https://picsum.photos/seed/ai_plan/800/800" alt="AI" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 space-y-8"
            >
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-5xl font-serif italic leading-tight text-[#1A1A1A]">
                AI-Powered <br /> Trip Forecasting.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Powered by advanced AI, NomadBudget predicts price fluctuations and suggests the optimal time to visit based on your financial constraints. We help you plan for the future, not just the present.
              </p>
              <button 
                onClick={() => navigate('/forecast')}
                className="bg-[#1A1A1A] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-colors"
              >
                Explore AI Insights
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto bg-[#1A1A1A] rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">
              Ready to start your <br /> next adventure?
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-light">
              Join 50,000+ nomads who use our data to travel smarter, longer, and better.
            </p>
            <div className="pt-8">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white text-black px-10 py-5 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Plan My Trip Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
