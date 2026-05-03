import React from 'react';
import { BookOpen, Map, Compass, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const edges = [
  {
    title: 'Verified Laws & Codes',
    desc: 'No more guessing. We translate complex state bills and zoning codes into plain, actionable English.',
    icon: BookOpen,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    darkBg: false
  },
  {
    title: 'Location-Specific Rules',
    desc: 'Down to the city level. See exact setbacks, height limits, and parking requirements for your local area.',
    icon: Map,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    darkBg: true
  },
  {
    title: 'Practical Building Guidance',
    desc: 'Step-by-step roadmaps from feasibility checks to final inspection and occupancy.',
    icon: Compass,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    darkBg: false
  },
  {
    title: 'Vetted Professionals',
    desc: 'A curated directory of architects, designers, and builders who specialize exclusively in ADUs.',
    icon: Users,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    darkBg: true
  },
  {
    title: 'Real Cost Clarity',
    desc: 'Honest breakdowns of design fees, permit costs, and construction by state and type.',
    icon: DollarSign,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    darkBg: false
  }
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

const ValueProp = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-primary mb-6">Why ADU Hub?</h2>
          <p className="text-lg text-slate-500">
            We provide a single, authoritative source of truth for accessory dwelling units.
          </p>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {edges.map((p, idx) => (
            <motion.div 
              key={idx} 
              variants={item}
              className={`p-8 rounded-[24px] border ${
                p.darkBg 
                  ? 'bg-slate-900 border-slate-800 text-white' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-soft hover:border-secondary/30'
              } transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group`}
            >
              <div className={`w-14 h-14 ${p.bg} ${p.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <p.icon className="w-7 h-7" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${p.darkBg ? 'text-white' : 'text-primary'}`}>{p.title}</h3>
              <p className={`text-base leading-relaxed ${p.darkBg ? 'text-slate-400' : 'text-slate-500'}`}>{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProp;
