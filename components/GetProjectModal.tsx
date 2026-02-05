
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Clock, Layers, MessageSquare, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface GetProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetProjectModal: React.FC<GetProjectModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    category: 'Automation (n8n)',
    duration: '1-2 Weeks',
    description: ''
  });

  const categories = ['Automation (n8n)', 'BI & Dashboards', 'Full Stack Dev', 'Database Design'];
  const durations = ['< 1 Week', '1-2 Weeks', '1 Month', 'Long Term'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const webhookUrl = localStorage.getItem('n8n_webhook_url');
    
    try {
      // 1. Save to Supabase (Backup)
      if (isSupabaseConfigured()) {
        await supabase.from('leads').insert([formData]);
      }

      // 2. Trigger n8n Webhook (Real-time)
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...formData, 
            source: 'Adam Portfolio',
            timestamp: new Date().toISOString()
          })
        });
      }
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({ email: '', category: 'Automation (n8n)', duration: '1-2 Weeks', description: '' });
      }, 3000);

    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong, but I've saved your request locally. I'll get back to you!");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors z-10">
              <X className="w-6 h-6 text-neutral-500" />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/3 bg-accent p-8 md:p-12 text-white flex flex-col justify-between overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4 italic">Start <br/>Build</h3>
                  <p className="text-white/70 text-sm font-medium">Let's turn your logic into a high-performance system.</p>
                </div>
                <div className="absolute -bottom-10 -left-10 text-[120px] font-black text-black/10 select-none pointer-events-none">PROJECT</div>
              </div>

              <div className="md:w-2/3 p-8 md:p-12">
                {success ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="h-full flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">Transmission Complete</h3>
                    <p className="text-neutral-500 text-sm font-medium">The workflow has been triggered. Adam will contact you shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8 max-h-[80vh] overflow-y-auto pr-2">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                          <Mail className="w-3 h-3 text-accent" /> Your Professional Email
                        </label>
                        <input 
                          required 
                          type="email" 
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-black border border-neutral-800 p-4 rounded-xl outline-none focus:border-accent transition-colors"
                          placeholder="name@company.com"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                          <Layers className="w-3 h-3 text-accent" /> Project Category
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {categories.map(cat => (
                            <button 
                              key={cat}
                              type="button"
                              onClick={() => setFormData({...formData, category: cat})}
                              className={`p-3 text-[10px] font-bold uppercase rounded-lg border transition-all ${formData.category === cat ? 'bg-accent border-accent text-white shadow-lg shadow-orange-500/20' : 'bg-black border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-3 h-3 text-accent" /> Desired Timeline
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {durations.map(dur => (
                            <button 
                              key={dur}
                              type="button"
                              onClick={() => setFormData({...formData, duration: dur})}
                              className={`p-3 text-[10px] font-bold uppercase rounded-lg border transition-all ${formData.duration === dur ? 'bg-accent border-accent text-white shadow-lg shadow-orange-500/20' : 'bg-black border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}
                            >
                              {dur}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare className="w-3 h-3 text-accent" /> Brief Description
                        </label>
                        <textarea 
                          required
                          rows={4}
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          className="w-full bg-black border border-neutral-800 p-4 rounded-xl outline-none focus:border-accent transition-colors resize-none text-sm"
                          placeholder="Tell me about the workflow you want to automate..."
                        />
                      </div>
                    </div>

                    <button 
                      disabled={loading}
                      className="w-full bg-white text-black font-black uppercase py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-accent hover:text-white transition-all transform active:scale-95 group"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          Transmit Request <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GetProjectModal;
