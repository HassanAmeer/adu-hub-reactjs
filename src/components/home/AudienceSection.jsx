import React from 'react';
import { Home, TrendingUp, PenTool, Hammer, Briefcase, Building, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const audiences = [
  { name: 'Homeowners', icon: Home, desc: 'Find out if you can build and how much it costs.' },
  { name: 'Real Estate Investors', icon: TrendingUp, desc: 'Calculate ROI and find ADU-friendly properties.' },
  { name: 'Architects & Designers', icon: PenTool, desc: 'Stay updated on local zoning and code changes.' },
  { name: 'Builders', icon: Hammer, desc: 'Get leads and understand local requirements.' },
  { name: 'Realtors', icon: Briefcase, desc: 'Help clients understand property potential.' },
  { name: 'Lenders', icon: Landmark, desc: 'Assess feasibility for construction loans.' },
  { name: 'City Planners', icon: Building, desc: 'Benchmark laws against neighboring cities.' },
];

const AudienceSection = () => {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-primary mb-6">Who is ADU Hub for?</h2>
          <p className="text-lg text-slate-500">
            Whether you are building your first ADU or planning city-wide initiatives, we have the data you need.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {audiences.map((aud, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 bg-white border border-slate-200 rounded-2xl hover:border-secondary/30 hover:shadow-lg transition-all duration-300 group ${idx === 6 ? 'sm:col-span-2 lg:col-span-2' : ''}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                  <aud.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary">{aud.name}</h3>
              </div>
              <p className="text-sm text-slate-500">{aud.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
