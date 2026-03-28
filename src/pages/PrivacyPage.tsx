import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      <Helmet>
        <title>Privacy Policy: NomadBudget GDPR & CCPA Compliance</title>
        <meta name="description" content="Read our privacy policy to understand how we collect, use, and protect your data at NomadBudget." />
        <link rel="canonical" href="https://nomadbudget.netlify.app/privacy" />
      </Helmet>

      <main className="max-w-3xl mx-auto px-4 pt-20 space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-serif italic tracking-tight text-[#1A1A1A]">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last Updated: March 28, 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-[#1A1A1A]">1. Introduction</h2>
            <p>Welcome to NomadBudget. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-[#1A1A1A]">2. The Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity Data:</strong> Includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> Includes email address and telephone numbers.</li>
              <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong>Usage Data:</strong> Includes information about how you use our website, products and services.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-[#1A1A1A]">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-[#1A1A1A]">4. GDPR & CCPA Compliance</h2>
            <p>If you are a resident of the European Economic Area (EEA) or California, you have certain data protection rights. NomadBudget aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif italic text-[#1A1A1A]">5. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:privacy@nomadbudget.com" className="text-[#1A1A1A] underline">privacy@nomadbudget.com</a></p>
          </section>
        </div>
      </main>
    </div>
  );
}
