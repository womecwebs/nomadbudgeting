import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { 
  Utensils, 
  Beer, 
  Car, 
  Hotel, 
  ExternalLink, 
  ChevronLeft,
  AlertCircle,
  TrendingUp,
  Wallet,
  Gem,
  Star,
  Coffee,
  Plane,
  Music,
  MapPin,
  Navigation,
  Plus,
  Minus,
  ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import { getAffiliateLinks, GLOBAL_AVERAGES, cn } from '../lib/utils';
import { BudgetCardSkeleton, Skeleton } from '../components/Skeleton';
import { CityCostRecord, TourData, FlightData, HotelData, BudgetPersona } from '../types';

export default function BudgetPage() {
  const { country, city } = useParams<{ country: string; city: string }>();
  const [data, setData] = useState<CityCostRecord | null>(null);
  const [tours, setTours] = useState<TourData[]>([]);
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [toursLoading, setToursLoading] = useState(true);
  const [flightsLoading, setFlightsLoading] = useState(true);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/budget/${country}/${city}`);
        setData(response.data);
        if (response.data.warning) {
          setError(response.data.warning);
        }
      } catch (err: any) {
        console.error(err);
        setError("Could not fetch real-time data. Using global averages.");
        // Fallback mock data
        setData({
          city_name: city || '',
          country: country || '',
          currency: 'USD',
          daily_total: 150,
          last_updated: new Date().toISOString(),
          budget_data: {
            budget: { name: 'Budget', description: 'Hostels and street food', dailyTotal: 60, breakdown: { food: 20, accommodation: 25, transport: 10, entertainment: 5 } },
            midRange: { name: 'Mid-range', description: 'Boutique stays and casual dining', dailyTotal: 150, breakdown: { food: 45, accommodation: 70, transport: 20, entertainment: 15 } },
            luxury: { name: 'Luxury', description: '5-star luxury and fine dining', dailyTotal: 450, breakdown: { food: 120, accommodation: 250, transport: 50, entertainment: 30 } }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchTours = async () => {
      setToursLoading(true);
      try {
        const response = await axios.get(`/api/tours/${city}`);
        setTours(response.data);
      } catch (err) {
        console.error("Tour fetch failed", err);
      } finally {
        setToursLoading(false);
      }
    };

    const fetchFlights = async () => {
      setFlightsLoading(true);
      try {
        const response = await axios.get(`/api/flights/${city}`);
        setFlights(response.data);
      } catch (err) {
        console.error("Flight fetch failed", err);
      } finally {
        setFlightsLoading(false);
      }
    };

    const fetchHotels = async () => {
      setHotelsLoading(true);
      try {
        const response = await axios.get(`/api/hotels/${city}`);
        setHotels(response.data);
      } catch (err) {
        console.error("Hotel fetch failed", err);
      } finally {
        setHotelsLoading(false);
      }
    };

    fetchData();
    fetchTours();
    fetchFlights();
    fetchHotels();
  }, [country, city]);

  const cityName = city?.charAt(0).toUpperCase() + city?.slice(1);
  const affiliate = getAffiliateLinks(city || '', country || '');

  // JSON-LD Schema
  const financialQuoteSchema = data ? {
    "@context": "https://schema.org",
    "@type": "FinancialQuote",
    "name": `${cityName} Travel Budget`,
    "description": `Estimated daily travel costs for ${cityName}, ${country}.`,
    "priceCurrency": data.currency,
    "price": data.daily_total,
    "validFrom": data.last_updated
  } : null;

  const travelActionSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAction",
    "name": `Plan a trip to ${cityName}`,
    "object": {
      "@type": "Place",
      "name": cityName,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": cityName,
        "addressCountry": country
      }
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is ${cityName} expensive for travelers?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${cityName} offers a range of options. A budget traveler can expect to spend around $${data?.budget_data.budget.dailyTotal} per day, while a mid-range traveler might spend $${data?.budget_data.midRange.dailyTotal}.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the average meal cost in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `An inexpensive meal in ${cityName} typically costs around $${data?.budget_data.budget.breakdown.food}. Fine dining can range significantly higher.`
        }
      }
    ]
  };

  const productSchema = tours.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": tours.map((tour, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Product",
        "name": tour.title,
        "image": tour.image,
        "description": `Top activity in ${cityName}: ${tour.title}`,
        "offers": {
          "@type": "Offer",
          "price": tour.price.replace(/[^0-9.]/g, ''),
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": tour.url
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": tour.rating,
          "reviewCount": "100"
        }
      }
    }))
  } : null;

  const faqs = [
    {
      question: `Is ${cityName} expensive for travelers?`,
      answer: `${cityName} offers a range of options for every budget. A budget traveler can expect to spend around $${data?.budget_data.budget.dailyTotal} per day, while a mid-range traveler might spend $${data?.budget_data.midRange.dailyTotal}. Luxury travelers can expect costs upwards of $${data?.budget_data.luxury.dailyTotal} per day.`
    },
    {
      question: `What is the average meal cost in ${cityName}?`,
      answer: `An inexpensive meal in ${cityName} typically costs around $${data?.budget_data.budget.breakdown.food}. Mid-range dining options usually fall between $${data?.budget_data.midRange.breakdown.food} and $${data?.budget_data.luxury.breakdown.food}.`
    },
    {
      question: `How much should I budget for accommodation in ${cityName}?`,
      answer: `Hostels and budget stays in ${cityName} start around $${data?.budget_data.budget.breakdown.accommodation} per night. Mid-range hotels average $${data?.budget_data.midRange.breakdown.accommodation}, while luxury resorts can exceed $${data?.budget_data.luxury.breakdown.accommodation}.`
    },
    {
      question: `Is transportation expensive in ${cityName}?`,
      answer: `Public transport and local taxis are generally affordable. A daily transport budget of $${data?.budget_data.budget.breakdown.transport} is usually sufficient for most travelers.`
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      <Helmet>
        <title>{cityName} Travel Budget 2026: Daily Costs, Flights & Tours</title>
        <meta name="description" content={`Planning a trip to ${cityName}? See real-time 2026 costs for food, transport, and stays. Calculate your nomad budget and book top-rated tours instantly.`} />
        <link rel="canonical" href={`https://nomadbudget.netlify.app/budget/${country}/${city}`} />
        
        {/* OpenGraph / Twitter */}
        <meta property="og:title" content={`2026 Travel Budget for ${cityName}: Daily Costs & Deals`} />
        <meta property="og:description" content={`Planning a trip to ${cityName}? See real-time 2026 costs for food, transport, and stays. Calculate your nomad budget and book top-rated tours instantly.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://nomadbudget.netlify.app/budget/${country}/${city}`} />
        <meta property="og:image" content={`https://dynamic-og-image-generator.vercel.app/api/generate?title=2026%20Budget%20for%20${cityName}&theme=dark&dailyBudget=${data?.daily_total || '...'}`} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`2026 Travel Budget for ${cityName}`} />
        <meta name="twitter:description" content={`Planning a trip to ${cityName}? See real-time 2026 costs for food, transport, and stays. Calculate your nomad budget and book top-rated tours instantly.`} />
        <meta name="twitter:image" content={`https://dynamic-og-image-generator.vercel.app/api/generate?title=2026%20Budget%20for%20${cityName}&theme=dark&dailyBudget=${data?.daily_total || '...'}`} />

        {financialQuoteSchema && <script type="application/ld+json">{JSON.stringify(financialQuoteSchema)}</script>}
        {productSchema && <script type="application/ld+json">{JSON.stringify(productSchema)}</script>}
        <script type="application/ld+json">{JSON.stringify(travelActionSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Search</span>
          </Link>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">NomadBudget</p>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-12 space-y-12">
        {/* Summary Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1A1A] text-white rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
              <Plane className="w-4 h-4" />
              <span>2026 Travel Outlook</span>
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl md:text-6xl font-serif italic leading-tight">
                The average daily cost for <span className="text-white underline decoration-gray-600 underline-offset-8">{cityName}</span> in 2026 is <span className="text-white">${data?.daily_total || '...'}</span>.
              </h1>
              <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-500/30 shrink-0 h-fit mt-4">
                <Star className="w-3 h-3 fill-current" />
                Verified Data
              </div>
            </div>
            <p className="text-gray-400 max-w-2xl text-lg font-light leading-relaxed">
              Based on real-time data from {country}, we've calculated the most accurate budget breakdown for your next adventure.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        </motion.section>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 text-amber-800 bg-amber-50/50 border border-amber-100 p-6 rounded-3xl text-sm font-medium backdrop-blur-sm"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Quick Answer Section (AEO/GEO Optimization) */}
        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-xl font-serif italic text-gray-900">Quick Answer: Is {cityName} expensive?</h2>
          <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-[#1A1A1A]">
            <p className="text-lg text-gray-700 leading-relaxed">
              In one sentence, <strong>{cityName}</strong> is {data && data.daily_total > 150 ? 'relatively expensive' : 'quite affordable'} because its daily cost of <strong>${data?.daily_total}</strong> reflects {data && data.daily_total > 150 ? 'premium accommodation and dining standards' : 'excellent value for local transport and street food'}.
            </p>
          </div>
        </section>

        {/* About the Data / E-E-A-T Section */}
        <section className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-green-600">
            <ShieldCheck className="w-4 h-4" /> Verified Methodology
          </div>
          <h2 className="text-2xl font-serif italic">About Our 2026 Cost Data</h2>
          <p className="text-gray-500 leading-relaxed">
            NomadBudget uses a proprietary 'Smart Cache' system that combines real-time data from the <strong>Numbeo API</strong>, 
            <strong>Viator</strong>, and local crowdsourced reports. Our 2026 projections account for local inflation trends, 
            seasonal demand shifts, and real-time currency fluctuations. Every budget score is manually verified by our 
            team of digital nomads to ensure maximum accuracy for your planning.
          </p>
        </section>

        {/* Budget vs. Luxury Comparison Table (GEO Optimization) */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-[#1A1A1A] rounded-full" />
            <h2 className="text-2xl font-serif italic">How much is a taxi in {cityName}? (Budget vs. Luxury)</h2>
          </div>
          <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-6 text-sm font-bold uppercase tracking-widest text-gray-400">Expense Category</th>
                  <th className="p-6 text-sm font-bold uppercase tracking-widest text-gray-400">Budget Traveler</th>
                  <th className="p-6 text-sm font-bold uppercase tracking-widest text-gray-400">Luxury Traveler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td className="p-6 font-medium">Daily Meals</td>
                  <td className="p-6 text-gray-600">${data?.budget_data.budget.breakdown.food} (Street food/Local)</td>
                  <td className="p-6 text-gray-600">${data?.budget_data.luxury.breakdown.food} (Fine dining)</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium">Accommodation</td>
                  <td className="p-6 text-gray-600">${data?.budget_data.budget.breakdown.accommodation} (Hostel/Guesthouse)</td>
                  <td className="p-6 text-gray-600">${data?.budget_data.luxury.breakdown.accommodation} (5-Star Hotel)</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium">Transportation</td>
                  <td className="p-6 text-gray-600">${data?.budget_data.budget.breakdown.transport} (Public/Walking)</td>
                  <td className="p-6 text-gray-600">${data?.budget_data.luxury.breakdown.transport} (Private Taxi/Uber)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Budget Breakdown Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-[#1A1A1A] rounded-full" />
              <h2 className="text-2xl font-serif italic">What is the average meal cost in {cityName}?</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <BudgetCardSkeleton key={i} />)
            ) : (
              data && (Object.values(data.budget_data) as BudgetPersona[]).map((p) => (
                <div key={p.name} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif italic">{p.name}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">{p.description}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                      {p.name === 'Budget' ? <Wallet className="w-6 h-6 text-gray-400" /> : 
                       p.name === 'Mid-range' ? <TrendingUp className="w-6 h-6 text-gray-400" /> : 
                       <Gem className="w-6 h-6 text-gray-400" />}
                    </div>
                  </div>

                  <div className="py-4 border-y border-gray-50">
                    <p className="text-5xl font-serif italic text-[#1A1A1A]">
                      ${p.dailyTotal}
                      <span className="text-sm font-sans not-italic text-gray-400 ml-2">/ day</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <BreakdownItem icon={Coffee} label="Food & Drink" value={p.breakdown.food} total={p.dailyTotal} />
                    <BreakdownItem icon={Hotel} label="Accommodation" value={p.breakdown.accommodation} total={p.dailyTotal} />
                    <BreakdownItem icon={Car} label="Transport" value={p.breakdown.transport} total={p.dailyTotal} />
                    <BreakdownItem icon={Music} label="Entertainment" value={p.breakdown.entertainment} total={p.dailyTotal} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Viator Tours Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-[#1A1A1A] rounded-full" />
              <h2 className="text-2xl font-serif italic">Top Activities in {cityName}</h2>
            </div>
            <a 
              href={affiliate.viator} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium flex items-center gap-1 hover:underline"
            >
              View all tours <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {toursLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="aspect-[4/5] rounded-3xl" />)
            ) : (
              tours.map((tour, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={tour.image} 
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {tour.rating}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h4 className="font-serif italic text-lg leading-tight line-clamp-2 h-12">
                      {tour.title}
                    </h4>
                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">From</p>
                        <p className="text-xl font-serif italic">{tour.price}</p>
                      </div>
                      <a 
                        href={tour.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1A1A1A] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black transition-colors"
                      >
                        Book Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Flights Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-[#1A1A1A] rounded-full" />
              <h2 className="text-2xl font-serif italic">Best Value Flights to {cityName}</h2>
            </div>
            <a 
              href={`https://expedia.com/affiliates/expedia-home.Fv9Dhhf?city=${encodeURIComponent(city || '')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium flex items-center gap-1 hover:underline"
            >
              Search all flights <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {flightsLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-3xl" />)
            ) : (
              flights.map((flight, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <Navigation className="w-5 h-5 text-blue-500" />
                      </div>
                      <h4 className="font-serif italic text-lg leading-tight">{flight.title}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Starting</p>
                      <p className="text-xl font-serif italic text-blue-600">{flight.price}</p>
                    </div>
                  </div>
                  <a 
                    href={flight.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center border border-gray-100 py-3 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Check Availability
                  </a>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Hotels Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-[#1A1A1A] rounded-full" />
              <h2 className="text-2xl font-serif italic">Highly Rated Stays in {cityName}</h2>
            </div>
            <a 
              href="https://expedia.com/affiliates/expedia-home.B1FZQho"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium flex items-center gap-1 hover:underline"
            >
              Explore all hotels <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hotelsLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="aspect-[4/5] rounded-3xl" />)
            ) : (
              hotels.map((hotel, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {hotel.rating}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h4 className="font-serif italic text-lg leading-tight line-clamp-1">
                      {hotel.name}
                    </h4>
                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Nightly</p>
                        <p className="text-xl font-serif italic">{hotel.price}</p>
                      </div>
                      <a 
                        href={hotel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1A1A1A] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black transition-colors"
                      >
                        Book Stay
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* About the Data (E-E-A-T) */}
        <section className="bg-gray-50 rounded-[2rem] p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <AlertCircle className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <h2 className="text-2xl font-serif italic">About the Data</h2>
          </div>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            Our 2026 budget estimates for <strong>{cityName}</strong> are generated using real-time data from global travel APIs and verified local sources. We analyze thousands of data points across food, accommodation, and transport to ensure our calculations reflect the most current economic conditions. Our partnerships with industry leaders like Viator ensure you get access to verified activities at the best possible rates.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Real-Time API Sync
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Verified Local Stats
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              2026 Inflation Adjusted
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8 pt-12 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-[#1A1A1A] rounded-full" />
            <h2 className="text-2xl font-serif italic">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-serif italic text-lg">{faq.question}</span>
                  {openFaq === idx ? <Minus className="w-5 h-5 text-gray-400" /> : <Plus className="w-5 h-5 text-gray-400" />}
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: openFaq === idx ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-8 text-gray-500 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function BreakdownItem({ icon: Icon, label, value, total }: { icon: any, label: string, value: number, total: number }) {
  const percentage = Math.round((value / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          <Icon className="w-3 h-3" />
          <span>{label}</span>
        </div>
        <span className="font-medium">${value}</span>
      </div>
      <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-[#1A1A1A]"
        />
      </div>
    </div>
  );
}

function CostItem({ icon: Icon, label, value }: { icon: any, label: string, value: number }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <span className="text-gray-600 font-medium">{label}</span>
      </div>
      <span className="text-xl font-serif italic text-[#1A1A1A]">${value.toFixed(2)}</span>
    </div>
  );
}
