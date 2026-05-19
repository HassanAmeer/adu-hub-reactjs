import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Bell, ShieldAlert, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import { dbService } from '../../services/dbService';

const LawTracker = () => {
  const [alerts, setAlerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [dispatchedAlerts, setDispatchedAlerts] = useState({});

  // Form Fields
  const [stateName, setStateName] = useState('California');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [beforeText, setBeforeText] = useState('');
  const [afterText, setAfterText] = useState('');
  const [impactTier, setImpactTier] = useState('High');

  useEffect(() => {
    setAlerts(dbService.getAlerts());
  }, []);

  const handleCreateAlert = (e) => {
    e.preventDefault();
    if (!title || !desc) return;

    const added = dbService.addAlert({
      state: stateName,
      title,
      desc,
      before: beforeText || 'Not specified',
      after: afterText || 'Not specified',
      impact: impactTier,
      status: 'Passed'
    });

    setAlerts([added, ...alerts]);
    
    // Clear inputs
    setTitle('');
    setDesc('');
    setBeforeText('');
    setAfterText('');
    setImpactTier('High');
    setIsModalOpen(false);
  };

  const handleDeleteAlert = (id, alertTitle) => {
    if (window.confirm(`Delete the legislative update "${alertTitle}"?`)) {
      dbService.deleteAlert(id);
      setAlerts(alerts.filter(a => a.id !== id));
      dbService.addLog(`Deleted legislative policy update: "${alertTitle}"`);
    }
  };

  const handleSimulateDispatch = (alert) => {
    setDispatchingId(alert.id);
    dbService.addLog(`Dispatched email/sms notifications to tracked subscribers for update: "${alert.title}"`);
    
    setTimeout(() => {
      setDispatchingId(null);
      setDispatchedAlerts(prev => ({ ...prev, [alert.id]: true }));
      setTimeout(() => {
        setDispatchedAlerts(prev => ({ ...prev, [alert.id]: false }));
      }, 3000);
    }, 2000);
  };

  const tableHeaders = [
    { label: "Date / State" },
    { label: "Legislation Details" },
    { label: "Impact" },
    { label: "Dispatch Alerts", className: "text-center" },
    { label: "Actions", className: "text-right" }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Law Changes & Alerts</h2>
          <p className="text-xs text-slate-400 mt-1">Publish state-level legislative updates and dispatch email/SMS notification alerts to tracked homeowners.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-xs font-bold shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Law Alert
        </button>
      </div>

      {/* Main Table view */}
      <AdminTable 
        headers={tableHeaders}
        data={alerts}
        searchPlaceholder="Search updates by title or state..."
        searchField="title"
        renderRow={(alert) => (
          <tr key={alert.id} className="hover:bg-slate-50/50">
            <td className="px-6 py-4">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">
                {alert.date}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[9px] font-bold uppercase">
                {alert.state}
              </span>
            </td>
            <td className="px-6 py-4 max-w-sm">
              <h4 className="font-bold text-slate-850 text-sm leading-normal">{alert.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{alert.desc}</p>
              
              {/* Before / After comparisons snippet */}
              <div className="grid grid-cols-2 gap-2 text-[10px] mt-3 p-2 bg-slate-50 border border-slate-100 rounded-lg">
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[8px] mb-0.5">Before:</span>
                  <span className="text-slate-500 font-medium truncate block">{alert.before}</span>
                </div>
                <div>
                  <span className="text-emerald-500 font-bold block uppercase tracking-wider text-[8px] mb-0.5">Now:</span>
                  <span className="text-slate-700 font-bold truncate block">{alert.after}</span>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className={`badge text-[9px] ${
                alert.impact === 'Very High' || alert.impact === 'High'
                  ? 'bg-rose-50 text-rose-700 border-rose-200' 
                  : alert.impact === 'Medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {alert.impact} Impact
              </span>
            </td>
            <td className="px-6 py-4 text-center">
              {dispatchingId === alert.id ? (
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg font-bold">
                  <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin"></div>
                  <span>Dispatching...</span>
                </div>
              ) : dispatchedAlerts[alert.id] ? (
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Subscribers Alerted!</span>
                </div>
              ) : (
                <button
                  onClick={() => handleSimulateDispatch(alert)}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-250 hover:bg-emerald-600 hover:text-white transition-all px-3 py-1.5 rounded-lg font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Notify List</span>
                </button>
              )}
            </td>
            <td className="px-6 py-4 text-right">
              <button 
                onClick={() => handleDeleteAlert(alert.id, alert.title)}
                className="p-1.5 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                title="Delete Alert"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </td>
          </tr>
        )}
      />

      {/* --- ADD ALERT MODAL --- */}
      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Legislative Policy Alert" size="lg">
        <form onSubmit={handleCreateAlert} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Affected State / Jurisdiction</label>
              <select className="input-field" value={stateName} onChange={e => setStateName(e.target.value)}>
                <option value="California">California</option>
                <option value="Washington">Washington</option>
                <option value="Oregon">Oregon</option>
                <option value="Texas">Texas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Legislative Impact Tier</label>
              <select className="input-field" value={impactTier} onChange={e => setImpactTier(e.target.value)}>
                <option value="Very High">Very High (Statewide mandate shifts)</option>
                <option value="High">High (Major setbacks/parking relief)</option>
                <option value="Medium">Medium (Subsidy grants/infrastructure)</option>
                <option value="Low">Low (Administrative timeline limits)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Legislation Title</label>
              <input type="text" placeholder="e.g. SB 1211: Complete Lot Coverage & Garage Parking Relief" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Plain English Explanation</label>
              <textarea rows={4} placeholder="Describe what the bill allows, who it applies to, and the deadline for local cities to comply..." className="input-field" value={desc} onChange={e => setDesc(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Previous Law Standard</label>
              <input type="text" placeholder="e.g. Cities could mandate replacement parking" className="input-field" value={beforeText} onChange={e => setBeforeText(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">New Enforced Standard</label>
              <input type="text" placeholder="e.g. No replacement parking required" className="input-field" value={afterText} onChange={e => setAfterText(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary !py-2 !px-5 text-xs font-bold">Cancel</button>
            <button type="submit" className="btn-primary !py-2 !px-5 text-xs font-bold">Publish Alert</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default LawTracker;
