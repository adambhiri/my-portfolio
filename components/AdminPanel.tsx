
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Trash2, Save, Terminal, LogOut, 
  LayoutGrid, ShieldCheck, Database, Loader2, Link as LinkIcon, Camera, User, Settings, Wifi, Zap, Globe, Github, AlignLeft, Inbox, Mail, Calendar, Upload, Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project } from '../types';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'leads' | 'settings'>('profile');
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const profileFileRef = useRef<HTMLInputElement>(null);
  const projectFileRef = useRef<HTMLInputElement>(null);

  // Supabase Config States
  const [dbConfig, setDbConfig] = useState({
    url: localStorage.getItem('supabase_url') || '',
    key: localStorage.getItem('supabase_anon_key') || '',
    n8nUrl: localStorage.getItem('n8n_webhook_url') || ''
  });

  // Data States
  const [profile, setProfile] = useState<any>({ 
    full_name: '', role: '', bio: '', email: '', 
    photo_url: '', resume_url: '', github_url: '', linkedin_url: '' 
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [newProject, setNewProject] = useState<Partial<Project>>({ 
    title: '', category: '', description: '', image_url: '', live_link: '', github_link: '' 
  });

  useEffect(() => {
    if (isLogged && isSupabaseConfigured()) {
      fetchData();
    }
  }, [isLogged]);

  const fetchData = async () => {
    if (!isSupabaseConfigured()) return;
    setLoading(true);
    try {
      const { data: profData } = await supabase.from('profiles').select('*').limit(1);
      if (profData && profData.length > 0) setProfile(profData[0]);

      const { data: projData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (projData) setProjects(projData);

      const { data: leadData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (leadData) setLeads(leadData);
    } catch (e) {
      console.error('Fetch error:', e);
    }
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'project') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'profile') {
        setProfile({ ...profile, photo_url: base64String });
      } else {
        setNewProject({ ...newProject, image_url: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveConfig = () => {
    localStorage.setItem('supabase_url', dbConfig.url);
    localStorage.setItem('supabase_anon_key', dbConfig.key);
    localStorage.setItem('n8n_webhook_url', dbConfig.n8nUrl);
    alert('Configuration saved! Redirecting to apply changes.');
    window.location.reload();
  };

  const handleSaveProfile = async () => {
    if (!isSupabaseConfigured()) return alert('Please configure Supabase first.');
    setLoading(true);
    const { data: existing } = await supabase.from('profiles').select('id').limit(1);
    let error;
    if (existing && existing.length > 0) {
      const { error: updateError } = await supabase.from('profiles').update(profile).eq('id', existing[0].id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('profiles').insert([profile]);
      error = insertError;
    }
    if (error) alert(`Error: ${error.message}`);
    else { alert('Success!'); fetchData(); }
    setLoading(false);
  };

  const handleAddProject = async () => {
    if (!isSupabaseConfigured()) return;
    if (!newProject.title) return alert('Title is required!');
    setLoading(true);
    const { error } = await supabase.from('projects').insert([newProject]);
    if (error) alert(error.message);
    else {
      setNewProject({ title: '', category: '', description: '', image_url: '', live_link: '', github_link: '' });
      fetchData();
    }
    setLoading(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (!isSupabaseConfigured()) return;
    if (!confirm('Are you sure?')) return;
    setLoading(true);
    await supabase.from('projects').delete().eq('id', id);
    fetchData();
    setLoading(false);
  };

  const handleDeleteLead = async (id: string) => {
    if (!isSupabaseConfigured()) return;
    if (!confirm('Delete this inquiry?')) return;
    setLoading(true);
    await supabase.from('leads').delete().eq('id', id);
    fetchData();
    setLoading(false);
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-neutral-950 border border-neutral-900 p-12 rounded-3xl">
          <ShieldCheck className="w-12 h-12 text-accent mb-8 mx-auto" />
          <h2 className="text-2xl font-black uppercase text-center mb-8 tracking-widest italic">Admin Console</h2>
          <form onSubmit={(e) => { e.preventDefault(); if(password==='adam2025') setIsLogged(true); else alert('Wrong password!'); }} className="space-y-6">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-neutral-800 p-4 rounded-xl outline-none focus:border-accent font-mono transition-colors text-accent"
              placeholder="••••••••"
            />
            <button className="w-full bg-accent text-white font-black uppercase py-4 rounded-xl shadow-lg shadow-orange-500/20">Login</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 lg:px-12 pt-32 pb-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-80 space-y-4">
            <div className="p-8 bg-neutral-950 border border-neutral-900 rounded-3xl sticky top-32">
              <h3 className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-8">System Menu</h3>
              <div className="space-y-2">
                {[
                  { id: 'profile', icon: User, label: 'Identity' },
                  { id: 'projects', icon: LayoutGrid, label: 'Portfolio' },
                  { id: 'leads', icon: Inbox, label: 'Leads' },
                  { id: 'settings', icon: Settings, label: 'Engine Config' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === tab.id ? 'bg-accent text-white shadow-lg' : 'hover:bg-neutral-900 text-neutral-500'}`}
                  >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setIsLogged(false)} className="w-full mt-20 flex items-center gap-4 px-6 py-4 hover:bg-red-950/30 text-red-500 font-black uppercase text-[10px] tracking-widest transition-colors rounded-2xl">
                <LogOut className="w-4 h-4" /> Terminate Session
              </button>
            </div>
          </div>

          <div className="flex-grow bg-neutral-950 border border-neutral-900 p-8 lg:p-12 rounded-3xl relative min-h-[600px]">
             {loading && <div className="absolute inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm rounded-3xl"><Loader2 className="w-12 h-12 animate-spin text-accent" /></div>}
             
             {activeTab === 'settings' && (
               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-neutral-900 pb-8">
                    <h3 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Engine</h3>
                    <p className="text-neutral-500 text-xs mt-2 font-bold uppercase tracking-widest">Connect your automation hubs</p>
                  </div>

                  <div className="space-y-10">
                    <div className="bg-black border border-neutral-900 p-8 rounded-2xl space-y-6">
                      <h4 className="flex items-center gap-2 text-xs font-black uppercase text-accent tracking-widest"><Database className="w-4 h-4" /> Supabase Primary DB</h4>
                      <input placeholder="URL" value={dbConfig.url} onChange={e => setDbConfig({...dbConfig, url: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 p-4 rounded-xl outline-none focus:border-accent font-mono text-xs" />
                      <input placeholder="Anon Key" type="password" value={dbConfig.key} onChange={e => setDbConfig({...dbConfig, key: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 p-4 rounded-xl outline-none focus:border-accent font-mono text-xs" />
                    </div>

                    <div className="bg-black border border-neutral-900 p-8 rounded-2xl space-y-6">
                      <h4 className="flex items-center gap-2 text-xs font-black uppercase text-[#ff0055] tracking-widest"><Zap className="w-4 h-4" /> n8n Automation Webhook</h4>
                      <input placeholder="https://n8n.yourdomain.com/webhook/..." value={dbConfig.n8nUrl} onChange={e => setDbConfig({...dbConfig, n8nUrl: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 p-4 rounded-xl outline-none focus:border-[#ff0055] font-mono text-xs" />
                      <p className="text-[10px] text-neutral-600 italic">This URL will receive all "Get a Project" inquiries as JSON.</p>
                    </div>

                    <button onClick={handleSaveConfig} className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-xs flex items-center gap-3 hover:bg-accent hover:text-white transition-all">
                      <Save className="w-4 h-4" /> Deploy Configuration
                    </button>
                  </div>
               </div>
             )}

             {activeTab === 'profile' && (
               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center border-b border-neutral-900 pb-8">
                    <div>
                      <h3 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Identity</h3>
                      <p className="text-neutral-500 text-xs mt-2 font-bold uppercase tracking-widest">Global meta-data management</p>
                    </div>
                    <button onClick={handleSaveProfile} className="bg-accent text-white px-10 py-5 rounded-2xl font-black uppercase text-xs flex items-center gap-3 hover:scale-105 transition-transform"><Save className="w-4 h-4" /> Save Metadata</button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <input placeholder="Full Name" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} className="bg-black border border-neutral-900 p-4 rounded-xl outline-none focus:border-accent" />
                    <input placeholder="Role (e.g. Automation Expert)" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} className="bg-black border border-neutral-900 p-4 rounded-xl outline-none focus:border-accent" />
                  </div>
                  <textarea placeholder="Your bio..." rows={4} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-black border border-neutral-900 p-4 rounded-xl outline-none focus:border-accent resize-none" />
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Profile Photo</label>
                       <div className="flex gap-2">
                          <input placeholder="Photo URL" value={profile.photo_url} onChange={e => setProfile({...profile, photo_url: e.target.value})} className="flex-grow bg-black border border-neutral-900 p-4 rounded-xl outline-none focus:border-accent" />
                          <button onClick={() => profileFileRef.current?.click()} className="bg-neutral-900 hover:bg-neutral-800 p-4 rounded-xl transition-colors flex items-center gap-2 text-xs font-bold">
                            <Upload className="w-4 h-4" /> Import
                          </button>
                          <input ref={profileFileRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile')} className="hidden" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Resume Link</label>
                       <input placeholder="Resume URL (G-Drive/Direct)" value={profile.resume_url} onChange={e => setProfile({...profile, resume_url: e.target.value})} className="w-full bg-black border border-neutral-900 p-4 rounded-xl outline-none focus:border-accent" />
                    </div>
                  </div>
               </div>
             )}

             {activeTab === 'projects' && (
               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Portfolio</h3>
                  <div className="bg-black border border-neutral-900 p-8 rounded-2xl space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl outline-none focus:border-accent" />
                      <input placeholder="Category" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl outline-none focus:border-accent" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input placeholder="Image URL" value={newProject.image_url} onChange={e => setNewProject({...newProject, image_url: e.target.value})} className="flex-grow bg-neutral-950 border border-neutral-800 p-4 rounded-xl outline-none focus:border-accent" />
                        <button onClick={() => projectFileRef.current?.click()} className="bg-neutral-900 hover:bg-neutral-800 p-4 rounded-xl transition-colors flex items-center gap-2 text-xs font-bold">
                          <Upload className="w-4 h-4" /> Import
                        </button>
                        <input ref={projectFileRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'project')} className="hidden" />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                        <input placeholder="Live Demo Link" value={newProject.live_link} onChange={e => setNewProject({...newProject, live_link: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 p-4 pl-12 rounded-xl outline-none focus:border-accent" />
                      </div>
                      <div className="relative">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                        <input placeholder="GitHub Link" value={newProject.github_link} onChange={e => setNewProject({...newProject, github_link: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 p-4 pl-12 rounded-xl outline-none focus:border-accent" />
                      </div>
                    </div>

                    <div className="relative">
                      <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-neutral-600" />
                      <textarea placeholder="Project Description..." rows={3} value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 p-4 pl-12 rounded-xl outline-none focus:border-accent resize-none" />
                    </div>

                    <button onClick={handleAddProject} className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-xs hover:bg-accent hover:text-white transition-all">Add Project</button>
                  </div>

                  <div className="grid gap-4">
                    {projects.map(proj => (
                      <div key={proj.id} className="p-6 bg-black border border-neutral-900 rounded-2xl flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                          <img src={proj.image_url} className="w-16 h-12 rounded-lg object-cover bg-neutral-900" />
                          <div>
                            <h4 className="font-bold uppercase text-sm tracking-tight">{proj.title}</h4>
                            <div className="flex gap-2 mt-1">
                              {proj.live_link && <Globe className="w-3 h-3 text-neutral-600" />}
                              {proj.github_link && <Github className="w-3 h-3 text-neutral-600" />}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteProject(proj.id)} className="text-neutral-700 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {activeTab === 'leads' && (
               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-neutral-900 pb-8">
                    <h3 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Inquiries</h3>
                    <p className="text-neutral-500 text-xs mt-2 font-bold uppercase tracking-widest">Leads captured from the frontend</p>
                  </div>

                  <div className="space-y-4">
                    {leads.length === 0 ? (
                      <div className="text-center py-20 text-neutral-700 font-bold uppercase text-xs tracking-widest">No inquiries yet.</div>
                    ) : (
                      leads.map(lead => (
                        <div key={lead.id} className="p-8 bg-black border border-neutral-900 rounded-3xl space-y-6 group hover:border-accent/30 transition-colors">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-neutral-900 rounded-xl">
                                <Mail className="w-5 h-5 text-accent" />
                              </div>
                              <div>
                                <h4 className="font-black text-lg">{lead.email}</h4>
                                <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">
                                  <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-md">{lead.category}</span>
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(lead.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <button onClick={() => handleDeleteLead(lead.id)} className="p-3 hover:bg-red-950/30 text-neutral-700 hover:text-red-500 transition-colors rounded-xl">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-900 ">
                            <p className="text-sm text-neutral-400 font-medium leading-relaxed italic break-all">"{lead.description}"</p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-600">
                             <Wifi className="w-3 h-3 text-green-500" /> Source: Portfolio Inbound
                          </div>
                        </div>
                      ))
                    )}
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
