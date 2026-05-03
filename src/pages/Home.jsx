import React from 'react';
import Hero from '../components/home/Hero';
import ValueProp from '../components/home/ValueProp';
import AudienceSection from '../components/home/AudienceSection';
import StateGrid from '../components/home/StateGrid';
import { featuredCities } from '../data/mockData';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <ValueProp />
      <AudienceSection />
      <StateGrid />
      
      {/* Featured Cities Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-primary mb-4">Trending Cities</h2>
            <p className="text-lg text-slate-500">The most active areas for new ADU development this month.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCities.map((city, idx) => (
              <div key={idx} className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg">
                <img src={city.img} alt={city.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <span className="text-secondary text-sm font-bold uppercase tracking-widest mb-2 block">{city.state}</span>
                  <h3 className="text-2xl text-white font-bold mb-4">{city.name}</h3>
                  <Link 
                    to={`/state/${city.state.toLowerCase()}/city/${city.name.toLowerCase().replace(' ', '-')}`} 
                    className="inline-flex items-center gap-2 text-white text-sm font-bold group/btn"
                  >
                    View Local Laws <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-5xl font-extrabold mb-8 leading-tight">Your ADU journey, <br /><span className="text-secondary">simplified.</span></h2>
              <div className="space-y-8">
                {[
                  { title: 'Check your address', desc: 'Get instant insights on zoning, lot size, and setbacks.' },
                  { title: 'Browse state laws', desc: 'Read simplified summaries of complex legislative documents.' },
                  { title: 'Estimate costs', desc: 'Plan your budget with our comprehensive cost library.' }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-bold text-secondary">
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/property-checker" className="btn-primary mt-12 !px-10 inline-block">Start Your Check</Link>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative z-20">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-bold">Property Check</h5>
                      <p className="text-xs text-slate-400">San Diego, CA 92101</p>
                    </div>
                  </div>
                  <span className="badge badge-allowed !bg-emerald-500/20 !text-emerald-300 !border-emerald-500/30">Allowed</span>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-slate-300">Max Size</span>
                    <span className="font-bold text-white">1,200 sq ft</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-slate-300">Height Limit</span>
                    <span className="font-bold text-white">16 ft</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-300">Setbacks</span>
                    <span className="font-bold text-white">4 ft Rear/Side</span>
                  </div>
                </div>
                
                <div className="bg-secondary p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/70 mb-1">Estimated Cost</p>
                    <p className="text-xl font-bold text-white">$240k - $310k</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
              </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-8 relative z-10 tracking-tight">Ready to build your <br /> dream ADU?</h2>
            <p className="text-slate-300 text-lg mb-12 max-w-xl mx-auto relative z-10 leading-relaxed">
              Join 50,000+ homeowners using ADU Hub to navigate laws and find professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/signup" className="bg-secondary text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-500 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 inline-block">Create Free Account</Link>
              <Link to="/directory" className="bg-white text-primary px-10 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 inline-block">Find Professionals</Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
