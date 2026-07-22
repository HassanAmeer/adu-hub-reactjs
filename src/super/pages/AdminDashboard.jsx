import React, { useEffect, useState } from 'react';
import { Users, Globe, Building, Bell, TrendingUp, Compass, Activity, ArrowUpRight, Search, Ticket, Calendar, MapPin, Star, UserPlus, AlertCircle, CheckCircle2, Clock, Plus, X } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import AdminModal from '../components/AdminModal';
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

  // Ticket Inspection & Management Modal States
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatusChoice, setNewStatusChoice] = useState('pending');
  const [timelineNote, setTimelineNote] = useState('');
  
  // Create Ticket Modal States
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newState, setNewState] = useState('California');
  const [newImpact, setNewImpact] = useState('Medium');
  const [newStatus, setNewStatus] = useState('pending');
  const [newDesc, setNewDesc] = useState('');

  // Filter states
  const [userFilter, setUserFilter] = useState('all'); // 30, 60, 90, custom
  const [userStartDate, setUserStartDate] = useState('');
  const [userEndDate, setUserEndDate] = useState('');
  const [searchLog, setSearchLog] = useState('');
  const [zoningFilter, setZoningFilter] = useState('30days');
  const [zoningLocationFilter, setZoningLocationFilter] = useState('all');
  const [isZoningReportOpen, setIsZoningReportOpen] = useState(false);

  const zoningStats = dbService.getZoningQueryStats(zoningFilter, zoningLocationFilter);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const usersData = dbService.getUsers();
    setAllUsers(usersData);
    setStats({
      users: usersData.length,
      states: dbService.getStates().length,
      pros: dbService.getDirectory().length,
      alerts: dbService.getAlerts().length,
    });
    setLogs(dbService.getLogs()); // Load all logs for comprehensive searching
    setTopPros(dbService.getDirectory().filter(p => p.isReferralEligible || p.rating >= 4.8).slice(0, 3));
    setTickets(dbService.getAlerts());
  };

  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatusChoice(ticket.status || 'pending');
    setTimelineNote('');
  };

  const handleUpdateTicketStatus = (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    dbService.updateAlertStatus(selectedTicket.id, newStatusChoice, timelineNote);
    loadData();

    // Refresh selectedTicket state locally
    const updatedTickets = dbService.getAlerts();
    const refreshed = updatedTickets.find(t => t.id === selectedTicket.id);
    setSelectedTicket(refreshed || null);
    setTimelineNote('');
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    dbService.addAlert({
      title: newTitle,
      state: newState,
      impact: newImpact,
      status: newStatus,
      desc: newDesc
    });

    loadData();
    setIsCreateTicketOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  // Filter Users Logic
  const getFilteredUsers = () => {
    const now = new Date();
    let filtered = allUsers;

    if (userFilter === 'custom') {
      return allUsers.filter(u => {
        if (!u.joinedDate) return false;
        if (userStartDate && new Date(u.joinedDate) < new Date(userStartDate)) return false;
        if (userEndDate) {
          const end = new Date(userEndDate);
          end.setHours(23, 59, 59, 999);
          if (new Date(u.joinedDate) > end) return false;
        }
        return true;
      });
    } else if (userFilter !== 'all') {
      const days = parseInt(userFilter);
      const cutoff = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
      cutoff.setHours(0, 0, 0, 0);
      filtered = allUsers.filter(u => u.joinedDate && new Date(u.joinedDate) >= cutoff);
    }
    return filtered;
  };

  const getRecentUsersCount = (daysCount) => {
    const cutoff = new Date();
    if (daysCount === 1) {
      const todayStr = new Date().toISOString().split('T')[0];
      return allUsers.filter(u => u.joinedDate && u.joinedDate.split('T')[0] === todayStr).length;
    }
    cutoff.setDate(cutoff.getDate() - daysCount);
    cutoff.setHours(0, 0, 0, 0);
    return allUsers.filter(u => u.joinedDate && new Date(u.joinedDate) >= cutoff).length;
  };

  const filteredLogs = logs.filter(l =>
    l.action.toLowerCase().includes(searchLog.toLowerCase()) ||
    l.admin.toLowerCase().includes(searchLog.toLowerCase())
  );

  const statusBadgeStyles = {
    'critical alert': 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs',
    'pending': 'bg-amber-50 text-amber-700 border-amber-200 shadow-xs',
    'in progress': 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs',
    'fixed': 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs',
    'Passed': 'bg-slate-100 text-slate-600 border-slate-200'
  };

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
        <StatsCard label="Total Users Registered" value={getFilteredUsers().length} icon={Users} change={userFilter !== 'all' ? `Filtered (${userFilter === 'custom' ? 'Date Range' : `Last ${userFilter}d`})` : "+12% this month"} colorClass="indigo" />
        <StatsCard label="Monitored States" value={stats.states} icon={Globe} change="50 Active" colorClass="emerald" />
        <StatsCard label="Listed Professionals" value={stats.pros} icon={Building} change="96% Verified" colorClass="amber" />
        <StatsCard label="System Tickets" value={stats.alerts} icon={Ticket} change="Active tracker" colorClass="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Acquisition Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-500" />
              User Registration Stats
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="30">Last 30 Days</option>
                <option value="60">Last 60 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="custom">Date Range</option>
              </select>
            </div>
          </div>

          {userFilter === 'custom' && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="font-bold text-[10px] text-slate-400 uppercase">From:</span>
                <input
                  type="date"
                  value={userStartDate}
                  onChange={(e) => setUserStartDate(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="font-bold text-[10px] text-slate-400 uppercase">To:</span>
                <input
                  type="date"
                  value={userEndDate}
                  onChange={(e) => setUserEndDate(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:border-indigo-200 transition-colors">
              <div className="text-2xl font-bold text-slate-800">{getRecentUsersCount(1)}</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">Today</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:border-indigo-200 transition-colors">
              <div className="text-2xl font-bold text-slate-800">{getRecentUsersCount(7)}</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">Last 7 Days</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:border-indigo-200 transition-colors">
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
              <div key={pro.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                    {pro.images && <img src={pro.images[0]} alt={pro.name} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      {pro.name}
                      {pro.isReferralEligible && (
                        <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">Partner</span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {pro.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {pro.reviewSource || 'Google'} {pro.rating}★
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 block">({pro.reviews || 0} reviews)</span>
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
              <p className="text-xs text-slate-400 mt-0.5">
                Total parcel feasibility searches run on Property Checker: <strong className="text-slate-700">{zoningStats.totalCount.toLocaleString()}</strong>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Location Filter */}
              <select
                value={zoningLocationFilter}
                onChange={(e) => setZoningLocationFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-slate-700 focus:outline-none focus:border-emerald-500 bg-slate-50 cursor-pointer"
              >
                <option value="all">📍 All Locations</option>
                <option value="top_cities">🏙️ Top Searched Cities</option>
                <option value="top_states">🗺️ Top Searched States</option>
                <option value="San Diego">San Diego, CA</option>
                <option value="Los Angeles">Los Angeles, CA</option>
                <option value="Austin">Austin, TX</option>
                <option value="Seattle">Seattle, WA</option>
                <option value="California">California State</option>
                <option value="Texas">Texas State</option>
              </select>

              {/* Timeline Filter */}
              <select
                value={zoningFilter}
                onChange={(e) => setZoningFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 font-semibold text-slate-600 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="30days">Last 30 Days</option>
                <option value="60days">Last 60 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last 1 Year</option>
                <option value="2years">Last 2 Years</option>
              </select>

              <button 
                onClick={() => setIsZoningReportOpen(true)}
                className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
              >
                Open Analytics <ArrowUpRight className="w-3.5 h-3.5" />
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
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {filteredLogs.length} {filteredLogs.length === 1 ? 'log' : 'logs'}
              </span>
            </div>

            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search activity logs by action, admin or date..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {searchLog && (
                <button
                  onClick={() => setSearchLog('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
              {filteredLogs.slice(0, 15).map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-700 leading-normal">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-bold uppercase">
                      <span className="text-slate-600 font-extrabold">{log.admin}</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500">No matching activity logs found.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Try searching for keywords like "User", "Project", or "Backup".</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Live Audit Trail
            </span>
            <a 
              href="/super/activity" 
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              Full Activity Logs <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

      {/* --- DISPATCHED ALERTS & SYSTEM TICKETS TRACKER --- */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2 tracking-tight">
              <Ticket className="w-5 h-5 text-indigo-600" />
              Dispatched Alerts & Bug Fix Tickets
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Click on any ticket item to inspect bug details, audit timeline history, or update resolution status.</p>
          </div>
          <button 
            onClick={() => setIsCreateTicketOpen(true)}
            className="btn-primary flex items-center gap-2 !py-2.5 !px-4 text-xs font-bold shrink-0"
          >
            <Plus className="w-4 h-4" /> Create Ticket / Bug Alert
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              onClick={() => openTicketModal(ticket)}
              className="border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider shrink-0 mt-0.5 ${statusBadgeStyles[ticket.status] || 'bg-slate-50 text-slate-600'}`}>
                  {ticket.status}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                    {ticket.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">{ticket.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold mt-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(ticket.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="text-slate-600">{ticket.state}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-bold">Impact: {ticket.impact || 'Medium'}</span>
                  </div>
                </div>
              </div>

              <button className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-2 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0 flex items-center gap-1.5">
                Inspect Ticket <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- TICKET DETAILS & STATUS INSPECTION MODAL --- */}
      {selectedTicket && (
        <AdminModal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`System Ticket Details: ${selectedTicket.id}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Issue Overview</span>
                <h3 className="text-lg font-bold text-slate-800">{selectedTicket.title}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-2">
                  <span>State: <strong>{selectedTicket.state}</strong></span>
                  <span>•</span>
                  <span>Impact: <strong className="text-rose-600">{selectedTicket.impact}</strong></span>
                  <span>•</span>
                  <span>Date: {new Date(selectedTicket.date).toLocaleDateString()}</span>
                </p>
              </div>
              
              <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider shrink-0 ${statusBadgeStyles[selectedTicket.status]}`}>
                {selectedTicket.status}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Technical Description & Context</h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200 font-medium">
                {selectedTicket.desc}
              </p>
            </div>

            {/* Change Status & Timeline Note Form */}
            <form onSubmit={handleUpdateTicketStatus} className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-indigo-600" />
                Update Ticket Status
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Select Status</label>
                  <select
                    value={newStatusChoice}
                    onChange={(e) => setNewStatusChoice(e.target.value)}
                    className="input-field text-xs font-bold !bg-white"
                  >
                    <option value="critical alert">🔴 Critical Alert</option>
                    <option value="pending">🟡 Pending Verification</option>
                    <option value="in progress">🔵 In Progress</option>
                    <option value="fixed">🟢 Fixed & Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Audit Note (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Code update pushed to staging server..."
                    value={timelineNote}
                    onChange={(e) => setTimelineNote(e.target.value)}
                    className="input-field text-xs !bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-primary !py-2 !px-4 text-xs font-bold">
                  Save Status Change
                </button>
              </div>
            </form>

            {/* Step-by-step Timeline History */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Audit Timeline & Status History</h4>
              <div className="space-y-4 pl-3 border-l-2 border-slate-200">
                {(selectedTicket.timeline || []).map((step, sIdx) => {
                  const dotColors = {
                    'critical alert': 'bg-rose-500',
                    'pending': 'bg-amber-500',
                    'in progress': 'bg-blue-500',
                    'fixed': 'bg-emerald-500'
                  };

                  return (
                    <div key={sIdx} className="relative pl-5">
                      <div className={`absolute -left-[19px] top-1 w-3 h-3 rounded-full border-2 border-white ${dotColors[step.status] || 'bg-slate-400'}`} />
                      <div className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2">
                        <span>{step.status}</span>
                        <span className="text-slate-400 font-normal lowercase">{new Date(step.date).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">{step.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button onClick={() => setSelectedTicket(null)} className="btn-secondary !py-2 !px-5 text-xs font-bold">Close Inspector</button>
            </div>
          </div>
        </AdminModal>
      )}

      {/* --- CREATE NEW TICKET MODAL --- */}
      {isCreateTicketOpen && (
        <AdminModal
          isOpen={isCreateTicketOpen}
          onClose={() => setIsCreateTicketOpen(false)}
          title="Create System Ticket / Bug Fix Alert"
        >
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Ticket Title</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Map Loading Error on San Diego Checker"
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)} 
                required 
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">State / Module</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newState} 
                  onChange={e => setNewState(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Impact Level</label>
                <select className="input-field" value={newImpact} onChange={e => setNewImpact(e.target.value)}>
                  <option value="Critical High">Critical High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Initial Status</label>
                <select className="input-field" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option value="critical alert">🔴 Critical Alert</option>
                  <option value="pending">🟡 Pending</option>
                  <option value="in progress">🔵 In Progress</option>
                  <option value="fixed">🟢 Fixed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Issue Description</label>
              <textarea 
                rows={3} 
                className="input-field" 
                placeholder="Describe bug symptoms, error trace, or municipal ordinance update details..." 
                value={newDesc} 
                onChange={e => setNewDesc(e.target.value)} 
                required 
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setIsCreateTicketOpen(false)} className="btn-secondary !py-2 !px-4 text-xs font-bold">Cancel</button>
              <button type="submit" className="btn-primary !py-2 !px-4 text-xs font-bold">Create Ticket</button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* --- ZONING QUERY ANALYTICS & BREAKDOWN MODAL --- */}
      {isZoningReportOpen && (
        <AdminModal
          isOpen={isZoningReportOpen}
          onClose={() => setIsZoningReportOpen(false)}
          title={`Zoning Query Volume Breakdown (${zoningFilter.replace('days', ' Days').replace('year', ' Year')})`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">Total Queries</span>
                <div className="text-xl font-black text-emerald-900">{zoningStats.totalCount.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">Top Searched City</span>
                <div className="text-xs font-black text-indigo-900 mt-1">{zoningStats.topCity}</div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">Top State</span>
                <div className="text-xs font-black text-amber-900 mt-1">{zoningStats.topState}</div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">Pass Rate</span>
                <div className="text-xl font-black text-blue-900">{zoningStats.passRate}</div>
              </div>
            </div>

            {/* Top Searched Cities & States Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Cities */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Top Searched Cities
                </h4>
                <div className="space-y-3">
                  {zoningStats.cityBreakdown.map((city, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{city.name}</span>
                        <span className="text-slate-500">{city.count} queries ({city.percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${city.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top States */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" /> Top Searched States
                </h4>
                <div className="space-y-3">
                  {zoningStats.stateBreakdown.map((state, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{state.name}</span>
                        <span className="text-slate-500">{state.count} queries ({state.percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${state.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Query Log Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Property Checks Log</h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      <th className="p-3">Property Address</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Zoning Outcome</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {zoningStats.recentQueries.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">{q.address}</td>
                        <td className="p-3 text-slate-600">{q.city}, {q.state}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {q.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 font-semibold">{q.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <a href="/super/checker" className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5">
                Manage Property Rules Database <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button onClick={() => setIsZoningReportOpen(false)} className="btn-secondary !py-2 !px-4 text-xs font-bold">
                Close Report
              </button>
            </div>
          </div>
        </AdminModal>
      )}

    </div>
  );
};

export default AdminDashboard;
