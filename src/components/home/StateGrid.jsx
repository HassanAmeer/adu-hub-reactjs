import React from 'react';
import { states } from '../../data/mockData';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StateGrid = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl text-primary mb-4">Explore by State</h2>
            <p className="text-slate-500">
              Select your state to view specific ADU regulations, upcoming legislation changes, and local building guidelines.
            </p>
          </div>
          <Link to="/law-tracker" className="text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All States <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {states.map((state) => (
            <Link 
              key={state.id} 
              to={`/state/${state.name.toLowerCase()}`}
              className="bg-white p-6 rounded-2xl border border-border hover:shadow-soft transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`badge ${state.status === 'Allowed' ? 'badge-allowed' : 'badge-conditional'}`}>
                  {state.status}
                </span>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{state.name}</h3>
              <p className="text-slate-500 text-sm">{state.cities.length} major cities tracked</p>
            </Link>
          ))}
          
          <div className="bg-primary p-6 rounded-2xl flex flex-col justify-between text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Don't see your state?</h3>
              <p className="text-slate-300 text-sm mb-6">We're expanding nationwide. Get notified when your state is added.</p>
              <button className="text-sm font-bold flex items-center gap-2 text-secondary group-hover:gap-3 transition-all">
                Notify Me <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StateGrid;
