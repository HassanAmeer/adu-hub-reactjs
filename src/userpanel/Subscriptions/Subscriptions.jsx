import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useUserAuth';
import { dbService } from '../../services/dbService';
import { usePlanLimits } from '../hooks/usePlanLimits';
import StripePaymentModal from './StripePaymentModal';
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
  Check,
  Award,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  ShieldCheck,
  Receipt,
  ChevronRight,
  Info
} from 'lucide-react';

const Subscriptions = () => {
  const { currentUser, refreshUser } = useAuth();
  const [activePlan, setActivePlan] = useState(currentUser?.subscription || 'free');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Payment Config from global settings
  const [settings, setSettings] = useState({});
  const [pendingDeposit, setPendingDeposit] = useState(null);

  // Filter state for invoice ledger
  const [invoiceFilter, setInvoiceFilter] = useState('all');

  // Payment upload states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [userInvoices, setUserInvoices] = useState([]);
  const [copied, setCopied] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  const limits = usePlanLimits(currentUser);

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

  const handlePlanClick = (plan) => {
    if (plan.id === 'free') {
      setLoading(true);
      // Simulate switching/downgrading lag
      setTimeout(() => {
        try {
          dbService.updateUser(currentUser.id, { subscription: 'free' });
          dbService.addLog(`Switched user ${currentUser.email} back to free tier`);
          setSuccess('Your account has been switched back to the Free Plan.');
          refreshUser();
          
          // Clear/reject any pending deposits for user to avoid confusion
          const deposits = dbService.getDeposits();
          const userPending = deposits.filter(d => d.userId === currentUser.id && d.status === 'pending');
          userPending.forEach(dep => {
            dbService.updateDeposit(dep.id, { status: 'rejected' });
          });
          
          // Refresh ledger
          const updatedDeposits = dbService.getDeposits();
          const myDeposits = updatedDeposits
            .filter(d => d.userId === currentUser.id)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setUserInvoices(myDeposits);
          
          setTimeout(() => setSuccess(''), 5050);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, 600);
    } else {
      handleOpenPaymentModal(plan);
    }
  };

  const handleInstantActivate = () => {
    if (!selectedPlan) return;
    setLoading(true);
    setShowPaymentModal(false);
    
    // Simulate minor processing lag
    setTimeout(() => {
      try {
        dbService.updateUser(currentUser.id, { subscription: selectedPlan.id });
        
        // Also simulate an approved deposit in the invoices history so it is documented
        dbService.addDeposit({
          userId: currentUser.id,
          userName: currentUser.name || currentUser.email,
          userEmail: currentUser.email,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          price: selectedPlan.price,
          screenshot: 'instant_demo_mode', // placeholder marker
          status: 'approved'
        });

        // Add log
        dbService.addLog(`Instantly activated ${selectedPlan.name} plan for user ${currentUser.email} in demo mode`);
        
        setSuccess(`Success! Your account has been upgraded to ${selectedPlan.name} instantly.`);
        refreshUser();
        
        // Reload invoices in the ledger
        const deposits = dbService.getDeposits();
        const myDeposits = deposits
          .filter(d => d.userId === currentUser.id)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setUserInvoices(myDeposits);
        
        setTimeout(() => setSuccess(''), 5050);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setSelectedPlan(null);
      }
    }, 600);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        reader.result && setScreenshotBase64(reader.result);
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

  const handleStripePaymentSuccess = (paymentMethod) => {
    try {
      const newDep = dbService.addDeposit({
        userId: currentUser.id,
        userName: currentUser.name || currentUser.email,
        userEmail: currentUser.email,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        price: selectedPlan.price,
        screenshot: 'stripe_demo_mode', // marker for stripe
        status: 'pending'
      });

      setPendingDeposit(newDep);
      setSuccess('Stripe Payment demo successful! Admin will review and activate your subscription.');
      setShowPaymentModal(false);
      setSelectedPlan(null);
      refreshUser();
      
      setTimeout(() => setSuccess(''), 6000);
    } catch (err) {
      console.error(err);
    }
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
      progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
    }
  }

  // Filtered invoices
  const filteredInvoices = userInvoices.filter(inv => {
    if (invoiceFilter === 'all') return true;
    return inv.status === invoiceFilter;
  });

  return (
    <div className="space-y-10 max-w-6xl">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
              <Award className="w-5 h-5" />
            </span>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Subscriptions & Billing</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Manage your membership tier, upload payment verifications, and view billing history records.
          </p>
        </div>
        
        {isFree && (
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl shrink-0 self-start md:self-auto">
            <Sparkles className="w-4.5 h-4.5 text-amber-600 animate-pulse" />
            <span className="text-xs font-bold text-amber-800">You are on the Free tier. Upgrade for full features.</span>
          </div>
        )}
      </div>

      {/* ── Dashboard Top Cards Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Active Subscription Card (Indigo Deep Glassmorphism) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-3xl p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          {/* Decorative glowing blobs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active Membership</span>
              <h4 className="text-3xl font-black tracking-tight text-white flex items-center gap-2 capitalize">
                {plans.find(p => p.id === activePlan)?.name || activePlan} Tier
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                  isFree ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-emerald-500 text-white animate-pulse'
                }`}>
                  {isFree ? 'Basic' : 'Active'}
                </span>
              </h4>
            </div>
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <CreditCard className="w-6 h-6 text-secondary" />
            </div>
          </div>

          {/* Content details */}
          <div className="grid grid-cols-2 gap-6 my-6 relative z-10 border-y border-white/5 py-4">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Activated On</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Calendar className="w-4 h-4 text-slate-400" />
                {activatedDateStr 
                  ? new Date(activatedDateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) 
                  : 'N/A (Free Plan)'}
              </div>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Renewal/Expiration</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Clock className="w-4 h-4 text-slate-400" />
                {isFree 
                  ? 'Never Expires' 
                  : expiresDateStr 
                    ? new Date(expiresDateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) 
                    : 'N/A'}
              </div>
            </div>
          </div>

          {/* Progress / Remaining Days */}
          <div className="relative z-10 space-y-3">
            {!isFree && expiresDateStr ? (
              <>
                <div className="flex justify-between items-baseline text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">Usage Cycle Elapsed</span>
                  <span className="text-secondary font-black text-sm">{progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary to-indigo-400 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>
                <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  You have <strong className="text-white font-bold">{remainingDays > 0 ? remainingDays : 0} days</strong> remaining on this cycle.
                </p>
              </>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <Info className="w-5 h-5 text-secondary shrink-0" />
                <p className="text-xs font-medium text-slate-300 leading-relaxed">
                  Your account has unlimited access to free utilities, but advanced ADU cost estimation models and listings features are locked.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Plan Quota & Limits Info (Glass-white panel) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Plan Quotas & Features</h4>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md uppercase">
                Active limits
              </span>
            </div>

            <ul className="space-y-4 mt-5 text-xs font-semibold text-slate-600">
              {/* Property Checker Runs */}
              <li className="flex items-center justify-between py-1 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <span className={`p-1.5 rounded-lg ${limits.propertyCheckerLimit !== -1 ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Zap className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 text-xs">Property Checker Runs</p>
                    <p className="text-[10px] text-slate-400 font-medium">Monthly run limit allowance</p>
                  </div>
                </div>
                <span className="font-bold text-slate-700">
                  {limits.propertyCheckerLimit === -1 ? 'Unlimited' : `${limits.propertyCheckerLimit} Runs / mo`}
                </span>
              </li>

              {/* Directory Placement Badge */}
              <li className="flex items-center justify-between py-1 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <span className={`p-1.5 rounded-lg ${limits.directoryPlacementBadge ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 text-xs">Featured Placement Badge</p>
                    <p className="text-[10px] text-slate-400 font-medium">Verified professional verification</p>
                  </div>
                </div>
                <span className="font-bold">
                  {limits.directoryPlacementBadge ? (
                    <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Included</span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Locked</span>
                  )}
                </span>
              </li>

              {/* ADU Projects Upload */}
              <li className="flex items-center justify-between py-1 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <span className={`p-1.5 rounded-lg ${limits.canUploadADUProjects ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Layers className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 text-xs">Upload ADU Projects</p>
                    <p className="text-[10px] text-slate-400 font-medium">Manage and share design layouts</p>
                  </div>
                </div>
                <span className="font-bold">
                  {limits.canUploadADUProjects ? (
                    <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Allowed</span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Locked</span>
                  )}
                </span>
              </li>

              {/* Directory Placement */}
              <li className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <span className={`p-1.5 rounded-lg ${limits.canUploadDirectory ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Award className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 text-xs">Directory Listing Form</p>
                    <p className="text-[10px] text-slate-400 font-medium">Publish services for local clients</p>
                  </div>
                </div>
                <span className="font-bold">
                  {limits.canUploadDirectory ? (
                    <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Allowed</span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Locked</span>
                  )}
                </span>
              </li>
            </ul>
          </div>
          
          {isFree && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium leading-normal">
                Need to unlock listing placement, priority tech support, or run more property checker iterations? Upgrade your plan below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Pending Verification Banner ── */}
      {pendingDeposit && (
        <div className="bg-amber-50 border border-amber-200/80 text-amber-900 p-5 rounded-2xl text-xs font-semibold flex items-start gap-3.5 shadow-sm animate-in fade-in duration-300">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-850 text-sm flex items-center gap-2">
              Payment Verification Pending
              <span className="px-2 py-0.5 bg-amber-200/50 text-amber-800 text-[9px] rounded font-bold uppercase tracking-wider">Reviewing</span>
            </p>
            <p className="text-slate-600 font-medium leading-relaxed">
              You submitted a payment screenshot confirmation for the <strong className="text-slate-800">{pendingDeposit.planName}</strong>. Our administrators are currently reviewing the transfer request. Once confirmed, your subscription permissions will automatically upgrade.
            </p>
          </div>
        </div>
      )}

      {/* ── Success Banner ── */}
      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-250 text-sm font-semibold flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> 
          <span>{success}</span>
        </div>
      )}

      {/* ── Pricing / Upgrade Options ── */}
      <div className="space-y-5">
        <div>
          <h4 className="font-extrabold text-slate-800 text-lg tracking-tight">Available Subscription Tiers</h4>
          <p className="text-xs text-slate-400 mt-0.5">Select a plan option to request subscription tier upgrades.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          {plans.map((p) => {
            const isPro = p.id === 'pro';
            return (
              <div 
                key={p.id} 
                className={`bg-white p-8 rounded-[32px] border flex flex-col justify-between space-y-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  p.active 
                    ? 'border-secondary ring-4 ring-secondary/10 shadow-lg' 
                    : 'border-slate-200 hover:shadow-lg shadow-sm'
                }`}
              >
                {/* Background design glow */}
                <div className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-40 ${
                  isPro ? 'bg-secondary/20' : 'bg-slate-300/30'
                }`} />

                {p.active && (
                  <span className="absolute top-4 right-4 bg-secondary text-white text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    Current Active
                  </span>
                )}

                <div className="space-y-6">
                  {/* Title & Price */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                      isPro ? 'bg-secondary/10 text-secondary' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {p.name}
                    </span>
                    
                    <div className="mt-4 flex items-baseline gap-1.5">
                      {p.price.includes('$') ? (
                        <>
                          <span className="text-4xl font-black text-slate-850 tracking-tight">
                            {p.price.split(' ')[0]}
                          </span>
                          <span className="text-slate-400 font-bold text-xs">/ month</span>
                        </>
                      ) : (
                        <span className="text-4xl font-black text-slate-850 tracking-tight">
                          {p.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Plan Features */}
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Included Benefits</p>
                    <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-slate-700 leading-normal">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Upgrade Button */}
                <button 
                  onClick={() => !p.active && handlePlanClick(p)}
                  disabled={p.active || loading || (p.id !== 'free' && pendingDeposit?.planId === p.id)}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    p.active
                      ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200'
                      : (p.id !== 'free' && pendingDeposit?.planId === p.id)
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-default'
                      : isPro
                      ? 'bg-secondary hover:bg-secondary/95 text-white hover:shadow-md hover:shadow-secondary/20 font-black'
                      : 'bg-slate-850 hover:bg-slate-900 text-white font-bold'
                  }`}
                >
                  {p.active ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Current Plan
                    </>
                  ) : (p.id !== 'free' && pendingDeposit?.planId === p.id) ? (
                    <>
                      <Clock className="w-3.5 h-3.5" /> Pending Verification
                    </>
                  ) : (
                    <>
                      {p.button} <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Deposits Requests & Invoice Ledger Card ── */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Receipt className="w-4.5 h-4.5" />
            </span>
            <div>
              <h4 className="font-extrabold text-slate-850 text-base tracking-tight">Deposit Requests & Invoice Ledger</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Filter and review your payment screenshots history submissions.</p>
            </div>
          </div>
          
          {/* Status filters */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0 self-start md:self-auto">
            {['all', 'pending', 'approved', 'rejected'].map((filter) => (
              <button
                key={filter}
                onClick={() => setInvoiceFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  invoiceFilter === filter
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                    : 'text-slate-450 hover:text-slate-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Layers className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-slate-400 text-xs italic">No matching deposit logs found. Upgraded records appear here.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-semibold text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[9px]">
                  <th className="pb-3 pr-2">ID Reference</th>
                  <th className="pb-3">Plan Requested</th>
                  <th className="pb-3">Price Tier</th>
                  <th className="pb-3">Submit Date</th>
                  <th className="pb-3 text-center">Receipt File</th>
                  <th className="pb-3">Approval Status</th>
                  <th className="pb-3">Active Validity</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => {
                  const isApproved = inv.status === 'approved';
                  let validityText = '—';
                  if (inv.status === 'pending') validityText = 'Pending Approval';
                  if (inv.status === 'rejected') validityText = 'Rejected transfer';
                  if (isApproved) {
                    const userActiveExp = currentUser?.subscriptionExpiresDate;
                    if (currentUser?.subscription === inv.planId && userActiveExp) {
                      validityText = `Expires: ${new Date(userActiveExp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
                    } else {
                      const tDate = new Date(inv.timestamp);
                      tDate.setDate(tDate.getDate() + 30);
                      validityText = `Expired / Valid until ${tDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
                    }
                  }

                  return (
                    <tr key={inv.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 font-mono font-bold text-slate-700 pr-2">
                        {inv.id.substring(0, 8)}...
                      </td>
                      <td className="py-4 uppercase text-[10px] tracking-wider text-slate-800 font-black">{inv.planName}</td>
                      <td className="py-4 text-emerald-600 font-black text-sm">{inv.price}</td>
                      <td className="py-4 text-slate-400 font-medium">
                        {inv.timestamp ? new Date(inv.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="py-4 text-center">
                        {inv.screenshot ? (
                          inv.screenshot === 'instant_demo_mode' ? (
                            <span className="inline-block text-indigo-700 bg-indigo-50 border border-indigo-150 rounded-lg px-2 py-1 text-[9px] font-bold uppercase tracking-wider">
                              Demo Instant
                            </span>
                          ) : (
                            <div 
                              className="relative w-9 h-9 group overflow-hidden rounded-xl border border-slate-200/80 shadow-xs cursor-pointer mx-auto"
                              onClick={() => setSelectedScreenshot(inv.screenshot)}
                            >
                              <img 
                                src={inv.screenshot} 
                                alt="Receipt preview" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-250"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Eye className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                          )
                        ) : (
                          <span className="text-slate-300 italic text-[11px] block text-center">No file</span>
                        )}
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                          inv.status === 'approved' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : inv.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 text-xs font-semibold text-slate-500">{validityText}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── PAYMENT SCREENSHOT UPLOADER MODAL ── */}
      {showPaymentModal && selectedPlan && import.meta.env.VITE_STRIPE_SANDBOX_MODE === 'true' ? (
        <StripePaymentModal
          plan={selectedPlan}
          onClose={() => { setShowPaymentModal(false); setSelectedPlan(null); }}
          onSuccess={handleStripePaymentSuccess}
        />
      ) : showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] max-w-lg w-full shadow-2xl relative overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                    {settings.paymentTitle || 'Direct Payment Gateway'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upgrade Request to <span className="font-bold text-emerald-700">{selectedPlan.name}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setShowPaymentModal(false); setSelectedPlan(null); }}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-650 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6">

              {/* Step Timeline */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">1</div>
                    <div className="w-0.5 h-full bg-slate-100 mt-1 min-h-[30px]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Direct Wallet / Bank Transfer</p>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">
                      {settings.paymentDescription || 'Transfer the plan pricing amount manually to our designated receipt wallet:'}
                    </p>
                    
                    {/* Copy Box */}
                    <div className="flex items-center gap-2 mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Payment Address</span>
                        <p className="text-xs font-mono font-bold text-indigo-700 break-all select-all select-none">
                          {settings.paymentAddress || '—'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className={`p-2 rounded-lg border transition-all cursor-pointer shrink-0 ${
                          copied
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-600'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                        title="Copy Address"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">2</div>
                    <div className="w-0.5 h-full bg-slate-100 mt-1 min-h-[20px]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Capture Confirmation</p>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">
                      Save a screenshot confirmation or digital invoice showing the date, amount, and receipt.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">3</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Upload screenshot receipt</p>
                  </div>
                </div>
              </div>

              {/* Upload area */}
              <form onSubmit={handleSubmitPayment} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Transaction Confirmation screenshot
                  </label>

                  {!screenshotBase64 ? (
                    <div className="border-2 border-dashed border-slate-250 hover:border-secondary hover:bg-secondary/[0.02] rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        required
                      />
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-black text-slate-700">Drop confirmation receipt here</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">or browse documents — JPEG, PNG</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 p-2">
                      <button
                        type="button"
                        onClick={() => setScreenshotBase64('')}
                        className="absolute top-4 right-4 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-colors cursor-pointer z-10"
                        title="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <img 
                        src={screenshotBase64} 
                        alt="Preview" 
                        className="w-full max-h-32 object-contain rounded-lg bg-white border border-slate-100"
                      />
                      <div className="flex items-center gap-1.5 mt-2 px-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Screenshot attached and ready to upload</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => { setShowPaymentModal(false); setSelectedPlan(null); }}
                    className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                    disabled={submittingPayment}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!screenshotBase64 || submittingPayment}
                    className="flex-1 bg-secondary hover:bg-secondary/95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-secondary/10"
                  >
                    {submittingPayment ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        Uploading Invoice…
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        Upload & Submit
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Instant developer activation option */}
              <div className="border-t border-slate-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={handleInstantActivate}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-750 hover:to-indigo-700 text-white font-black text-xs py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-100"
                >
                  <Sparkles className="w-4 h-4" />
                  ⚡ Instant Activate Plan (Demo Mode)
                </button>
              </div>

              {/* Warning note */}
              <div className="flex items-start gap-2.5 bg-blue-50/50 border border-blue-100 rounded-2xl px-4 py-3.5 text-xs text-blue-700">
                <AlertTriangle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">
                  Upgrades require manual validation. Verification is processed by support agents within <strong>24 hours</strong>. If rejected, contact our administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SCREENSHOT LIGHTBOX MODAL ── */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl p-5 overflow-hidden shadow-2xl flex flex-col border border-slate-100 max-h-[85vh]">
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-all cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
            
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Transaction Confirmation receipt</h3>
            
            <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 min-h-0">
              <img 
                src={selectedScreenshot} 
                alt="Confirmation screenshot receipt" 
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm"
              />
            </div>
            
            <div className="flex justify-end pt-4 shrink-0">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer"
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
