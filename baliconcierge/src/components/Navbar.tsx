import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Background styling
      setIsScrolled(window.scrollY > 20);

      // Active section tracking
      if (location.pathname === '/') {
        const sectionIds = ['home', 'services', 'gallery', 'why-us', 'testimonials', 'contact'];
        let current = 'home';
        
        for (const id of sectionIds) {
          const element = document.getElementById(id);
          if (element) {
            const rect = element.getBoundingClientRect();
            // A section is considered active if its top is near the top of the viewport
            if (rect.top <= 150) {
              current = id;
            }
          }
        }
        
        // Force home if at the very top
        if (window.scrollY < 50) {
          current = 'home';
        }
        
        setActiveSection(current);
      } else {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Close mobile menu on route or hash change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent iOS bounce
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { title: 'Services', to: '/#services', id: 'services' },
    { title: 'Gallery', to: '/#gallery', id: 'gallery' },
    { title: 'Why Us', to: '/#why-us', id: 'why-us' },
    { title: 'Testimonials', to: '/#testimonials', id: 'testimonials' },
  ];

  const getLinkClass = (linkId: string) => {
    const isActive = activeSection === linkId;
    return `${isActive ? 'text-primary font-bold' : 'text-secondary font-medium hover:text-on-tertiary-container'} transition-all duration-300 relative py-2`;
  };

  const handleContactClick = () => {
  if (location.pathname === '/') {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    navigate('/#contact');
  }
};

  return (
    <>
      <header className={`${
        isMobileMenuOpen 
          ? 'bg-transparent border-transparent' 
          : `${isScrolled ? 'bg-white/95 shadow-sm border-stone-200' : 'bg-white/80 border-stone-200'} backdrop-blur-md border-b`
      } fixed top-0 w-full z-[70] transition-all duration-300`}>
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 md:py-4 max-w-7xl mx-auto w-full">
          <Link to="/" className="text-2xl font-h2 font-bold tracking-tight text-primary cursor-pointer relative z-[70]">
            BaliConcierge
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <NavHashLink 
                key={link.to}
                smooth 
                className={getLinkClass(link.id)} 
                to={link.to}
              >
                {link.title}
                {activeSection === link.id && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </NavHashLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <NavHashLink
              smooth 
              to="/#contact"
              className="hidden md:block bg-primary text-on-primary px-6 py-3 rounded font-label-caps text-label-caps hover:bg-primary-container transition-colors active:scale-95 duration-200">
              Contact Us
            </NavHashLink>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-primary relative z-[70] p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-2xl transition-transform duration-300">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[80%] max-w-xs h-full bg-white shadow-2xl z-[65] md:hidden flex flex-col p-8 pt-24 overflow-y-auto"
            >
              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <NavHashLink 
                    key={link.to}
                    smooth 
                    className={`${activeSection === link.id ? 'text-primary font-bold' : 'text-primary/70'} text-lg font-h2 hover:text-primary transition-colors flex items-center justify-between`}
                    to={link.to}
                  >
                    {link.title}
                    {activeSection === link.id && <span className="material-symbols-outlined text-sm">circle</span>}
                  </NavHashLink>
                ))}
              </nav>
              <div className="mt-auto pb-8">
                <NavHashLink
                  smooth 
                  to="/#contact"
                  className="w-full bg-primary text-on-primary py-4 rounded font-label-caps text-label-caps hover:bg-primary-container transition-colors shadow-lg">
                  Contact Us
                </NavHashLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
