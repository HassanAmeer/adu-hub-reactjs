import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useUserAuth';
import { dbService } from '../../services/dbService';
import { usePlanLimits } from '../hooks/usePlanLimits';
import { Building, Mail, Users, Check, X, ShieldCheck, Edit3, Lock, Zap, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Professionals = () => {
  const { currentUser, refreshUser } = useAuth();
  const limits = usePlanLimits(currentUser);
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [category, setCategory] = useState(currentUser?.category || 'General Contractor');
  const [location, setLocation] = useState(currentUser?.location || 'Los Angeles, CA');
  const [experience, setExperience] = useState(currentUser?.experience || '5 Years');
  const [rates, setRates] = useState(currentUser?.rates || '$150 - $250 / sq ft');
  const [leads, setLeads] = useState([]);
  const [editing, setEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Generate some mock customer inquiries/leads
    setLeads([
      { id: 'lead-1', name: 'Alice Miller', email: 'alice@gmail.com', phone: '(310) 555-0199', project: 'Detached ADU (800 sq ft)', address: '1428 Elm St, Los Angeles', date: '2 hours ago', status: 'Pending' },
      { id: 'lead-2', name: 'Robert Chen', email: 'rchen@outlook.com', phone: '(213) 555-8833', project: 'Garage Conversion Studio', address: '883 Sunset Blvd, Los Angeles', date: 'Yesterday', status: 'Pending' }
    ]);
  }, []);

  const handleUpdateListing = (e) => {
    e.preventDefault();
    dbService.updateUser(currentUser.id, {
      name,
      category,
      location,
      experience,
      rates
    });
    setEditing(false);
    setSavedSuccess(true);
    refreshUser();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLeadAction = (id, newStatus) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const canUpload = limits.canUploadDirectory;
  const hasBadge = limits.directoryPlacementBadge;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-primary">Pro Partner Portal</h3>
        <p className="text-xs text-slate-400 mt-1">Manage your service listing, accept customer leads, and edit rates.</p>
      </div>

      {/* Upgrade wall for free users */}
      {!canUpload && (
        <div className="bg-white border border-amber-200 rounded-2xl p-8 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">Directory Listing — Pro Feature</h4>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Your <span className="font-bold text-slate-700">Free Plan</span> doesn't include adding or managing a professional directory listing.
            Upgrade to <span className="text-emerald-600 font-bold">Pro</span> to get listed and receive homeowner leads.
          </p>
          <button
            onClick={() => navigate('/userpanel/subscriptions')}
            className="mt-2 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            Upgrade to Pro
          </button>
        </div>
      )}

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-500" /> Listing updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Listing Details */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Business Listing</h4>
            <button 
              onClick={() => setEditing(!editing)}
              className="p-1.5 border border-slate-200 hover:border-emerald-600 rounded-lg text-slate-500 hover:text-emerald-600 transition-all"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleUpdateListing} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Service Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Service Category</label>
                <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
                  <option>General Contractor</option>
                  <option>ADU Architect</option>
                  <option>Zoning Consultant</option>
                  <option>Pre-Fab ADU Dealer</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Experience</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={experience} 
                  onChange={e => setExperience(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Service Area / City</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Average Rates</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={rates} 
                  onChange={e => setRates(e.target.value)} 
                />
              </div>
              <button type="submit" className="w-full btn-primary !py-2.5 text-xs">Save Changes</button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-200 text-slate-600 mb-3 text-xl font-bold uppercase">
                  {(name || 'P')[0]}
                </div>
                <h5 className="font-bold text-slate-800 text-base">{name}</h5>
                <p className="text-xs text-secondary font-bold">{category}</p>
                {hasBadge && (
                  <span className="inline-flex items-center gap-1 mt-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    <BadgeCheck className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-primary">{location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Experience:</span>
                  <span className="text-primary">{experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. Rates:</span>
                  <span className="text-primary">{rates}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lead Inquiries */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary animate-pulse" />
            Homeowner Project Inquiries
          </h4>

          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">{lead.name}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{lead.project} • {lead.date}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    lead.status === 'Accepted' 
                      ? 'bg-emerald-50 text-emerald-600'
                      : lead.status === 'Declined'
                      ? 'bg-red-50 text-red-500'
                      : 'bg-amber-50 text-amber-500'
                  }`}>
                    {lead.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-600 border-t border-b border-slate-100/80 py-3">
                  <div><span className="text-slate-400">Phone:</span> {lead.phone}</div>
                  <div><span className="text-slate-400">Email:</span> {lead.email}</div>
                  <div className="sm:col-span-2"><span className="text-slate-400">Address:</span> {lead.address}</div>
                </div>

                {lead.status === 'Pending' && (
                  <div className="flex gap-3 justify-end pt-1">
                    <button 
                      onClick={() => handleLeadAction(lead.id, 'Declined')}
                      className="px-4 py-2 border border-slate-200 hover:border-red-200 hover:bg-red-50/30 text-slate-500 hover:text-red-500 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" /> Reject Inquire
                    </button>
                    <button 
                      onClick={() => handleLeadAction(lead.id, 'Accepted')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Accept Lead
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Professionals;
