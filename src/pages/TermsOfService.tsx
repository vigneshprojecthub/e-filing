import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-24 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-12">
          <Reveal>
            <div className="inline-flex items-center space-x-2 bg-surface border border-line px-4 py-2 rounded-full mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Legal</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-primary mb-8 leading-tight">Terms of Service</h1>
          </Reveal>
          
          <div className="prose prose-slate max-w-none space-y-12 text-text-muted">
            <Reveal delay={0.1}>
              <div className="p-4 bg-surface border-l-4 border-accent rounded-r-xl">
                <p className="text-sm font-bold text-primary uppercase tracking-widest">Last updated: March 27, 2026</p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h2 className="text-3xl font-black text-primary mt-12 mb-6">1. Acceptance of Terms</h2>
              <p className="text-lg leading-relaxed">
                By accessing and using the Expert View Consultancy website and services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <h2 className="text-3xl font-black text-primary mt-12 mb-6">2. Description of Service</h2>
              <p className="text-lg leading-relaxed">
                Expert View Consultancy provides corporate compliance, tax filing, and related legal services. We reserve the right to modify, suspend or discontinue the service with or without notice at any time and without any liability to you.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <h2 className="text-3xl font-black text-primary mt-12 mb-6">3. User Responsibilities</h2>
              <p className="text-lg leading-relaxed">
                You are responsible for providing accurate and complete information required for the execution of our services. Expert View Consultancy shall not be held liable for any penalties, delays, or damages arising from incorrect or incomplete information provided by the user.
              </p>
            </Reveal>

            <Reveal delay={0.5}>
              <h2 className="text-3xl font-black text-primary mt-12 mb-6">4. Payment and Fees</h2>
              <p className="text-lg leading-relaxed">
                All fees for services must be paid in advance unless otherwise agreed upon. Fees are non-refundable once the service execution has commenced, except as required by law or explicitly stated in our refund policy.
              </p>
            </Reveal>

            <Reveal delay={0.6}>
              <h2 className="text-3xl font-black text-primary mt-12 mb-6">5. Limitation of Liability</h2>
              <p className="text-lg leading-relaxed">
                In no event shall Expert View Consultancy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
