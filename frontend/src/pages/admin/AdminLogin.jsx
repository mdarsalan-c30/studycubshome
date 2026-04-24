import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await axios.post('/api/api.php?action=login', formData);
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminUser', JSON.stringify(res.data.user));
        navigate('/admin');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-fredoka flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[hsl(190,70%,42%)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[hsl(190,70%,42%)]/20">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black mb-2">Study<span className="text-[hsl(190,70%,42%)]">Admin</span></h1>
          <p className="text-gray-400 font-medium">Control center for StudyCubs</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  required
                  type="email" 
                  placeholder="arsalan@studycubs.com"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[hsl(190,70%,42%)] focus:outline-none transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[hsl(190,70%,42%)] focus:outline-none transition-all font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm font-bold text-center">Invalid email or password</p>
            )}

            <button 
              disabled={status === 'loading'}
              className="w-full py-5 bg-[hsl(190,70%,42%)] text-white font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[hsl(190,70%,42%)]/20 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Sign In <ArrowRight className="w-6 h-6" /></>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
