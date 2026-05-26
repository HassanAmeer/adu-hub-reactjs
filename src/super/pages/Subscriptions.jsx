import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/dbService';
import {
  Check, Edit3, Save, X, Users, Layers,
  Settings2, ToggleLeft, ToggleRight, ChevronDown, ChevronUp,
  Hash, BadgeCheck, Headphones, Building, FolderOpen
} from 'lucide-react';

// ── Default plan limits if none stored ──────────────────────────────────────
const DEFAULT_LIMITS = {
  free: {
    propertyCheckerLimit: 3,
    directoryPlacementBadge: false,
    technicalSupport: false,
    canUploadDirectory: false,
    canUploadADUProjects: false
  },
  pro: {
    propertyCheckerLimit: -1,       // -1 = unlimited
    directoryPlacementBadge: true,
    technicalSupport: true,
    canUploadDirectory: true,
    canUploadADUProjects: true
  }
};

// Helper to load limits from localStorage
const loadLimits = () => {
  try {
    const raw = localStorage.getItem('adu-plan-limits');
    return raw ? JSON.parse(raw) : DEFAULT_LIMITS;
  } catch {
    return DEFAULT_LIMITS;
  }
};

const saveLimitsToStorage = (limits) => {
  localStorage.setItem('adu-plan-limits', JSON.stringify(limits));
};

