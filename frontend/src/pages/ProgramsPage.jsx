import React, { useState, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { Users, Clock, Star, ArrowRight, Sparkles, Loader2, Calendar, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BookingModal from '../components/BookingModal';

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useSEO({
    title: 'Programs | StudyCubs – Public Speaking & Communication Courses for Kids',
    description: 'Explore StudyCubs programs: Little Explorers (Class 3–6), Rising Stars (Class 7–10), Global Leaders (College), Corporate Training & Summer Camps.',
    canonical: 'https://www.studycubs.com/programs'
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get('/api/api.php?action=get_programs');
      if (res.data.success) {
        setPrograms(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const staticPrograms = [
    {
      id: 1,
      title: "Little Explorers",
      slug: "little-explorers",
      age_group: "Class 3-6",
      short_description: "Building the foundation of confident communication through storytelling and play.",
      price: "1999",
      batch_size: "1:3 Live",
      duration: "3 Months",
      schedule: "2 Classes / Week",
      image_url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "Rising Stars",
      slug: "rising-stars",
      age_group: "Class 7-10",
      short_description: "Developing debate skills, stage presence, and the art of persuasion.",
      price: "2499",
      batch_size: "1:3 Live",
      duration: "4 Months",
      schedule: "3 Classes / Week",
      image_url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "Global Leaders",
      slug: "global-leaders",
      age_group: "College Students",
      short_description: "Professional communication, interview skills, and leadership development for young adults.",
      price: "2999",
      batch_size: "1:3 Live",
      duration: "4 Months",
      schedule: "2 Classes / Week",
      image_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 4,
      title: "Corporate Training",
      slug: "corporate-training",
      age_group: "Working Professionals",
      short_description: "Enhance your executive presence, presentation skills, and professional networking.",
      price: "4999",
      batch_size: "1:1 Coaching",
      duration: "2 Months",
      schedule: "Custom Schedule",
      image_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 5,
      title: "Summer Camps",
      slug: "summer-camps",
      age_group: "All Ages",
      short_description: "Immersive workshops focused on storytelling, theatre, and creative expression.",
      price: "3499",
      batch_size: "Group Live",
      duration: "15 Days",
      schedule: "Daily Session",
      image_url: "https://images.unsplash.com/photo-1472289065668-ce6a9a442c6a?w=800&auto=format&fit=crop&q=60"
    }
  ];

  const displayPrograms = programs.length > 0 ? programs : staticPrograms;

  return (
    <div className="bg-white pt-32 pb-20 px-8 lg:px-24 font-fredoka min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-6 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-black uppercase tracking-widest mb-6">Explore Courses</motion.div>
          <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">Master the Art of <br/><span className="text-[hsl(190,70%,42%)]">Communication</span></h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">Scientifically designed curriculum to help your child overcome stage fear and lead with confidence.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[hsl(190,70%,42%)]" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {displayPrograms.map((program, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden flex flex-col hover:border-[hsl(190,70%,42%)] transition-all duration-500"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden">
                   <img src={program.image_url || 'https://via.placeholder.com/800x600'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={program.title} />
                   <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-widest text-[hsl(190,70%,42%)]">{program.age_group}</div>
                </div>

                <div className="p-10 flex flex-col flex-grow">
                   <h3 className="text-3xl font-black mb-4 group-hover:text-[hsl(190,70%,42%)] transition-colors">{program.title}</h3>
                   <p className="text-gray-500 font-medium mb-8 line-clamp-2">{program.short_description || program.description}</p>
                   
                   {/* Horizontal Stats */}
                   <div className="flex items-center justify-between py-6 border-y border-gray-50 mb-8">
                      <div className="text-center">
                         <div className="flex items-center gap-1 text-[hsl(190,70%,42%)] font-black text-sm mb-1">
                            <Users className="w-3 h-3" /> {program.batch_size || '1:3'}
                         </div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase">Ratio</p>
                      </div>
                      <div className="text-center border-x border-gray-100 px-6">
                         <div className="flex items-center gap-1 text-orange-500 font-black text-sm mb-1">
                            <Clock className="w-3 h-3" /> {program.duration || '3m'}
                         </div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase">Duration</p>
                      </div>
                      <div className="text-center">
                         <div className="flex items-center gap-1 text-blue-500 font-black text-sm mb-1">
                            <Calendar className="w-3 h-3" /> {program.schedule?.split(' ')[0] || '2'}
                         </div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase">Weekly</p>
                      </div>
                   </div>

                   <div className="mt-auto space-y-4">
                      <div className="flex items-end justify-between mb-2">
                         <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Enrollment Fee</p>
                            <p className="text-3xl font-black">₹{program.price}</p>
                         </div>
                         <Link to={`/program/${program.slug || program.id}`} className="flex items-center gap-2 text-[hsl(190,70%,42%)] font-black text-sm hover:translate-x-2 transition-transform">
                            View Curriculum <ArrowRight className="w-4 h-4" />
                         </Link>
                      </div>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-5 bg-[hsl(190,70%,42%)] text-white font-black text-lg rounded-[1.5rem] shadow-xl shadow-[hsl(190,70%,42%)]/20 hover:bg-[hsl(190,70%,48%)] transition-all"
                      >
                         Book Free Demo
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ProgramsPage;
