import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Info,
  ChevronRight,
  Download,
  Filter,
  BarChart3
} from 'lucide-react';

const CostLibraryPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="bg-white border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl text-primary mb-4">ADU Cost Library</h1>
              <p className="text-slate-500 max-w-2xl">
                Real-world construction data from thousands of completed ADU projects across the country.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn-outline flex items-center gap-2 !py-2.5">
                <Filter className="w-4 h-4" />
                Customize View
              </button>
              <button className="btn-primary flex items-center gap-2 !py-2.5">
                <Download className="w-4 h-4" />
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
            { label: 'Avg. Project Cost', value: '$245,000', change: '+4.2%', icon: DollarSign, color: 'text-secondary' },
            { label: 'Avg. Price per sq ft', value: '$385', change: '+2.1%', icon: TrendingUp, color: 'text-accent' },
            { label: 'Avg. Return on Invest', value: '12-18%', change: 'Steady', icon: PieChartIcon, color: 'text-warning' },
            { label: 'Recent Price Trend', value: 'Stabilizing', change: '-1.5%', icon: BarChart3, color: 'text-primary' },
          ].map((stat, idx) => (
            <div key={idx} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold ${stat.change.includes('+') ? 'text-accent' : 'text-slate-400'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Cost Breakdown Cards */}
            <section>
              <h2 className="text-2xl mb-8">Detailed Breakdown (750 sq ft ADU)</h2>
              <div className="space-y-6">
                {[
                  { title: 'Design & Pre-construction', range: '$15k - $25k', items: ['Architectural Plans', 'Structural Engineering', 'Site Surveys', 'Energy Calculations'] },
                  { title: 'Permits & City Fees', range: '$5k - $15k', items: ['Plan Check Fees', 'Impact Fees (Sewer/Water)', 'School District Fees', 'Permit Issuance'] },
                  { title: 'Site Prep & Foundation', range: '$40k - $60k', items: ['Grading & Excavation', 'Concrete Foundation', 'Utility Trenching', 'Plumbing Rough-in'] },
                  { title: 'Shell & Exterior', range: '$80k - $120k', items: ['Framing & Roofing', 'Windows & Doors', 'Siding & Stucco', 'Insulation'] }
                ].map((block, idx) => (
                  <div key={idx} className="bg-white border border-border rounded-2xl overflow-hidden hover:border-secondary transition-all">
                    <div className="p-6 flex justify-between items-center bg-slate-50/50">
                      <h4 className="font-bold text-primary">{block.title}</h4>
                      <span className="font-bold text-secondary">{block.range}</span>
                    </div>
                    <div className="p-6">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {block.items.map(item => (
                            <div key={item} className="flex items-center gap-3 text-sm text-slate-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
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
            <div className="card">
              <h4 className="font-bold mb-6 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-secondary" />
                Cost Allocation
              </h4>
              <div className="space-y-6">
                 {[
                   { label: 'Construction', value: '65%', color: 'bg-secondary' },
                   { label: 'Foundation', value: '15%', color: 'bg-accent' },
                   { label: 'Design', value: '10%', color: 'bg-warning' },
                   { label: 'Permits', value: '10%', color: 'bg-primary' },
                 ].map(item => (
                   <div key={item.label}>
                      <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-primary">{item.value}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: item.value }}></div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="card bg-primary text-white">
               <h4 className="font-bold mb-4">Want a custom quote?</h4>
               <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                 Our cost calculator uses live market data from your specific neighborhood to give you a 95% accurate estimate.
               </p>
               <button className="w-full btn-primary !bg-secondary !text-white !border-none">Launch Calculator</button>
            </div>
            
            <div className="card">
              <h4 className="font-bold mb-4">Regional Multipliers</h4>
              <p className="text-xs text-slate-500 mb-6">Adjustment factors based on local labor and material costs.</p>
              <div className="space-y-4">
                {[
                  { region: 'Bay Area, CA', multiplier: '1.4x' },
                  { region: 'Seattle, WA', multiplier: '1.1x' },
                  { region: 'Portland, OR', multiplier: '0.9x' },
                  { region: 'Austin, TX', multiplier: '0.85x' },
                ].map(r => (
                  <div key={r.region} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm font-semibold text-slate-600">{r.region}</span>
                    <span className="text-sm font-bold text-primary">{r.multiplier}</span>
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

export default CostLibraryPage;
