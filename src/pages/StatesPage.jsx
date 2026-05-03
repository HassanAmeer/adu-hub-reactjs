import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronRight, Info, Building2, ShieldCheck, Globe } from 'lucide-react';
import { states } from '../data/mockData';

const StatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStates = states.filter(state => 
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen pb-24"
    >
      {/* Hero Section */}
      <section className="bg-primary text-white pt-32 pb-20 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-secondary text-sm font-bold mb-6">
              <Globe className="w-4 h-4" />
              National ADU Database
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              State-by-State <span className="text-secondary">ADU Laws</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Find specific ADU regulations, size limits, and requirements for your state and city. We track 12,000+ local codes.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-2xl mx-auto relative"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
              <input 
                type="text" 
                placeholder="Search for a state (e.g. California, Washington...)" 
                className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl text-slate-900 text-lg shadow-2xl focus:ring-4 focus:ring-secondary/20 outline-none transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-8 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'States Tracked', value: '50+', icon: MapPin, color: 'text-emerald-500' },
              { label: 'City Codes', value: '12,482', icon: Building2, color: 'text-blue-500' },
              { label: 'Last Updated', value: 'Today', icon: ShieldCheck, color: 'text-secondary' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-5">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-slate-50 ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-primary">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* States Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Explore ADU Regulations</h2>
              <p className="text-slate-500">Select your state to view detailed ADU laws and city-level rules.</p>
            </div>
            <div className="hidden md:block">
              <span className="text-sm font-medium text-slate-400">Showing {filteredStates.length} states</span>
            </div>
          </div>

          {filteredStates.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredStates.map((state) => (
                <motion.div key={state.id} variants={itemVariants}>
                  <Link 
                    to={`/state/${state.id}`}
                    className="group block bg-white rounded-[32px] p-8 border border-slate-200 hover:border-secondary/30 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[100px] -mr-4 -mt-4 group-hover:bg-secondary/5 transition-colors"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold group-hover:bg-secondary transition-colors">
                          {state.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className={`badge ${
                          state.status === 'Allowed' ? 'badge-allowed' : 'badge-restricted'
                        }`}>
                          {state.status}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-black text-primary mb-2">{state.name}</h3>
                      <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                        Comprehensive rules for {state.cities.length} major cities including {state.cities.slice(0, 2).join(', ')}.
                      </p>
                      
                      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-bold text-secondary flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Rules <ChevronRight className="w-4 h-4" />
                        </span>
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200"></div>
                          ))}
                          <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                            +{state.cities.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">No states found matching "{searchTerm}"</h3>
              <p className="text-slate-500 mb-8">Try searching for a different state or check back later.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="btn-primary"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-emerald-50 py-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-black text-primary mb-6 leading-tight">
                How We Maintain Our <span className="text-secondary">Database Accuracy</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Weekly Updates', desc: 'Our team monitors city council meetings and legislative sessions daily.' },
                  { title: 'Verified by Experts', desc: 'Each rule change is verified by local ADU consultants before going live.' },
                  { title: 'Community Driven', desc: 'Homeowners and professionals report local changes to keep data fresh.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="bg-white p-10 rounded-[40px] shadow-2xl relative z-10 border border-emerald-100">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-primary">Compliance Verified</h4>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Trust Score: 98%</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-400">Coverage</span>
                        <span className="text-sm font-bold text-secondary">All 50 States</span>
                      </div>
                    </div>
                  </div>
               </div>
               {/* Decorative blobs */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-secondary/10 rounded-full blur-[100px] -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-primary rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
             </div>
             <h2 className="text-3xl md:text-4xl font-black mb-6 relative z-10">Get Alerts on Law Changes</h2>
             <p className="text-slate-300 mb-10 text-lg relative z-10">
               State and local ADU laws change frequently. Subscribe to get notified whenever rules in your area are updated.
             </p>
             <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-secondary transition-all"
               />
               <button className="btn-primary whitespace-nowrap">Subscribe Now</button>
             </form>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default StatesPage;
