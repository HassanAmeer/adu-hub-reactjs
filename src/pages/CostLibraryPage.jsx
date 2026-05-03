import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Info,
  ChevronRight,
  Download,
  Filter,
  BarChart3,
  PaintRoller
} from 'lucide-react';
import { motion } from 'framer-motion';

const CostLibraryPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen pb-24"
    >
      <div className="bg-primary text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6">ADU Cost Library</h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                Real-world construction data from thousands of completed ADU projects across the country. Get a detailed breakdown of what to expect.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button className="btn-secondary !bg-white/10 !text-white hover:!bg-white/20 border border-white/20 flex items-center justify-center gap-2 !py-3">
                <Filter className="w-5 h-5" />
                Customize View
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 !py-3">
                <Download className="w-5 h-5" />
                2024 Market Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Avg. Project Cost', value: '$245,000', change: '+4.2%', icon: DollarSign, color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { label: 'Avg. Price per sq ft', value: '$385', change: '+2.1%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Avg. Return on Invest', value: '12-18%', change: 'Steady', icon: PieChartIcon, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Recent Price Trend', value: 'Stabilizing', change: '-1.5%', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-50' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${stat.change.includes('+') ? 'bg-emerald-50 text-emerald-600' : stat.change.includes('-') ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Cost Breakdown Cards */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-8">Detailed Breakdown <span className="text-slate-400 font-medium text-xl">(750 sq ft ADU)</span></h2>
              <div className="space-y-6">
                {[
                  { title: 'Design & Pre-construction', range: '$15k - $25k', items: ['Architectural Plans', 'Structural Engineering', 'Site Surveys', 'Energy Calculations'] },
                  { title: 'Permits & City Fees', range: '$5k - $15k', items: ['Plan Check Fees', 'Impact Fees (Sewer/Water)', 'School District Fees', 'Permit Issuance'] },
                  { title: 'Site Prep & Foundation', range: '$40k - $60k', items: ['Grading & Excavation', 'Concrete Foundation', 'Utility Trenching', 'Plumbing Rough-in'] },
                  { title: 'Shell & Exterior', range: '$80k - $120k', items: ['Framing & Roofing', 'Windows & Doors', 'Siding & Stucco', 'Insulation'] },
                  { title: 'Interior Finishes', range: '$45k - $75k', items: ['Drywall & Paint', 'Flooring & Trim', 'Cabinets & Countertops', 'Fixtures & Appliances'] }
                ].map((block, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-[20px] overflow-hidden hover:border-secondary/50 hover:shadow-md transition-all group">
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 border-b border-slate-100 gap-4">
                      <h4 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">{block.title}</h4>
                      <span className="text-2xl font-extrabold text-secondary">{block.range}</span>
                    </div>
                    <div className="p-6 sm:p-8">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {block.items.map(item => (
                            <div key={item} className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                              <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                              {item}
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Charts/Filters */}
          <div className="space-y-8">
            <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm">
              <h4 className="text-xl font-bold text-primary mb-8 flex items-center gap-3">
                <PieChartIcon className="w-6 h-6 text-secondary" />
                Cost Allocation
              </h4>
              <div className="space-y-6">
                 {[
                   { label: 'Construction & Shell', value: '50%', color: 'bg-emerald-500' },
                   { label: 'Interior Finishes', value: '20%', color: 'bg-indigo-500' },
                   { label: 'Foundation & Prep', value: '15%', color: 'bg-amber-500' },
                   { label: 'Design & Permits', value: '15%', color: 'bg-blue-500' },
                 ].map(item => (
                   <div key={item.label}>
                      <div className="flex justify-between text-xs font-bold mb-3 uppercase tracking-wider">
                        <span className="text-slate-500">{item.label}</span>
                        <span className="text-slate-900">{item.value}</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: item.value }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${item.color} rounded-full`}
                        />
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="bg-primary rounded-[24px] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
               </div>
               <h4 className="text-2xl font-bold mb-4 relative z-10">Want a custom quote?</h4>
               <p className="text-slate-300 text-sm mb-8 leading-relaxed relative z-10">
                 Our cost calculator uses live market data from your specific neighborhood to give you a 95% accurate estimate.
               </p>
               <button className="w-full btn-secondary block text-center !py-3 relative z-10">Launch Calculator</button>
            </div>
            
            <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm">
              <h4 className="text-lg font-bold text-primary mb-2">Regional Multipliers</h4>
              <p className="text-xs text-slate-500 mb-6 font-medium">Adjustment factors based on local labor and material costs.</p>
              <div className="space-y-4">
                {[
                  { region: 'Bay Area, CA', multiplier: '1.4x', isHigh: true },
                  { region: 'Seattle, WA', multiplier: '1.1x', isHigh: true },
                  { region: 'Portland, OR', multiplier: '0.9x', isHigh: false },
                  { region: 'Austin, TX', multiplier: '0.85x', isHigh: false },
                ].map(r => (
                  <div key={r.region} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                    <span className="text-sm font-bold text-slate-700">{r.region}</span>
                    <span className={`text-sm font-extrabold px-2 py-1 rounded-md ${r.isHigh ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {r.multiplier}
                    </span>
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

export default CostLibraryPage;
