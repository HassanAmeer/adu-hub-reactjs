import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  Eye, 
  Save, 
  AlertCircle, 
  Info,
  CreditCard,
  User,
  Activity,
  Calendar,
  X
} from 'lucide-react';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import { dbService } from '../../services/dbService';

const Deposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [settings, setSettings] = useState({});
  
  // Payment info form fields
  const [paymentTitle, setPaymentTitle] = useState('');
  const [paymentAddress, setPaymentAddress] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  
  // UI states
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    // Load deposits and global settings
    setDeposits(dbService.getDeposits());
    const globalSettings = dbService.getSettings();
    setSettings(globalSettings);
    
    // Set form fields
    setPaymentTitle(globalSettings.paymentTitle || '');
    setPaymentAddress(globalSettings.paymentAddress || '');
    setPaymentDescription(globalSettings.paymentDescription || '');
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const updatedSettings = {
        ...settings,
        paymentTitle,
        paymentAddress,
        paymentDescription
      };
      
      dbService.saveSettings(updatedSettings);
      setSettings(updatedSettings);
      dbService.addLog('Updated subscription payment coordinates coordinates');
      setSuccessMsg('Payment coordinates updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save settings. Please try again.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleStatusChange = (depositId, newStatus) => {
    try {
      const updated = dbService.updateDeposit(depositId, { status: newStatus });
      if (updated) {
        setDeposits(prev => prev.map(d => d.id === depositId ? updated : d));
        setSuccessMsg(`Deposit request status marked as ${newStatus.toUpperCase()}`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update status.');
    }
  };

  const handleDeleteDeposit = (depositId, userEmail) => {
    if (window.confirm(`Are you sure you want to permanently delete the deposit record for ${userEmail}?`)) {
      try {
        dbService.deleteDeposit(depositId);
        setDeposits(prev => prev.filter(d => d.id !== depositId));
        setSuccessMsg('Deposit record deleted successfully.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to delete deposit record.');
      }
    }
  };

  const tableHeaders = [
    { label: "Submitted By / User" },
    { label: "Selected Plan" },
    { label: "Plan Cost" },
    { label: "Transaction Date" },
    { label: "Receipt File" },
    { label: "Approval Status" },
    { label: "Review Actions", className: "text-right" }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800">Deposit Invoices & Upgrades</h2>
        <p className="text-xs text-slate-400 mt-1">Configure direct payment coordinates coordinates and review user uploaded screenshot billing confirmations.</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-100 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Payment Coordinates Editor Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <CreditCard className="w-4.5 h-4.5 text-secondary" />
          Payment coordinates Configuration
        </h3>
        
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Payment Method Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-secondary"
                value={paymentTitle}
                onChange={(e) => setPaymentTitle(e.target.value)}
                placeholder="e.g. Zelle & Bank Wire Coordinates"
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Payment Address/Details</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-secondary"
                value={paymentAddress}
                onChange={(e) => setPaymentAddress(e.target.value)}
                placeholder="e.g. Zelle: pay@adunavi.com | Bank: Wells Fargo A/C 9876"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Instructions Description</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-secondary"
              value={paymentDescription}
              onChange={(e) => setPaymentDescription(e.target.value)}
              placeholder="Provide directions on payment instructions..."
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="bg-secondary hover:bg-secondary/90 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
            >
              <Save className="w-3.5 h-3.5" />
              {isSavingSettings ? 'Saving Details...' : 'Save Payment Info'}
            </button>
          </div>
        </form>
      </div>

      {/* Deposits List */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-500" />
          Billing Confirmations Ledger
        </h3>

        <AdminTable
          headers={tableHeaders}
          data={deposits}
          searchPlaceholder="Search deposits by user name or email..."
          searchField="userName"
          renderRow={(dep) => (
            <tr key={dep.id} className="hover:bg-slate-50/50">
              {/* User info */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs leading-normal">
                      {dep.userName}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold block">{dep.userEmail}</span>
                  </div>
                </div>
              </td>
              
              {/* Selected Plan */}
              <td className="px-6 py-4 font-bold text-slate-700 text-xs uppercase tracking-wider">
                {dep.planId}
              </td>
              
              {/* Plan Cost */}
              <td className="px-6 py-4 font-black text-emerald-600 text-xs">
                {dep.price}
              </td>
              
              {/* Date */}
              <td className="px-6 py-4 text-slate-400 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-300" />
                  <span>{dep.timestamp ? new Date(dep.timestamp).toISOString().split('T')[0] : 'N/A'}</span>
                </div>
              </td>
              
              {/* Screenshot */}
              <td className="px-6 py-4">
                {dep.screenshot ? (
                  <div 
                    className="relative w-12 h-12 group overflow-hidden rounded-lg border border-slate-200 shadow-sm cursor-pointer"
                    onClick={() => setSelectedScreenshot(dep.screenshot)}
                  >
                    <img 
                      src={dep.screenshot} 
                      alt="Receipt thumbnail" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-350 italic text-[11px]">No Receipt</span>
                )}
              </td>
              
              {/* Status */}
              <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                  dep.status === 'approved' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                    : dep.status === 'rejected'
                    ? 'bg-rose-50 text-rose-700 border-rose-150'
                    : 'bg-amber-50 text-amber-700 border-amber-150'
                }`}>
                  {dep.status}
                </span>
              </td>
              
              {/* Action Buttons */}
              <td className="px-6 py-4 text-right flex justify-end gap-1.5">
                {dep.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(dep.id, 'approved')}
                    className="p-1.5 border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors cursor-pointer"
                    title="Approve Transaction & Upgrade User"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                
                {dep.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(dep.id, 'rejected')}
                    className="p-1.5 border border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Reject Request"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}

                {dep.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusChange(dep.id, 'pending')}
                    className="p-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors cursor-pointer"
                    title="Reset to Pending Review"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleDeleteDeposit(dep.id, dep.userEmail)}
                  className="p-1.5 border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Delete Log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          )}
        />
      </div>

      {/* Screenshot Viewer Lightbox Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xs">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 overflow-hidden shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 p-2 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-all cursor-pointer border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-4 px-2">
              <h3 className="text-sm font-bold text-slate-200">Payment receipt confirmation document</h3>
            </div>
            <div className="w-full h-[60vh] flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden border border-slate-950">
              <img 
                src={selectedScreenshot} 
                alt="Payment confirmation receipt screenshot" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-full flex justify-end gap-2 pt-4 px-2">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 font-bold text-xs py-2 px-5 rounded-xl transition-all cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposits;
