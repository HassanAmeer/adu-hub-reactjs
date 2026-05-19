import React from 'react';

const StatsCard = ({ label, value, icon: Icon, change = null, changeType = 'increase', colorClass = 'indigo' }) => {
  const themes = {
    indigo: { bg: 'bg-indigo-50/70', border: 'border-indigo-100', icon: 'text-indigo-600', hover: 'hover:border-indigo-300' },
    emerald: { bg: 'bg-emerald-50/70', border: 'border-emerald-100', icon: 'text-emerald-600', hover: 'hover:border-emerald-300' },
    amber: { bg: 'bg-amber-50/70', border: 'border-amber-100', icon: 'text-amber-600', hover: 'hover:border-amber-300' },
    blue: { bg: 'bg-blue-50/70', border: 'border-blue-100', icon: 'text-blue-600', hover: 'hover:border-blue-300' },
    rose: { bg: 'bg-rose-50/70', border: 'border-rose-100', icon: 'text-rose-600', hover: 'hover:border-rose-300' },
  };

  const theme = themes[colorClass] || themes.indigo;

  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition-all duration-200 ${theme.hover}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${theme.bg} ${theme.icon}`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
            {change && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                changeType === 'increase' 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}>
                {change}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
