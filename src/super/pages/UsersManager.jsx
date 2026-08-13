import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, ShieldAlert, CheckCircle2, User, UserX, UserCheck, Shield, Briefcase, Users, UserPlus, Calendar, Clock, Filter, X, ArrowUpRight } from 'lucide-react';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import StatsCard from '../components/StatsCard';
import { dbService } from '../../services/dbService';
import { useNavigate } from 'react-router-dom';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Date Filter States
  const [dateFilter, setDateFilter] = useState('all'); // all, 30, 60, 90, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const navigate = useNavigate();

  // Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('homeowner');
  const [status, setStatus] = useState('active');
  const [subscription, setSubscription] = useState('free');
  const [subActivatedDate, setSubActivatedDate] = useState('');
  const [subExpiresDate, setSubExpiresDate] = useState('');

  useEffect(() => {
    setUsers(dbService.getUsers());
    const syncUsers = async () => {
      const synced = await dbService.syncUsersFromFirestore();
      if (synced) setUsers(synced);
    };
    syncUsers();
  }, []);

  const openEditModal = (user) => {
    setEditingUser(user);
    setName(user.name);
    setRole(user.role);
    setStatus(user.status || 'active');
    setSubscription(user.subscription || 'free');
    setSubActivatedDate(user.subscriptionActivatedDate || '');
    setSubExpiresDate(user.subscriptionExpiresDate || '');
    setIsModalOpen(true);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const payload = {
      role,
      status,
      subscription,
      subscriptionActivatedDate: subscription === 'free' ? null : subActivatedDate,
      subscriptionExpiresDate: subscription === 'free' ? null : subExpiresDate
    };

    const updated = dbService.updateUser(editingUser.id, payload);
    setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...updated } : u));
    dbService.addLog(`Updated account settings/role for user: "${editingUser.email}"`);
    setIsModalOpen(false);
  };

  const handleDeleteUser = (id, email) => {
    if (window.confirm(`Are you sure you want to permanently delete the user account for ${email}?`)) {
      dbService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      dbService.addLog(`Deleted user account: "${email}"`);
    }
  };

  const handleToggleBlock = (user) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    const updated = dbService.updateUser(user.id, { status: nextStatus });
    setUsers(users.map(u => u.id === user.id ? { ...u, ...updated } : u));
    dbService.addLog(`Toggled account access to ${nextStatus} for user: "${user.email}"`);
  };

  // --- Registration Statistics Calculations ---
  const todayStr = new Date().toISOString().split('T')[0];

  const getTodayCount = () => {
    return users.filter(u => u.joinedDate && u.joinedDate.split('T')[0] === todayStr).length;
  };

  const getRecentCount = (days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);
    return users.filter(u => {
      if (!u.joinedDate) return false;
      const userDate = new Date(u.joinedDate);
      return userDate >= cutoff;
    }).length;
  };

  // --- Filtering Logic ---
  const isDateMatchingFilter = (user) => {
    if (dateFilter === 'all') return true;
    if (!user.joinedDate) return false;

    const userDate = new Date(user.joinedDate);
    
    if (dateFilter === '30') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      cutoff.setHours(0, 0, 0, 0);
      return userDate >= cutoff;
    }
    if (dateFilter === '60') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 60);
      cutoff.setHours(0, 0, 0, 0);
      return userDate >= cutoff;
    }
    if (dateFilter === '90') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      cutoff.setHours(0, 0, 0, 0);
      return userDate >= cutoff;
    }
    if (dateFilter === 'custom') {
      if (startDate && new Date(user.joinedDate) < new Date(startDate)) return false;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(user.joinedDate) > end) return false;
      }
      return true;
    }
    return true;
  };

  const filteredUsers = users.filter(user => {
    const roleMatches = roleFilter === 'all' || user.role === roleFilter;
    const dateMatches = isDateMatchingFilter(user);
    return roleMatches && dateMatches;
  });

  const resetDateFilter = () => {
    setDateFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const tableHeaders = [
    { label: "User Account" },
    { label: "Account Role" },
    { label: "Access Status" },
    { label: "Subscription Tier" },
    { label: "Member Since" },
    { label: "Actions", className: "text-right" }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Users Management</h2>
          <p className="text-xs text-slate-400 mt-1">Review registered accounts, inspect registration metrics, and manage system access clearances.</p>
        </div>
      </div>

      {/* --- TOTAL USERS REGISTERED & STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Total Users Registered" 
          value={dateFilter === 'all' ? users.length : filteredUsers.length} 
          icon={Users} 
          change={dateFilter !== 'all' ? `Filtered (${dateFilter === 'custom' ? 'Date Range' : `Last ${dateFilter}d`})` : `${users.length} Total`}
          colorClass="indigo" 
        />
        <StatsCard 
          label="Registered Today" 
          value={getTodayCount()} 
          icon={UserPlus} 
          change="Today" 
          colorClass="emerald" 
        />
        <StatsCard 
          label="Last 7 Days" 
          value={getRecentCount(7)} 
          icon={Clock} 
          change="Past 7 days" 
          colorClass="blue" 
        />
        <StatsCard 
          label="Last 30 Days" 
          value={getRecentCount(30)} 
          icon={Calendar} 
          change="Past 30 days" 
          colorClass="amber" 
        />
      </div>

      {/* --- FILTER CONTROL BAR (Role & Date Range) --- */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-4">
          
          {/* Date Filter Selection */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <Filter className="w-4 h-4 text-indigo-500" />
              Registration Date:
            </span>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="30">Last 30 Days</option>
              <option value="60">Last 60 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="custom">Custom Date Range</option>
            </select>

            {/* Custom Date Range Inputs */}
            {dateFilter === 'custom' && (
              <div className="flex items-center gap-2 animate-in fade-in duration-200 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">From:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">To:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {(dateFilter !== 'all' || startDate || endDate) && (
              <button
                onClick={resetDateFilter}
                className="text-xs text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1 shrink-0"
              >
                <X className="w-3.5 h-3.5" /> Clear Date Filter
              </button>
            )}
          </div>

          {/* Role Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-250/70 p-1 rounded-2xl shrink-0 w-full sm:w-auto overflow-x-auto">
            {['all', 'homeowner', 'professional', 'investor', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                  roleFilter === r 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r}s
              </button>
            ))}
          </div>

        </div>

        {/* Filter Summary Banner */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredUsers.length}</span> of <span className="font-bold text-slate-800">{users.length}</span> registered users
            {roleFilter !== 'all' && <span className="ml-1 text-indigo-600 font-bold">({roleFilter}s)</span>}
            {dateFilter !== 'all' && (
              <span className="ml-1 text-indigo-600 font-bold">
                [{dateFilter === 'custom' ? `Range: ${startDate || 'Start'} to ${endDate || 'Today'}` : `Last ${dateFilter} days`}]
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Table view */}
      <AdminTable 
        headers={tableHeaders}
        data={filteredUsers}
        searchPlaceholder="Search users by name or email..."
        searchField="name"
        renderRow={(user) => (
          <tr key={user.id} className="hover:bg-slate-50/50">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0 shadow-inner">
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-normal flex items-center gap-1.5">
                    {user.name}
                    {user.role === 'admin' && (
                      <Shield className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/10" title="Super Admin Account" />
                    )}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-semibold block">{user.email}</span>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                user.role === 'admin' 
                  ? 'bg-slate-900 text-white' 
                  : user.role === 'professional'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : user.role === 'investor'
                  ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {user.role}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className={`badge text-[9px] ${
                user.status === 'active' ? 'badge-allowed' : 'badge-prohibited'
              }`}>
                {user.status || 'active'}
              </span>
            </td>
            <td className="px-6 py-4">
              <div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                  user.subscription === 'pro' 
                    ? 'bg-amber-100 text-amber-850 border border-amber-250 shadow-xs' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {user.subscription || 'free'}
                </span>
                {user.subscription === 'pro' && user.subscriptionExpiresDate && (
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1.5 whitespace-nowrap">
                    Expires: {user.subscriptionExpiresDate}
                  </span>
                )}
              </div>
            </td>
            <td className="px-6 py-4 text-slate-400 text-xs font-semibold">
              {user.joinedDate || '2025-01-10'}
            </td>
            <td className="px-6 py-4 text-right flex justify-end gap-2">
              {user.role !== 'admin' && (
                <button
                  onClick={() => handleToggleBlock(user)}
                  className={`p-1.5 border rounded-lg transition-colors ${
                    user.status === 'suspended'
                      ? 'bg-emerald-50 border-emerald-250 text-emerald-600 hover:bg-emerald-100'
                      : 'bg-rose-50 border-rose-250 text-rose-500 hover:bg-rose-100'
                  }`}
                  title={user.status === 'suspended' ? "Unblock Access" : "Block Access"}
                >
                  {user.status === 'suspended' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                </button>
              )}
              {user.role !== 'admin' && (
                <button 
                  onClick={() => navigate(`/super/projects?search=${user.email}`)}
                  className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg hover:text-slate-800 transition-colors flex items-center gap-1 shrink-0"
                  title="View User ADU Projects"
                >
                  <Briefcase className="w-4 h-4 text-secondary shrink-0" />
                  {user.projects?.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 bg-emerald-50 text-emerald-600 rounded">
                      {user.projects.length}
                    </span>
                  )}
                </button>
              )}
              <button 
                onClick={() => openEditModal(user)}
                className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg hover:text-slate-800 transition-colors"
                title="Edit Access Role"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {user.role !== 'admin' && (
                <button 
                  onClick={() => handleDeleteUser(user.id, user.email)}
                  className="p-1.5 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="Delete Account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </td>
          </tr>
        )}
      />

      {/* --- EDIT ACCESS MODAL --- */}
      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Modify access details: ${editingUser?.email}`}>
        <form onSubmit={handleUpdateUser} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
              <input type="text" className="input-field !bg-slate-50" value={name} readOnly />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Assign Platform Role</label>
              <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
                <option value="homeowner">Homeowner (Find laws/Estimate costs)</option>
                <option value="professional">Professional (Publish profile/Inquire leads)</option>
                <option value="investor">Investor (Multi-unit feasibility checker)</option>
                <option value="admin">Admin (Manage platform databases)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Access Status</label>
              <select className="input-field" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="active">Active (Access Allowed)</option>
                <option value="suspended">Suspended (Account Blocked)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subscription Tier</label>
              <select className="input-field" value={subscription} onChange={e => setSubscription(e.target.value)}>
                <option value="free">Free Tier</option>
                <option value="pro">Pro Tier</option>
              </select>
            </div>

            {subscription !== 'free' && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Activated Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={subActivatedDate}
                    onChange={e => setSubActivatedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Expiration Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={subExpiresDate}
                    onChange={e => setSubExpiresDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary !py-2 !px-5 text-xs font-bold">Cancel</button>
            <button type="submit" className="btn-primary !py-2 !px-5 text-xs font-bold">Save Changes</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default UsersManager;
