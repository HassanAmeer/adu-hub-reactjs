import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  Eye, 
  Save, 
  AlertCircle,
  CreditCard,
  User,
  Users,
  DollarSign,
  Activity,
  Calendar,
  X,
  Receipt,
  TrendingUp,
  Settings2,
  ChevronRight,
  ArrowUpRight,
  BadgeCheck,
  FileImage
} from 'lucide-react';
import AdminTable from '../components/AdminTable';
import { dbService } from '../../services/dbService';

const Deposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({});
  
  const [paymentTitle, setPaymentTitle] = useState('');
  const [paymentAddress, setPaymentAddress] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    setDeposits(dbService.getDeposits());
    setUsers(dbService.getUsers());
    const globalSettings = dbService.getSettings();
    setSettings(globalSettings);
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
      const updatedSettings = { ...settings, paymentTitle, paymentAddress, paymentDescription };
      dbService.saveSettings(updatedSettings);
      setSettings(updatedSettings);
      dbService.addLog('Updated subscription payment coordinates');
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
        setUsers(dbService.getUsers());
        setSuccessMsg(`Deposit marked as ${newStatus.toUpperCase()}`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg('Failed to update status.');
    }
  };

  const handleDeleteDeposit = (depositId, userEmail) => {
    if (window.confirm(`Delete deposit record for ${userEmail}?`)) {
      try {
        dbService.deleteDeposit(depositId);
        setDeposits(prev => prev.filter(d => d.id !== depositId));
        setUsers(dbService.getUsers());
        setSuccessMsg('Deposit record deleted.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        setErrorMsg('Failed to delete deposit record.');
      }
    }
  };

  const tableHeaders = [
    { label: "User" },
    { label: "Plan" },
    { label: "Amount" },
    { label: "Date" },
    { label: "Receipt" },
    { label: "Status" },
    { label: "Actions", className: "text-right" }
  ];

  const freeUsers = users.filter(u => u.subscription === 'free').length;
  const paidUsers = users.filter(u => u.subscription === 'pro').length;
  const approvedDeposits = deposits.filter(d => d.status === 'approved');
  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const totalRevenue = approvedDeposits.reduce((sum, dep) => {
    const amount = parseFloat(dep.price.replace(/[^0-9.]/g, '')) || 0;
    return sum + amount;
  }, 0);

  return (
    <div className="space-y-7">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Deposit Invoices & Upgrades</h2>
          <p className="text-sm text-slate-500 mt-1">Review payment confirmations and manage subscription upgrades.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>{deposits.length} total records</span>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">${totalRevenue.toFixed(0)}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              From approved deposits
            </p>
          </div>
        </div>

        {/* Paid Users */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paid Users</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-violet-600" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{paidUsers}</p>
            <p className="text-xs text-violet-600 font-semibold mt-1">Active Pro subscribers</p>
          </div>
        </div>

        {/* Free Users */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Free Users</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{freeUsers}</p>
            <p className="text-xs text-blue-600 font-semibold mt-1">Basic free accounts</p>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{pendingDeposits.length}</p>
            <p className="text-xs text-amber-600 font-semibold mt-1">Pending deposits</p>
          </div>
        </div>
      </div>

      {/* ── Alerts ── */}
      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl border border-emerald-200 text-sm font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-200 text-sm font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* ── Payment Config Form ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Settings2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Payment Coordinates</h3>
            <p className="text-xs text-slate-500">These details are shown to users when they initiate a deposit</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Payment Method Title</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={paymentTitle}
                onChange={(e) => setPaymentTitle(e.target.value)}
                placeholder="e.g. Zelle & Bank Wire"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Payment Address / Details</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={paymentAddress}
                onChange={(e) => setPaymentAddress(e.target.value)}
                placeholder="e.g. Zelle: pay@site.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">Payment Instructions</label>
            <textarea
              rows={3}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
              value={paymentDescription}
              onChange={(e) => setPaymentDescription(e.target.value)}
              placeholder="Provide step-by-step payment instructions for users..."
              required
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSavingSettings ? 'Saving…' : 'Save Payment Info'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Deposits Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Billing Confirmations Ledger</h3>
              <p className="text-xs text-slate-500">All user-submitted payment receipts</p>
            </div>
          </div>
          {pendingDeposits.length > 0 && (
            <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              {pendingDeposits.length} pending
            </span>
          )}
        </div>

        <AdminTable
          headers={tableHeaders}
          data={deposits}
          searchPlaceholder="Search by name or email…"
          searchField="userName"
          renderRow={(dep) => {
            const statusColors = {
              approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              rejected: 'bg-rose-50 text-rose-700 border-rose-200',
              pending:  'bg-amber-50 text-amber-700 border-amber-200',
            };
            const StatusIcon = {
              approved: CheckCircle2,
              rejected: XCircle,
              pending:  Clock,
            }[dep.status] || Clock;

            return (
              <tr key={dep.id} className="hover:bg-slate-50/60 transition-colors border-b border-slate-100 last:border-0">

                {/* User */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm shrink-0">
                      {dep.userName?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm leading-tight">{dep.userName}</p>
                      <p className="text-xs text-slate-400 leading-tight mt-0.5">{dep.userEmail}</p>
                    </div>
                  </div>
                </td>

                {/* Plan */}
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${
                    dep.planId === 'pro'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {dep.planId === 'pro' && <BadgeCheck className="w-3 h-3" />}
                    {dep.planId}
                  </span>
                </td>

                {/* Amount */}
                <td className="px-5 py-4">
                  <span className="font-bold text-slate-900 text-sm">{dep.price}</span>
                </td>

                {/* Date */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {dep.timestamp ? new Date(dep.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </div>
                </td>

                {/* Receipt thumbnail */}
                <td className="px-5 py-4">
                  {dep.screenshot ? (
                    <button
                      onClick={() => setSelectedScreenshot(dep.screenshot)}
                      className="group relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer block"
                    >
                      <img
                        src={dep.screenshot}
                        alt="Receipt"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
                        <Eye className="w-3.5 h-3.5 text-white" />
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-300 text-xs italic">
                      <FileImage className="w-3.5 h-3.5" />
                      No receipt
                    </div>
                  )}
                </td>

                {/* Status badge */}
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${statusColors[dep.status] || statusColors.pending}`}>
                    <StatusIcon className="w-3 h-3" />
                    {dep.status?.charAt(0).toUpperCase() + dep.status?.slice(1)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    {dep.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(dep.id, 'approved')}
                        title="Approve"
                        className="p-2 rounded-lg border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {dep.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(dep.id, 'rejected')}
                        title="Reject"
                        className="p-2 rounded-lg border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    {dep.status !== 'pending' && (
                      <button
                        onClick={() => handleStatusChange(dep.id, 'pending')}
                        title="Reset to Pending"
                        className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteDeposit(dep.id, dep.userEmail)}
                      title="Delete Record"
                      className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          }}
        />
      </div>

      {/* ── Screenshot Lightbox ── */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-800">Payment Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <div className="bg-slate-50 p-4 max-h-[70vh] overflow-auto flex items-center justify-center">
              <img
                src={selectedScreenshot}
                alt="Payment receipt"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposits;
