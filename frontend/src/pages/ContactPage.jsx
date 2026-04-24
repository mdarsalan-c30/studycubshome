import React, { useState } from 'react';
import useSEO from '../hooks/useSEO';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  useSEO({
    title: 'Contact Us | StudyCubs – Book a Free Demo or Talk to Our Team',
    description: 'Get in touch with StudyCubs. Book a free demo session, ask about our programs, or speak to our team. We are based in Pune, India.',
    canonical: 'https://www.studycubs.com/contact'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await axios.post('/api/api.php?action=submit_enquiry', formData);
      if (res.data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white pt-32 pb-20 px-8 lg:px-24 font-fredoka min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h1 className="text-5xl font-bold mb-6">Let's <span className="text-[hsl(190,70%,42%)]">Connect</span></h1>
            <p className="text-xl text-gray-500 font-medium mb-12">Have questions? We're here to help you on your journey to confidence.</p>
            
            <div className="space-y-8">
              <div className="flex gap-6 items-center p-6 bg-gray-50 rounded-[2rem]">
                <div className="w-14 h-14 bg-[hsl(190,70%,42%)] rounded-2xl flex items-center justify-center text-white shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Call Us</p>
                  <p className="text-xl font-bold">+91 81474 34014</p>
                </div>
              </div>
              
              <div className="flex gap-6 items-center p-6 bg-gray-50 rounded-[2rem]">
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">WhatsApp</p>
                  <p className="text-xl font-bold">81474 34014</p>
                </div>
              </div>

              <div className="flex gap-6 items-center p-6 bg-gray-50 rounded-[2rem]">
                <div className="w-14 h-14 bg-[hsl(40,90%,55%)] rounded-2xl flex items-center justify-center text-white shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Email Us</p>
                  <p className="text-xl font-bold">support@studycubs.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 lg:p-16 rounded-[3rem] border border-gray-100 shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-20">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-2">Message Sent!</h2>
                <p className="text-gray-500 font-medium">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter full name"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[hsl(190,70%,42%)] focus:outline-none transition-all font-medium"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="name@example.com"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[hsl(190,70%,42%)] focus:outline-none transition-all font-medium"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">How can we help?</label>
                  <textarea 
                    required
                    rows="5"
                    placeholder="Write your message here..."
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[hsl(190,70%,42%)] focus:outline-none transition-all font-medium"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <button className="w-full py-5 bg-[hsl(190,70%,42%)] text-white font-black text-xl rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-[hsl(190,70%,42%)]/20 flex items-center justify-center gap-2">
                  Send Message <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
