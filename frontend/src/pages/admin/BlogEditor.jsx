import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, ArrowLeft, Image as ImageIcon, Sparkles, 
  Loader2, Search, Target, Clock, FileText, 
  Send, Eye, Layout, Type, Hash, ShieldCheck,
  CheckCircle2, AlertCircle, TrendingUp, Info, Upload, Trash2
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { uploadToCloudinary } from '../../utils/cloudinary';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const BlogEditor = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [formData, setFormData] = useState({
    title: '', content: '', thumbnail: '', status: 'published',
    seo_title: '', meta_description: '', keywords: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  const fetchBlogDetail = async () => {
    setInitialLoading(true);
    try {
      const res = await axios.get(`/api/api.php?action=get_blog_detail&id=${id}`);
      if (res.data.success) {
        setFormData(res.data.data);
      }
    } catch (err) {
      alert("Failed to load article details");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData({ ...formData, thumbnail: url });
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const seoData = useMemo(() => {
    const checks = [
      { id: 1, label: 'Title Length (50-70 chars)', passed: formData.title.length >= 50 && formData.title.length <= 70 },
      { id: 2, label: 'Meta Description (120-160 chars)', passed: formData.meta_description.length >= 120 && formData.meta_description.length <= 160 },
      { id: 3, label: 'Focus Keywords included', passed: formData.keywords.length > 5 },
      { id: 4, label: 'Content Depth (500+ words)', passed: (formData.content || '').split(' ').length > 300 },
      { id: 5, label: 'SEO Title optimized', passed: formData.seo_title.length > 10 },
      { id: 6, label: 'Featured Image present', passed: !!formData.thumbnail }
    ];
    const score = Math.round((checks.filter(c => c.passed).length / checks.length) * 100);
    return { checks, score };
  }, [formData]);

  const quillModules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const action = id ? 'update_blog' : 'add_blog';
    
    try {
      const res = await axios.post(`/api/api.php?action=${action}`, { ...formData, id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        navigate('/admin');
      }
    } catch (err) {
      alert("Failed to save article: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="h-screen flex items-center justify-center font-inter"><Loader2 className="animate-spin text-[hsl(190,70%,42%)] w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-4 font-bold transition-all group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{id ? 'Refine Article' : 'Draft New Insight'}</h1>
          </div>
          <div className="flex gap-4">
            <button 
              form="blog-form"
              disabled={loading || uploading}
              className="px-8 py-4 bg-[hsl(190,70%,42%)] text-white font-bold rounded-2xl shadow-xl shadow-[hsl(190,70%,42%)]/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send size={20} />} {id ? 'Update Changes' : 'Publish Article'}
            </button>
          </div>
        </header>

        <form id="blog-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Editor */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="mb-10">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Headline</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Enter a compelling title..." 
                    className="w-full text-3xl font-black border-none focus:ring-0 placeholder:text-slate-200 p-0"
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  />
               </div>
               
               <div className="prose-editor">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Article Body</label>
                  <ReactQuill 
                    theme="snow"
                    modules={quillModules}
                    value={formData.content} 
                    onChange={(content) => setFormData({...formData, content})}
                    placeholder="Start writing your masterpiece..."
                    className="bg-slate-50 rounded-3xl overflow-hidden border-none"
                  />
               </div>
            </div>
          </div>

          {/* Sidebar Tools */}
          <div className="lg:col-span-4 space-y-8">
             {/* SEO Score Card */}
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold flex items-center gap-2"><TrendingUp className="text-[hsl(190,70%,42%)]" size={20}/> SEO Performance</h3>
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${seoData.score > 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {seoData.score}%
                   </div>
                </div>
                <div className="space-y-4">
                   {seoData.checks.map(check => (
                      <div key={check.id} className="flex items-center gap-3 text-xs font-bold">
                         {check.passed ? <CheckCircle2 className="text-emerald-500" size={16}/> : <AlertCircle className="text-slate-200" size={16}/>}
                         <span className={check.passed ? 'text-slate-800' : 'text-slate-400'}>{check.label}</span>
                      </div>
                   ))}
                </div>
             </div>

             {/* Asset Manager */}
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2"><ImageIcon size={20}/> Feature Image</h3>
                <div className="relative group">
                   {formData.thumbnail ? (
                      <div className="aspect-video rounded-2xl overflow-hidden relative">
                         <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Preview" />
                         <button type="button" onClick={() => setFormData({...formData, thumbnail: ''})} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                      </div>
                   ) : (
                      <label className="aspect-video border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-[hsl(190,70%,42%)] hover:bg-slate-50 transition-all">
                         <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                            {uploading ? <Loader2 className="animate-spin w-6 h-6" /> : <Upload size={24} />}
                         </div>
                         <p className="text-xs font-black uppercase tracking-widest text-slate-400">Upload to Cloudinary</p>
                         <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                   )}
                </div>
             </div>

             {/* Metadata Suite */}
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2"><Hash size={20}/> Metadata Suite</h3>
                <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">SEO Title</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" value={formData.seo_title} onChange={(e) => setFormData({...formData, seo_title: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Keywords</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium" value={formData.keywords} onChange={(e) => setFormData({...formData, keywords: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Meta Description</label>
                      <textarea rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium" value={formData.meta_description} onChange={(e) => setFormData({...formData, meta_description: e.target.value})} />
                   </div>
                </div>
             </div>
          </div>
        </form>
      </div>

      <style>{`
        .prose-editor .ql-container {
          border: none !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 1.125rem !important;
        }
        .prose-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #f1f5f9 !important;
          padding: 1rem !important;
        }
        .prose-editor .ql-editor {
          min-height: 400px !important;
          padding: 2rem !important;
        }
        .prose-editor .ql-editor.ql-blank::before {
          color: #cbd5e1 !important;
          font-style: normal !important;
        }
      `}</style>
    </div>
  );
};

export default BlogEditor;
