import React, { useState } from 'react';
import { X, CheckCircle, Loader2, MessageSquare } from 'lucide-react';
import axios from 'axios';

const BookingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    parent_name: '',
    phone: '',
    child_age: '',
    city: '',
    notes: '',
    source: 'website_demo'
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    try {
      const response = await axios.post('/api/api.php?action=submit_lead', {
        name: formData.parent_name,
        phone: formData.phone,
        email: `age:${formData.child_age} | city:${formData.city}`, // Storing age/city in email or dedicated fields
        notes: formData.notes,
        source: 'website_demo'
      });
      if (response.data.success) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setFormData({ parent_name: '', phone: '', child_age: '', city: '', notes: '', source: 'website_demo' });
        }, 3000);
      } else {
        setStatus('error');
        setErrorMessage(response.data.error || 'Something went wrong');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 lg:p-12 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Enquiry Received!</h2>
            <p className="text-gray-500 font-medium">A coordinator will call you soon to confirm details.</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-2">Request a Free Demo</h2>
            <p className="text-gray-500 mb-8 font-medium">Unlock your child's confidence today!</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Parent's Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Your name"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[hsl(190,70%,42%)] focus:outline-none transition-all font-medium"
                    value={formData.parent_name}
                    onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+91 98765 43210"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[hsl(190,70%,42%)] focus:outline-none transition-all font-medium"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Child's Age</label>
                  <select 
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[hsl(190,70%,42%)] focus:outline-none transition-all font-medium"
                    value={formData.child_age}
                    onChange={(e) => setFormData({...formData, child_age: e.target.value})}
                  >
                    <option value="">Select age</option>
                    {[...Array(15)].map((_, i) => (
                      <option key={i} value={i + 5}>{i + 5} Years</option>
                    ))}
                    <option value="college">College Student</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your City</label>
                  <input 
                    required
                    type="text" 
                    placeholder="City name"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[hsl(190,70%,42%)] focus:outline-none transition-all font-medium"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Anything else? (optional)</label>
                <textarea 
                  rows="3"
                  placeholder="Tell us about your child's interests or any specific needs..."
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[hsl(190,70%,42%)] focus:outline-none transition-all font-medium"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-xs text-yellow-800 font-medium leading-relaxed">
                <p>This is an enquiry, not a booking. A coordinator will call to confirm details.</p>
              </div>

              {status === 'error' && (
                <p className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-xl border border-red-100">
                  ⚠️ Error: {errorMessage}
                </p>
              )}

              <button 
                disabled={status === 'loading'}
                className="w-full py-5 bg-[hsl(190,70%,42%)] text-white font-black text-xl rounded-2xl hover:scale-[1.01] transition-all shadow-xl shadow-[hsl(190,70%,42%)]/20 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Request a Free Demo'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
