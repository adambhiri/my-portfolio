
import React from 'react';
import { Github, Linkedin, Twitter, Mail, Command } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-20 px-6 border-t border-neutral-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex items-center gap-4 mb-12">
          <Command className="text-[#ff4f00] w-10 h-10" />
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Adam<span className="text-neutral-500">Bhiri</span></h2>
        </div>
        
        <div className="flex gap-8 mb-16">
          {[
            { icon: <Github />, label: 'Github' },
            { icon: <Linkedin />, label: 'LinkedIn' },
            { icon: <Mail />, label: 'Mail' }
          ].map(social => (
            <a key={social.label} href="#" className="p-4 rounded-full border border-neutral-900 hover:border-[#ff4f00] hover:text-[#ff4f00] transition-all">
              {social.icon}
            </a>
          ))}
        </div>

        <div className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.5em] text-center">
          &copy; {new Date().getFullYear()} Operations Hub. All Rights Reserved.
        </div>
      </div>
      
      {/* Decorative text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[20vw] font-black uppercase text-neutral-950 -z-10 pointer-events-none">
        Automate
      </div>
    </footer>
  );
};

export default Footer;
