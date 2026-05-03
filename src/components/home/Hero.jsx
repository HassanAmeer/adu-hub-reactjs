import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, Building, CheckCircle } from 'lucide-react';

const Hero = () => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const mockResults = [
    { addr: '123 Main St, San Diego, CA', zone: 'R-1' },
    { addr: '456 Ocean Ave, San Diego, CA', zone: 'R-2' },
    { addr: '789 Broadway, San Diego, CA', zone: 'Commercial' },
  ];

  return (
    <div className="relative overflow-hidden bg-primary py-24 sm:py-32">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* ... existing badge ... */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            Nationwide ADU Data Platform
          </div>
          
          <h1 className="text-4xl sm:text-6xl text-white mb-8 leading-tight">
            Check if you can build an <span className="text-secondary">ADU</span> on your property.
          </h1>
          
          <p className="text-xl text-slate-300 mb-12">
            The most accurate platform for ADU feasibility, laws, and costs. Enter your address to get started.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex-grow flex items-center px-4 gap-3">
                <MapPin className="text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowResults(e.target.value.length > 2);
                  }}
                  onFocus={() => query.length > 2 && setShowResults(true)}
                  placeholder="Enter your property address..." 
                  className="w-full py-4 text-primary font-medium outline-none"
                />
              </div>
              <button className="btn-primary !px-8 flex items-center justify-center gap-2">
                Check Feasibility
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Autocomplete Results */}
            {showResults && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {mockResults.map((res, idx) => (
                  <button 
                    key={idx}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                    onClick={() => {
                      setQuery(res.addr);
                      setShowResults(false);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-primary">{res.addr}</p>
                        <p className="text-xs text-slate-400">Zoning: {res.zone}</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
              </div>
              Official State Data
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
              </div>
              Updated Weekly
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
