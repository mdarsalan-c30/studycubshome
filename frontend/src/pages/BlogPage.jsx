import React, { useState, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Sparkles, Loader2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Blog | StudyCubs – Expert Advice for Confident Kids',
    description: 'Read expert articles on public speaking, confidence building, communication skills and parenting tips from the StudyCubs team.',
    canonical: 'https://www.studycubs.com/blog'
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/api/api.php?action=get_blogs');
        if (res.data.success) setBlogs(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const staticBlogs = [
    {
      id: 1,
      title: "Why Public Speaking is the #1 Skill for Kids",
      slug: "why-public-speaking-is-the-1-skill-for-kids",
      thumbnail: "https://images.unsplash.com/photo-1475721027187-40017c050a1b?w=800&auto=format&fit=crop&q=60",
      created_at: "Oct 24, 2023",
      category: "Parenting"
    },
    {
      id: 2,
      title: "5 Games to Overcome Stage Fear at Home",
      slug: "5-games-to-overcome-stage-fear-at-home",
      thumbnail: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=60",
      created_at: "Oct 20, 2023",
      category: "Activities"
    }
  ];

  const displayBlogs = blogs.length > 0 ? blogs : staticBlogs;

  return (
    <div className="bg-white pt-32 pb-20 px-8 lg:px-24 font-fredoka min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl text-center lg:text-left">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles className="w-4 h-4" /> StudyCubs Journal
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">Expert Advice for <br/><span className="text-[hsl(190,70%,42%)]">Confident Kids</span></h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">Resources, guides, and tips to help your child find their voice and lead with confidence.</p>
          </div>
          
          <div className="relative w-full lg:w-96">
            <input type="text" placeholder="Search articles..." className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[2rem] focus:bg-white focus:border-[hsl(190,70%,42%)] transition-all font-medium shadow-sm" />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-6 h-6" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[hsl(190,70%,42%)]" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {displayBlogs.map((blog, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden hover:shadow-2xl hover:border-[hsl(190,70%,42%)] transition-all duration-500 cursor-pointer"
              >
                <Link to={`/blog/${blog.slug || blog.id}`} className="block relative aspect-[16/10] overflow-hidden">
                  <img src={blog.thumbnail || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=60'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={blog.title} />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-purple-600">
                    {blog.category || 'Article'}
                  </div>
                </Link>

                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <Link to={`/blog/${blog.slug || blog.id}`} className="text-2xl font-black mb-6 leading-tight group-hover:text-[hsl(190,70%,42%)] transition-colors line-clamp-2">
                    {blog.title}
                  </Link>
                  
                  <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center font-black text-[hsl(190,70%,42%)]">S</div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">StudyCubs Editor</p>
                     </div>
                     <Link to={`/blog/${blog.slug || blog.id}`} className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-[hsl(190,70%,42%)] group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                     </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
