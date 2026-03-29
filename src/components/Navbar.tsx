import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogOut, LayoutDashboard, Calculator, Info, Phone, MessageSquare, ChevronDown, ChevronRight, Briefcase, User as UserIcon, Search } from 'lucide-react';
import { signOut, type User } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { cn } from '../utils/cn';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Service } from '../types';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { toast } from 'sonner';

interface NavbarProps {
  user: User | null;
  isAdmin: boolean;
}

export default function Navbar({ user, isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!showServicesDropdown) {
      setSearchQuery('');
    }
  }, [showServicesDropdown]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showServicesDropdown) return;

    if (e.key === 'Escape') {
      setShowServicesDropdown(false);
      return;
    }

    const focusableElements = dropdownRef.current?.querySelectorAll(
      'a[href], input:not([disabled])'
    ) as NodeListOf<HTMLElement> | undefined;

    if (!focusableElements || focusableElements.length === 0) return;

    const elementsArray = Array.from(focusableElements);
    const currentIndex = elementsArray.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % elementsArray.length;
      elementsArray[nextIndex].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + elementsArray.length) % elementsArray.length;
      elementsArray[prevIndex].focus();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const q = query(collection(db, 'services'));
    const unsubscribeServices = onSnapshot(q, (snapshot) => {
      const fetchedServices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      // Sort in memory to avoid index requirements
      setServices(fetchedServices.sort((a, b) => a.title.localeCompare(b.title)));
    }, (error) => {
      console.error('Navbar services fetch error:', error);
      try {
        handleFirestoreError(error, OperationType.GET, 'services');
      } catch (e) {
        console.error('Handled Navbar Firestore Error:', e);
      }
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeServices();
    };
  }, []);

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(filteredServices.map(s => s.category)));

  const navLinks = [
    { name: 'Home', path: '/', icon: <Info className="w-4 h-4" /> },
    { name: 'GST Calculator', path: '/#gst-calculator', icon: <Calculator className="w-4 h-4" /> },
    { name: 'Articles', path: '/#articles', icon: <MessageSquare className="w-4 h-4" /> },
    { name: 'Contact', path: '/#contact', icon: <Phone className="w-4 h-4" /> },
  ];

  const handleSignOut = async () => {
    const toastId = toast.loading('Logging out...');
    try {
      await signOut(auth);
      toast.success('Logged out successfully', { id: toastId });
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to logout', { id: toastId });
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-gray-100 py-3'
          : 'bg-transparent border-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">EVC</span>
            </div>
            <span className="text-2xl font-bold text-primary">
              Expert View
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.path.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}

            {/* Services Dropdown */}
            <div 
              className="group"
              onMouseEnter={() => setShowServicesDropdown(true)}
              onMouseLeave={() => {
                if (!dropdownRef.current?.contains(document.activeElement)) {
                  setShowServicesDropdown(false);
                }
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setShowServicesDropdown(false);
                }
              }}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-text-muted hover:text-primary transition-all py-2">
                <span>Services</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", showServicesDropdown && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showServicesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full pt-4 w-full px-4 sm:px-6 lg:px-8 pb-4"
                  >
                    <div 
                      ref={dropdownRef}
                      onKeyDown={handleKeyDown}
                      className="max-w-7xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl backdrop-blur-xl flex flex-col max-h-[70vh]"
                    >
                      <div className="mb-6 relative shrink-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search services or categories..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-surface border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      
                      {categories.length === 0 ? (
                        <div className="text-center py-8 text-text-muted">
                          No services found matching "{searchQuery}"
                        </div>
                      ) : (
                        <div className="overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 custom-scrollbar pr-2">
                          {categories.map((category) => (
                            <div key={category} className="space-y-4">
                              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-gray-100 pb-2">
                                {category}
                              </h4>
                              <div className="space-y-1">
                                {filteredServices
                                  .filter(s => s.category === category)
                                  .map(service => (
                                    <Link
                                      key={service.id}
                                      to={`/service/${service.id}`}
                                      onClick={() => setShowServicesDropdown(false)}
                                      className="flex items-center justify-between group/item p-2 rounded-xl hover:bg-surface focus:bg-surface focus:outline-none transition-all"
                                    >
                                      <span className="text-xs text-text-muted group-hover/item:text-primary transition-colors line-clamp-1">
                                        {service.title}
                                      </span>
                                      <ChevronRight className="w-3 h-3 text-gray-300 group-hover/item:text-primary opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                                    </Link>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {user && isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 text-sm font-medium text-primary hover:text-accent"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-sm font-medium text-text-muted hover:text-red-500"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/admin/login"
                className="p-2.5 bg-white border border-gray-100 text-text-muted hover:text-primary hover:border-primary/50 rounded-xl transition-all shadow-lg"
                title="Admin Login"
              >
                <UserIcon className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-muted hover:text-primary p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-y-auto max-h-[calc(100vh-70px)] custom-scrollbar"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                link.path.startsWith('/#') ? (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium text-text-muted hover:text-primary hover:bg-surface rounded-lg transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      {link.icon}
                      <span>{link.name}</span>
                    </div>
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium text-text-muted hover:text-primary hover:bg-surface rounded-lg transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      {link.icon}
                      <span>{link.name}</span>
                    </div>
                  </Link>
                )
              ))}
              
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full flex items-center justify-between px-3 py-4 text-base font-medium text-text-muted hover:text-primary hover:bg-surface rounded-lg transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-4 h-4" />
                    <span>Our Services</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", mobileServicesOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-10 pr-3 py-2 space-y-1 border-l-2 border-gray-100 ml-5 mt-1">
                        {services.slice(0, 8).map(service => (
                          <Link
                            key={service.id}
                            to={`/service/${service.id}`}
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-sm text-text-muted hover:text-primary transition-colors"
                          >
                            {service.title}
                          </Link>
                        ))}
                        {services.length > 8 && (
                          <a href="/#services" onClick={() => setIsOpen(false)} className="block py-2 text-xs text-primary font-medium">
                            View all services &rarr;
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {user && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-primary hover:bg-surface rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </div>
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-4 text-base font-medium text-red-500 hover:bg-surface rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </div>
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 px-3 py-4 text-base font-medium text-white bg-primary rounded-lg text-center mt-4"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Admin Login</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
