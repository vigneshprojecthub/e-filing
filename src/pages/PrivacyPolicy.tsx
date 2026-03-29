import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-[var(--color-background)]">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-primary)]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-12">
          <Reveal>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-main)] mb-8">Privacy Policy</h1>
          </Reveal>
          
          <div className="prose prose-slate max-w-none space-y-8 text-[var(--color-text-muted)]">
            <Reveal delay={0.1}>
              <p>Last updated: March 27, 2026</p>
            </Reveal>

            <Reveal delay={0.2}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-8 mb-4">1. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us, including but not limited to your name, email address, phone number, PAN, Aadhaar, business details, and financial information necessary to provide our services.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-8 mb-4">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-4">
                <li>Provide, maintain, and improve our services.</li>
                <li>Process transactions and send related information.</li>
                <li>File documents with government authorities (MCA, Income Tax Dept, etc.) on your behalf.</li>
                <li>Send technical notices, updates, security alerts, and support messages.</li>
                <li>Respond to your comments, questions, and requests.</li>
              </ul>
            </Reveal>

            <Reveal delay={0.4}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-8 mb-4">3. Information Sharing</h2>
              <p>
                We do not share your personal information with third parties except as necessary to provide our services (e.g., submitting forms to government portals) or to comply with the law. We may share information with trusted third-party service providers who assist us in operating our website and conducting our business, as long as those parties agree to keep this information confidential.
              </p>
            </Reveal>

            <Reveal delay={0.5}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-8 mb-4">4. Data Security</h2>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet, or method of electronic storage, is 100% secure.
              </p>
            </Reveal>

            <Reveal delay={0.6}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-8 mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:expertviewtaxsolution@gmail.com" className="text-[var(--color-primary)] hover:underline">expertviewtaxsolution@gmail.com</a>.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
