import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Map as MapIcon, 
  Clock, 
  Info,
  ChevronRight,
  ArrowLeft,
  Search,
  BookOpen,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import MockMap from '../components/shared/MockMap';

const CityPage = () => {
  const { state, cityName } = useParams();
  const formattedCity = cityName ? cityName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'San Diego';
  const formattedState = state ? state.charAt(0).toUpperCase() + state.slice(1) : 'California';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen pb-24"
    >
      {/* City Header */}
      <div className="bg-primary text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-slate-300 mb-8 text-sm font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/state/${state || 'california'}`} className="hover:text-white transition-colors">{formattedState}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-semibold">{formattedCity}</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <Link to={`/state/${state || 'california'}`} className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6 text-sm font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to State
              </Link>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white">{formattedCity}, {formattedState}</h1>
                <span className="badge !bg-emerald-500/20 !text-emerald-300 !border-emerald-500/30">Pro-ADU City</span>
              </div>
              <p className="text-slate-300 max-w-2xl text-lg">
                Specific local ordinances and zoning overlays for {formattedCity}. Local rules often supersede state defaults in specific neighborhoods.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="px-5 py-3 bg-slate-800 rounded-xl shadow-lg border border-white/5 text-center">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Permit Time</p>
                <p className="font-bold text-white text-lg">60-90 Days</p>
              </div>
              <div className="px-5 py-3 bg-slate-800 rounded-xl shadow-lg border border-white/5 text-center">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Impact Fees</p>
                <p className="font-bold text-white text-lg">$0 - $5k</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Overlays & Alerts */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-amber-900 mb-1">Coastal & Historic Overlays</h4>
              <p className="text-sm text-amber-800/80 leading-relaxed">
                Properties within 1,000 yards of the coast or in designated historic districts require additional permits, adding 4-6 months to timelines.
              </p>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-[20px] p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-900 mb-1">Fee Waiver Active</h4>
              <p className="text-sm text-emerald-800/80 leading-relaxed">
                {formattedCity} is currently waiving development impact fees for ADUs under 750 sq ft until December 2024.
              </p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-[20px] p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
            <Home className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">HOA Overlays</h4>
              <p className="text-sm text-blue-800/80 leading-relaxed">
                State law restricts HOAs from banning ADUs, but they can impose "reasonable" aesthetic guidelines in {formattedCity}.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Local Amendments */}
            <section className="card border-l-4 border-l-secondary">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-primary m-0">Local Amendments to State Law</h2>
              </div>
              <p className="text-slate-600 mb-4">
                While state law provides baseline allowances, {formattedCity} has passed local ordinances that modify these rules:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Height Increases:</strong> Allows up to 18 ft (instead of 16 ft) for detached ADUs near transit.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Front Yard ADUs:</strong> Permitted only if rear yard is completely constrained.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Owner Occupancy:</strong> Suspended until 2025, but may be reinstated locally afterwards.</span>
                </li>
              </ul>
            </section>

            {/* Detailed Rules Table */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-primary">Zoning Standards</h2>
              </div>
              <div className="bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Standard</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { cat: 'Setbacks', std: '4 ft Side / Rear', notes: 'Reduced from standard 15ft' },
                      { cat: 'Lot Coverage', std: 'No maximum', notes: 'State law overrides local limit' },
                      { cat: 'Min Lot Size', std: 'None', notes: 'Any residentially zoned lot' },
                      { cat: 'Fire Sprinklers', std: 'Required', notes: 'Only if primary has them' },
                      { cat: 'Architecture', std: 'Must match primary', notes: 'Roof pitch and siding' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">{row.cat}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{row.std}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                            {row.notes}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Permit Process */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-8">Permit Timeline</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { step: 'Intake', time: '1-2 Weeks', icon: Search },
                  { step: 'Plan Review', time: '4-6 Weeks', icon: Clock },
                  { step: 'Corrections', time: '2-4 Weeks', icon: Info },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[20px] border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow hover:border-secondary/30">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary mx-auto mb-5 flex items-center justify-center">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">{item.step}</h4>
                    <p className="text-xl font-extrabold text-secondary">{item.time}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="card">
              <h4 className="text-lg font-bold text-primary mb-6">Zoning Overlays</h4>
              <div className="flex flex-wrap gap-2">
                {['Single Family', 'Multi-Family', 'Transit Priority', 'Historic District', 'Wildfire Zone', 'HOA Zones'].map(chip => (
                  <button key={chip} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-all">
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="card !bg-primary !text-white !border-slate-800 shadow-xl">
              <h4 className="text-xl font-bold mb-4">Start your project</h4>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Connect with local contractors who have successfully built in {formattedCity}.
              </p>
              <Link to="/directory" className="w-full btn-primary block text-center !py-3">Find Local Pros</Link>
            </div>
            
            <div className="h-64 rounded-[20px] overflow-hidden border border-slate-200 shadow-sm relative">
               {/* Map Placeholder or Component */}
               <div className="absolute inset-0 bg-slate-200 flex items-center justify-center flex-col gap-2">
                 <MapIcon className="w-8 h-8 text-slate-400" />
                 <span className="text-sm font-semibold text-slate-500">Interactive Map View</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CityPage;
