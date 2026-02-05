
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Loader2, Github } from 'lucide-react';
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      {projects.map((project, idx) => (
        <motion.div 
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="group"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl mb-8 bg-neutral-900 shadow-2xl">
            <img 
              src={project.image_url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/10 transition-colors" />
            
            {/* Action Buttons on Hover */}
            <div className="absolute bottom-6 right-6 flex gap-3">
              {project.github_link && (
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => window.open(project.github_link, '_blank')}
                  className="w-12 h-12 bg-neutral-900/80 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0"
                >
                  <Github className="w-5 h-5" />
                </motion.button>
              )}
              {project.live_link && (
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => window.open(project.live_link, '_blank')}
                  className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 delay-75"
                >
                  <ExternalLink className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{project.category}</span>
                <h3 className="text-2xl font-black uppercase italic tracking-tight group-hover:text-accent transition-colors leading-none">{project.title}</h3>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-800 group-hover:text-accent transition-colors mt-4" />
            </div>
            
            {project.description && (
              <p className="text-neutral-500 text-sm font-medium leading-relaxed line-clamp-3 group-hover:text-neutral-400 transition-colors">
                {project.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Projects;
