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
  Search
} from 'lucide-react';
import MockMap from '../components/shared/MockMap';

const CityPage = () => {
  const { state, cityName } = useParams();
  const formattedCity = cityName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const formattedState = state.charAt(0).toUpperCase() + state.slice(1);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* City Header */}
      <div className="bg-white border-b border-border pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-500 mb-8 text-sm font-semibold">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/state/${state}`} className="hover:text-primary">{formattedState}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary">{formattedCity}</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl text-primary">{formattedCity}, {formattedState}</h1>
                <span className="badge !bg-blue-100 !text-blue-600 !py-1.5 !px-4">Pro-ADU City</span>
              </div>
              <p className="text-slate-500 max-w-2xl">
                Specific local ordinances and zoning overlays for {formattedCity}. Local rules often supersede state defaults in specific neighborhoods.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-border">
              <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-border text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Permit Time</p>
                <p className="font-bold text-primary">60-90 Days</p>
              </div>
              <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-border text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Impact Fees</p>
                <p className="font-bold text-primary">$0 - $5k</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Alerts / Constraints */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />
            <div>
              <h4 className="font-bold text-warning mb-1">Coastal Overlay Zone</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Properties within 1,000 yards of the coast require additional Coastal Development Permits (CDP) which can add 4-6 months to timeline.
              </p>
            </div>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
            <div>
              <h4 className="font-bold text-accent mb-1">Fee Waiver Active</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {formattedCity} is currently waiving development impact fees for ADUs under 750 sq ft until December 2024.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Detailed Rules Table */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl">Zoning Standards</h2>
                <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                  <MapIcon className="w-4 h-4" />
                  View Interactive Map
                </div>
              </div>
              <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-soft">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-border">
                      <th className="px-6 py-4 font-bold text-slate-600 text-sm">Category</th>
                      <th className="px-6 py-4 font-bold text-slate-600 text-sm">Standard</th>
                      <th className="px-6 py-4 font-bold text-slate-600 text-sm">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { cat: 'Setbacks', std: '4 ft Side / Rear', notes: 'Reduced from standard 15ft' },
                      { cat: 'Lot Coverage', std: 'No maximum', notes: 'State law overrides local limit' },
                      { cat: 'Min Lot Size', std: 'None', notes: 'Any residentially zoned lot' },
                      { cat: 'Fire Sprinklers', std: 'Required', notes: 'Only if primary has them' },
                      { cat: 'Architecture', std: 'Must match primary', notes: 'Roof pitch and siding' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{row.cat}</td>
                        <td className="px-6 py-4 text-slate-600">{row.std}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
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
              <h2 className="text-2xl mb-8">Permit Timeline</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { step: 'Intake', time: '1-2 Weeks', icon: Search },
                  { step: 'Plan Review', time: '4-6 Weeks', icon: Clock },
                  { step: 'Corrections', time: '2-4 Weeks', icon: Info },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-border text-center">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary mx-auto mb-4 flex items-center justify-center">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold mb-1">{item.step}</h4>
                    <p className="text-lg font-bold text-primary">{item.time}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="card">
              <h4 className="font-bold mb-6">Zoning Overlays</h4>
              <div className="flex flex-wrap gap-2">
                {['Single Family', 'Multi-Family', 'Transit Priority', 'Historic District', 'Wildfire Zone'].map(chip => (
                  <button key={chip} className="px-4 py-2 rounded-xl bg-slate-50 border border-border text-xs font-bold text-slate-600 hover:border-secondary hover:text-secondary transition-all">
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="card bg-primary text-white">
              <h4 className="font-bold mb-4">Start your project</h4>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Connect with local contractors who have successfully built in {formattedCity}.
              </p>
              <button className="w-full btn-primary !bg-secondary !text-white !border-none">Find Local Pros</button>
            </div>
            
            <div className="h-64 mb-8">
               <MockMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPage;
