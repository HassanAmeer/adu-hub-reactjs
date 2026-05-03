import React from 'react';
import { Gavel, Ruler, DollarSign, Users } from 'lucide-react';

const props = [
  {
    title: 'Up-to-date Laws',
    desc: 'Always accurate zoning and state ADU laws at your fingertips.',
    icon: Gavel,
    color: 'text-secondary',
    bg: 'bg-secondary/10'
  },
  {
    title: 'Instant Feasibility',
    desc: 'Know exactly what size and type of ADU you can build on your lot.',
    icon: Ruler,
    color: 'text-accent',
    bg: 'bg-accent/10'
  },
  {
    title: 'Cost Estimator',
    desc: 'Get localized cost breakdowns for design, permits, and construction.',
    icon: DollarSign,
    color: 'text-warning',
    bg: 'bg-warning/10'
  },
  {
    title: 'Verified Pros',
    desc: 'Connect with architects and builders specializing in ADUs.',
    icon: Users,
    color: 'text-primary',
    bg: 'bg-slate-100'
  }
];

const ValueProp = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-primary mb-4">Everything you need to build.</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            We simplify the complex process of building an accessory dwelling unit, from initial research to final inspection.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {props.map((p, idx) => (
            <div key={idx} className="group p-8 rounded-2xl border border-border hover:border-secondary/50 hover:shadow-soft transition-all duration-300">
              <div className={`w-14 h-14 ${p.bg} ${p.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <p.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">{p.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProp;