// ── Toggle component ─────────────────────────────────────────────────────────
const Toggle = ({ value, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!value)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      value ? 'bg-emerald-500' : 'bg-slate-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
      value ? 'translate-x-6' : 'translate-x-1'
    }`} />
  </button>
);

// ── LimitRow component ───────────────────────────────────────────────────────
const LimitRow = ({ icon: Icon, label, description, children }) => (
  <div className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-100 last:border-0">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editFeatures, setEditFeatures] = useState('');

  // Limits state per plan id
  const [limits, setLimits] = useState(loadLimits);
  const [expandedLimits, setExpandedLimits] = useState({});
  const [savingLimits, setSavingLimits] = useState({});
  const [limitsSaved, setLimitsSaved] = useState({});

  useEffect(() => {
    setPlans(dbService.getPlans());
    setUsers(dbService.getUsers());
  }, []);

  // ── Plan edit handlers ────────────────────────────────────────────────────
  const handleEdit = (index) => {
    if (!plans || plans.length <= index) return;
    setEditingIndex(index);
    const plan = plans[index];
    setEditPrice(plan?.price || '');
    setEditFeatures(Array.isArray(plan?.features) ? plan.features.join('\n') : '');
  };

  const handleSave = (index) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = {
      ...updatedPlans[index],
      price: editPrice,
      features: editFeatures.split('\n').map(f => f.trim()).filter(Boolean)
    };
    setPlans(updatedPlans);
    dbService.savePlans(updatedPlans);
    setEditingIndex(null);
  };

  // ── Limits handlers ───────────────────────────────────────────────────────
  const toggleLimitsPanel = (planId) => {
    setExpandedLimits(prev => ({ ...prev, [planId]: !prev[planId] }));
  };

  const updateLimit = (planId, key, value) => {
    setLimits(prev => ({
      ...prev,
      [planId]: { ...prev[planId], [key]: value }
    }));
  };

  const handleSaveLimits = (planId) => {
    setSavingLimits(prev => ({ ...prev, [planId]: true }));
    setTimeout(() => {
      saveLimitsToStorage(limits);
      setSavingLimits(prev => ({ ...prev, [planId]: false }));
      setLimitsSaved(prev => ({ ...prev, [planId]: true }));
      setTimeout(() => setLimitsSaved(prev => ({ ...prev, [planId]: false })), 2500);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Subscriptions & Monetization</h2>
          <p className="text-xs text-slate-400 mt-1">Configure plan pricing, feature lists, and per-plan access limits.</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {plans.map((plan, idx) => {
          const isEditing = editingIndex === idx;
          const subscriberCount = users.filter(u => u.subscription === plan.id).length;
          const isPro = plan.id === 'pro';
          const hasPriceNumber = /\d/.test(plan.price);
          const planLimits = limits[plan.id] || DEFAULT_LIMITS[plan.id] || {};
          const isLimitsOpen = !!expandedLimits[plan.id];

          return (
            <div key={idx} className="flex flex-col gap-0">

              {/* ── Plan Card ── */}
              <div className={`rounded-t-2xl border p-8 flex flex-col bg-white relative transition-shadow ${
                isPro
                  ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                  : 'border-slate-200 shadow-sm'
              } ${isLimitsOpen ? 'rounded-t-2xl rounded-b-none' : 'rounded-2xl'}`}>

                {isPro && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-sm">
                    Recommended
                  </div>
                )}

                {isEditing ? (
                  <div className="space-y-6 w-full flex-1">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        <Edit3 className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Edit {plan.name} Plan</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600">Monthly Pricing</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                          <input
                            type="text"
                            className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            value={editPrice.replace('$', '')}
                            onChange={(e) => setEditPrice(`$${e.target.value}`)}
                            placeholder="e.g. 49"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600">Features (One per line)</label>
                        <textarea
                          rows={6}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                          value={editFeatures}
                          onChange={(e) => setEditFeatures(e.target.value)}
                          placeholder="Enter features..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleSave(idx)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full w-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{plan.desc}</p>
                      </div>
                      <button
                        onClick={() => handleEdit(idx)}
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Edit Plan"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      {hasPriceNumber ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-slate-400">$</span>
                          <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            {plan.price.replace('$', '')}
                          </span>
                          <span className="text-sm text-slate-500 font-medium ml-1">/mo</span>
                        </div>
                      ) : (
                        <span className="text-5xl font-extrabold text-slate-900 tracking-tight">{plan.price}</span>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex-1">
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                            <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                            <span className="leading-tight">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer stats */}
                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">Active Users</span>
                      </div>
                      <span className="font-bold text-slate-900">{subscriberCount}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Plan Limits Accordion Toggle ── */}
              <button
                onClick={() => toggleLimitsPanel(plan.id)}
                className={`flex items-center justify-between w-full px-5 py-3 border-x border-b text-sm font-semibold transition-colors cursor-pointer ${
                  isLimitsOpen
                    ? isPro
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                    : isPro
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-b-2xl'
                      : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100 rounded-b-2xl'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  Plan Access Limits
                </div>
                {isLimitsOpen
                  ? <ChevronUp className="w-4 h-4 opacity-60" />
                  : <ChevronDown className="w-4 h-4 opacity-60" />
                }
              </button>

              {/* ── Limits Panel ── */}
              {isLimitsOpen && (
                <div className={`border-x border-b rounded-b-2xl bg-white px-6 py-4 space-y-1 ${
                  isPro ? 'border-emerald-500' : 'border-slate-200'
                }`}>

                  {/* Property Checker Limit */}
                  <LimitRow
                    icon={Hash}
                    label="Property Checker Runs"
                    description="Max searches per user per month. Set to -1 for unlimited."
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="-1"
                        className="w-20 text-center border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        value={planLimits.propertyCheckerLimit ?? 3}
                        onChange={(e) => updateLimit(plan.id, 'propertyCheckerLimit', parseInt(e.target.value) || 0)}
                      />
                      <span className="text-xs text-slate-400 font-medium">
                        {planLimits.propertyCheckerLimit === -1 ? '∞ Unlimited' : 'runs/mo'}
                      </span>
                    </div>
                  </LimitRow>

                  {/* Directory Placement Badge */}
                  <LimitRow
                    icon={BadgeCheck}
                    label="Directory Placement Badge"
                    description="Show a 'Featured' badge on users' directory listing."
                  >
                    <Toggle
                      value={!!planLimits.directoryPlacementBadge}
                      onChange={(v) => updateLimit(plan.id, 'directoryPlacementBadge', v)}
                    />
                  </LimitRow>

                  {/* Technical Support */}
                  <LimitRow
                    icon={Headphones}
                    label="Technical Support"
                    description="Access to admin priority support channel."
                  >
                    <Toggle
                      value={!!planLimits.technicalSupport}
                      onChange={(v) => updateLimit(plan.id, 'technicalSupport', v)}
                    />
                  </LimitRow>

                  {/* Can Upload Directory */}
                  <LimitRow
                    icon={Building}
                    label="Upload to Directory"
                    description="Allow users on this plan to add/manage their professional listing."
                  >
                    <Toggle
                      value={!!planLimits.canUploadDirectory}
                      onChange={(v) => updateLimit(plan.id, 'canUploadDirectory', v)}
                    />
                  </LimitRow>

                  {/* Can Upload ADU Projects */}
                  <LimitRow
                    icon={FolderOpen}
                    label="Upload ADU Projects"
                    description="Allow users to create and manage their ADU project portfolio."
                  >
                    <Toggle
                      value={!!planLimits.canUploadADUProjects}
                      onChange={(v) => updateLimit(plan.id, 'canUploadADUProjects', v)}
                    />
                  </LimitRow>

                  {/* Save Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => handleSaveLimits(plan.id)}
                      disabled={savingLimits[plan.id]}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      {savingLimits[plan.id] ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Saving…
                        </>
                      ) : limitsSaved[plan.id] ? (
                        <>
                          <Check className="w-4 h-4" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Limits
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subscriptions;
