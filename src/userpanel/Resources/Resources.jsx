import React from 'react';
import { Download, FileText, Globe, Info, Compass, ShieldCheck } from 'lucide-react';

const Resources = () => {
  const materials = [
    { title: 'ADU Planning & Feasibility Guidebook', type: 'PDF Document', size: '4.8 MB', desc: 'A step-by-step primer covering site setbacks, utilities, floorplan optimization, and cost modeling.' },
    { title: 'Standard Detached ADU Blueprint Template', type: 'CAD / PDF Drawing', size: '12.4 MB', desc: 'Sample pre-approved structural layout drawings for a 2-bedroom detached accessory unit.' },
    { title: 'Municipal Permit Checklist & Ordinance Tracker', type: 'Excel Spreadsheet', size: '1.2 MB', desc: 'Excel tracker sheet to compute structural fee items, impact fees, and fire hazard zone variables.' },
    { title: 'Builder & General Contractor Agreement Template', type: 'Word Template', size: '250 KB', desc: 'A vetted standard contract structure to manage build phases, milestones, and payment schedule.' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-primary">Downloads & Resources</h3>
        <p className="text-xs text-slate-400 mt-1">Get pre-vetted architectural blueprints, planning checklists, and contract structures.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {materials.map((m, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 group hover:border-secondary transition-all">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-secondary/15 group-hover:text-secondary transition-all">
                  <FileText className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{m.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{m.type} • {m.size}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{m.desc}</p>
            </div>
            <button 
              onClick={() => alert(`Simulating premium download for: ${m.title}`)}
              className="btn-primary !py-2 text-xs flex items-center justify-center gap-2 group-hover:!bg-secondary text-white"
            >
              <Download className="w-4 h-4" /> Download File
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
