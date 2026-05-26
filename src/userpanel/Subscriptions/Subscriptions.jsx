import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useUserAuth';
import { dbService } from '../../services/dbService';
import { 
  CreditCard, 
  CheckCircle2, 
  Upload, 
  X, 
  AlertTriangle, 
  Clock,
  Eye,
  Calendar,
  Layers,
  Copy,
  Check
} from 'lucide-react';

const Subscriptions = () => {
  const { currentUser, refreshUser } = useAuth();
  const [activePlan, setActivePlan] = useState(currentUser?.subscription || 'free');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Payment Config from global settings
  const [settings, setSettings] = useState({});
  const [pendingDeposit, setPendingDeposit] = useState(null);

  // Payment upload states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [userInvoices, setUserInvoices] = useState([]);
  const [copied, setCopied] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  const handleCopyAddress = () => {
    if (!settings.paymentAddress) return;
    navigator.clipboard.writeText(settings.paymentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Load settings
    const globalSettings = dbService.getSettings();
    setSettings(globalSettings);

    // Check for pending deposit request for this user
    const deposits = dbService.getDeposits();
    const pending = deposits.find(d => d.userId === currentUser.id && d.status === 'pending');
    setPendingDeposit(pending);

    // Filter deposits (pending, approved, rejected) for user history table
    const myDeposits = deposits
      .filter(d => d.userId === currentUser.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setUserInvoices(myDeposits);
    
    // Refresh local active plan state
    setActivePlan(currentUser?.subscription || 'free');
  }, [currentUser]);

  const handleOpenPaymentModal = (plan) => {
    setSelectedPlan(plan);
    setScreenshotFile(null);
    setScreenshotBase64('');
    setShowPaymentModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!screenshotBase64 || !selectedPlan) return;

    setSubmittingPayment(true);
    
    // Simulate minor uploading lag
    setTimeout(() => {
      try {
        const newDep = dbService.addDeposit({
          userId: currentUser.id,
          userName: currentUser.name || currentUser.email,
          userEmail: currentUser.email,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          price: selectedPlan.price,
          screenshot: screenshotBase64,
          status: 'pending'
        });

        setPendingDeposit(newDep);
        setSuccess('Receipt screenshot uploaded successfully! Admin will review and activate your subscription.');
        setShowPaymentModal(false);
        setSelectedPlan(null);
        setScreenshotFile(null);
        setScreenshotBase64('');
        refreshUser();
        
        setTimeout(() => setSuccess(''), 6000);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmittingPayment(false);
      }
    }, 1200);
  };

  const plans = dbService.getPlans().map(p => ({
    ...p,
    button: activePlan === p.id ? 'Current Plan' : (p.id === 'free' ? 'Basic Plan' : (p.id === 'pro' ? 'Upgrade to Pro' : 'Upgrade to Expert')),
    active: activePlan === p.id,
    period: p.id === 'free' ? 'Forever' : 'Month'
  }));

  // Expiration Calculations
  const isFree = activePlan === 'free';
  const activatedDateStr = currentUser?.subscriptionActivatedDate || '';
  const expiresDateStr = currentUser?.subscriptionExpiresDate || '';
  
  let remainingDays = 0;
  let progressPercent = 0;
  if (!isFree && expiresDateStr) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const exp = new Date(expiresDateStr);
    exp.setHours(0,0,0,0);
    const diffTime = exp - today;
    remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate percentage of 30 days elapsed
    const act = activatedDateStr ? new Date(activatedDateStr) : new Date(today.getTime() - 1000*60*60*24*15); // fallback
    act.setHours(0,0,0,0);
    const totalDuration = exp - act;
    const elapsed = today - act;
    if (totalDuration > 0) {
      // Show percentage elapsed
      progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h3 className="text-xl font-bold text-primary">Subscriptions & Billing</h3>
        <p className="text-xs text-slate-400 mt-1">Upgrade your subscription plan to unlock full zoning calculators and contractor tools.</p>
      </div>

      {/* Active Subscription Summary Panel */}
      <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-stretch">
        <div className="space-y-4 flex-1">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Current Membership Plan</span>
            <h4 className="text-xl font-black text-slate-800 capitalize flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-secondary/15 text-secondary border border-secondary/10 text-xs font-bold uppercase">
                {activePlan} Tier
              </span>
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Activated On</span>
              <p className="text-slate-800 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {activatedDateStr ? new Date(activatedDateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A (Free Plan)'}
              </p>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Expires On</span>
              <p className="text-slate-800 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {isFree ? 'Never Expires' : expiresDateStr ? new Date(expiresDateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {!isFree && expiresDateStr && (
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6 flex flex-col justify-center space-y-4 shrink-0">
            <div>
              <div className="flex justify-between items-baseline mb-1.5 text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">Plan Cycle Elapsed</span>
                <span className="text-secondary font-black text-sm">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div 
                  className="h-full bg-secondary rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-secondary/[0.03] border border-secondary/10 rounded-2xl p-3">
              <Clock className="w-5 h-5 text-secondary shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Time Remaining</p>
                <p className="text-sm font-black text-slate-800">
                  {remainingDays > 0 ? `${remainingDays} Days Left` : 'Expired / Pending Renewal'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pending Upgrades Banner */}
      {pendingDeposit && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-5 py-4 rounded-[20px] text-xs font-semibold flex flex-col gap-1.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Payment Verification Pending</span>
          </div>
          <p className="text-slate-600 font-medium leading-relaxed">
            You submitted a deposit screenshot confirmation for the <strong className="text-slate-800 font-bold">{pendingDeposit.planName}</strong>. Our administrators are verifying the transaction. Once verified, your subscription permissions will automatically upgrade.
          </p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {success}
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {plans.map((p) => (
          <div 
            key={p.id} 
            className={`bg-white p-6 rounded-[24px] border shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden ${
              p.active ? 'border-secondary ring-2 ring-secondary/10' : 'border-slate-200'
            }`}
          >
            {p.active && (
              <span className="absolute top-3 right-3 bg-secondary text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                Active
              </span>
            )}
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{p.name}</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-primary">{p.price}</span>
                  <span className="text-slate-400 font-bold text-xs">/ {p.period}</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => !p.active && handleOpenPaymentModal(p)}
              disabled={p.active || loading || (p.id !== 'free' && pendingDeposit?.planId === p.id)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                p.active
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : (p.id !== 'free' && pendingDeposit?.planId === p.id)
                  ? 'bg-amber-100 text-amber-600 border border-amber-200 cursor-default'
                  : 'bg-secondary hover:bg-secondary/90 text-white shadow-sm'
              }`}
            >
              {p.active ? 'Current Plan' : (p.id !== 'free' && pendingDeposit?.planId === p.id) ? 'Pending Verification' : p.button}
            </button>
          </div>
        ))}
      </div>

      {/* Deposits Requests & Billing History Ledger */}
      <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
        <h4 className="font-bold text-primary text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4.5 h-4.5 text-secondary" />
          Deposit Requests & Invoice History
        </h4>
        <div className="overflow-x-auto">
          {userInvoices.length === 0 ? (
            <p className="text-slate-400 text-xs italic">No invoice history found. Upgraded plan payment records appear here after approval.</p>
          ) : (
            <table className="w-full text-left text-xs font-semibold text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[9px]">
                  <th className="pb-3">Request ID</th>
                  <th className="pb-3">Requested Plan</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Submit Date</th>
                  <th className="pb-3">Receipt Screenshot</th>
                  <th className="pb-3">Approval Status</th>
                  <th className="pb-3">Membership Expiration</th>
                </tr>
              </thead>
              <tbody>
                {userInvoices.map((inv) => {
                  const isApproved = inv.status === 'approved';
                  let validityText = 'N/A';
                  if (inv.status === 'pending') validityText = 'Awaiting Verification';
                  if (inv.status === 'rejected') validityText = 'Transfer Rejected';
                  if (isApproved) {
                    const userActiveExp = currentUser?.subscriptionExpiresDate;
                    if (currentUser?.subscription === inv.planId && userActiveExp) {
                      validityText = `Expires: ${new Date(userActiveExp).toLocaleDateString()}`;
                    } else {
                      // fallback: 30 days from transaction date
                      const tDate = new Date(inv.timestamp);
                      tDate.setDate(tDate.getDate() + 30);
                      validityText = `Expired / Valid until ${tDate.toLocaleDateString()}`;
                    }
                  }

                  return (
                    <tr key={inv.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="py-3 font-mono font-bold text-slate-700">{inv.id}</td>
                      <td className="py-3 uppercase text-[10px] tracking-wider text-slate-800">{inv.planName}</td>
                      <td className="py-3 text-emerald-600 font-bold">{inv.price}</td>
                      <td className="py-3 text-slate-400">
                        {inv.timestamp ? new Date(inv.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="py-3">
                        {inv.screenshot ? (
                          <div 
                            className="relative w-10 h-10 group overflow-hidden rounded-lg border border-slate-200 shadow-xs cursor-pointer"
                            onClick={() => setSelectedScreenshot(inv.screenshot)}
                          >
                            <img 
                              src={inv.screenshot} 
                              alt="Receipt thumbnail" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="w-3.5 h-3.5 text-white" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 italic text-[11px]">No file</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                          inv.status === 'approved' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                            : inv.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-150'
                            : 'bg-amber-50 text-amber-700 border-amber-150'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs font-semibold text-slate-500">{validityText}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- PAYMENT SCREENSHOT UPLOADER MODAL --- */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-[28px] border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button 
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedPlan(null);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div>
              <h4 className="font-extrabold text-slate-800 text-lg leading-normal">
                {settings.paymentTitle || 'Direct Payment Gateway'}
              </h4>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Upgrading to: {selectedPlan.name} ({selectedPlan.price})
              </p>
            </div>

            {/* Instructions details */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
              <div className="flex gap-2 items-start text-xs font-bold text-slate-700">
                <AlertTriangle className="w-4.5 h-4.5 text-secondary shrink-0" />
                <span>Instruction Guide</span>
              </div>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                {settings.paymentDescription || 'Please transfer the exact amount and upload your proof.'}
              </p>
              
              <div className="border-t border-slate-200/60 pt-3">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transfer Address coordinates</span>
                <div className="flex items-center gap-2">
                  <div className="bg-white border border-slate-250 rounded-xl py-2.5 px-3 text-xs font-mono font-bold text-secondary break-all select-all flex-1">
                    {settings.paymentAddress}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Uploader Form */}
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Upload screenshot of transaction confirmation</label>
                
                {!screenshotBase64 ? (
                  <div className="border-2 border-dashed border-slate-200 hover:border-secondary hover:bg-slate-50/50 rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      required
                    />
                    <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-700">Click to upload screenshot</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG, or WEBP up to 5MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-950 p-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setScreenshotBase64('')}
                      className="absolute top-4 right-4 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all cursor-pointer"
                      title="Remove Screenshot"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img 
                      src={screenshotBase64} 
                      alt="Payment screenshot preview" 
                      className="max-h-40 object-contain rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPlan(null);
                  }}
                  className="btn-secondary !py-2.5 !px-5 text-xs font-bold cursor-pointer"
                  disabled={submittingPayment}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!screenshotBase64 || submittingPayment}
                  className="bg-secondary hover:bg-secondary/90 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {submittingPayment ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Uploading proof...
                    </>
                  ) : (
                    'Submit Payment Proof'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default Subscriptions;
