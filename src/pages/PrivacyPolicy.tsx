import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-24 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-12">
          <Reveal>
            <div className="inline-flex items-center space-x-2 bg-surface border border-line px-4 py-2 rounded-full mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Legal</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-primary mb-8 leading-tight">Privacy Policy</h1>
          </Reveal>
          
          <div className="prose prose-slate max-w-none space-y-12 text-text-muted">
            <Reveal delay={0.1}>
              <div className="p-4 bg-surface border-l-4 border-accent rounded-r-xl">
                <p className="text-sm font-bold text-primary uppercase tracking-widest">Last updated: March 27, 2026</p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h2 className="text-3xl font-black text-primary mt-12 mb-6">1. Information We Collect</h2>
              <p className="text-lg leading-relaxed">
                We collect information that you provide directly to us, including but not limited to your name, email address, phone number, PAN, Aadhaar, business details, and financial information necessary to provide our services.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <h2 className="text-3xl font-black text-primary mt-12 mb-6">2. How We Use Your Information</h2>
              <p className="text-lg leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="space-y-4 mt-6">
                {[
                  'Provide, maintain, and improve our services.',
                  'Process transactions and send related information.',
                  'File documents with government authorities (MCA, Income Tax Dept, etc.) on your behalf.',
                  'Send technical notices, updates, security alerts, and support messages.',
                  'Respond to your comments, questions, and requests.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2.5 shrink-0" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.4}>
              <h2 className="text-3xl font-black text-primary mt-12 mb-6">3. Information Sharing</h2>
              <p className="text-lg leading-relaxed">
                We do not share your personal information with third parties except as necessary to provide our services (e.g., submitting forms to government portals) or to comply with the law. We may share information with trusted third-party service providers who assist us in operating our website and conducting our business, as long as those parties agree to keep this information confidential.
              </p>
            </Reveal>

            <Reveal delay={0.5}>
              <h2 className="text-3xl font-black text-primary mt-12 mb-6">4. Data Security</h2>
              <p className="text-lg leading-relaxed">
                We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet, or method of electronic storage, is 100% secure.
              </p>
            </Reveal>

            <Reveal delay={0.6}>
              <h2 className="text-3xl font-black text-primary mt-12 mb-6">5. Contact Us</h2>
              <p className="text-lg leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:expertviewtaxsolution@gmail.com" className="text-accent font-bold hover:underline">expertviewtaxsolution@gmail.com</a>.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
