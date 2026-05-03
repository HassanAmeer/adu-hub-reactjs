import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { aduRules, states } from '../data/mockData';
import { 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  ArrowLeft, 
  Download, 
  Calendar,
  Building,
  Ruler,
  Car,
  UserCheck,
  TrendingUp,
  Banknote,
  Landmark,
  Layers,
  Zap,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatePage = () => {
  const { stateName } = useParams();
  const stateData = states.find(s => s.id === stateName?.toLowerCase() || s.name.toLowerCase() === stateName?.toLowerCase());
  const formattedState = stateData ? stateData.name : (stateName ? stateName.charAt(0).toUpperCase() + stateName.slice(1) : 'California');
  const status = stateData?.status || 'Allowed';
  const cities = stateData?.cities || ['San Diego', 'Los Angeles', 'San Francisco', 'San Jose', 'Sacramento', 'Oakland'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen pb-24"
    >
      {/* Header */}
      <div className="bg-primary text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to States
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl sm:text-6xl font-extrabold text-white">{formattedState} ADU Laws</h1>
                <span className={`badge ${status === 'Allowed' ? '!bg-emerald-500/20 !text-emerald-300 !border-emerald-500/30' : '!bg-amber-500/20 !text-amber-300 !border-amber-500/30'}`}>
                  {status === 'Allowed' ? 'Pro-ADU State' : 'Restricted Rules'}
                </span>
              </div>
              <p className="text-lg text-slate-300 leading-relaxed">
                Comprehensive guide to ADU regulations in {formattedState}. Learn about size limits, parking requirements, grants, and recent legislation changes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button className="btn-secondary !bg-white/10 !text-white hover:!bg-white/20 border border-white/20 flex items-center justify-center gap-2 !py-3">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 !py-3">
                Get Alerted on Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average Cost</p>
              <p className="text-2xl font-bold text-primary">$180k - $250k</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Typical ROI</p>
              <p className="text-2xl font-bold text-primary">8% - 12%</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Permit Time</p>
              <p className="text-2xl font-bold text-primary">2 - 6 Months</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Summary Grid */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-8">Key Regulations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {aduRules.map((rule, idx) => (
                  <div key={idx} className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-secondary/30 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                        {rule.title.includes('Size') && <Ruler className="w-6 h-6" />}
                        {rule.title.includes('Height') && <Building className="w-6 h-6" />}
                        {rule.title.includes('Parking') && <Car className="w-6 h-6" />}
                        {rule.title.includes('Occupancy') && <UserCheck className="w-6 h-6" />}
                        {rule.title.includes('Setbacks') && <Layers className="w-6 h-6" />}
                        {rule.title.includes('Utility') && <Zap className="w-6 h-6" />}
                        {rule.title.includes('Fire') && <Flame className="w-6 h-6" />}
                        {!['Size', 'Height', 'Parking', 'Occupancy', 'Setbacks', 'Utility', 'Fire'].some(k => rule.title.includes(k)) && <Info className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">{rule.title}</h4>
                        <p className="text-xl font-extrabold text-secondary mb-2">{rule.value}</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{rule.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Grant Programs */}
            <section>
              <div className="bg-indigo-50 border border-indigo-100 rounded-[24px] p-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-3 relative z-10">
                  <Banknote className="w-7 h-7 text-indigo-500" />
                  State Grant Programs
                </h2>
                <div className="space-y-4 relative z-10">
                  <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="font-bold text-slate-800 text-lg">CalHFA ADU Grant Program</h4>
                      <span className="badge !bg-emerald-100 !text-emerald-700 !border-emerald-200">Active</span>
                    </div>
                    <p className="text-slate-600 mb-4">Provides up to $40,000 to reimburse pre-development and non-reoccurring closing costs associated with the construction of the ADU.</p>
                    <a href="#" className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1">Check Eligibility <ChevronRight className="w-4 h-4" /></a>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm opacity-70">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="font-bold text-slate-800 text-lg">Local City Grants</h4>
                      <span className="badge !bg-slate-100 !text-slate-600 !border-slate-200">Varies</span>
                    </div>
                    <p className="text-slate-600 mb-4">Many cities offer their own localized grants, fee waivers, or forgivable loans. Check individual city pages for details.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-8 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-secondary" />
                Timeline of Legislative Changes
              </h2>
              <div className="space-y-0 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 ml-2">
                {[
                  { year: '2024', title: 'SB 423 Implementation', desc: 'Accelerated permit processing for multi-family ADUs in certain zones.' },
                  { year: '2023', title: 'AB 1033 Passing', desc: 'Allows local agencies to permit ADUs to be sold separately as condos.' },
                  { year: '2020', title: 'The ADU Revolution', desc: 'Major state-wide changes removing parking and owner-occupancy requirements.' }
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-12 pb-10 last:pb-0">
                    <div className="absolute left-[-2px] top-1 w-10 h-10 rounded-full bg-white border-2 border-secondary flex items-center justify-center z-10 shadow-sm">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-sm font-extrabold text-secondary mb-2 block">{item.year}</span>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Cities List */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-8">Major Cities in {formattedState}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cities.map((city) => (
                  <Link 
                    key={city}
                    to={`/state/${stateName || 'california'}/city/${city.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-200 hover:border-secondary hover:shadow-md group transition-all"
                  >
                    <span className="font-bold text-slate-700 group-hover:text-primary">{city}</span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary rounded-[24px] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
               </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Need Help?</h3>
              <p className="text-slate-300 text-sm mb-8 leading-relaxed relative z-10">
                Our ADU experts can help you navigate the complex laws in {formattedState}.
              </p>
              <button className="w-full btn-secondary block text-center !py-3 relative z-10 mb-4">Book Free Consult</button>
              <p className="text-xs text-center text-slate-400 relative z-10 font-medium">Average response time: 2 hours</p>
            </div>

            <div className="card">
              <h4 className="font-bold mb-6 flex items-center gap-2 text-lg text-primary">
                <Info className="w-5 h-5 text-secondary" />
                Quick Resources
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="flex items-center justify-between text-sm font-semibold text-slate-600 hover:text-secondary group">
                    Official State Handbook
                    <Download className="w-4 h-4 text-slate-300 group-hover:text-secondary" />
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between text-sm font-semibold text-slate-600 hover:text-secondary group">
                    State Zoning Map Tool
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-secondary group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between text-sm font-semibold text-slate-600 hover:text-secondary group">
                    Permit Fee Calculator
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-secondary group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
              </ul>
            </div>

            <div className={`card ${status === 'Allowed' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'} shadow-sm`}>
              <div className={`flex items-center gap-3 mb-4 ${status === 'Allowed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {status === 'Allowed' ? <CheckCircle2 className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                <h4 className={`font-bold ${status === 'Allowed' ? 'text-emerald-900' : 'text-amber-900'} text-lg`}>
                  Law Status: {status === 'Allowed' ? 'Healthy' : 'Restricted'}
                </h4>
              </div>
              <p className={`text-sm ${status === 'Allowed' ? 'text-emerald-800/80' : 'text-amber-800/80'} leading-relaxed font-medium`}>
                {formattedState} {status === 'Allowed' ? 'has some of the most pro-ADU laws in the country, making it relatively easy to build.' : 'currently has some restrictions that might limit where and how you can build ADUs.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatePage;
