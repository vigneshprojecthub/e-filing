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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-line py-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]'
          : 'bg-transparent py-8'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-xl shadow-accent/20 group-hover:rotate-12 transition-all duration-500 transform group-hover:scale-110">
              <span className="text-white font-black text-2xl tracking-tighter">E</span>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black text-primary tracking-tighter uppercase leading-none">
                Expert View
              </span>
              <span className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mt-1">
                Consultancy
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              link.path.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-sm font-bold text-primary/70 hover:text-accent transition-all relative group/link uppercase tracking-widest"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-1 bg-accent transition-all duration-300 group-hover/link:w-full rounded-full"></span>
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-bold text-primary/70 hover:text-accent transition-all relative group/link uppercase tracking-widest"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-1 bg-accent transition-all duration-300 group-hover/link:w-full rounded-full"></span>
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
            >
              <button className="flex items-center space-x-2 text-sm font-bold text-primary/70 hover:text-accent transition-all py-2 uppercase tracking-widest">
                <span>Services</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-500", showServicesDropdown && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showServicesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute left-0 right-0 top-full pt-6 w-full px-4 sm:px-6 lg:px-8 pb-6"
                  >
                    <div 
                      ref={dropdownRef}
                      onKeyDown={handleKeyDown}
                      className="max-w-7xl mx-auto bg-white border border-line rounded-[40px] p-12 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] backdrop-blur-2xl flex flex-col max-h-[80vh]"
                    >
                      <div className="mb-10 relative shrink-0">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search for corporate services, tax filing, or legal compliance..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-surface border-2 border-line rounded-3xl py-5 pl-16 pr-8 text-primary font-medium placeholder-text-muted focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all text-lg"
                        />
                      </div>
                      
                      {categories.length === 0 ? (
                        <div className="text-center py-20 bg-surface rounded-[32px] border-2 border-line border-dashed">
                          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Search className="w-10 h-10 text-text-muted" />
                          </div>
                          <h3 className="text-2xl font-black text-primary mb-2">No results found</h3>
                          <p className="text-text-muted text-lg">Try searching for broader terms like "GST" or "Company"</p>
                        </div>
                      ) : (
                        <div className="overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 custom-scrollbar pr-6">
                          {categories.map((category) => (
                            <div key={category} className="space-y-6">
                              <div className="flex items-center space-x-3 border-b-2 border-line pb-4">
                                <div className="w-2 h-2 bg-accent rounded-full" />
                                <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">
                                  {category}
                                </h4>
                              </div>
                              <div className="space-y-2">
                                {filteredServices
                                  .filter(s => s.category === category)
                                  .map(service => (
                                    <Link
                                      key={service.id}
                                      to={`/service/${service.id}`}
                                      onClick={() => setShowServicesDropdown(false)}
                                      className="flex items-center justify-between group/item p-4 rounded-2xl hover:bg-surface focus:bg-surface focus:outline-none transition-all border border-transparent hover:border-line"
                                    >
                                      <span className="text-base font-bold text-primary/70 group-hover/item:text-accent transition-colors line-clamp-1">
                                        {service.title}
                                      </span>
                                      <div className="w-8 h-8 rounded-full bg-white border border-line flex items-center justify-center opacity-0 group-hover/item:opacity-100 -translate-x-4 group-hover/item:translate-x-0 transition-all duration-300">
                                        <ChevronRight className="w-4 h-4 text-accent" />
                                      </div>
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
            
            <div className="h-8 w-[2px] bg-line"></div>

            {user && isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 text-sm font-black text-primary hover:text-accent transition-all uppercase tracking-widest"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-sm font-black text-primary/70 hover:text-red-500 transition-all uppercase tracking-widest"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/admin/login"
                className="bg-primary text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-accent hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 flex items-center space-x-2 uppercase tracking-widest"
              >
                <UserIcon className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-b border-line overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar"
          >
            <div className="px-6 py-10 space-y-4">
              {navLinks.map((link) => (
                link.path.startsWith('/#') ? (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-5 text-lg font-black text-primary hover:bg-surface rounded-3xl transition-all border border-transparent hover:border-line"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-accent">
                        {link.icon}
                      </div>
                      <span className="uppercase tracking-widest">{link.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-line" />
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-5 text-lg font-black text-primary hover:bg-surface rounded-3xl transition-all border border-transparent hover:border-line"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-accent">
                        {link.icon}
                      </div>
                      <span className="uppercase tracking-widest">{link.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-line" />
                  </Link>
                )
              ))}
              
              <div className="pt-4 border-t border-line">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full flex items-center justify-between p-5 text-lg font-black text-primary hover:bg-surface rounded-3xl transition-all border border-transparent hover:border-line"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-accent">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="uppercase tracking-widest">Our Services</span>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 transition-transform duration-500", mobileServicesOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-2 p-4 bg-surface rounded-3xl mt-2">
                        {services.slice(0, 10).map(service => (
                          <Link
                            key={service.id}
                            to={`/service/${service.id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between p-4 text-base font-bold text-primary/70 hover:text-accent transition-colors"
                          >
                            <span>{service.title}</span>
                            <ChevronRight className="w-4 h-4 opacity-50" />
                          </Link>
                        ))}
                        <Link to="/#services" onClick={() => setIsOpen(false)} className="p-4 text-sm text-accent font-black uppercase tracking-widest text-center border-t border-line mt-2">
                          View all services
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-6 space-y-4">
                {user && isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-4 p-5 text-lg font-black text-primary bg-surface rounded-3xl border border-line"
                  >
                    <LayoutDashboard className="w-5 h-5 text-accent" />
                    <span className="uppercase tracking-widest">Admin Dashboard</span>
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-4 p-5 text-lg font-black text-red-500 bg-red-50 rounded-3xl border border-red-100"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="uppercase tracking-widest">Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-3 p-6 text-xl font-black text-white bg-primary rounded-3xl shadow-xl shadow-primary/20 uppercase tracking-[0.2em]"
                  >
                    <UserIcon className="w-6 h-6" />
                    <span>Admin Login</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
