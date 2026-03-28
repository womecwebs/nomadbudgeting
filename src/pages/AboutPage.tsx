import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { MapPin, Users, Target, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      <Helmet>
        <title>About NomadBudget: Our Mission & Story</title>
        <meta name="description" content="Learn about NomadBudget, the mission behind our travel budget calculator, and how we help travelers explore the world affordably." />
        <link rel="canonical" href="https://nomadbudget.netlify.app/about" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 pt-20 space-y-20">
        <section className="text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif italic tracking-tight text-[#1A1A1A]"
          >
            We believe travel should be <span className="underline decoration-gray-200 underline-offset-8">accessible</span> to everyone.
          </motion.h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
            NomadBudget was born out of a simple frustration: the lack of accurate, real-time travel cost data for digital nomads and budget travelers.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-3xl font-serif italic">Our Mission</h2>
            <p className="text-gray-500 leading-relaxed">
              Our mission is to empower travelers with the data they need to make informed financial decisions. We combine real-time API data with community insights to provide the most accurate travel budget breakdowns on the web.
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className="text-3xl font-serif italic">The Community</h2>
            <p className="text-gray-500 leading-relaxed">
              We're more than just a calculator. We're a growing community of digital nomads, backpackers, and slow travelers who believe in the transformative power of experiencing new cultures without breaking the bank.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl font-serif italic">Our Commitment to Accuracy</h2>
          </div>
          <p className="text-gray-500 leading-relaxed text-lg">
            In an era of AI-generated misinformation, we pride ourselves on transparency. Our 'Smart Cache' system ensures that we're always pulling the most recent data from trusted sources like Numbeo, while our manual verification process adds a human touch to every city guide.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-50">
            <div className="text-center space-y-2">
              <p className="text-4xl font-serif italic text-[#1A1A1A]">500+</p>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Cities Tracked</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl font-serif italic text-[#1A1A1A]">50k+</p>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Monthly Users</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl font-serif italic text-[#1A1A1A]">2026</p>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Data Outlook</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl font-serif italic text-[#1A1A1A]">100%</p>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Free to Use</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
