import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, ArrowLeft, Image as ImageIcon, Sparkles, 
  Loader2, Target, Clock, Users, Calendar, 
  Plus, Trash2, Settings, FileText 
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ProgramEditor = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [formData, setFormData] = useState({
    title: '', age_group: '', short_description: '', long_description: '',
    highlights: [''], learning_outcomes: [''], image_url: '', price: '',
    duration: '3 Months', timing: 'Flexible', schedule: '2 Classes / Week', batch_size: '1:3'
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProgramDetail();
    }
  }, [id]);

  const fetchProgramDetail = async () => {
    setInitialLoading(true);
    try {
      const res = await axios.get(`/api/api.php?action=get_program_detail&id=${id}`);
      if (res.data.success) {
        const data = res.data.data;
        if (typeof data.highlights === 'string') data.highlights = JSON.parse(data.highlights);
        if (typeof data.learning_outcomes === 'string') data.learning_outcomes = JSON.parse(data.learning_outcomes);
        setFormData(data);
      }
    } catch (err) {
      alert("Failed to load program details");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const action = id ? 'update_program' : 'add_program';
    
    try {
      const res = await axios.post(`/api/api.php?action=${action}`, { ...formData, id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        navigate('/admin');
      }
    } catch (err) {
      alert("Failed to save program: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (type, index, value) => {
    const newArr = [...formData[type]];
    newArr[index] = value;
    setFormData({ ...formData, [type]: newArr });
  };

  const addArrayItem = (type) => {
    setFormData({ ...formData, [type]: [...formData[type], ''] });
  };

  const removeArrayItem = (type, index) => {
    const newArr = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: newArr });
  };

  if (initialLoading) return <div className="h-screen flex items-center justify-center font-inter"><Loader2 className="animate-spin text-[hsl(190,70%,42%)] w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter py-16 px-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-4 font-bold transition-all group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{id ? 'Edit Curriculum' : 'Design New Program'}</h1>
          </div>
          <div className="flex gap-4">
            <button 
              form="program-form"
              disabled={loading}
              className="px-8 py-4 bg-[hsl(190,70%,42%)] text-white font-bold rounded-2xl shadow-xl shadow-[hsl(190,70%,42%)]/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />} {id ? 'Update Program' : 'Publish Program'}
            </button>
          </div>
        </header>

        <form id="program-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-2"><FileText className="text-[hsl(190,70%,42%)]" size={20}/> Primary Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Program Title</label>
                  <input required type="text" placeholder="e.g. Little Explorers: Public Speaking" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[hsl(190,70%,42%)]/20 focus:border-[hsl(190,70%,42%)] focus:bg-white transition-all font-bold" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Age Group</label>
                    <input required type="text" placeholder="e.g. Class 3-6" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[hsl(190,70%,42%)]/20 focus:bg-white transition-all font-bold" value={formData.age_group} onChange={(e) => setFormData({...formData, age_group: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Price (₹)</label>
                    <input required type="number" placeholder="e.g. 1499" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[hsl(190,70%,42%)]/20 focus:bg-white transition-all font-bold" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Short Tagline</label>
                  <input required type="text" placeholder="One sentence highlight..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[hsl(190,70%,42%)]/20 focus:bg-white transition-all font-bold" value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Full Curriculum Description</label>
                  <textarea rows="5" placeholder="Describe the journey and impact..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[hsl(190,70%,42%)]/20 focus:bg-white transition-all font-medium leading-relaxed" value={formData.long_description} onChange={(e) => setFormData({...formData, long_description: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Highlights & Outcomes */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                     <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-emerald-600"><Plus size={20}/> Course Highlights</h3>
                     <div className="space-y-4">
                        {formData.highlights.map((h, i) => (
                           <div key={i} className="flex gap-2">
                              <input type="text" value={h} onChange={(e) => handleArrayChange('highlights', i, e.target.value)} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium" />
                              <button type="button" onClick={() => removeArrayItem('highlights', i)} className="p-3 text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                           </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('highlights')} className="w-full py-3 border-2 border-dashed border-slate-100 text-slate-400 rounded-xl font-bold text-xs hover:border-[hsl(190,70%,42%)] hover:text-[hsl(190,70%,42%)] transition-all">+ Add Highlight</button>
                     </div>
                  </div>
                  <div>
                     <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-blue-600"><Target size={20}/> Learning Outcomes</h3>
                     <div className="space-y-4">
                        {formData.learning_outcomes.map((o, i) => (
                           <div key={i} className="flex gap-2">
                              <input type="text" value={o} onChange={(e) => handleArrayChange('learning_outcomes', i, e.target.value)} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium" />
                              <button type="button" onClick={() => removeArrayItem('learning_outcomes', i)} className="p-3 text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                           </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('learning_outcomes')} className="w-full py-3 border-2 border-dashed border-slate-100 text-slate-400 rounded-xl font-bold text-xs hover:border-[hsl(190,70%,42%)] hover:text-[hsl(190,70%,42%)] transition-all">+ Add Outcome</button>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar Config */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h3 className="text-lg font-bold mb-8 flex items-center gap-2"><Settings size={20}/> Logistics</h3>
               <div className="space-y-6">
                  <ConfigInput label="Batch Ratio" value={formData.batch_size} onChange={(v) => setFormData({...formData, batch_size: v})} icon={<Users size={16}/>} />
                  <ConfigInput label="Course Duration" value={formData.duration} onChange={(v) => setFormData({...formData, duration: v})} icon={<Clock size={16}/>} />
                  <ConfigInput label="Weekly Classes" value={formData.schedule} onChange={(v) => setFormData({...formData, schedule: v})} icon={<Calendar size={16}/>} />
                  <ConfigInput label="Session Timing" value={formData.timing} onChange={(v) => setFormData({...formData, timing: v})} icon={<Clock size={16}/>} />
               </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h3 className="text-lg font-bold mb-8 flex items-center gap-2"><ImageIcon size={20}/> Visual Asset</h3>
               <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Thumbnail URL</label>
               <input type="text" placeholder="Cloudinary link..." className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium mb-6" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
               {formData.image_url && (
                  <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                     <img src={formData.image_url} className="w-full h-full object-cover" alt="Preview" />
                  </div>
               )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfigInput = ({ label, value, onChange, icon }) => (
  <div>
     <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</label>
     <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[hsl(190,70%,42%)]/10 transition-all" />
     </div>
  </div>
);

export default ProgramEditor;
