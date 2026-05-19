import React, { useState } from 'react';
import { useAuth } from '../hooks/useUserAuth';
import { dbService } from '../../services/dbService';
import { Bell, Lock, CheckCircle2, ShieldCheck, Key, Loader2 } from 'lucide-react';

const Settings = () => {
  const { currentUser, refreshUser } = useAuth();
  const [legislativeAlerts, setLegislativeAlerts] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [leadInquiries, setLeadInquiries] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setSuccess('Notification preferences updated!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword) {
      setError('Please enter both current and new passwords.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const freshUser = dbService.getUsers().find(u => u.id === currentUser.id);
      if (freshUser && freshUser.password === oldPassword) {
        dbService.updateUser(currentUser.id, { password: newPassword });
        setSuccess('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        refreshUser();
      } else {
        setError('Current password is incorrect.');
      }
    } catch (err) {
      setError('Failed to update password.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h3 className="text-xl font-bold text-primary">Settings</h3>
        <p className="text-xs text-slate-400 mt-1">Configure account access, security parameters, and email subscriptions.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {success}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-100 text-sm font-semibold flex items-center gap-2">
          <span className="mt-0.5">⚠️</span> {error}
        </div>
      )}

      {/* Notifications form */}
      <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4.5 h-4.5 text-secondary" />
          Notification Preferences
        </h4>

        <form onSubmit={handleSaveNotifications} className="space-y-4">
          <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
            <div>
              <p className="text-xs font-bold text-slate-800">Legislative Zoning Updates</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Receive immediate notifications on ADU laws revision.</p>
            </div>
            <input 
              type="checkbox" 
              className="w-4.5 h-4.5 accent-secondary"
              checked={legislativeAlerts} 
              onChange={e => setLegislativeAlerts(e.target.checked)} 
            />
          </div>

          <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
            <div>
              <p className="text-xs font-bold text-slate-800">Monthly Builder digest</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Newsletter on recent pricing estimates and market data.</p>
            </div>
            <input 
              type="checkbox" 
              className="w-4.5 h-4.5 accent-secondary"
              checked={newsletter} 
              onChange={e => setNewsletter(e.target.checked)} 
            />
          </div>

          {currentUser?.role === 'professional' && (
            <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-800">Customer leads alerts</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Email triggers when new properties request professional services.</p>
              </div>
              <input 
                type="checkbox" 
                className="w-4.5 h-4.5 accent-secondary"
                checked={leadInquiries} 
                onChange={e => setLeadInquiries(e.target.checked)} 
              />
            </div>
          )}

          <button type="submit" className="btn-primary !py-2.5 text-xs">Save Preferences</button>
        </form>
      </div>

      {/* Security credentials form */}
      <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4.5 h-4.5 text-secondary" />
          Update Password
        </h4>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary !py-2.5 text-xs flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              'Change Passcode'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
