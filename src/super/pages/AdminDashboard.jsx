import React, { useEffect, useState } from 'react';
import { Users, Globe, Building, Bell, TrendingUp, Compass, Activity, ArrowUpRight } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { dbService } from '../../services/dbService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    states: 0,
    pros: 0,
    alerts: 0,
  });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setStats({
      users: dbService.getUsers().length,
      states: dbService.getStates().length,
      pros: dbService.getDirectory().length,
      alerts: dbService.getAlerts().length,
    });
    setLogs(dbService.getLogs().slice(0, 4));
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome & Overview Header */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Control Center
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mt-3">Welcome Back, Administrator 👋</h1>
          <p className="text-slate-400 text-sm max-w-xl font-medium leading-relaxed">
            Monitor ADU Navi platform status, review zoning regulations databases, approve professional directory requests, and dispatch legislative alerts.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total Users Registered" value={stats.users} icon={Users} change="+12% this month" colorClass="indigo" />
        <StatsCard label="Monitored States" value={stats.states} icon={Globe} change="4 Active" colorClass="emerald" />
        <StatsCard label="Listed Professionals" value={stats.pros} icon={Building} change="96% Verified" colorClass="amber" />
        <StatsCard label="Dispatched Alerts" value={stats.alerts} icon={Bell} change="+1 this week" colorClass="blue" />
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* User Search Trends (Interactive SVG Chart) */}
        <div className="xl:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Zoning Query Volume (Weekly)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Total searches run on the Property Checker tool</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 font-bold">
              +18.4% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Custom SVG Line Chart with Gradients */}
          <div className="relative h-60 w-full mb-4">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              
              {/* Background gridlines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#F1F5F9" strokeWidth="1" />
              
              {/* Area under curve */}
              <path 
                d="M 0 170 C 60 150, 100 120, 150 140 C 200 160, 250 80, 300 90 C 350 100, 400 40, 500 30 L 500 200 L 0 200 Z" 
                fill="url(#chartGradient)" 
              />
              
              {/* Main curve line */}
              <path 
                d="M 0 170 C 60 150, 100 120, 150 140 C 200 160, 250 80, 300 90 C 350 100, 400 40, 500 30" 
                fill="none" 
                stroke="#059669" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />

              {/* Data points */}
              <circle cx="150" cy="140" r="5" fill="#059669" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="300" cy="90" r="5" fill="#059669" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="500" cy="30" r="6" fill="#059669" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-4">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* System Activity Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              System Activity
            </h3>
            
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700 leading-normal">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-bold uppercase">
                      <span>{log.admin}</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <p className="text-slate-400 text-sm text-center py-6">No recent actions recorded.</p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Live status synced with Firestore
            </span>
          </div>
        </div>

      </div>

      {/* ADU Platform Roadmap & Overview Checklists */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-500" />
          Admin Checklist
        </h3>
        <p className="text-xs text-slate-400 mb-6 font-medium">Core verification tasks required to maintain the platform:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { task: 'Approve pending contractor profiles in Professionals list', status: 'Requires Review' },
            { task: 'Crosscheck zoning updates for newly proposed bills (SB 1211 / SB 1537)', status: 'In Progress' },
            { task: 'Simulate property zoning constraints for San Diego & Seattle', status: 'Completed' },
            { task: 'Audit payment transaction history for expert tier contractors', status: 'Completed' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  item.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {item.status === 'Completed' && (
                    <svg className="w-3 h-3 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={`font-semibold ${item.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {item.task}
                </span>
              </div>
              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
