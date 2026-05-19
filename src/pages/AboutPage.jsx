import React from 'react';
import { ShieldCheck, Compass, Info, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-primary uppercase tracking-tight">About ADU Navi</h1>
          <p className="text-slate-500 font-medium text-lg">Democratizing housing construction by clarifying residential zoning code rules.</p>
        </div>

        <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-primary border-b border-slate-100 pb-4">Our Mission</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            ADU Navi was created to streamline the accessory dwelling unit construction cycle for homeowners and builders. By aggregating complex city ordinances, state building codes, and municipal fees, we empower everyone to easily evaluate zoning feasibility and construct beautiful accessory dwellings.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            Whether you want to build a detached backyard flat, convert a garage, or find a licensed contractor, our site provides pre-vetted pricing guides and zoning checkers to complete your project on time and within budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Zoning Transparency', icon: Compass, desc: 'We translate municipal housing guidelines into plain, readable English.' },
            { title: 'Verified Builders', icon: Users, desc: 'Every contractor in our local directory passes verified credentials check.' },
            { title: 'Cost Estimates', icon: ShieldCheck, desc: 'Our library delivers realistic planning fee lists and design costs.' }
          ].map((val, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <val.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">{val.title}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
