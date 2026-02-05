
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, useScroll, useSpring, Variants } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { BarChart3, Workflow, Database } from 'lucide-react';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    async function getProfile() {
      try {
        const { data } = await supabase.from('profiles').select('*').limit(1).single();
        if (data) setProfile(data);
      } catch (e) {}
    }
    getProfile();
  }, []);

  const services = [
    { icon: <Workflow className="w-6 h-6 text-accent" />, title: 'Workflow Automation', desc: 'End-to-end n8n processes.' },
    { icon: <Database className="w-6 h-6 text-accent" />, title: 'Data Architecture', desc: 'Supabase & PostgreSQL design.' },
    { icon: <BarChart3 className="w-6 h-6 text-accent" />, title: 'BI Dashboards', desc: 'Insights that drive decisions.' }
  ];

  const stats = [
    { value: '120+', label: 'Automations Built' },
    { value: '95%', label: 'Client Satisfaction' },
    { value: '5+', label: 'Years Experience' }
  ];

  // Added explicit Variants type to fix motion type errors
  const revealVars: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <Router>
      <div className="selection:bg-accent selection:text-white bg-[#0d1117] font-sans">
        <motion.div className="fixed top-0 left-0 right-0 h-1 bg-accent z-[1001] origin-left" style={{ scaleX }} />
        <Navbar />
        
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              
              <section id="about" className="py-32 px-6 lg:px-24">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                      visible: { transition: { staggerChildren: 0.2 } }
                    }}
                    className="space-y-8"
                  >
                    {services.map((s, i) => (
                      <motion.div 
                        variants={revealVars}
                        key={i} 
                        className="flex items-start gap-6 group p-6 rounded-3xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5"
                      >
                        <div className="p-4 rounded-2xl bg-neutral-900 group-hover:bg-accent/20 transition-all duration-500 group-hover:rotate-12">
                          {s.icon}
                        </div>
                        <div>
                          <h4 className="text-xl font-black uppercase italic mb-1 tracking-tight">{s.title}</h4>
                          <p className="text-neutral-500 text-sm font-medium">{s.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={revealVars}
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <h3 className="text-5xl font-black uppercase tracking-tighter italic">About <span className="text-neutral-700">Me</span></h3>
                      <span className="w-12 h-1 bg-accent"></span>
                    </div>
                    <p className="text-neutral-400 text-lg leading-relaxed mb-12 font-medium">
                      {profile?.bio || "I started my journey in BI, but I fell in love with the power of automation. Since then, I've focused on building systems that don't just move data, but save hundreds of human hours every month."}
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {stats.map((stat, i) => (
                        <motion.div 
                          whileHover={{ y: -5, borderColor: '#ff5733' }}
                          key={i} 
                          className="stat-card p-8 rounded-3xl text-center border border-white/5"
                        >
                          <div className="text-4xl font-black text-accent mb-2">{stat.value}</div>
                          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </section>
              
              <section id="work" className="py-24 border-t border-neutral-900/30">
                <div className="px-6 lg:px-24 mb-20 max-w-7xl mx-auto">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-6 mb-4"
                  >
                    <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">Work</h2>
                    <span className="flex-grow h-px bg-neutral-800"></span>
                  </motion.div>
                  <p className="text-neutral-500 max-w-md text-sm font-bold uppercase tracking-widest">Logic-driven solutions for complex businesses.</p>
                </div>
                <div className="px-6 lg:px-24 max-w-7xl mx-auto">
                  <Projects />
                </div>
              </section>
            </main>
          } />
          <Route path="/aywah09" element={<AdminPanel />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
