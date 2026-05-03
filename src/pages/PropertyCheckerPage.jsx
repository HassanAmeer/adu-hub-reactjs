import React, { useState } from 'react';
import { 
  MapPin, 
  Ruler, 
  Building2, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  HelpCircle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyCheckerPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleCheck = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl text-primary mb-4">Property Feasibility Tool</h1>
          <p className="text-slate-500">
            Enter your property details to get an instant report on ADU potential.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div 
              key="form"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="card shadow-2xl p-0 overflow-hidden"
            >
            <div className="bg-primary p-8 text-white">
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= s ? 'bg-secondary' : 'bg-white/20'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Step {step} of 3</span>
              </div>
              <h2 className="text-2xl">
                {step === 1 && "Where is the property?"}
                {step === 2 && "Property Dimensions"}
                {step === 3 && "Existing Structures"}
              </h2>
            </div>

            <div className="p-8 sm:p-12">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Street Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        placeholder="123 Main St, San Diego, CA" 
                        className="input-field !pl-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Zoning Type (Optional)</label>
                    <select className="input-field appearance-none">
                      <option>Unknown / Not Sure</option>
                      <option>Single Family (R-1)</option>
                      <option>Multi-Family (R-2)</option>
                      <option>Commercial with Residential</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Lot Size (sq ft)</label>
                      <div className="relative">
                        <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input type="number" placeholder="5000" className="input-field !pl-12" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Lot Depth (ft)</label>
                      <input type="number" placeholder="100" className="input-field" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Existing House Size (sq ft)</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input type="number" placeholder="1800" className="input-field !pl-12" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Check all that apply:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Detached Garage', 'Swimming Pool', 'Large Trees', 'Slope / Hillside'].map(item => (
                        <label key={item} className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                          <input type="checkbox" className="w-5 h-5 accent-secondary" />
                          <span className="text-sm font-semibold">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12 flex justify-between items-center">
                {step > 1 ? (
                  <button 
                    onClick={() => setStep(step - 1)}
                    className="text-slate-500 font-bold hover:text-primary transition-colors"
                  >
                    Back
                  </button>
                ) : <div />}
                
                {step < 3 ? (
                  <button 
                    onClick={() => setStep(step + 1)}
                    className="btn-primary !px-10"
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    onClick={handleCheck}
                    disabled={loading}
                    className="btn-primary !px-10 flex items-center gap-3 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Generate Report
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="space-y-8"
            >
              {/* Result Header */}
              <div className="bg-white rounded-[2rem] border-2 border-accent p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8">
                  <Zap className="w-12 h-12 text-accent opacity-20" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Highly Feasible</h3>
                    <p className="text-slate-500">123 Main St, San Diego, CA</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Max ADU Size</p>
                    <p className="text-xl font-bold text-primary">1,200 sq ft</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Complexity</p>
                    <p className="text-xl font-bold text-accent">Easy</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Est. Value Add</p>
                    <p className="text-xl font-bold text-secondary">+$250k</p>
                  </div>
                </div>
              </div>

              {/* Cost Estimate */}
              <div className="card">
                <h3 className="text-xl mb-6">Estimated Cost Breakdown</h3>
                <div className="space-y-4">
                   {[
                     { label: 'Design & Engineering', cost: '$12,000 - $18,000', color: 'bg-secondary' },
                     { label: 'Permits & Fees', cost: '$4,000 - $7,000', color: 'bg-warning' },
                     { label: 'Construction (Standard)', cost: '$180,000 - $240,000', color: 'bg-accent' },
                   ].map((item, idx) => (
                     <div key={idx} className="flex flex-col gap-2">
                       <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-slate-600">{item.label}</span>
                          <span className="text-sm font-bold text-primary">{item.cost}</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: idx === 0 ? '10%' : idx === 1 ? '5%' : '85%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full ${item.color}`}
                          ></motion.div>
                       </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 btn-primary">Download Full Report</button>
                <button onClick={() => setShowResult(false)} className="flex-1 btn-outline">Start Over</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PropertyCheckerPage;
