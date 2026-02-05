
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-accent" /></div>;

  if (projects.length === 0) return <div className="text-center py-20 text-neutral-600 font-bold uppercase tracking-widest">No projects deployed yet.</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, idx) => (
        <motion.div 
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="group"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6">
            <img 
              src={project.image_url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <button 
              onClick={() => project.live_link && window.open(project.live_link, '_blank')}
              className="absolute top-6 right-6 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block">{project.category}</span>
              <h3 className="text-xl font-bold group-hover:text-accent transition-colors">{project.title}</h3>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-700 group-hover:text-accent transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Projects;
