import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-24 pb-12 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Section */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:rotate-12 transition-all duration-500">
                <span className="text-white font-black text-2xl">E</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none">
                  EXPERT VIEW
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent mt-1">
                  Consultancy
                </span>
              </div>
            </Link>
            <p className="text-white/60 text-base leading-relaxed font-medium">
              India's premier platform for corporate compliance, tax filing, and legal services. 
              Empowering businesses with expert insights and seamless automation.
            </p>
            <div className="flex items-center space-x-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-white hover:bg-accent hover:border-accent transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-8 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-accent rounded-full" />
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Services', path: '/#services' },
                { name: 'GST Calculator', path: '/#gst-calculator' },
                { name: 'Case Laws', path: '/#articles' },
                { name: 'Contact Us', path: '/#contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-white/60 hover:text-accent text-base font-medium transition-all duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-[2px] bg-accent mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-8 relative inline-block">
              Popular Services
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-accent rounded-full" />
            </h3>
            <ul className="space-y-4">
              {[
                'Private Limited Company', 
                'GST Registration', 
                'Income Tax Filing', 
                'Trademark Registration', 
                'FSSAI License'
              ].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-white/60 hover:text-accent text-base font-medium transition-all duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-[2px] bg-accent mr-0 group-hover:mr-2 transition-all duration-300" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-8 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-accent rounded-full" />
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                  <MapPin className="w-5 h-5 text-accent group-hover:text-white" />
                </div>
                <span className="text-white/60 text-base font-medium leading-relaxed">
                  123, Corporate Plaza, MG Road, Bangalore, Karnataka - 560001
                </span>
              </li>
              <li className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                  <Phone className="w-5 h-5 text-accent group-hover:text-white" />
                </div>
                <a href="tel:+918754065383" className="text-white/60 hover:text-white text-base font-medium transition-colors">
                  +91 87540 65383
                </a>
              </li>
              <li className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                  <Mail className="w-5 h-5 text-accent group-hover:text-white" />
                </div>
                <a href="mailto:expertviewtaxsolution@gmail.com" className="text-white/60 hover:text-white text-base font-medium transition-colors">
                  expertviewtaxsolution@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-sm font-medium">
            © {currentYear} Expert View Consultancy. Crafted with precision.
          </p>
          <div className="flex items-center space-x-8 text-sm font-bold">
            <Link to="/privacy" className="text-white/40 hover:text-accent transition-colors uppercase tracking-widest">Privacy Policy</Link>
            <Link to="/terms" className="text-white/40 hover:text-accent transition-colors uppercase tracking-widest">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
