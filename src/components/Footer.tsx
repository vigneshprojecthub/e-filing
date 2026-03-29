import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">EVC</span>
              </div>
              <span className="text-2xl font-bold text-primary">
                Expert View
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              India's premier platform for corporate compliance, tax filing, and legal services. Join thousands of businesses who trust Expert View Consultancy to simplify and automate their MCA, GST, and Income Tax compliance.
            </p>
            <div className="flex items-center space-x-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text-main font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-text-muted hover:text-primary text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/#services" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/#gst-calculator" className="text-text-muted hover:text-primary text-sm transition-colors">
                  GST Calculator
                </Link>
              </li>
              <li>
                <Link to="/#articles" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Case Laws
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-text-main font-semibold mb-6">Popular Services</h3>
            <ul className="space-y-4">
              {['Private Limited Company', 'GST Registration', 'Income Tax Filing', 'Trademark Registration', 'FSSAI License'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-text-muted hover:text-primary text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-text-main font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-text-muted text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>123, Corporate Plaza, MG Road, Bangalore, Karnataka - 560001</span>
              </li>
              <li className="flex items-center space-x-3 text-text-muted text-sm">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+918754065383" className="hover:text-primary transition-colors">+91 87540 65383</a>
              </li>
              <li className="flex items-center space-x-3 text-text-muted text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:expertviewtaxsolution@gmail.com" className="hover:text-primary transition-colors">expertviewtaxsolution@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-text-muted text-xs">
            © {currentYear} Expert View Consultancy. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-xs text-text-muted">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
