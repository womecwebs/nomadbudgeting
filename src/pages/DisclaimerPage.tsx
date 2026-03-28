import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      <Helmet>
        <title>Affiliate Disclaimer: NomadBudget Transparency</title>
        <meta name="description" content="Read our affiliate disclaimer to understand how we earn commissions and maintain our travel budget data." />
        <link rel="canonical" href="https://nomadbudget.netlify.app/disclaimer" />
      </Helmet>

      <main className="max-w-3xl mx-auto px-4 pt-20 space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-serif italic tracking-tight text-[#1A1A1A]">Affiliate Disclaimer</h1>
          <p className="text-gray-400 text-sm">Last Updated: March 28, 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-[#1A1A1A]">1. Affiliate Disclosure</h2>
            <p>NomadBudget is a participant in several affiliate advertising programs. This means that we may earn a commission if you click on a link and make a purchase or booking through our affiliate partners, including but not limited to Viator, Booking.com, Expedia, and others.</p>
            <p>This comes at <strong>no extra cost to you</strong>. In many cases, our partnerships allow us to provide you with exclusive deals or discounts that you wouldn't find otherwise.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-[#1A1A1A]">2. Why We Use Affiliate Links</h2>
            <p>Maintaining a real-time travel budget calculator requires significant resources, including API costs, server maintenance, and manual data verification. Affiliate commissions help us keep NomadBudget 100% free for all users while ensuring our data remains accurate and up-to-date.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-[#1A1A1A]">3. Editorial Integrity</h2>
            <p>Our recommendations are based on data, community feedback, and our own research. We never prioritize an affiliate partner over the best interests of our users. Our primary goal is to help you travel better and cheaper, regardless of whether we earn a commission.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-[#1A1A1A]">4. Contact Us</h2>
            <p>If you have any questions regarding our affiliate relationships, please feel free to reach out to us at: <a href="mailto:hello@nomadbudget.com" className="text-[#1A1A1A] underline">hello@nomadbudget.com</a></p>
          </section>
        </div>
      </main>
    </div>
  );
}
