import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-[var(--color-background)]">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-12">
          <Reveal>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-main)] mb-8">Terms of Service</h1>
          </Reveal>
          
          <div className="prose prose-slate max-w-none space-y-8 text-[var(--color-text-muted)]">
            <Reveal delay={0.1}>
              <p>Last updated: March 27, 2026</p>
            </Reveal>

            <Reveal delay={0.2}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Expert View Consultancy website and services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-8 mb-4">2. Description of Service</h2>
              <p>
                Expert View Consultancy provides corporate compliance, tax filing, and related legal services. We reserve the right to modify, suspend or discontinue the service with or without notice at any time and without any liability to you.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-8 mb-4">3. User Responsibilities</h2>
              <p>
                You are responsible for providing accurate and complete information required for the execution of our services. Expert View Consultancy shall not be held liable for any penalties, delays, or damages arising from incorrect or incomplete information provided by the user.
              </p>
            </Reveal>

            <Reveal delay={0.5}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-8 mb-4">4. Payment and Fees</h2>
              <p>
                All fees for services must be paid in advance unless otherwise agreed upon. Fees are non-refundable once the service execution has commenced, except as required by law or explicitly stated in our refund policy.
              </p>
            </Reveal>

            <Reveal delay={0.6}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-8 mb-4">5. Limitation of Liability</h2>
              <p>
                In no event shall Expert View Consultancy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
