import React, { useState } from 'react';
import { useAuth } from '../hooks/useUserAuth';
import { dbService } from '../../services/dbService';
import { CheckCircle2, User, Phone, MapPin, Loader2 } from 'lucide-react';

const Profile = () => {
  const { currentUser, refreshUser } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [email] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      dbService.updateUser(currentUser.id, { 
        name, 
        phone, 
        location,
        bio 
      });
      setSaveSuccess(true);
      await refreshUser();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
      <h3 className="text-xl font-bold text-primary">My Profile</h3>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Changes saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center border-b border-slate-100 pb-6">
          <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary font-bold text-2xl shadow-inner uppercase">
            {(name || 'U')[0]}
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-primary text-base">{name || 'ADU Member'}</h4>
            <p className="text-xs text-slate-400 capitalize">{currentUser?.role || 'Homeowner'} Account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                className="input-field !pl-12"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              className="input-field !bg-slate-50"
              value={email}
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="tel"
                className="input-field !pl-12"
                placeholder="(123) 456-7890"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Location / City</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                className="input-field !pl-12"
                placeholder="e.g. San Diego, CA"
                value={location}
                onChange={e => setLocation(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bio / Project Goals</label>
          <textarea
            rows={4}
            className="input-field"
            placeholder="Tell us about your ADU goals..."
            value={bio}
            onChange={e => setBio(e.target.value)}
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary !py-3 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
