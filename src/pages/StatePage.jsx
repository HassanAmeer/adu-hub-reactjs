import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { aduRules } from '../data/mockData';
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
  UserCheck
} from 'lucide-react';

const StatePage = () => {
  const { stateName } = useParams();
  const formattedState = stateName.charAt(0).toUpperCase() + stateName.slice(1);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-border pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to States
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl text-primary">{formattedState} ADU Laws</h1>
                <span className="badge badge-allowed !py-1.5 !px-4">Allowed State</span>
              </div>
              <p className="text-slate-500 max-w-2xl">
                Comprehensive guide to ADU regulations in {formattedState}. Learn about size limits, parking requirements, and recent legislation changes.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="btn-outline flex items-center gap-2 !py-2.5 !px-5 text-sm">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-sm">
                Get Alerted on Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Summary Grid */}
            <section>
              <h2 className="text-2xl mb-8">Key Regulations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {aduRules.map((rule, idx) => (
                  <div key={idx} className="card group hover:border-secondary/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                        {idx === 0 && <Ruler className="w-6 h-6" />}
                        {idx === 1 && <Building className="w-6 h-6" />}
                        {idx === 2 && <Car className="w-6 h-6" />}
                        {idx === 3 && <UserCheck className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">{rule.title}</h4>
                        <p className="text-2xl font-bold text-secondary mb-2">{rule.value}</p>
                        <p className="text-sm text-slate-500 leading-relaxed">{rule.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section>
              <h2 className="text-2xl mb-8">Legislative Timeline</h2>
              <div className="space-y-0 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                {[
                  { year: '2024', title: 'SB 423 Implementation', desc: 'Accelerated permit processing for multi-family ADUs in certain zones.' },
                  { year: '2023', title: 'AB 1033 Passing', desc: 'Allows local agencies to permit ADUs to be sold separately as condos.' },
                  { year: '2020', title: 'The ADU Revolution', desc: 'Major state-wide changes removing parking and owner-occupancy requirements.' }
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-12 pb-12 last:pb-0">
                    <div className="absolute left-0 top-1 w-9 h-9 rounded-full bg-white border-2 border-secondary flex items-center justify-center z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-border">
                      <span className="text-sm font-bold text-secondary mb-2 block">{item.year}</span>
                      <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Cities List */}
            <section>
              <h2 className="text-2xl mb-8">Major Cities in {formattedState}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['San Diego', 'Los Angeles', 'San Francisco', 'San Jose', 'Sacramento', 'Oakland'].map((city) => (
                  <Link 
                    key={city}
                    to={`/state/${stateName}/city/${city.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-border hover:border-secondary group transition-all"
                  >
                    <span className="font-semibold text-slate-700">{city}</span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-secondary" />
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary rounded-3xl p-8 text-white">
              <h3 className="text-xl mb-4">Need Help?</h3>
              <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                Our ADU experts can help you navigate the complex laws in {formattedState}.
              </p>
              <button className="w-full btn-primary !bg-secondary !text-white !border-none mb-4">Book Free Consult</button>
              <p className="text-[10px] text-center text-slate-400">Average response time: 2 hours</p>
            </div>

            <div className="card">
              <h4 className="font-bold mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-secondary" />
                Quick Resources
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="flex items-center justify-between text-sm text-slate-600 hover:text-secondary group">
                    Official Handbook
                    <Download className="w-4 h-4 text-slate-300 group-hover:text-secondary" />
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between text-sm text-slate-600 hover:text-secondary group">
                    Zoning Map Tool
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-secondary" />
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between text-sm text-slate-600 hover:text-secondary group">
                    Permit Fee Calculator
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-secondary" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="card bg-accent/5 border-accent/20">
              <div className="flex items-center gap-3 mb-4 text-accent">
                <CheckCircle2 className="w-6 h-6" />
                <h4 className="font-bold text-slate-900">Law Status: Healthy</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                {formattedState} has some of the most pro-ADU laws in the country, making it relatively easy to build.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatePage;
