import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-24 relative overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-20">
          <div className="text-center">
            <Reveal>
              <div className="inline-flex items-center space-x-2 bg-surface border border-line px-4 py-2 rounded-full mb-8">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Our Story</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-black text-primary mb-8 leading-tight">
                Empowering <span className="text-accent italic">India's</span> <br />
                Business Ecosystem
              </h1>
            </Reveal>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <Reveal delay={0.2}>
              <div className="space-y-8">
                <h2 className="text-3xl font-black text-primary relative inline-block">
                  Our Mission
                  <span className="absolute -bottom-2 left-0 w-12 h-1.5 bg-accent rounded-full" />
                </h2>
                <p className="text-xl text-text-main leading-relaxed font-medium opacity-90">
                  Welcome to Expert View Consultancy, India's premier platform for corporate compliance and legal services. 
                  Our mission is to simplify the complex world of taxation, company registration, and statutory compliance 
                  for businesses of all sizes.
                </p>
                <div className="p-8 bg-surface rounded-[32px] border border-line">
                  <p className="text-text-muted italic text-lg leading-relaxed">
                    "We believe that every entrepreneur should have the freedom to innovate without being held back by regulatory complexity."
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="space-y-8">
                <h2 className="text-3xl font-black text-primary relative inline-block">
                  Our Vision
                  <span className="absolute -bottom-2 left-0 w-12 h-1.5 bg-accent rounded-full" />
                </h2>
                <p className="text-lg text-text-muted leading-relaxed">
                  We envision a business ecosystem where entrepreneurs can focus entirely on growth and innovation, 
                  leaving the regulatory and compliance burden to our expert systems and professionals. We strive to 
                  make legal services accessible, transparent, and highly efficient.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-line rounded-2xl shadow-sm">
                    <div className="text-3xl font-black text-primary mb-1">500+</div>
                    <div className="text-xs font-bold text-accent uppercase tracking-widest">Clients</div>
                  </div>
                  <div className="p-6 bg-white border border-line rounded-2xl shadow-sm">
                    <div className="text-3xl font-black text-primary mb-1">15+</div>
                    <div className="text-xs font-bold text-accent uppercase tracking-widest">Experts</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="py-20 border-y border-line">
            <Reveal delay={0.4}>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-primary mb-4">Why Choose Us?</h2>
                <p className="text-text-muted max-w-2xl mx-auto">
                  We combine deep domain expertise with cutting-edge technology to deliver 
                  unparalleled compliance solutions.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: 'Expertise', desc: 'A dedicated team of certified professionals including CAs & CSs.' },
                  { title: 'Tech-Driven', desc: 'Fast, secure, and error-free processing through our platform.' },
                  { title: 'Transparency', desc: 'Clear pricing with no hidden charges or surprise fees.' },
                  { title: '24/7 Support', desc: 'Round-the-clock assistance for all your compliance queries.' }
                ].map((item, i) => (
                  <div key={i} className="p-8 bg-white border border-line rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                      <span className="text-primary font-black group-hover:text-white">0{i+1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                    <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
