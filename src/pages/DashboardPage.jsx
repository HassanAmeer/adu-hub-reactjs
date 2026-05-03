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
  CheckCircle2
} from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mini Sidebar */}
      <div className="hidden lg:flex flex-col w-20 bg-primary items-center py-8 border-r border-white/10">
        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl mb-12">A</div>
        <div className="flex flex-col gap-8">
           <button className="text-secondary"><LayoutDashboard className="w-6 h-6" /></button>
           <button className="text-slate-500 hover:text-white transition-colors"><MapPin className="w-6 h-6" /></button>
           <button className="text-slate-500 hover:text-white transition-colors"><Bell className="w-6 h-6" /></button>
           <button className="text-slate-500 hover:text-white transition-colors"><FileText className="w-6 h-6" /></button>
           <button className="text-slate-500 hover:text-white transition-colors"><Settings className="w-6 h-6" /></button>
        </div>
      </div>

      <div className="flex-grow">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-border flex items-center justify-between px-8">
           <h2 className="text-xl font-bold">My Dashboard</h2>
           <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                 <input type="text" placeholder="Search saved locations..." className="bg-slate-50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none w-64" />
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold">John Doe</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Pro Account</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-slate-100 border border-border"></div>
              </div>
           </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
           {/* Welcome Section */}
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
              <div>
                <h1 className="text-3xl text-primary mb-2">Welcome back, John! 👋</h1>
                <p className="text-slate-500">You have 3 active property checks and 2 new policy alerts.</p>
              </div>
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Property Check
              </button>
           </div>

           {/* Stats Overview */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="card">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                       <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Saved Locations</p>
                       <p className="text-2xl font-bold">12</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-accent">
                    <TrendingUp className="w-3 h-3" />
                    +2 this week
                 </div>
              </div>
              <div className="card">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                       <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Feasible Lots</p>
                       <p className="text-2xl font-bold">8</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    66% of tracked sites
                 </div>
              </div>
              <div className="card">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
                       <Clock className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Permit Watch</p>
                       <p className="text-2xl font-bold">2</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    Expected sign-off: 14d
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 space-y-8">
                 <section>
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-lg font-bold">Recent Property Checks</h3>
                       <button className="text-sm font-bold text-secondary flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-4">
                       {[
                         { addr: '123 Main St, San Diego', status: 'Feasible', color: 'text-accent', bg: 'bg-accent/10' },
                         { addr: '456 Oak Ln, Austin', status: 'Conditional', color: 'text-warning', bg: 'bg-warning/10' },
                         { addr: '789 Pine Rd, Seattle', status: 'Feasible', color: 'text-accent', bg: 'bg-accent/10' },
                       ].map((item, idx) => (
                         <div key={idx} className="card flex items-center justify-between group hover:border-secondary transition-all">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-secondary transition-colors">
                                  <MapPin className="w-5 h-5" />
                               </div>
                               <div>
                                  <h4 className="font-bold text-sm">{item.addr}</h4>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">Checked 2 days ago</p>
                               </div>
                            </div>
                            <span className={`badge ${item.status === 'Feasible' ? 'badge-allowed' : 'badge-conditional'}`}>
                               {item.status}
                            </span>
                         </div>
                       ))}
                    </div>
                 </section>
              </div>

              {/* Sidebar Alerts */}
              <div className="space-y-8">
                 <section>
                    <h3 className="text-lg font-bold mb-6">Policy Alerts</h3>
                    <div className="bg-white rounded-2xl border border-border overflow-hidden">
                       {[
                         { title: 'New Ordinance in Austin', desc: 'ADU height limit increased to 25ft.' },
                         { title: 'Fee Waiver Reminder', desc: 'San Diego waiver ends in 12 days.' },
                       ].map((alert, idx) => (
                         <div key={idx} className="p-4 border-b border-border last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                            <h4 className="text-sm font-bold text-primary mb-1">{alert.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{alert.desc}</p>
                         </div>
                       ))}
                    </div>
                 </section>

                 <div className="bg-secondary rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                       <h4 className="font-bold mb-2">Upgrade to Expert</h4>
                       <p className="text-xs text-white/70 mb-4 leading-relaxed">Get 1-on-1 access to ADU consultants and custom legal reports.</p>
                       <button className="w-full bg-white text-secondary py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">Learn More</button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
