import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Clock, 
  FileText, 
  Settings, 
  Plus, 
  Search, 
  Bell,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  LogOut,
  Users,
  Compass,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mini Sidebar */}
      <div className="hidden lg:flex flex-col w-24 bg-primary items-center py-8 border-r border-white/10 shadow-2xl z-20 relative">
        <div className="w-12 h-12 bg-secondary rounded-[16px] flex items-center justify-center text-white font-extrabold text-2xl mb-12 shadow-md">A</div>
        <div className="flex flex-col gap-8 w-full items-center">
           <button className="w-12 h-12 bg-white/10 rounded-xl text-secondary flex items-center justify-center relative group">
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-secondary rounded-r-full"></div>
             <LayoutDashboard className="w-6 h-6" />
             <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Dashboard</span>
           </button>
           <button className="w-12 h-12 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center group relative">
             <MapPin className="w-6 h-6" />
             <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Saved Properties</span>
           </button>
           <button className="w-12 h-12 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center group relative">
             <Users className="w-6 h-6" />
             <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Saved Pros</span>
           </button>
           <button className="w-12 h-12 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center group relative">
             <div className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-primary"></div>
             <Bell className="w-6 h-6" />
             <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Alerts</span>
           </button>
           <button className="w-12 h-12 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center group relative">
             <Settings className="w-6 h-6" />
             <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Settings</span>
           </button>
           <button onClick={handleLogout} className="w-12 h-12 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center mt-auto group relative">
             <LogOut className="w-6 h-6" />
             <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">Logout</span>
           </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-10 z-10">
           <h2 className="text-2xl font-bold text-primary">My Dashboard</h2>
           <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                 <input type="text" placeholder="Search saved locations..." className="bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none w-72 focus:ring-2 focus:ring-secondary/20 transition-all" />
              </div>
              <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-primary">{currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-[11px] text-secondary uppercase font-extrabold tracking-wider">Pro Account</p>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm">
                    {currentUser?.email?.[0].toUpperCase() || 'U'}
                 </div>
              </div>
           </div>
        </header>

        <div className="p-6 sm:p-10 max-w-[1600px] mx-auto w-full overflow-y-auto">
           {/* Welcome Section */}
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm"
           >
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-3">Welcome back, {currentUser?.email?.split('@')[0] || 'Builder'}! 👋</h1>
                <p className="text-slate-500 text-lg">You have 3 active property checks and <span className="font-bold text-secondary">2 new policy alerts</span>.</p>
              </div>
              <button className="btn-secondary !py-3 !px-6 shadow-md hover:shadow-lg flex-shrink-0 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                New Property Check
              </button>
           </motion.div>

           {/* Stats Overview */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-[16px] bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                       <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                       <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Saved Locations</p>
                       <p className="text-3xl font-extrabold text-primary">12</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
                    <TrendingUp className="w-4 h-4" />
                    +2 this week
                 </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-[16px] bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                       <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                       <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Feasible Lots</p>
                       <p className="text-3xl font-extrabold text-primary">8</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                    66% of tracked sites
                 </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-[16px] bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center shadow-sm">
                       <Clock className="w-7 h-7" />
                    </div>
                    <div>
                       <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Permit Watch</p>
                       <p className="text-3xl font-extrabold text-primary">2</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 w-fit px-3 py-1.5 rounded-lg border border-amber-100">
                    Expected sign-off: 14d
                 </div>
              </motion.div>
           </div>

           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 pb-12">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-8">
                 
                 {/* Action Center */}
                 <section>
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-2xl font-bold text-primary flex items-center gap-3">
                         <Compass className="w-6 h-6 text-secondary" />
                         Action Center
                       </h3>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-sm">
                       <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                       <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 flex-shrink-0">
                             <FileCheck className="w-8 h-8" />
                          </div>
                          <div className="flex-grow">
                             <h4 className="text-xl font-bold text-indigo-900 mb-2">Next Step: Submit Permitting Documents</h4>
                             <p className="text-slate-600 mb-4 font-medium">Your project at <span className="font-bold text-indigo-900">456 Oak Ln</span> has passed feasibility. You need to upload architectural plans to proceed.</p>
                             <div className="flex gap-3">
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors">Upload Plans</button>
                                <button className="bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">View Checklist</button>
                             </div>
                          </div>
                       </div>
                    </div>
                 </section>

                 <section>
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-2xl font-bold text-primary">Saved Properties</h3>
                       <button className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline">View All <ChevronRight className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {[
                         { addr: '123 Main St, San Diego', status: 'Feasible', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
                         { addr: '456 Oak Ln, Austin', status: 'In Review', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
                         { addr: '789 Pine Rd, Seattle', status: 'Feasible', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
                         { addr: '101 Maple Dr, Portland', status: 'Conditional', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' }
                       ].map((item, idx) => (
                         <div key={idx} className="bg-white rounded-[20px] p-5 border border-slate-200 flex items-center justify-between group hover:border-secondary/50 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-secondary group-hover:bg-secondary/5 transition-colors">
                                  <MapPin className="w-6 h-6" />
                               </div>
                               <div>
                                  <h4 className="font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">{item.addr}</h4>
                                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Updated 2d ago</p>
                               </div>
                            </div>
                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${item.bg} ${item.color}`}>
                               {item.status}
                            </span>
                         </div>
                       ))}
                    </div>
                 </section>
                 
                 <section>
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-2xl font-bold text-primary">Saved Professionals</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {[
                         { name: 'Coastal Design Studio', role: 'Architect', location: 'San Diego, CA', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=100&auto=format&fit=crop' },
                         { name: 'Precision Build ADU', role: 'General Contractor', location: 'Los Angeles, CA', img: 'https://images.unsplash.com/photo-1541913007727-4dd01126ac03?q=80&w=100&auto=format&fit=crop' }
                       ].map((pro, idx) => (
                         <div key={idx} className="bg-white rounded-[20px] p-5 border border-slate-200 flex items-center gap-4 group hover:border-secondary/50 hover:shadow-md transition-all cursor-pointer">
                            <img src={pro.img} alt={pro.name} className="w-14 h-14 rounded-xl object-cover" />
                            <div className="flex-grow">
                               <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{pro.name}</h4>
                               <p className="text-xs font-bold text-secondary mb-1">{pro.role}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{pro.location}</p>
                            </div>
                            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-colors">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                         </div>
                       ))}
                    </div>
                 </section>
              </div>

              {/* Right Sidebar Alerts */}
              <div className="space-y-8">
                 <section className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 sm:p-8">
                    <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-secondary" />
                      Policy Alerts
                    </h3>
                    <div className="space-y-4">
                       {[
                         { title: 'New Ordinance in Austin', desc: 'ADU height limit increased to 25ft.', time: '2 hours ago', isNew: true },
                         { title: 'Fee Waiver Reminder', desc: 'San Diego waiver ends in 12 days.', time: '1 day ago', isNew: true },
                         { title: 'Statewide Zoning Update', desc: 'SB 423 implementation details released.', time: '3 days ago', isNew: false }
                       ].map((alert, idx) => (
                         <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-colors cursor-pointer relative overflow-hidden group">
                            {alert.isNew && <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>}
                            <div className="flex justify-between items-start mb-1">
                               <h4 className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors pl-2">{alert.title}</h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed pl-2 mb-2">{alert.desc}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2">{alert.time}</p>
                         </div>
                       ))}
                    </div>
                    <button className="w-full mt-6 py-2.5 text-sm font-bold text-slate-500 hover:text-primary transition-colors border-t border-slate-100">View All Alerts</button>
                 </section>

                 <div className="bg-primary rounded-[24px] p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    </div>
                    <div className="relative z-10">
                       <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-4">Pro Plan</div>
                       <h4 className="text-2xl font-bold mb-3">Upgrade to Expert</h4>
                       <p className="text-sm text-slate-300 mb-6 leading-relaxed">Get 1-on-1 access to ADU consultants, custom architectural review, and expedited permitting support.</p>
                       <button className="w-full bg-white hover:bg-slate-50 text-primary py-3 rounded-xl text-sm font-bold transition-colors shadow-md">Learn More</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
