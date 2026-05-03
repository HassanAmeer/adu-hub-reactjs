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

const LawTrackerPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="bg-primary py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
              <div className="max-w-2xl">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest mb-6">
                    Live Updates
                 </div>
                 <h1 className="text-4xl sm:text-5xl mb-6">ADU Law Tracker</h1>
                 <p className="text-xl text-slate-300">
                    Stay ahead of legislative changes. We monitor state and local policy updates in real-time.
                 </p>
              </div>
              <div className="flex-shrink-0 bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 max-w-sm">
                 <Bell className="w-8 h-8 text-secondary mb-4" />
                 <h4 className="text-lg font-bold mb-2">Get Policy Alerts</h4>
                 <p className="text-slate-400 text-sm mb-6">Subscribe to receive email notifications when laws change in your area.</p>
                 <div className="flex gap-2">
                    <input type="email" placeholder="email@example.com" className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm outline-none flex-grow" />
                    <button className="bg-secondary px-4 py-2 rounded-xl text-sm font-bold">Join</button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Timeline UI */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <History className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl text-primary">Recent Legislation Changes</h2>
              </div>
              
              <div className="space-y-8">
                {[
                  {
                    date: 'May 2, 2024',
                    state: 'California',
                    title: 'SB 1211: Parking & Coverage Relief',
                    status: 'Passed',
                    impact: 'High',
                    desc: 'This bill removes local authority to require replacement parking when a garage is converted to an ADU, and clarifies lot coverage limits.'
                  },
                  {
                    date: 'April 15, 2024',
                    state: 'Washington',
                    title: 'HB 1110: Middle Housing Act',
                    status: 'Implementation Phase',
                    impact: 'Very High',
                    desc: 'Mandates cities to allow at least two ADUs per lot in all residential zones. Cities have until 2025 to update local codes.'
                  },
                  {
                    date: 'March 28, 2024',
                    state: 'Oregon',
                    title: 'SB 1537: Housing Infrastructure',
                    status: 'Signed by Governor',
                    impact: 'Medium',
                    desc: 'Expands the use of revolving loan funds for ADU construction and infrastructure upgrades.'
                  }
                ].map((update, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-border overflow-hidden shadow-soft group hover:border-secondary transition-all">
                    <div className="p-8">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400 uppercase">{update.date}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-xs font-bold text-secondary uppercase">{update.state}</span>
                        </div>
                        <div className="flex gap-2">
                           <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-tight">{update.status}</span>
                           <span className="px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-tight">Impact: {update.impact}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4">{update.title}</h3>
                      <p className="text-slate-500 leading-relaxed mb-8">{update.desc}</p>
                      
                      {/* Before vs After comparison */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" /> Previous Law
                          </p>
                          <p className="text-sm text-slate-600 line-through">Cities could require up to 1 parking space per bedroom for any ADU project.</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-secondary uppercase mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> New Law (Pro-ADU)
                          </p>
                          <p className="text-sm font-bold text-slate-900">No replacement parking required for conversions or projects near transit.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 lg:mt-14">
            <div className="card">
              <h4 className="font-bold mb-6">Pending Bills</h4>
              <div className="space-y-6">
                {[
                  { bill: 'AB 2533', state: 'CA', status: 'In Committee', desc: 'ADU Amnesty Program extension' },
                  { bill: 'SB 6029', state: 'WA', status: 'Floor Vote', desc: 'Pre-approved plan mandate' },
                  { bill: 'HB 204', state: 'CO', status: 'Drafting', desc: 'Statewide ADU allowance' },
                ].map((item, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-primary">{item.bill} ({item.state})</span>
                      <span className="text-[10px] font-bold text-warning uppercase">{item.status}</span>
                    </div>
                    <p className="text-sm text-slate-500 group-hover:text-secondary transition-colors">{item.desc}</p>
                  </div>
                ))}
              </div>
              <button className="w-full btn-outline !mt-8 text-xs !py-3">Browse Full Database</button>
            </div>

            <div className="card bg-accent/5 border-accent/20">
               <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                  <h4 className="font-bold">The ADU Index</h4>
               </div>
               <p className="text-sm text-slate-500 mb-6 leading-relaxed">Our proprietary score of how "ADU Friendly" a region's laws are.</p>
               <div className="space-y-4">
                  {[
                    { region: 'West Coast', score: '94/100', trend: 'up' },
                    { region: 'East Coast', score: '62/100', trend: 'up' },
                    { region: 'Mountain', score: '48/100', trend: 'down' },
                  ].map(r => (
                    <div key={r.region} className="flex justify-between items-center">
                       <span className="text-sm font-semibold">{r.region}</span>
                       <span className="text-sm font-bold text-primary">{r.score}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawTrackerPage;
