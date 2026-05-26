import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/dbService';
import { DollarSign, Users, Clock, TrendingUp } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editFeatures, setEditFeatures] = useState('');

  useEffect(() => {
    const loadedPlans = dbService.getPlans();
    console.log("Loaded plans in Admin Subscriptions:", loadedPlans);
    setPlans(loadedPlans);
    setUsers(dbService.getUsers());
    setDeposits(dbService.getDeposits());
  }, []);

  const handleEdit = (index) => {
    console.log("handleEdit clicked for index:", index);
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

  // --- Dynamic Live Statistics Calculations ---
  const proSubscribers = users.filter(u => u.subscription === 'pro').length;
  
  const approvedDeposits = deposits.filter(d => d.status === 'approved');
  const totalRevenue = approvedDeposits.reduce((sum, dep) => {
    const amount = parseFloat(dep.price.replace(/[^0-9.]/g, '')) || 0;
    return sum + amount;
  }, 0);

  const pendingCount = deposits.filter(d => d.status === 'pending').length;
  
  // Exclude admin role users when calculating subscription conversion rate
  const customerUsers = users.filter(u => u.role !== 'admin');
  const conversionRate = customerUsers.length > 0 
    ? ((proSubscribers / customerUsers.length) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800">Subscriptions & Monetization</h2>
        <p className="text-xs text-slate-400 mt-1">Configure and manage subscription plan pricing and feature points.</p>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Live Revenue Collected" 
          value={`$${totalRevenue}`} 
          icon={DollarSign} 
          change="Sum of Approved Deposits" 
          colorClass="emerald" 
        />
        <StatsCard 
          label="Active Pro Subscribers" 
          value={proSubscribers} 
          icon={Users} 
          change={`${users.filter(u => u.subscription === 'free').length} Basic Free Users`} 
          colorClass="indigo" 
        />
        <StatsCard 
          label="Pending Approval Queue" 
          value={pendingCount} 
          icon={Clock} 
          change="Awaiting Receipt Review" 
          colorClass="amber" 
        />
        <StatsCard 
          label="Subscribers Conversion" 
          value={`${conversionRate}%`} 
          icon={TrendingUp} 
          change="Pro Tiers Share" 
          colorClass="blue" 
        />
      </div>

      {/* Subscriptions Plans Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {plans.map((plan, idx) => {
          const isEditing = editingIndex === idx;
          const subscriberCount = users.filter(u => u.subscription === plan.id).length;

          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative">
              {isEditing ? (
                <div className="space-y-4 w-full">
                  <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Price</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-secondary"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      placeholder="e.g. $49"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Feature Points (One per line)</label>
                    <textarea
                      rows={5}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-secondary"
                      value={editFeatures}
                      onChange={(e) => setEditFeatures(e.target.value)}
                      placeholder="Enter feature points..."
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleSave(idx)}
                      className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs py-2 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full justify-between w-full">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Plan</span>
                      <button
                        onClick={() => handleEdit(idx)}
                        className="text-[10px] font-bold text-secondary hover:underline uppercase tracking-wider"
                      >
                        Edit Plan
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mt-1">{plan.name}</h3>
                    <p className="text-2xl font-black text-emerald-600 mt-3">{plan.price}<span className="text-xs text-slate-400 font-bold font-sans">/mo</span></p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2.5 mb-6">{plan.desc}</p>

                    <ul className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex gap-2 items-center text-xs font-semibold text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Plan specific live user stats */}
                  <div className="border-t border-slate-100 pt-4 mt-auto flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Plan Members</span>
                    <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-xl border border-slate-200 shadow-inner">
                      {subscriberCount} Active {subscriberCount === 1 ? 'User' : 'Users'}
                    </span>
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
