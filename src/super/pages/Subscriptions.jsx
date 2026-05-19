import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Users, DollarSign, ArrowUpRight, ShieldAlert } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import AdminTable from '../components/AdminTable';

const Subscriptions = () => {
  // Mock payments list
  const payments = [
    { id: 'tx-1092', user: 'Alex Rivera', email: 'alex@coastaldesign.com', plan: 'Expert Pro', amount: 99, date: '2026-05-19', status: 'Success' },
    { id: 'tx-1091', user: 'Coastal Design Studio', email: 'contact@coastaldesign.com', plan: 'Expert Pro', amount: 99, date: '2026-05-18', status: 'Success' },
    { id: 'tx-1090', user: 'Jane Doe', email: 'jane@example.com', plan: 'Standard Pro', amount: 49, date: '2026-05-17', status: 'Success' },
    { id: 'tx-1089', user: 'Mark Smith', email: 'mark@gmail.com', plan: 'Standard Pro', amount: 49, date: '2026-05-15', status: 'Success' },
    { id: 'tx-1088', user: 'Precision Build ADU', email: 'info@precisionbuildadu.com', plan: 'Expert Pro', amount: 99, date: '2026-05-12', status: 'Success' },
    { id: 'tx-1087', user: 'Urban Dwelling Co.', email: 'hello@urbandwelling.co', plan: 'Standard Pro', amount: 49, date: '2026-05-10', status: 'Success' },
  ];

  const tableHeaders = [
    { label: "Transaction ID" },
    { label: "Subscriber / Account" },
    { label: "Plan Tier" },
    { label: "Bill Date" },
    { label: "Amount" },
    { label: "Status" }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800">Subscriptions & Monetization</h2>
        <p className="text-xs text-slate-400 mt-1">Review premium tiers activation metrics, active subscriber records, and billing receipts.</p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Monthly Revenue" value="$4,850" icon={DollarSign} change="+18% this month" colorClass="emerald" />
        <StatsCard label="Active Subscribers" value="62" icon={Users} change="60 Pro, 2 Expert" colorClass="indigo" />
        <StatsCard label="Avg. Order Value" value="$78.22" icon={CreditCard} change="Per Month" colorClass="blue" />
        <StatsCard label="Churh Rate" value="1.4%" icon={TrendingUp} change="Extremely Low" colorClass="amber" />
      </div>

      {/* Subscriptions Plans Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Free Basic Tier', price: '$0', desc: 'Allows basic setback checking and laws queries for homeowners.', features: ['3 Property Checker run limit', 'Access to State level laws', 'Read directory reviews'] },
          { name: 'Standard Pro Tier', price: '$49', desc: 'Designed for professional contractors, consultants, and builders.', features: ['Direct lead acquisition queries', 'Featured directory placement badge', 'Comprehensive municipal details access'] },
          { name: 'Expert Builder Tier', price: '$99', desc: 'Ideal for regional firms requiring bulk zoning queries and leads.', features: ['Unlimited Lead pipelines', 'Priority search algorithm ranking', 'Regional zoning analytics reports'] }
        ].map((plan, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Plan</span>
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
          </div>
        ))}
      </div>

      {/* Recent Payments Table */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-base">Billing Receipts History</h3>
        
        <AdminTable 
          headers={tableHeaders}
          data={payments}
          searchPlaceholder="Search transactions by user or plan..."
          searchField="user"
          renderRow={(pay) => (
            <tr key={pay.id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <span className="font-mono text-xs font-bold text-slate-700">{pay.id}</span>
              </td>
              <td className="px-6 py-4">
                <p className="font-bold text-slate-800 text-sm">{pay.user}</p>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{pay.email}</span>
              </td>
              <td className="px-6 py-4 text-xs font-bold text-slate-600">{pay.plan}</td>
              <td className="px-6 py-4 text-xs font-semibold text-slate-400">{pay.date}</td>
              <td className="px-6 py-4 font-bold text-slate-800">${pay.amount}</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-150 text-[10px] font-bold uppercase">
                  {pay.status}
                </span>
              </td>
            </tr>
          )}
        />
      </div>

    </div>
  );
};

export default Subscriptions;
