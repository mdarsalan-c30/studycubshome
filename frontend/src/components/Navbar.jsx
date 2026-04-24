import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/programs' },
    { name: 'Materials', path: '/materials' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[90] transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-8 lg:px-24 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[hsl(190,70%,42%)] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black font-fredoka">Study<span className="text-[hsl(190,70%,42%)]">Cubs</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`font-bold font-fredoka transition-all hover:text-[hsl(190,70%,42%)] ${location.pathname === link.path ? 'text-[hsl(190,70%,42%)]' : 'text-gray-500'}`}
            >
              {link.name}
            </Link>
          ))}
          <button className="px-6 py-3 bg-[hsl(190,70%,42%)] text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-[hsl(190,70%,42%)]/20 flex items-center gap-2">
            Free Demo <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-gray-500">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 p-8 lg:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold font-fredoka text-gray-600 hover:text-[hsl(190,70%,42%)]"
              >
                {link.name}
              </Link>
            ))}
            <button className="w-full py-4 bg-[hsl(190,70%,42%)] text-white font-black rounded-xl text-lg">
              Book Free Demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
