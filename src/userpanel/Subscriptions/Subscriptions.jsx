import React, { useState } from 'react';
import { useAuth } from '../hooks/useUserAuth';
import { dbService } from '../../services/dbService';
import { CreditCard, CheckCircle2, ShieldCheck, ChevronRight, Lock } from 'lucide-react';

const Subscriptions = () => {
  const { currentUser, refreshUser } = useAuth();
  const [activePlan, setActivePlan] = useState(currentUser?.subscription || 'free');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleUpgrade = (tier) => {
    setLoading(true);
    setTimeout(() => {
      dbService.updateUser(currentUser.id, { subscription: tier });
      setActivePlan(tier);
      setSuccess(`Upgrade to ${tier.toUpperCase()} completed successfully!`);
      refreshUser();
      setLoading(false);
      setTimeout(() => setSuccess(''), 4000);
    }, 1000);
  };

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '$0',
      period: 'Forever',
      features: ['Basic Property Search', 'Saved up to 2 Properties', 'Public Pro Directory access'],
      button: 'Current Plan',
      active: activePlan === 'free'
    },
    {
      id: 'pro',
      name: 'Pro Planner',
      price: '$19',
      period: 'Month',
      features: ['Unlimited zoning calculations', 'Instant cost calculator', 'Alert notification list', 'Premium templates'],
      button: 'Upgrade to Pro',
      active: activePlan === 'pro'
    },
    {
      id: 'professional',
      name: 'Pro Partner',
      price: '$49',
      period: 'Month',
      features: ['Premium Directory listing badge', 'Direct leads matching', 'Interactive customer dashboard', 'Unlimited analytics logs'],
      button: 'Upgrade to Partner',
      active: activePlan === 'professional'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h3 className="text-xl font-bold text-primary">Subscriptions & Billing</h3>
        <p className="text-xs text-slate-400 mt-1">Upgrade your subscription plan to unlock full zoning calculators and contractor tools.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {success}
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              onClick={() => !p.active && handleUpgrade(p.id)}
              disabled={p.active || loading}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                p.active
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : 'bg-secondary hover:bg-secondary/90 text-white shadow-sm'
              }`}
            >
              {p.button}
            </button>
          </div>
        ))}
      </div>

      {/* Mock Billing History */}
      <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
        <h4 className="font-bold text-primary text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
          <CreditCard className="w-4.5 h-4.5 text-secondary" />
          Recent Invoices
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[9px]">
                <th className="pb-3">Invoice Number</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                <td className="py-3 font-bold text-slate-700">INV-2026-001</td>
                <td className="py-3">May 10, 2026</td>
                <td className="py-3">$19.00</td>
                <td className="py-3 text-emerald-500">Paid</td>
              </tr>
              <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                <td className="py-3 font-bold text-slate-700">INV-2026-002</td>
                <td className="py-3">April 10, 2026</td>
                <td className="py-3">$19.00</td>
                <td className="py-3 text-emerald-500">Paid</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
