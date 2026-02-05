
import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import GetProjectModal from './GetProjectModal';

const Hero: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const skills = ['n8n', 'Python', 'SQL', 'PostgreSQL', 'Power BI', 'Supabase', 'Docker'];

  useEffect(() => {
    async function getProfile() {
      try {
        const { data } = await supabase.from('profiles').select('*').limit(1).single();
        if (data) setProfile(data);
      } catch (e) {
        console.warn("Could not fetch profile, using defaults.");
      }
    }
    getProfile();
  }, []);

  const handleResume = () => {
    if (profile?.resume_url) {
      window.open(profile.resume_url, '_blank');
    } else {
      alert("Resume link hasn't been set in the Admin Panel yet! Go to /admin and add it.");
    }
  };

  // Added explicit Variants type to fix motion type errors
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  // Added explicit Variants type to handle tuple for ease [0.16, 1, 0.3, 1]
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 px-6 lg:px-24">
      <GetProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        <motion.div variants={containerVars} initial="hidden" animate="visible">
          <motion.div variants={itemVars} className="flex items-center gap-2 mb-4">
             <h2 className="text-3xl font-bold">Hello</h2>
             <span className="w-2 h-2 bg-accent rounded-full mt-2 animate-ping"></span>
          </motion.div>
          
          <motion.h1 variants={itemVars} className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
            <span className="text-neutral-400">I'm </span>{profile?.full_name?.split(' ')[0] || 'Adam'} <br />
            <motion.span 
              animate={{ color: ['#ff5733', '#ff8c00', '#ff5733'] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="italic"
            >
              {profile?.role || 'Automation'}
            </motion.span> specialist
          </motion.h1>
          
          <motion.div variants={itemVars} className="flex flex-wrap gap-4 mt-10">
            <motion.button 
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-orange-500/20"
            >
              Get a project? <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResume}
              className="border border-neutral-700 text-white px-8 py-4 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              My resume <Download className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }} 
          animate={{ opacity: 1, scale: 1, rotate: 0 }} 
          transition={{ duration: 1, ease: "easeOut" }} 
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-accent/20 blur-[120px] rounded-full" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border-2 border-dashed border-accent/20 rounded-full" 
            />
            <div className="relative z-10 w-full h-full rounded-full overflow-hidden orange-ring shadow-2xl">
              <img 
                src={profile?.photo_url } 
                alt="Adam Bhiri" 
                className="w-full h-full object-cover rounded-full bg-[#1c232d] grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-20 border-y border-neutral-800/50 py-10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-8 opacity-40">
           {skills.map((skill, i) => (
             <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + (i * 0.1) }}
              key={skill} 
              className="text-xs font-black uppercase tracking-[0.3em] hover:text-accent transition-colors cursor-default"
             >
              {skill}
             </motion.span>
           ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
