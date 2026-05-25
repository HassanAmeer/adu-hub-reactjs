import React, { useState, useRef } from 'react';
import { ArrowRight, Play, CheckCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config';

const SUGGESTIONS = [
  'Can I build an ADU in Los Angeles?',
  'ADU rules in San Diego',
  'How much does an ADU cost?',
  'Detached ADU setback requirements',
  'California ADU law 2024',
];

const Hero = () => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const dest = query.trim()
      ? `${ROUTES.PROPERTY_CHECKER}?q=${encodeURIComponent(query.trim())}`
      : ROUTES.PROPERTY_CHECKER;
    navigate(dest);
  };

  const handleSuggestion = (s) => {
    setQuery(s);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative overflow-hidden bg-primary pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pb-48">
      {/* Background patterns & blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>
      </div>
      <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-secondary/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-1/3 h-1/3 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-semibold mb-8 backdrop-blur-md">
              <span>🏠</span>
              <span>Trusted by 50,000+ Homeowners</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Everything <span className="text-secondary">ADUs</span> — All in One Place.
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Stop digging through fragmented city PDFs and contractor blogs. 
              Find out if you can build an ADU, how to do it legally, and who can help you—instantly.
            </p>

            {/* ── Search Bar ───────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative mb-6"
            >
              <form onSubmit={handleSearch}>
                <div className="flex items-center bg-white/95 backdrop-blur-xl border-2 border-white/20 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden focus-within:border-secondary transition-colors duration-200">
                  <Search className="w-5 h-5 text-slate-400 ml-5 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    id="hero-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    placeholder="Ask anything about ADUs…"
                    className="flex-1 px-4 py-4 text-slate-800 text-base bg-transparent outline-none placeholder-slate-400 font-medium"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="m-2 bg-secondary hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md shadow-secondary/30 active:scale-95 text-sm whitespace-nowrap"
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Suggestion Dropdown */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider px-3 py-2">Try asking…</p>
                      {SUGGESTIONS.map((s, idx) => (
                        <button
                          key={idx}
                          onMouseDown={() => handleSuggestion(s)}
                          className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 text-sm transition-colors"
                        >
                          <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/property-checker" className="btn-primary flex items-center justify-center gap-2">
                Start Your ADU Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/how-to-build" className="btn-ghost border border-white/20 flex items-center justify-center gap-2 hover:bg-white/5">
                <Play className="w-5 h-5" />
                See How It Works
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Floating Card */}
          <motion.div 
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative mx-auto w-full max-w-md">
              {/* Glassmorphism Card */}
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-8 shadow-2xl relative z-20">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Property Feasibility</h3>
                    <p className="text-sm text-slate-300">San Diego, CA</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex justify-between items-center">
                    <span className="text-slate-300 font-medium">ADU Status</span>
                    <span className="badge badge-allowed !bg-emerald-500/20 !text-emerald-300 !border-emerald-500/30">Allowed</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Max Size</span>
                    <span className="text-white font-bold text-lg">1,200 sq ft</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Est. Cost</span>
                    <span className="text-white font-bold text-lg">$240k - $310k</span>
                  </div>
                </div>
                
                <Link
                  to={ROUTES.PROPERTY_CHECKER}
                  className="block w-full mt-8 bg-secondary hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-colors duration-200 text-center"
                >
                  View Full Report
                </Link>
              </div>
              
              {/* Decorative elements behind card */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/30 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
