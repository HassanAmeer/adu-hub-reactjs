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
  Zap,
  ListChecks
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
          className="text-center mb-12 mt-8"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">Can I Build?</h1>
          <p className="text-lg text-slate-500">
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
              className="card !p-0 overflow-hidden border-0"
            >
            <div className="bg-primary p-8 sm:p-12 text-white">
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={`h-2 w-16 rounded-full transition-all duration-500 ${step >= s ? 'bg-secondary' : 'bg-white/20'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Step {step} of 3</span>
              </div>
              <h2 className="text-3xl font-bold">
                {step === 1 && "Where is the property?"}
                {step === 2 && "Property Dimensions"}
                {step === 3 && "Existing Structures"}
              </h2>
            </div>

            <div className="p-8 sm:p-12 bg-white">
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Street Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                      <input 
                        type="text" 
                        placeholder="123 Main St, San Diego, CA" 
                        className="input-field !pl-14 !py-4 text-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Zoning Type</label>
                    <div className="relative">
                      <select className="input-field appearance-none !py-4 text-lg">
                        <option>Unknown / Not Sure</option>
                        <option>Single Family (R-1)</option>
                        <option>Multi-Family (R-2 / R-3)</option>
                        <option>Mixed Use</option>
                        <option>Commercial</option>
                      </select>
                      <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 rotate-90" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-3">Lot Size</label>
                     <div className="relative">
                       <select className="input-field appearance-none !py-4 text-lg">
                         <option>&lt; 5,000 sq ft</option>
                         <option>5,000 – 7,500 sq ft</option>
                         <option>7,500 – 10,000 sq ft</option>
                         <option>10,000+ sq ft</option>
                       </select>
                       <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 rotate-90" />
                     </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Existing Structures (Check all that apply):</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Main House', 'Garage', 'Pool', 'Other'].map(item => (
                        <label key={item} className="flex items-center gap-3 p-5 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-secondary/50 hover:bg-secondary/5 transition-all group">
                          <input type="checkbox" className="w-5 h-5 accent-secondary" />
                          <span className="text-base font-semibold text-slate-700 group-hover:text-primary">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                {step > 1 ? (
                  <button 
                    onClick={() => setStep(step - 1)}
                    className="text-slate-500 font-bold hover:text-primary px-4 py-2 transition-colors"
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
                    className="btn-primary !px-10 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
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
              <div className="bg-white rounded-[24px] border-2 border-emerald-500/30 p-8 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="badge badge-allowed !bg-emerald-100 !text-emerald-700 !border-emerald-300 !px-4 !py-1.5">Yes, Allowed</span>
                    </div>
                    <p className="text-slate-500 font-medium">123 Main St, San Diego, CA</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Max ADU Size</p>
                      <p className="text-2xl font-extrabold text-primary">1,200 sq ft</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Approval Difficulty</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 font-bold text-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Easy
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Likely Constraints
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                        <span>4ft rear and side setbacks required.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                        <span>Existing pool limits placement options.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                        <span>Must match primary house roof pitch.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cost Estimate */}
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                     <ListChecks className="w-5 h-5" />
                   </div>
                   <h3 className="text-xl font-bold text-primary m-0">Rough Cost Range</h3>
                </div>
                
                <div className="mb-8">
                  <p className="text-3xl font-extrabold text-primary">$180k – $320k</p>
                  <p className="text-slate-500 text-sm mt-1">Estimated total project cost based on San Diego averages.</p>
                </div>

                <div className="space-y-5">
                   {[
                     { label: 'Design & Engineering', cost: '$12,000 - $18,000', color: 'bg-indigo-500' },
                     { label: 'Permits & Impact Fees', cost: '$4,000 - $7,000', color: 'bg-amber-500' },
                     { label: 'Construction', cost: '$164,000 - $295,000', color: 'bg-emerald-500' },
                   ].map((item, idx) => (
                     <div key={idx} className="flex flex-col gap-2">
                       <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-slate-700">{item.label}</span>
                          <span className="text-sm font-bold text-slate-900">{item.cost}</span>
                       </div>
                       <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: idx === 0 ? '10%' : idx === 1 ? '5%' : '85%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full ${item.color} rounded-full`}
                          ></motion.div>
                       </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 btn-primary !py-4">Download Full Report</button>
                <button onClick={() => { setStep(1); setShowResult(false); }} className="flex-1 btn-secondary !py-4">Start New Check</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PropertyCheckerPage;
