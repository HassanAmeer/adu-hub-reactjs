import React, { useEffect, useState } from 'react';
import { Users, Globe, Building, Bell, TrendingUp, Compass, Activity, ArrowUpRight, Search, Ticket, Calendar, MapPin, Star, UserPlus } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { dbService } from '../../services/dbService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    states: 0,
    pros: 0,
    alerts: 0,
  });

  // Data states
  const [allUsers, setAllUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [topPros, setTopPros] = useState([]);
  const [tickets, setTickets] = useState([]);

  // Filter states
  const [userFilter, setUserFilter] = useState('all'); // 30, 60, 90, custom
  const [searchLog, setSearchLog] = useState('');
  const [zoningFilter, setZoningFilter] = useState('30days');

  useEffect(() => {
    const usersData = dbService.getUsers();
    setAllUsers(usersData);
    setStats({
      users: usersData.length,
      states: dbService.getStates().length,
      pros: dbService.getDirectory().length,
      alerts: dbService.getAlerts().length,
    });
    setLogs(dbService.getLogs().slice(0, 10)); // Load more for searching
    setTopPros(dbService.getDirectory().filter(p => p.isReferralEligible || p.rating >= 4.8).slice(0, 3));
    setTickets(dbService.getAlerts());
  }, []);

  // Filter Users Logic
  const getFilteredUsers = () => {
    const now = new Date();
    let filtered = allUsers;

    if (userFilter !== 'all') {
      const days = parseInt(userFilter);
      const cutoff = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
      filtered = allUsers.filter(u => new Date(u.joinedDate) >= cutoff);
    }
    return filtered;
  };

  const getRecentUsersCount = (daysCount) => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - (daysCount * 24 * 60 * 60 * 1000));
    return allUsers.filter(u => new Date(u.joinedDate) >= cutoff).length;
  };

  const filteredLogs = logs.filter(l =>
    l.action.toLowerCase().includes(searchLog.toLowerCase()) ||
    l.admin.toLowerCase().includes(searchLog.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Welcome & Overview Header */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Control Center
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mt-3 text-secondary">Welcome Back, Administrator 👋</h1>
          <p className="text-slate-400 text-sm max-w-xl font-medium leading-relaxed">
            Monitor ADU Navi platform status, review zoning regulations databases, approve professional directory requests, and manage system tickets.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total Users Registered" value={getFilteredUsers().length} icon={Users} change="+12% this month" colorClass="indigo" />
        <StatsCard label="Monitored States" value={stats.states} icon={Globe} change="50 Active" colorClass="emerald" />
        <StatsCard label="Listed Professionals" value={stats.pros} icon={Building} change="96% Verified" colorClass="amber" />
        <StatsCard label="System Tickets" value={stats.alerts} icon={Ticket} change="Active tracker" colorClass="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Acquisition Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-500" />
              User Registration Stats
            </h3>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-600 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="30">Last 30 Days</option>
              <option value="60">Last 60 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <div className="text-2xl font-bold text-slate-800">{getRecentUsersCount(1)}</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">Today</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <div className="text-2xl font-bold text-slate-800">{getRecentUsersCount(7)}</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">Last 7 Days</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <div className="text-2xl font-bold text-slate-800">{getRecentUsersCount(30)}</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">Last 30 Days</div>
            </div>
          </div>
        </div>

        {/* Top Listed Professionals */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-amber-500" />
            Top Listed Professionals (Referral Program Ready)
          </h3>
          <div className="space-y-3">
            {topPros.map(pro => (
              <div key={pro.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                    {pro.images && <img src={pro.images[0]} alt={pro.name} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{pro.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {pro.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {pro.rating}
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wide">Top Rated</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* User Search Trends (Interactive SVG Chart) */}
        <div className="xl:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Zoning Query Volume
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Total searches run on the Property Checker tool</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={zoningFilter}
                onChange={(e) => setZoningFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-600 focus:outline-none focus:border-emerald-500"
              >
                <option value="30days">Last 30 Days</option>
                <option value="60days">Last 60 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last 1 Year</option>
                <option value="2years">Last 2 Years</option>
              </select>
              <button className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 font-bold hover:bg-emerald-100 transition-colors">
                Open Report <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Custom SVG Line Chart with Gradients */}
          <div className="relative h-60 w-full mb-4 group cursor-crosshair">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              <line x1="0" y1="50" x2="500" y2="50" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#F1F5F9" strokeWidth="1" />

              <path
                d={zoningFilter.includes('days')
                  ? "M 0 170 C 60 150, 100 120, 150 140 C 200 160, 250 80, 300 90 C 350 100, 400 40, 500 30 L 500 200 L 0 200 Z"
                  : "M 0 120 C 60 100, 100 150, 150 90 C 200 60, 250 100, 300 50 C 350 80, 400 20, 500 10 L 500 200 L 0 200 Z"
                }
                fill="url(#chartGradient)"
                className="transition-all duration-500 ease-in-out"
              />

              <path
                d={zoningFilter.includes('days')
                  ? "M 0 170 C 60 150, 100 120, 150 140 C 200 160, 250 80, 300 90 C 350 100, 400 40, 500 30"
                  : "M 0 120 C 60 100, 100 150, 150 90 C 200 60, 250 100, 300 50 C 350 80, 400 20, 500 10"
                }
                fill="none"
                stroke="var(--color-secondary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="transition-all duration-500 ease-in-out"
              />

              <circle cx={zoningFilter.includes('days') ? "150" : "300"} cy={zoningFilter.includes('days') ? "140" : "50"} r="5" fill="var(--color-secondary)" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="500" cy={zoningFilter.includes('days') ? "30" : "10"} r="6" fill="var(--color-secondary)" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-4">
            {zoningFilter.includes('days') ? (
              <><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></>
            ) : (
              <><span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span></>
            )}
          </div>
        </div>

        {/* System Activity Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                System Activity
              </h3>
            </div>

            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
              {filteredLogs.map((log) => (
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
              {filteredLogs.length === 0 && (
                <p className="text-slate-400 text-sm text-center py-6">No matching actions found.</p>
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

      {/* Dispatched Alerts & System Tickets Tracker */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-500" />
              System Tickets & Dispatched Alerts
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Click on any ticket to view timeline and status history.</p>
          </div>
          <button className="text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
            + Create Ticket
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tickets.map((ticket, idx) => {
            const statusColors = {
              'critical alert': 'bg-rose-50 text-rose-600 border-rose-200',
              'pending': 'bg-amber-50 text-amber-600 border-amber-200',
              'in progress': 'bg-blue-50 text-blue-600 border-blue-200',
              'fixed': 'bg-emerald-50 text-emerald-600 border-emerald-200',
              'Passed': 'bg-slate-100 text-slate-600 border-slate-200' // Legacy compatibility
            };

            return (
              <details key={idx} className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-slate-300 transition-colors cursor-pointer">
                <summary className="p-4 flex items-center justify-between bg-slate-50/50 outline-none list-none">
                  <div className="flex items-center gap-4">
                    <div className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${statusColors[ticket.status] || 'bg-slate-50 text-slate-600'}`}>
                      {ticket.status}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{ticket.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(ticket.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-semibold">{ticket.state}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400 group-open:rotate-180 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </summary>
                <div className="p-4 border-t border-slate-100 bg-white">
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{ticket.desc}</p>

                  {ticket.timeline && ticket.timeline.length > 0 && (
                    <div className="space-y-4 pl-2 border-l-2 border-slate-100 mt-4">
                      {ticket.timeline.map((step, sIdx) => (
                        <div key={sIdx} className="relative pl-4">
                          <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${step.status === 'fixed' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <div className="text-xs font-bold text-slate-800 uppercase">{step.status} <span className="text-slate-400 font-normal lowercase ml-2">{new Date(step.date).toLocaleString()}</span></div>
                          <p className="text-xs text-slate-500 mt-1">{step.note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
