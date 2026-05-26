import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, ShieldAlert, CheckCircle2, User, UserX, UserCheck, Shield } from 'lucide-react';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import { dbService } from '../../services/dbService';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');

  // Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('homeowner');
  const [status, setStatus] = useState('active');
  const [subscription, setSubscription] = useState('free');

  useEffect(() => {
    setUsers(dbService.getUsers());
  }, []);

  const openEditModal = (user) => {
    setEditingUser(user);
    setName(user.name);
    setRole(user.role);
    setStatus(user.status || 'active');
    setSubscription(user.subscription || 'free');
    setIsModalOpen(true);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const payload = {
      role,
      status,
      subscription
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

  // Filter by role
  const filteredUsers = users.filter(user => {
    if (roleFilter === 'all') return true;
    return user.role === roleFilter;
  });

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Users Management</h2>
          <p className="text-xs text-slate-400 mt-1">Review homeowner, investor, and contractor account credentials and toggle system access limits.</p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-250/70 p-1 rounded-xl shrink-0 w-full sm:w-auto">
          {['all', 'homeowner', 'professional', 'investor', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
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
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {user.subscription || 'free'}
              </span>
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
