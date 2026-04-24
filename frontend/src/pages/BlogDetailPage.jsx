import React, { useState, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useSEO({
    title: blog ? `${blog.title} | StudyCubs Journal` : 'Blog | StudyCubs',
    description: blog ? blog.meta_description || `${blog.title} - Read on StudyCubs Journal` : 'Expert articles on public speaking and confidence for kids.',
    canonical: `https://www.studycubs.com/blog/${slug}`,
    schema: blog ? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': blog.title,
      'image': blog.thumbnail,
      'author': { '@type': 'Organization', 'name': 'StudyCubs' },
      'publisher': { '@type': 'Organization', 'name': 'StudyCubs', 'logo': { '@type': 'ImageObject', 'url': 'https://yt3.googleusercontent.com/a0RnR_z95rDRo1CJtZQoJjORgIgM_V4hpNVqU8r-BWwZJkakuu-48rnIaw3msBkFBpv1yCAB=s160-c-k-c0x00ffffff-no-rj' } },
      'datePublished': blog.created_at,
      'url': `https://www.studycubs.com/blog/${slug}`
    } : null
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/api.php?action=get_blog_detail&slug=${slug}`);
        if (res.data.success) {
          setBlog(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[hsl(190,70%,42%)]" /></div>;
  if (!blog) return <div className="h-screen flex flex-col items-center justify-center p-8 text-center">
    <h2 className="text-4xl font-black mb-4">Article Not Found</h2>
    <Link to="/blog" className="text-[hsl(190,70%,42%)] font-bold flex items-center gap-2"><ArrowLeft/> Back to Blog</Link>
  </div>;

  return (
    <div className="bg-white font-fredoka min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-8 lg:px-0">
        {/* Navigation */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-[hsl(190,70%,42%)] transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" /> Back to Journal
        </Link>

        {/* Header */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest mb-8">
            <Sparkles className="w-4 h-4" /> Editorial
          </div>
          <h1 className="text-4xl lg:text-6xl font-black mb-10 leading-[1.2]">{blog.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-6 py-10 border-y border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[hsl(190,70%,42%)] text-white rounded-full flex items-center justify-center font-black text-xl">S</div>
              <div>
                <p className="font-black text-gray-900">StudyCubs Editor</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expert Faculty</p>
              </div>
            </div>
            <div className="flex items-center gap-10">
               <div className="text-right">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Published</p>
                  <p className="font-bold text-gray-900">{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
               </div>
               <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-[hsl(190,70%,42%)] hover:text-white transition-all">
                  <Share2 className="w-6 h-6" />
               </button>
            </div>
          </div>
        </header>

        {/* Thumbnail */}
        <div className="mb-20 rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200">
          <img src={blog.thumbnail || 'https://via.placeholder.com/1200x800'} className="w-full aspect-video object-cover" alt={blog.title} />
        </div>

        {/* Content */}
        <article 
          className="prose prose-xl max-w-none prose-p:font-medium prose-p:text-gray-600 prose-headings:font-black prose-img:rounded-3xl prose-a:text-[hsl(190,70%,42%)] mb-32"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Footer / CTA */}
        <div className="bg-gray-50 rounded-[4rem] p-12 lg:p-24 text-center">
           <h3 className="text-3xl lg:text-4xl font-black mb-8">Liked this article?</h3>
           <p className="text-gray-500 text-xl font-medium mb-12 max-w-xl mx-auto">Explore our programs designed to put these skills into practice for your child.</p>
           <Link to="/programs" className="inline-flex items-center gap-3 px-12 py-6 bg-gray-900 text-white font-black text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all">
             Browse Programs <ArrowRight className="w-6 h-6" />
           </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
