import React, { useState, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { 
  MessageCircle, Star, ArrowRight, Play, 
  Sparkles, ShieldCheck, Trophy, Award,
  Mail, Phone, MapPin, Globe, ChevronRight, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BookingModal from '../components/BookingModal';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pages, setPages] = useState([]);

  useSEO({
    title: 'StudyCubs | 1:3 Live Mentorship for Public Speaking & Confidence in Kids',
    description: 'StudyCubs offers expert-led 1:3 live online mentorship for public speaking, communication, and confidence building for kids & teens (Class 3–College). Join us today!',
    canonical: 'https://www.studycubs.com/'
  });

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await axios.get('/api/api.php?action=get_pages');
        if (res.data.success) setPages(res.data.data);
      } catch (err) { console.error("Failed to fetch pages"); }
    };
    fetchPages();
  }, []);

  const handleWhatsApp = () => {
    const phoneNumber = "918147434014"; 
    const message = encodeURIComponent("Hi StudyCubs! I want to know more about the Public Speaking program for my child.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const superCubs = [
    { name: "Saadgee Patodee", course: "Public Speaking", img: "https://i.pravatar.cc/150?u=saadgee" },
    { name: "Hraday Waykos", course: "Public Speaking", img: "https://i.pravatar.cc/150?u=hraday" },
    { name: "Shivani Kulkarni", course: "Public Speaking", img: "https://i.pravatar.cc/150?u=shivani" },
    { name: "Swarit", course: "Public Speaking", img: "https://i.pravatar.cc/150?u=swarit" }
  ];

  return (
    <div className="bg-white text-gray-900 font-fredoka overflow-x-hidden pb-24 lg:pb-0">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-8 lg:px-24">
        <div className="absolute inset-0 bg-pattern opacity-30 -z-10"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(190,70%,95%)] text-[hsl(190,70%,40%)] font-bold text-xs mb-6 border border-[hsl(190,70%,85%)]">
              <Sparkles className="w-3 h-3 fill-current" /> India's #1 Speaking Platform
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-[1.2] mb-6">
              Speak with <br/>
              <span className="text-[hsl(190,70%,42%)]">Total Confidence</span>
            </h1>
            
            <p className="text-lg text-gray-500 mb-10 max-w-md font-medium leading-relaxed">
              1:3 Live Mentorship for Kids & Students. <br/>
              Master public speaking in just 30 days.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-10 py-5 bg-[hsl(190,70%,42%)] hover:bg-[hsl(190,70%,35%)] text-white font-black text-xl rounded-2xl transition-all shadow-xl shadow-[hsl(190,70%,42%)]/20 flex items-center justify-center gap-3"
              >
                Book Free Demo <ArrowRight className="w-6 h-6" />
              </button>
              <button 
                onClick={handleWhatsApp}
                className="px-10 py-5 bg-[hsl(40,90%,55%)] hover:bg-[hsl(40,90%,50%)] text-white border-none rounded-2xl font-black text-xl transition-all shadow-xl shadow-[hsl(40,90%,55%)]/30 flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-6 h-6" /> WhatsApp Expert
              </button>
            </div>

            <div className="mt-8 flex items-center gap-3 text-gray-400 font-medium text-sm">
              <ShieldCheck className="w-5 h-5 text-green-500" /> No credit card required. Limited slots only.
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-lg overflow-hidden">
              <img 
                src="https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS/f0d0a00a-0527-4d57-8be1-9cd8fc827212.webp" 
                alt="Super Speakers" 
                className="w-full h-auto object-contain"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[hsl(40,90%,55%)] text-[hsl(40,90%,55%)]" />)}
              </div>
              <p className="font-bold text-sm">4.9/5 Student Rating</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- QUICK FEATURES --- */}
      <section id="about" className="py-20 px-8 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Live 1:3 Batches", desc: "Small groups for personal attention.", icon: "🎯" },
            { title: "Expert Mentors", desc: "Trained professionals for guidance.", icon: "🧑‍🏫" },
            { title: "Fun Curriculum", desc: "Activity-based learning for all ages.", icon: "🚀" }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="text-4xl">{item.icon}</div>
              <div>
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SIMPLE CTA STRIP --- */}
      <section className="py-24 px-8 lg:px-24">
        <div className="max-w-5xl mx-auto bg-[hsl(190,70%,42%)] rounded-[2.5rem] p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Start Your Speaking Journey Today</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto font-medium">Join thousands of students who have conquered their stage fear with StudyCubs.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-10 py-5 bg-[hsl(40,90%,55%)] text-white font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-lg"
              >
                Request Free Demo
              </button>
              <button 
                onClick={handleWhatsApp}
                className="px-10 py-5 bg-white text-[hsl(190,70%,42%)] font-bold text-xl rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-6 h-6 text-green-500" /> WhatsApp Expert
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        </div>
      </section>

      {/* --- MEET OUR SUPERCUBS --- */}
      <section id="stories" className="py-24 px-8 lg:px-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Meet Our SuperCubs 🏆</h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">Celebrating our star students who shine bright on every stage</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {superCubs.map((cub, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg text-center group"
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-[hsl(190,70%,95%)] group-hover:border-[hsl(190,70%,42%)] transition-all">
                  <img src={cub.img} alt={cub.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-1">{cub.name}</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold">
                  <Award className="w-3 h-3" /> {cub.course}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DETAILED PROFESSIONAL FOOTER --- */}
      <footer className="bg-gray-900 text-white pt-20 pb-10 px-8 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[hsl(190,70%,42%)] rounded-xl flex items-center justify-center">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">Study<span className="text-[hsl(190,70%,42%)]">Cubs</span></span>
            </div>
            <p className="text-gray-400 font-medium leading-relaxed mb-6">
              Empowering the next generation of leaders through confident communication and public speaking excellence.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              {/* Check if About Us exists in pages, otherwise use section link */}
              {pages.some(p => p.slug === 'about-us') ? (
                <li><Link to="/page/about-us" className="hover:text-white transition-all">About Us</Link></li>
              ) : (
                <li><a href="/#about" className="hover:text-white transition-all">About Us</a></li>
              )}
              <li><Link to="/contact" className="hover:text-white transition-all">Our Programs</Link></li>
              <li><a href="/#stories" className="hover:text-white transition-all">Success Stories</a></li>
              <li><Link to="/materials" className="hover:text-white transition-all">Resource Library</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-all">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Programs Stage</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link to="/program/little-explorers" className="hover:text-white transition-all">Little Explorers (Class 3-6)</Link></li>
              <li><Link to="/program/rising-stars" className="hover:text-white transition-all">Rising Stars (Class 7-10)</Link></li>
              <li><Link to="/program/global-leaders" className="hover:text-white transition-all">Global Leaders (College)</Link></li>
              <li><Link to="/program/corporate-training" className="hover:text-white transition-all">Corporate Training</Link></li>
              <li><Link to="/program/summer-camps" className="hover:text-white transition-all">Summer Camps</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Support</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[hsl(190,70%,42%)] shrink-0" />
                <span>+91 81474 34014</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[hsl(190,70%,42%)] shrink-0" />
                <span>support@studycubs.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium italic">© 2026 StudyCubs Education. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs text-gray-600 font-bold uppercase tracking-widest justify-center">
            {/* Dynamically list all pages EXCEPT about-us (which is in quick links) */}
            {pages.filter(p => p.slug !== 'about-us').map(page => (
              <Link key={page.id} to={`/page/${page.slug}`} className="hover:text-gray-400 transition-all">
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* --- STICKY BOTTOM BAR (RESPONSIVE) --- */}
      <div className="fixed bottom-0 left-0 w-full z-[80] lg:hidden bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 py-4 bg-[hsl(190,70%,42%)] text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm"
          >
            Book Demo
          </button>
          <button 
            onClick={handleWhatsApp}
            className="flex-1 py-4 bg-green-500 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <MessageCircle className="w-5 h-5" /> Chat Now
          </button>
        </div>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
    </div>
  );
};

export default LandingPage;
