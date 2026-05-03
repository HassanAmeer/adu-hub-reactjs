import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MapPin, 
  Settings, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight,
  Plus
} from 'lucide-react';

const AlertsPage = () => {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-3xl text-primary mb-4 flex items-center gap-3">
              <Bell className="w-8 h-8 text-secondary" />
              Policy Alerts & Notifications
            </h1>
            <p className="text-slate-500">
              Get notified immediately when ADU laws, permit fees, or zoning changes in your tracked locations.
            </p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Alert
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <h4 className="font-bold mb-6 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Delivery Methods
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold">Email</span>
                  </div>
                  <div className="w-10 h-5 bg-secondary rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-xl">
                  <div className="flex items-center gap-3 opacity-50">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold">SMS / Push</span>
                  </div>
                  <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-primary text-white">
              <ShieldCheck className="w-8 h-8 text-secondary mb-4" />
              <h4 className="font-bold mb-2 text-white">Pro Subscriber</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                You are receiving priority alerts with full legal analysis and expert commentary.
              </p>
              <button className="text-xs font-bold text-secondary flex items-center gap-2">Manage Plan <ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Active Alerts List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex border-b border-border mb-6">
              <button 
                onClick={() => setActiveTab('active')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'active' ? 'border-secondary text-secondary' : 'border-transparent text-slate-400'}`}
              >
                Active Alerts (3)
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'history' ? 'border-secondary text-secondary' : 'border-transparent text-slate-400'}`}
              >
                Notification History
              </button>
            </div>

            {activeTab === 'active' && (
              <div className="space-y-4">
                {[
                  { location: 'San Diego, CA', type: 'Zoning & Setbacks', frequency: 'Instant' },
                  { location: 'Washington State', type: 'State Legislation', frequency: 'Daily Summary' },
                  { location: 'Austin, TX', type: 'Permit Fee Changes', frequency: 'Instant' }
                ].map((alert, idx) => (
                  <div key={idx} className="card group hover:border-secondary transition-all flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-secondary group-hover:bg-secondary/10 transition-colors">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary mb-1">{alert.location}</h4>
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-semibold text-slate-500">{alert.type}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-200" />
                           <span className="text-[10px] font-bold text-accent uppercase">{alert.frequency}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-danger transition-colors p-2">
                       <Settings className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="space-y-4">
                {[
                  { title: 'New Law Passed in CA', date: '2 days ago', desc: 'SB 1211 has been signed by the governor.' },
                  { title: 'Permit Fee Waiver Alert', date: '1 week ago', desc: 'San Diego is waiving impact fees for June.' }
                ].map((hist, idx) => (
                  <div key={idx} className="card bg-slate-50/50 border-dashed">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900">{hist.title}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{hist.date}</span>
                    </div>
                    <p className="text-sm text-slate-500">{hist.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
