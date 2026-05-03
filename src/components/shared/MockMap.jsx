import React from 'react';

const MockMap = ({ className = "" }) => {
  return (
    <div className={`relative w-full h-full bg-slate-100 rounded-2xl overflow-hidden ${className}`}>
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Blocks/Lots */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
        <rect x="50" y="50" width="80" height="120" className="fill-white stroke-slate-300 stroke-1" />
        <rect x="50" y="180" width="80" height="60" className="fill-white stroke-slate-300 stroke-1" />
        <rect x="140" y="50" width="100" height="180" className="fill-white stroke-slate-300 stroke-1" />
        <rect x="250" y="50" width="100" height="90" className="fill-white stroke-slate-300 stroke-1" />
        <rect x="250" y="150" width="100" height="90" className="fill-secondary/10 stroke-secondary stroke-2" />
        
        {/* Street Lines */}
        <line x1="0" y1="45" x2="400" y2="45" className="stroke-slate-200 stroke-[10]" />
        <line x1="45" y1="0" x2="45" y2="400" className="stroke-slate-200 stroke-[10]" />
        <line x1="355" y1="0" x2="355" y2="400" className="stroke-slate-200 stroke-[10]" />
        
        {/* Selected Property Pin */}
        <g transform="translate(300, 195)">
          <path d="M0 -15 C -8 -15, -8 -5, 0 0 C 8 -5, 8 -15, 0 -15" className="fill-danger" />
          <circle cx="0" cy="-10" r="3" className="fill-white" />
        </g>
        
        {/* Other lot details */}
        <rect x="150" y="70" width="30" height="30" className="fill-slate-50" />
        <rect x="190" y="70" width="30" height="30" className="fill-slate-50" />
      </svg>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary rounded-sm"></div>
            <span className="text-[10px] font-bold text-slate-600">Selected Parcel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-sm"></div>
            <span className="text-[10px] font-bold text-slate-600">Buffer Zone</span>
          </div>
        </div>
      </div>
      
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1">
        <button className="w-8 h-8 bg-white border border-border rounded-lg shadow-sm flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50">+</button>
        <button className="w-8 h-8 bg-white border border-border rounded-lg shadow-sm flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50">-</button>
      </div>
    </div>
  );
};

export default MockMap;
