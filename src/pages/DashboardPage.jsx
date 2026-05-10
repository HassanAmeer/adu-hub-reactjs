import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Clock, 
  FileText, 
  Settings as SettingsIcon, 
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
  FileCheck,
  ShieldCheck,
  ExternalLink,
  Trash2,
  CreditCard,
  User,
  BellRing
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAlerts, getSavedProperties, getSavedPros } from '../services/db';

const DashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'properties', icon: MapPin, label: 'Saved Properties' },
    { id: 'pros', icon: Users, label: 'Saved Pros' },
    { id: 'alerts', icon: Bell, label: 'Alerts', badge: true },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const [alerts, setAlerts] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [savedPros, setSavedPros] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      const alertsData = await getAlerts(currentUser.id);
      const propsData = await getSavedProperties(currentUser.id);
      const prosData = await getSavedPros(currentUser.id);
      
      setAlerts(alertsData);
      setSavedProperties(propsData);
      setSavedPros(prosData);
      setLoading(false);
    };
    fetchDashboardData();
  }, [currentUser]);

  const renderContent = () => {
    if (loading) return <div className="text-center py-20 text-slate-500">Loading dashboard...</div>;
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview currentUser={currentUser} alerts={alerts} properties={savedProperties} />;
      case 'properties':
        return <SavedProperties properties={savedProperties} />;
      case 'pros':
        return <SavedPros pros={savedPros} />;
      case 'alerts':
        return <AlertsFeed alerts={alerts} />;
      case 'settings':
        return <SettingsView currentUser={currentUser} />;
      default:
        return <DashboardOverview currentUser={currentUser} alerts={alerts} properties={savedProperties} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mini Sidebar */}
      <div className="hidden lg:flex flex-col w-24 bg-primary items-center py-8 border-r border-white/10 shadow-2xl z-20 relative">
        <div className="w-12 h-12 bg-secondary rounded-[16px] flex items-center justify-center text-white font-extrabold text-2xl mb-12 shadow-md cursor-pointer" onClick={() => navigate('/')}>A</div>
        <div className="flex flex-col gap-8 w-full items-center">
           {menuItems.map((item) => (
             <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center relative group transition-all ${
                  activeTab === item.id ? 'bg-white/10 text-secondary' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
             >
               {activeTab === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-secondary rounded-r-full"></div>}
               <item.icon className="w-6 h-6" />
               {item.badge && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-primary"></div>}
               <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/10">{item.label}</span>
             </button>
           ))}
           <button onClick={handleLogout} className="w-12 h-12 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center mt-auto group relative">
             <LogOut className="w-6 h-6" />
             <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/10">Logout</span>
           </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-10 z-10 shrink-0">
           <h2 className="text-2xl font-bold text-primary">
             {menuItems.find(i => i.id === activeTab)?.label}
           </h2>
           <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                 <input type="text" placeholder="Search..." className="bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none w-72 focus:ring-2 focus:ring-secondary/20 transition-all" />
              </div>
              <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-primary">{currentUser?.displayName || 'User'}</p>
                    <p className="text-[11px] text-secondary uppercase font-extrabold tracking-wider">Pro Account</p>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm">
                    {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
                 </div>
              </div>
           </div>
        </header>

        <main className="flex-grow overflow-y-auto p-6 sm:p-10 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-[1400px] mx-auto w-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

/* --- Sub-components for Content --- */

const DashboardOverview = ({ currentUser, alerts, properties }) => (
  <div className="space-y-12">
    {/* Welcome Section */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-3">Welcome back, {currentUser?.displayName || 'Builder'}! 👋</h1>
        <p className="text-slate-500 text-lg">You have {properties.length} active property checks and <span className="font-bold text-secondary">{alerts.filter(a => a.unread).length} new policy alerts</span>.</p>
      </div>
      <button className="btn-secondary !py-3 !px-6 shadow-md hover:shadow-lg flex-shrink-0 flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" />
        New Property Check
      </button>
    </div>

    {/* Stats Overview */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {[
        { label: 'Saved Locations', value: '12', icon: MapPin, color: 'text-indigo-600', bg: 'bg-indigo-50', change: '+2 this week' },
        { label: 'Feasible Lots', value: '8', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '66% success' },
        { label: 'Permit Watch', value: '2', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', change: '14 days avg' },
      ].map((stat, idx) => (
        <div key={idx} className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-[16px] ${stat.bg} border border-slate-100 ${stat.color} flex items-center justify-center shadow-sm`}>
               <stat.icon className="w-7 h-7" />
            </div>
            <div>
               <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 text-xs font-bold w-fit px-3 py-1.5 rounded-lg border ${stat.color === 'text-emerald-600' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : stat.color === 'text-amber-500' ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-slate-500 bg-slate-50 border-slate-100'}`}>
            {stat.change}
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 pb-12">
      <div className="xl:col-span-2 space-y-12">
        {/* Action Center */}
        <section>
          <h3 className="text-2xl font-bold text-primary flex items-center gap-3 mb-6">
            <Compass className="w-6 h-6 text-secondary" />
            Action Center
          </h3>
          <div className="bg-indigo-50 border border-indigo-100 rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-sm group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 flex-shrink-0">
                <FileCheck className="w-8 h-8" />
              </div>
              <div className="flex-grow">
                <h4 className="text-xl font-bold text-indigo-900 mb-2">Next Step: Submit Permitting Documents</h4>
                <p className="text-slate-600 mb-4 font-medium leading-relaxed">Your project at <span className="font-bold text-indigo-900">456 Oak Ln</span> has passed feasibility. You need to upload architectural plans to proceed.</p>
                <div className="flex gap-3">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95">Upload Plans</button>
                  <button className="bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95">View Checklist</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity Mini Grid */}
        <section>
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-primary">Recently Checked</h3>
              <button className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline">View All <ChevronRight className="w-4 h-4" /></button>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {properties.slice(0, 2).map((item, idx) => (
                <div key={idx} className="bg-white rounded-[20px] p-5 border border-slate-200 flex items-center justify-between group hover:border-secondary/50 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-secondary group-hover:bg-secondary/5 transition-colors">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">{item.addr}</h4>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Recently</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${item.status === 'Feasible' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
           </div>
        </section>
      </div>

      <div className="space-y-8">
        {/* Mini Alerts Sidebar */}
        <section className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 sm:p-8">
          <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-secondary" />
            Recent Alerts
          </h3>
          <div className="space-y-4">
            {alerts.slice(0, 2).map((alert, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-secondary opacity-50"></div>
                <h4 className="text-sm font-bold text-slate-800 mb-1 pl-2">{alert.title}</h4>
                <p className="text-xs text-slate-500 pl-2 mb-2">{alert.desc}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2">{alert.time}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 text-sm font-bold text-slate-500 hover:text-primary transition-colors border-t border-slate-100">See All Alerts</button>
        </section>

        {/* Upgrade Card */}
        <div className="bg-primary rounded-[24px] p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10">
            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-4">Pro Plan</div>
            <h4 className="text-2xl font-bold mb-3">Upgrade to Expert</h4>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">Get 1-on-1 access to ADU consultants and expedited permitting support.</p>
            <button className="w-full bg-white hover:bg-slate-50 text-primary py-3 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-md">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SavedProperties = ({ properties }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-2xl font-bold text-primary">Your Saved Locations</h3>
      <button className="btn-secondary !py-2.5 !px-5 text-sm flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add New
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((prop, idx) => (
        <div key={idx} className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer">
          <div className="h-48 relative overflow-hidden">
            <img src={prop.img} alt={prop.addr} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-red-500 flex items-center justify-center hover:bg-white transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4">
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${
                prop.status === 'Feasible' ? 'bg-emerald-500/80 text-white border-emerald-400' : 
                prop.status === 'Restricted' ? 'bg-amber-500/80 text-white border-amber-400' : 'bg-indigo-500/80 text-white border-indigo-400'
              }`}>
                {prop.status}
              </span>
            </div>
          </div>
          <div className="p-6">
            <h4 className="font-bold text-slate-800 mb-4 line-clamp-1">{prop.addr}</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {prop.tags.map(tag => (
                <span key={tag} className="px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold uppercase">{tag}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 btn-primary !py-2 text-xs">Analyze</button>
              <button className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SavedPros = ({ pros }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-2xl font-bold text-primary">Tracked Professionals</h3>
      <p className="text-sm text-slate-500 font-bold">{pros.length} Professionals Saved</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {pros.map((pro, idx) => (
        <div key={idx} className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-secondary/50 hover:shadow-xl transition-all cursor-pointer">
          <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-2xl">
            <img src={pro.img} alt={pro.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-primary text-xl group-hover:text-secondary transition-colors">{pro.name}</h4>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <ShieldCheck className="w-3.5 h-3.5" /> {pro.rating}
              </div>
            </div>
            <p className="text-sm font-bold text-secondary mb-2">{pro.role}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">
              <MapPin className="w-3.5 h-3.5" /> {pro.location}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 py-2 rounded-xl text-xs font-bold transition-colors">Message</button>
              <button className="flex-1 bg-secondary hover:bg-secondary/90 text-white py-2 rounded-xl text-xs font-bold transition-colors">Portfolio</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AlertsFeed = ({ alerts }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-2xl font-bold text-primary">Policy Alerts & Notifications</h3>
      <button className="text-sm font-bold text-secondary">Mark all as read</button>
    </div>
    <div className="space-y-4 max-w-4xl">
      {alerts.map((alert, idx) => (
        <div key={idx} className={`bg-white rounded-[20px] p-6 border transition-all hover:shadow-md cursor-pointer flex gap-6 ${alert.unread ? 'border-secondary/30 ring-1 ring-secondary/5 shadow-sm' : 'border-slate-200 opacity-80'}`}>
          <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${alert.type === 'Law' ? 'bg-amber-50 text-amber-500' : alert.type === 'Finance' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
            <BellRing className="w-7 h-7" />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-primary text-lg">{alert.title}</h4>
                {alert.unread && <div className="w-2 h-2 rounded-full bg-secondary"></div>}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{alert.time}</span>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed font-medium">{alert.desc}</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">{alert.type}</span>
              <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${
                alert.impact === 'Very High' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-amber-50 text-amber-500 border-amber-100'
              }`}>Impact: {alert.impact}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SettingsView = ({ currentUser }) => (
  <div className="max-w-4xl space-y-12 pb-24">
    <section>
      <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
        <User className="w-6 h-6 text-secondary" />
        Profile Information
      </h3>
      <div className="bg-white rounded-[24px] border border-slate-200 p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
           <div className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-indigo-600 font-extrabold text-4xl">
              {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
           </div>
           <div>
              <button className="btn-secondary !py-2 !px-4 text-xs shadow-sm">Change Avatar</button>
              <p className="text-xs text-slate-400 mt-2 font-medium">Recommended: 256x256px JPG or PNG</p>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
              <input type="text" defaultValue={currentUser?.displayName} className="input-field !py-3 !bg-slate-50" />
           </div>
           <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" defaultValue={currentUser?.email} className="input-field !py-3 !bg-slate-50" readOnly />
           </div>
        </div>
        <button className="btn-primary !py-3 !px-8 text-sm shadow-md active:scale-95 transition-all">Save Changes</button>
      </div>
    </section>

    <section>
      <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
        <CreditCard className="w-6 h-6 text-secondary" />
        Subscription & Billing
      </h3>
      <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
           <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Current Plan</p>
              <h4 className="text-2xl font-bold text-primary">Pro Builder <span className="text-slate-400 font-medium text-lg">($29/mo)</span></h4>
           </div>
           <button className="btn-outline !py-2 !px-4 text-xs">Manage Plan</button>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-600">Visa ending in •••• 4242</span>
           </div>
           <button className="text-xs font-bold text-secondary hover:underline">Update</button>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
        <BellRing className="w-6 h-6 text-secondary" />
        Notification Preferences
      </h3>
      <div className="bg-white rounded-[24px] border border-slate-200 p-8 space-y-4 shadow-sm">
        {[
          { label: 'Policy Alerts', desc: 'Get notified when zoning laws change in your saved locations.', default: true },
          { label: 'New Professionals', desc: 'Alert me when new architects or contractors join the directory.', default: true },
          { label: 'Marketing Updates', desc: 'Weekly newsletter with ADU tips and case studies.', default: false },
        ].map((pref, idx) => (
          <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
             <div>
                <h4 className="font-bold text-slate-800 text-sm">{pref.label}</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">{pref.desc}</p>
             </div>
             <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${pref.default ? 'bg-secondary' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${pref.default ? 'left-7' : 'left-1'}`}></div>
             </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default DashboardPage;
