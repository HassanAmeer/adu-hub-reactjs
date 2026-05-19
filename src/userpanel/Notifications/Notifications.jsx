import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/dbService';
import { Bell, Info, ShieldCheck } from 'lucide-react';

const Notifications = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    setAlerts(dbService.getAlerts());
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-xl font-bold text-primary">Notifications & Alerts</h3>
        <p className="text-xs text-slate-400 mt-1">Real-time legislative revisions and local zoning amendments in your state.</p>
      </div>

      <div className="space-y-4">
        {alerts.map((a) => (
          <div key={a.id} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>
            <div className="flex justify-between items-start gap-4 mb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{a.date}</span>
                <h4 className="font-bold text-primary text-base flex items-center gap-2">
                  <Bell className="w-4.5 h-4.5 text-secondary animate-pulse" />
                  {a.title}
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded bg-secondary/15 text-secondary text-[10px] font-bold uppercase">{a.state}</span>
            </div>
            <p className="text-sm text-slate-600 mb-4">{a.desc}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100 font-semibold text-slate-700">
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[9px] mb-1">Previous Standard:</span>
                <span className="text-slate-500 font-medium">{a.before}</span>
              </div>
              <div>
                <span className="text-secondary font-bold block uppercase text-[9px] mb-1">New Legislation:</span>
                <span className="text-slate-800 font-bold">{a.after}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
