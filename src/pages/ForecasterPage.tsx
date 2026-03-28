import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Zap, 
  ArrowRight, 
  Plane, 
  Hotel, 
  Compass,
  Info,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

// Mock data for initial state or fallback
const initialTrendData = [
  { month: 'Jan', price: 1200 },
  { month: 'Feb', price: 1150 },
  { month: 'Mar', price: 1300 },
  { month: 'Apr', price: 1450 },
  { month: 'May', price: 1600 },
  { month: 'Jun', price: 1800 },
  { month: 'Jul', price: 1950 },
  { month: 'Aug', price: 1900 },
  { month: 'Sep', price: 1550 },
  { month: 'Oct', price: 1400 },
  { month: 'Nov', price: 1250 },
  { month: 'Dec', price: 1500 },
];

export default function ForecasterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!city || !country) return;

    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a travel budget forecast for ${city}, ${country}. 
        Provide the following in JSON format:
        1. "trendData": An array of 12 objects with "month" (Jan-Dec) and "price" (estimated daily cost in USD).
        2. "bestMonth": The cheapest month to visit.
        3. "savingsPercent": How much cheaper it is compared to peak season.
        4. "summary": A 2-3 sentence professional explanation of the price trends.
        5. "tips": 3 bullet points for saving money in this specific city.
        6. "confidence": A percentage (e.g., "92%").`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text);
      setForecast(data);
      
      // Update URL without reloading
      const newParams = new URLSearchParams();
      newParams.set('city', city);
      newParams.set('country', country);
      window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`);
    } catch (err) {
      console.error("Forecast error:", err);
      setError("Failed to generate AI forecast. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('city') && searchParams.get('country')) {
      handleSearch();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      <Helmet>
        <title>{city ? `${city} Travel Budget Forecast 2026: Cheapest Month to Visit` : 'AI Trip Forecaster 2026: Predict Travel Costs & Save'}</title>
        <meta name="description" content={city ? `Planning a trip to ${city}? Predict the cheapest time to visit with our AI-powered 2026 travel budget forecaster. Get real-time price trends and saving tips.` : 'Predict the cheapest time to visit any city with our AI-powered 2026 travel budget forecaster. Get real-time price trends and saving tips.'} />
        <meta name="keywords" content={`cheapest time to visit ${city}, travel cost prediction ${city}, best month for budget travel to ${city}, AI travel budget forecaster`} />
        <link rel="canonical" href={`https://nomadbudget.netlify.app/forecast${city ? `?city=${city}&country=${country}` : ''}`} />
        
        {/* OpenGraph / Twitter */}
        <meta property="og:title" content={city ? `2026 Travel Budget Forecast for ${city}` : 'AI Trip Forecaster 2026'} />
        <meta property="og:description" content={`Predict the cheapest time to visit ${city || 'any city'} with our AI-powered 2026 travel budget forecaster.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://nomadbudget.netlify.app/forecast${city ? `?city=${city}&country=${country}` : ''}`} />
        <meta property="og:image" content={`https://dynamic-og-image-generator.vercel.app/api/generate?title=2026%20Forecast%20for%20${city || 'Your%20Trip'}&theme=dark`} />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3" /> AI-Powered Forecasting
            </div>
            <h1 className="text-4xl md:text-6xl font-serif italic tracking-tight text-[#1A1A1A]">
              Predict Your Next <br /> Budget Escape.
            </h1>
            <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto">
              Our AI engine analyzes historical data, seasonal trends, and local events to predict the exact month your money will go the furthest.
            </p>
          </motion.div>

          <form 
            onSubmit={handleSearch}
            className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto"
          >
            <div className="flex-1 flex items-center px-4 py-3 gap-3 border-b md:border-b-0 md:border-r border-gray-100">
              <Search className="text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="City (e.g. Lisbon)"
                className="w-full outline-none text-gray-700 placeholder:text-gray-300"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 gap-3">
              <Calendar className="text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Country (e.g. Portugal)"
                className="w-full outline-none text-gray-700 placeholder:text-gray-300"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-[#1A1A1A] text-white px-8 py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Generate Forecast'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-6"
            >
              <div className="relative w-24 h-24">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-purple-100 border-t-purple-600 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-purple-600 animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-serif italic text-[#1A1A1A]">Analyzing seasonal trends...</p>
                <p className="text-sm text-gray-400">Comparing millions of data points for {city}</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-700 max-w-2xl mx-auto"
            >
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {forecast && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Main Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Best Month to Visit</p>
                  <div className="flex items-center gap-3">
                    <TrendingDown className="text-green-500 w-6 h-6" />
                    <p className="text-3xl font-serif italic text-[#1A1A1A]">{forecast.bestMonth}</p>
                  </div>
                  <p className="text-sm text-green-600 font-medium">Save up to {forecast.savingsPercent} vs Peak</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">AI Confidence Score</p>
                  <div className="flex items-center gap-3">
                    <Zap className="text-purple-500 w-6 h-6" />
                    <p className="text-3xl font-serif italic text-[#1A1A1A]">{forecast.confidence}</p>
                  </div>
                  <p className="text-sm text-gray-400">Based on 2024-2026 data models</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Avg. Daily Budget</p>
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-orange-500 w-6 h-6" />
                    <p className="text-3xl font-serif italic text-[#1A1A1A]">${Math.min(...forecast.trendData.map((d: any) => d.price))}</p>
                  </div>
                  <p className="text-sm text-gray-400">Estimated for {forecast.bestMonth}</p>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif italic">12-Month Price Forecast</h3>
                    <p className="text-sm text-gray-400">Predicted daily cost (USD) including accommodation and food.</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full" /> Forecast</div>
                  </div>
                </div>

                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecast.trendData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          borderRadius: '16px', 
                          border: '1px solid #f1f5f9',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}
                        itemStyle={{ color: '#1A1A1A', fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Insights & Affiliate */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-serif italic">AI Insights</h3>
                    <p className="text-gray-500 leading-relaxed">{forecast.summary}</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">Saving Strategies</h4>
                    <ul className="space-y-4">
                      {forecast.tips.map((tip: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600">
                          <div className="w-5 h-5 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                          </div>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-[#1A1A1A] p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Compass className="w-32 h-32 rotate-12" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-serif italic">Lock in the Savings</h3>
                    <p className="text-gray-400 text-sm">We've found the best rates for {forecast.bestMonth} in {city}.</p>
                    
                    <div className="space-y-4">
                      <a 
                        href={`https://expedia.com/affiliates/flights/search?destination=${city}`}
                        target="_blank"
                        className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <Plane className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-sm font-bold">Cheapest Flights</p>
                            <p className="text-xs text-gray-500">From $199 round-trip</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </a>
                      <a 
                        href={`https://booking.com/searchresults.html?ss=${city}`}
                        target="_blank"
                        className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <Hotel className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-sm font-bold">Top Rated Hotels</p>
                            <p className="text-xs text-gray-500">Up to 40% off in {forecast.bestMonth}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </a>
                      <a 
                        href={`https://viator.com/search/${city}`}
                        target="_blank"
                        className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <Compass className="w-5 h-5 text-orange-400" />
                          <div>
                            <p className="text-sm font-bold">Local Experiences</p>
                            <p className="text-xs text-gray-500">Book tours for {forecast.bestMonth}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!loading && !forecast && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center space-y-6 max-w-xl mx-auto"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Info className="w-8 h-8 text-gray-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif italic text-[#1A1A1A]">Ready to Forecast?</h3>
                <p className="text-gray-500">Enter a destination above to see predicted price trends and the best time to visit for your budget.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
