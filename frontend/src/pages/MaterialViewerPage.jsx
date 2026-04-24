import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, Share2, FileText, ImageIcon, Globe, Clock, ArrowLeft, X, Maximize2, Minimize2 } from 'lucide-react';

const MaterialViewerPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    fetchMaterial();
    window.scrollTo(0, 0);
  }, [slug]);

  // Handle Escape key to exit full screen
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsFullScreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const fetchMaterial = async () => {
    try {
      const res = await axios.get('/api/api.php?action=get_materials');
      if (res.data.success) {
        const item = res.data.data.find(m => m.slug === slug || m.id.toString() === slug);
        setMaterial(item);
      }
    } catch (err) {
      console.error("Fetch material error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: material.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-20">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-[hsl(190,70%,42%)] rounded-full animate-spin"></div>
    </div>
  );

  if (!material) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white pt-20">
      <h2 className="text-2xl font-bold mb-4">Material Not Found</h2>
      <button onClick={() => navigate('/materials')} className="text-[hsl(190,70%,42%)] font-bold flex items-center gap-2"><ChevronLeft /> Back to Library</button>
    </div>
  );

  return (
    <div className={`min-h-screen bg-slate-50 ${isFullScreen ? 'overflow-hidden' : 'pt-24 pb-12'} font-fredoka`}>
      <div className={`max-w-7xl mx-auto px-6 lg:px-12 ${isFullScreen ? 'max-w-none px-0' : ''}`}>
        
        {/* Navigation & Slim Actions (Hidden in Full Screen) */}
        {!isFullScreen && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <button 
              onClick={() => navigate('/materials')} 
              className="group flex items-center gap-3 text-slate-400 hover:text-[hsl(190,70%,42%)] font-bold transition-all text-sm"
            >
              <ArrowLeft size={18} />
              Back to Library
            </button>
            
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={handleShare}
                className="px-4 py-2 bg-white text-slate-600 font-bold rounded-lg border border-slate-200 flex items-center gap-2 hover:bg-slate-50 transition-all text-sm"
              >
                <Share2 size={16} /> Share
              </button>
              <a 
                href={material.file_url}
                download
                className="px-6 py-2 bg-[hsl(190,70%,42%)] text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-[hsl(190,70%,42%)]/20 hover:scale-105 transition-all text-sm"
              >
                <Download size={16} /> Save
              </a>
            </div>
          </div>
        )}

        {/* Slim Header (Hidden in Full Screen) */}
        {!isFullScreen && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6">
             <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[hsl(190,70%,42%)] shrink-0">
                   {material.type === 'pdf' ? <FileText size={24} /> : <ImageIcon size={24} />}
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-[hsl(190,70%,42%)] text-[10px] font-black uppercase tracking-widest">Study Resource</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 text-[10px] font-bold">{new Date(material.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                   </div>
                   <h1 className="text-xl lg:text-2xl font-bold text-slate-800">{material.title}</h1>
                </div>
             </div>
          </div>
        )}

        {/* Main Viewer Canvas */}
        <motion.div 
          layout
          className={`${
            isFullScreen 
            ? 'fixed inset-0 z-[1000] bg-slate-900 w-screen h-screen' 
            : 'bg-slate-200 rounded-3xl overflow-hidden shadow-xl border-4 border-white h-[75vh] lg:h-[80vh] relative'
          }`}
        >
          {/* Full Screen Toggle Button */}
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`absolute right-4 top-4 z-[1001] p-3 rounded-xl shadow-lg transition-all ${
              isFullScreen 
              ? 'bg-slate-800/80 text-white hover:bg-slate-700' 
              : 'bg-white/90 text-slate-600 hover:bg-white'
            }`}
            title={isFullScreen ? "Exit Full Screen" : "Full Screen Mode"}
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          {material.type === 'pdf' ? (
            <iframe 
              src={`${material.file_url}#toolbar=0`} 
              className="w-full h-full border-none"
              title={material.title}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center p-6 ${isFullScreen ? 'bg-slate-900' : 'bg-white'}`}>
               <img src={material.file_url} className="max-w-full max-h-full object-contain" alt={material.title} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MaterialViewerPage;
