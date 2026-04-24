import React, { useState, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const LegalPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: page ? `${page.title} | StudyCubs` : 'Legal | StudyCubs',
    description: page ? `Read the StudyCubs ${page.title} for information about our terms, policies and legal obligations.` : 'Legal pages for StudyCubs.',
    canonical: `https://www.studycubs.com/page/${slug}`
  });

  useEffect(() => {
    fetchPage();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchPage = async () => {
    try {
      const res = await axios.get(`/api/api.php?action=get_page&slug=${slug}`);
      if (res.data.success) {
        setPage(res.data.data);
      }
    } catch (err) {
      console.error("Fetch page error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-[hsl(190,70%,42%)] rounded-full animate-spin"></div>
    </div>
  );

  if (!page) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <button onClick={() => navigate('/')} className="text-[hsl(190,70%,42%)] font-bold flex items-center gap-2"><ChevronLeft /> Back to Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-8 lg:px-24 font-fredoka">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-10 text-slate-800">{page.title}</h1>
          <div 
            className="prose prose-lg max-w-none text-slate-600 font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LegalPage;
