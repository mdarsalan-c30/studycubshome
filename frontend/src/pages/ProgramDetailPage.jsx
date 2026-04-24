import React, { useState, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, Clock, Users, Calendar, ArrowLeft, 
  Sparkles, Target, Star, ShieldCheck, ChevronRight, MessageSquare, Loader2
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import BookingModal from '../components/BookingModal';

const ProgramDetailPage = () => {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useSEO({
    title: program ? `${program.title} | StudyCubs – ${program.age_group} Program` : 'Program Details | StudyCubs',
    description: program ? program.short_description || `Enroll in ${program.title} – a live online program by StudyCubs for ${program.age_group} students.` : 'Explore live online programs by StudyCubs for public speaking and confidence.',
    canonical: `https://www.studycubs.com/program/${slug}`,
    schema: program ? {
      '@context': 'https://schema.org',
      '@type': 'Course',
      'name': program.title,
      'description': program.short_description,
      'provider': { '@type': 'Organization', 'name': 'StudyCubs', 'url': 'https://www.studycubs.com' },
      'image': program.image_url,
      'url': `https://www.studycubs.com/program/${slug}`,
      'educationalCredentialAwarded': 'Certificate of Completion'
    } : null
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/api/api.php?action=get_program_detail&slug=${slug}`);
        if (res.data.success) {
          const data = res.data.data;
          // Parse JSON fields
          if (typeof data.highlights === 'string') data.highlights = JSON.parse(data.highlights);
          if (typeof data.learning_outcomes === 'string') data.learning_outcomes = JSON.parse(data.learning_outcomes);
          setProgram(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[hsl(190,70%,42%)]" /></div>;
  if (!program) return <div className="h-screen flex flex-col items-center justify-center p-8 text-center">
    <h2 className="text-4xl font-black mb-4">Program Not Found</h2>
    <button onClick={() => navigate('/programs')} className="text-[hsl(190,70%,42%)] font-bold flex items-center gap-2"><ArrowLeft/> Back to Programs</button>
  </div>;

  return (
    <div className="bg-white font-fredoka">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-8 lg:px-24 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-black uppercase tracking-widest mb-8">
              {program.age_group} Course
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.1]">
              Unlock Your Child's <br/><span className="text-[hsl(190,70%,42%)]">Superpower.</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {program.short_description} {program.long_description && <span className="block mt-4">{program.long_description}</span>}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-10 py-5 bg-[hsl(190,70%,42%)] text-white font-black text-lg rounded-[1.5rem] shadow-2xl shadow-[hsl(190,70%,42%)]/30 hover:scale-105 transition-all"
              >
                Book Free Demo
              </button>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-gray-100 text-gray-900 font-black text-lg rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
              >
                <MessageSquare className="text-green-500 w-6 h-6" /> Chat With Us
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative"
          >
            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl shadow-gray-200">
               <img src={program.image_url || 'https://via.placeholder.com/1200x800'} className="w-full aspect-[4/3] object-cover" alt={program.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
               <div className="absolute bottom-10 left-10 text-white">
                  <p className="text-4xl font-black">₹{program.price}</p>
                  <p className="text-xs font-black uppercase tracking-widest opacity-80">Full Course Enrollment</p>
               </div>
            </div>
            {/* Float Badge */}
            <div className="absolute -bottom-10 -right-10 bg-[hsl(40,90%,55%)] text-white p-10 rounded-full w-40 h-40 flex flex-col items-center justify-center rotate-12 shadow-xl">
               <span className="text-3xl font-black">100%</span>
               <span className="text-[10px] font-black uppercase text-center leading-none">Live<br/>Interactivity</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights & Logistics Grid */}
      <section className="bg-gray-50 py-32 px-8 lg:px-24">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
               {/* Highlights */}
               <div className="lg:col-span-7">
                  <h2 className="text-4xl font-black mb-12 flex items-center gap-4">
                    Program <span className="text-[hsl(190,70%,42%)]">Highlights</span> <Sparkles className="text-yellow-400 w-8 h-8" />
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {program.highlights?.map((item, i) => (
                      <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                          <CheckCircle className="text-green-500 w-6 h-6" />
                        </div>
                        <p className="font-bold text-gray-700 leading-tight pt-1">{item}</p>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Logistics Card */}
               <div className="lg:col-span-5">
                  <div className="bg-[hsl(190,70%,42%)] p-10 rounded-[3rem] text-white shadow-2xl shadow-[hsl(190,70%,42%)]/20 relative overflow-hidden">
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                     <h3 className="text-2xl font-black mb-8 border-b border-white/20 pb-6">Course Specifications</h3>
                     <div className="space-y-8">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><Clock className="w-6 h-6" /></div>
                           <div><p className="text-[10px] font-black uppercase opacity-60">Duration</p><p className="text-xl font-black">{program.duration}</p></div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
                           <div><p className="text-[10px] font-black uppercase opacity-60">Ratio</p><p className="text-xl font-black">{program.batch_size} Interactive</p></div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><Calendar className="w-6 h-6" /></div>
                           <div><p className="text-[10px] font-black uppercase opacity-60">Schedule</p><p className="text-xl font-black">{program.schedule}</p></div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><Target className="w-6 h-6" /></div>
                           <div><p className="text-[10px] font-black uppercase opacity-60">Session Time</p><p className="text-xl font-black">{program.timing}</p></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Outcomes */}
      <section className="py-32 px-8 lg:px-24">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-black mb-16 leading-tight">What Your Ward Will <br/><span className="text-[hsl(190,70%,42%)]">Accomplish</span></h2>
            <div className="space-y-6 text-left">
               {program.learning_outcomes?.map((outcome, i) => (
                  <div key={i} className="flex items-center gap-6 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:bg-white hover:shadow-xl transition-all">
                     <div className="w-12 h-12 bg-[hsl(190,70%,42%)] text-white rounded-2xl flex items-center justify-center font-black text-xl shrink-0">
                        {i + 1}
                     </div>
                     <p className="text-xl font-bold text-gray-800">{outcome}</p>
                     <ChevronRight className="ml-auto text-gray-200 group-hover:text-[hsl(190,70%,42%)] transition-colors" />
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="pb-32 px-8 lg:px-24">
         <div className="max-w-6xl mx-auto bg-gray-900 rounded-[4rem] p-12 lg:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
               <div className="absolute top-10 left-10 w-32 h-32 bg-[hsl(190,70%,42%)] rounded-full blur-3xl"></div>
               <div className="absolute bottom-10 right-10 w-40 h-40 bg-[hsl(40,90%,55%)] rounded-full blur-3xl"></div>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-8">Ready to see the <br/>transformation?</h2>
            <p className="text-gray-400 text-xl font-medium mb-12 max-w-2xl mx-auto">Take the first step towards your child's brighter future. Book a free diagnostic demo today.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-12 py-6 bg-[hsl(190,70%,42%)] text-white font-black text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all"
            >
              Secure Free Demo Slot
            </button>
         </div>
      </section>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ProgramDetailPage;
