import React from 'react';
import { 
  History, 
  ArrowRight, 
  Zap, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

const LawTrackerPage = () => {
  const updates = [
    {
      date: 'May 2, 2024',
      state: 'California',
      title: 'SB 1211: Parking & Coverage Relief',
      status: 'Passed',
      impact: 'High',
      desc: 'This bill removes local authority to require replacement parking when a garage is converted to an ADU, and clarifies lot coverage limits.',
      before: 'Cities could require up to 1 parking space per bedroom for any ADU project, making many conversions unfeasible.',
      after: 'No replacement parking required for conversions or projects near transit. Lot coverage exemptions expanded.'
    },
    {
      date: 'April 15, 2024',
      state: 'Washington',
      title: 'HB 1110: Middle Housing Act',
      status: 'Implementation Phase',
      impact: 'Very High',
      desc: 'Mandates cities to allow at least two ADUs per lot in all residential zones. Cities have until 2025 to update local codes.',
      before: 'Most cities limited single-family lots to a maximum of one attached or detached ADU.',
      after: 'Cities must allow at least two ADUs per lot in all residential zones, drastically increasing housing density options.'
    },
    {
      date: 'March 28, 2024',
      state: 'Oregon',
      title: 'SB 1537: Housing Infrastructure',
      status: 'Signed by Governor',
      impact: 'Medium',
      desc: 'Expands the use of revolving loan funds for ADU construction and infrastructure upgrades.',
      before: 'Limited state funding available specifically for homeowner-driven ADU projects.',
      after: 'Expands a $3M revolving loan fund to provide targeted financing for ADU construction.'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen pb-24"
    >
      <div className="bg-primary pt-32 pb-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
              <div className="max-w-2xl">
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" /> Live Updates
                 </div>
                 <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">ADU Law Tracker</h1>
                 <p className="text-lg text-slate-300 leading-relaxed">
                    Stay ahead of legislative changes. We monitor state and local policy updates in real-time to ensure your project complies with the latest laws.
                 </p>
              </div>
              <div className="flex-shrink-0 bg-white/10 backdrop-blur-xl p-8 rounded-[24px] border border-white/20 max-w-sm w-full shadow-2xl">
                 <Bell className="w-8 h-8 text-secondary mb-4" />
                 <h4 className="text-xl font-bold mb-2">Get Policy Alerts</h4>
                 <p className="text-slate-300 text-sm mb-6 leading-relaxed">Subscribe to receive email notifications when laws change in your specific area.</p>
                 <div className="flex flex-col gap-3">
                    <input type="email" placeholder="email@example.com" className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none w-full focus:bg-white/20 focus:border-secondary transition-all text-white placeholder-slate-400" />
                    <button className="bg-secondary hover:bg-secondary/90 px-4 py-3 rounded-xl text-sm font-bold text-white transition-colors w-full shadow-md">Subscribe Now</button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Timeline UI */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <History className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-primary">Recent Legislation Changes</h2>
              </div>
              
              <div className="space-y-8">
                {updates.map((update, idx) => (
                  <div key={idx} className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all group">
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">{update.date}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <span className="text-xs font-extrabold text-secondary uppercase tracking-widest">{update.state}</span>
                        </div>
                        <div className="flex gap-2">
                           <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">{update.status}</span>
                           <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${update.impact === 'Very High' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>Impact: {update.impact}</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-primary transition-colors">{update.title}</h3>
                      <p className="text-slate-600 leading-relaxed mb-8 text-lg">{update.desc}</p>
                      
                      {/* Before vs After comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-6 rounded-[16px] border border-slate-200">
                          <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-slate-400" /> Previous Law
                          </p>
                          <p className="text-sm text-slate-600 font-medium leading-relaxed">{update.before}</p>
                        </div>
                        <div className="bg-emerald-50/50 p-6 rounded-[16px] border border-emerald-100 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full -mr-2 -mt-2"></div>
                          <p className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> New Law (Pro-ADU)
                          </p>
                          <p className="text-sm font-bold text-slate-800 leading-relaxed relative z-10">{update.after}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm">
              <h4 className="text-xl font-bold text-primary mb-6">Pending Bills</h4>
              <div className="space-y-6">
                {[
                  { bill: 'AB 2533', state: 'CA', status: 'In Committee', desc: 'ADU Amnesty Program extension' },
                  { bill: 'SB 6029', state: 'WA', status: 'Floor Vote', desc: 'Pre-approved plan mandate' },
                  { bill: 'HB 204', state: 'CO', status: 'Drafting', desc: 'Statewide ADU allowance' },
                ].map((item, idx) => (
                  <div key={idx} className="group cursor-pointer border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-800 group-hover:text-primary transition-colors">{item.bill} ({item.state})</span>
                      <span className="text-[10px] font-extrabold text-amber-500 bg-amber-50 px-2 py-1 rounded-md uppercase tracking-wider">{item.status}</span>
                    </div>
                    <p className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">{item.desc}</p>
                  </div>
                ))}
              </div>
              <button className="w-full btn-outline !mt-6 text-sm !py-3">Browse Full Database</button>
            </div>

            <div className="card bg-indigo-50 border-indigo-100 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-indigo-900 text-lg">The ADU Index</h4>
               </div>
               <p className="text-sm text-indigo-800/70 mb-6 leading-relaxed font-medium">Our proprietary score of how "ADU Friendly" a region's laws are.</p>
               <div className="space-y-4">
                  {[
                    { region: 'West Coast', score: '94/100', trend: 'up' },
                    { region: 'East Coast', score: '62/100', trend: 'up' },
                    { region: 'Mountain', score: '48/100', trend: 'down' },
                  ].map(r => (
                    <div key={r.region} className="flex justify-between items-center bg-white p-3 rounded-xl border border-indigo-50">
                       <span className="text-sm font-bold text-slate-700">{r.region}</span>
                       <span className={`text-sm font-extrabold ${r.trend === 'up' ? 'text-emerald-500' : 'text-amber-500'}`}>{r.score}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LawTrackerPage;
