import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-[var(--color-background)]">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-primary)]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-12">
          <Reveal>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-main)] mb-8">About Us</h1>
          </Reveal>
          
          <div className="prose prose-slate max-w-none">
            <Reveal delay={0.1}>
              <p className="text-lg text-[var(--color-text-main)] leading-relaxed">
                Welcome to Expert View Consultancy, India's premier platform for corporate compliance and legal services. 
                Our mission is to simplify the complex world of taxation, company registration, and statutory compliance 
                for businesses of all sizes.
              </p>
            </Reveal>
            
            <Reveal delay={0.2}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-12 mb-4">Our Vision</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                We envision a business ecosystem where entrepreneurs can focus entirely on growth and innovation, 
                leaving the regulatory and compliance burden to our expert systems and professionals. We strive to 
                make legal services accessible, transparent, and highly efficient.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-12 mb-4">What We Do</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                From incorporating a new company to managing annual filings, GST returns, and trademark registrations, 
                Expert View Consultancy provides an end-to-end suite of services. Our platform combines cutting-edge technology 
                with the expertise of seasoned Chartered Accountants, Company Secretaries, and Legal Professionals.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mt-12 mb-4">Why Choose Us?</h2>
              <ul className="list-disc pl-6 text-[var(--color-text-muted)] space-y-4">
                <li><strong className="text-[var(--color-text-main)]">Expertise:</strong> A dedicated team of certified professionals.</li>
                <li><strong className="text-[var(--color-text-main)]">Technology-Driven:</strong> Fast, secure, and error-free processing.</li>
                <li><strong className="text-[var(--color-text-main)]">Transparency:</strong> Clear pricing with no hidden charges.</li>
                <li><strong className="text-[var(--color-text-main)]">Support:</strong> Round-the-clock customer assistance for all your queries.</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
