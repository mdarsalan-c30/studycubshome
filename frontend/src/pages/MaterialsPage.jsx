import React, { useState, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Download, Lock, Search, Filter, BookOpen, ImageIcon, Eye, X } from 'lucide-react';

const MaterialsPage = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useSEO({
    title: 'Study Materials | StudyCubs – Free Resources for Kids & Teens',
    description: 'Access free study materials, worksheets, PDFs and resources by StudyCubs to help kids improve public speaking, communication and confidence.',
    canonical: 'https://www.studycubs.com/materials'
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('/api/api.php?action=get_materials');
      if (res.data.success) {
        setMaterials(res.data.data);
      }
    } catch (err) {
      console.error("Fetch materials error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(m => {
    const title = m.title ? m.title.toLowerCase() : '';
    const description = m.description ? m.description.toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    return title.includes(search) || description.includes(search);
  });

  return (
    <div className="bg-white pt-32 pb-20 px-8 lg:px-24 font-fredoka min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl text-left">
            <h1 className="text-5xl font-bold mb-4">Study <span className="text-[hsl(190,70%,42%)]">Materials</span></h1>
            <p className="text-xl text-gray-500 font-medium">Download high-quality guides, checklists, and templates to kickstart your journey.</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search materials..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[hsl(190,70%,42%)] focus:outline-none transition-all font-medium" 
              />
            </div>
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-[hsl(190,70%,42%)] rounded-full animate-spin"></div>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaterials.map((m, i) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 relative group flex flex-col"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-[hsl(190,70%,42%)] group-hover:bg-[hsl(190,70%,42%)] group-hover:text-white transition-all">
                  {m.type === 'pdf' ? <FileText className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                </div>
                
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-[hsl(40,90%,55%)]">{m.type}</span>
                  <span className="text-xs font-bold text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-[hsl(190,70%,42%)] transition-all">{m.title}</h3>
                <p className="text-sm text-gray-400 font-medium mb-8 line-clamp-2">{m.description}</p>
                
                <div className="mt-auto flex gap-3">
                  <button 
                    onClick={() => navigate(`/material/${m.slug || m.id}`)}
                    className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
                  >
                    <Eye className="w-5 h-5" />
                    Open
                  </button>
                  <a 
                    href={m.file_url} 
                    download
                    target="_blank"
                    className="flex-1 py-4 bg-[hsl(190,70%,42%)] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[hsl(190,70%,35%)] shadow-lg shadow-[hsl(190,70%,42%)]/20 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Save
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lead Capture */}
        <div className="mt-20 p-12 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[3rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Want more advanced materials?</h2>
          <p className="text-gray-500 mb-8 font-medium max-w-xl mx-auto">Our Premium Resource Library is available exclusively for our students. Join a demo session to get full access.</p>
          <a href="/#contact" className="inline-block px-10 py-5 bg-[hsl(40,90%,55%)] text-white font-black text-xl rounded-2xl shadow-xl shadow-[hsl(40,90%,55%)]/20 hover:scale-105 transition-all">Request Full Access</a>
        </div>
      </div>
    </div>
  );
};

export default MaterialsPage;
