
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenu(false);
    if (location.pathname !== '/') {
      window.location.hash = `/#${id}`;
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-[#0d1117]/90 py-4 backdrop-blur-md' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-24 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tighter">
          Adam <span className="text-accent italic">Bhiri</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {['home', 'about', 'work'].map((item) => (
            <button 
              key={item}
              onClick={() => handleNavClick(item === 'home' ? 'root' : item)}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-[#0d1117] border-b border-neutral-800 px-8 py-10 flex flex-col gap-6 md:hidden overflow-hidden"
          >
            <button onClick={() => handleNavClick('root')} className="text-2xl font-bold uppercase">Home</button>
            <button onClick={() => handleNavClick('about')} className="text-2xl font-bold uppercase">About</button>
            <button onClick={() => handleNavClick('work')} className="text-2xl font-bold uppercase">Projects</button>
            <Link to="/admin" onClick={() => setMobileMenu(false)} className="text-2xl font-bold uppercase text-accent">Admin</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
