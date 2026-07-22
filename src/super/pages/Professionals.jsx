import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ShieldCheck, Star, Check, X, AlertTriangle, Building, ExternalLink, MessageSquare, DollarSign, TrendingUp, Award } from 'lucide-react';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import StatsCard from '../components/StatsCard';
import { dbService } from '../../services/dbService';

const Professionals = () => {
  const [pros, setPros] = useState([]);
  const [refStats, setRefStats] = useState({ partnerCount: 0, totalLeads: 0, totalWebClicks: 0, estimatedIncentives: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPro, setEditingPro] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('Architect');
  const [location, setLocation] = useState('San Diego, CA');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [priceTier, setPriceTier] = useState('$$');
  const [verified, setVerified] = useState(false);
  const [featured, setFeatured] = useState(false);
  
  // Referral & Review Fields
  const [reviewSource, setReviewSource] = useState('Google Reviews');
  const [reviewRating, setReviewRating] = useState('4.9');
  const [isReferralEligible, setIsReferralEligible] = useState(true);
  const [incentiveRate, setIncentiveRate] = useState('$35 / lead');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPros(dbService.getDirectory());
    setRefStats(dbService.getReferralStats());
  };

  const openAddModal = () => {
    setEditingPro(null);
    setName('');
    setRole('Architect');
    setLocation('San Diego, CA');
    setEmail('');
    setPhone('');
    setWebsite('');
    setDescription('');
    setTagsInput('Detached, Modern');
    setPriceTier('$$');
    setVerified(false);
    setFeatured(false);
    setReviewSource('Google Reviews');
    setReviewRating('4.9');
    setIsReferralEligible(true);
    setIncentiveRate('$35 / lead');
    setIsModalOpen(true);
  };

  const openEditModal = (pro) => {
    setEditingPro(pro);
    setName(pro.name);
    setRole(pro.role);
    setLocation(pro.location);
    setEmail(pro.email || '');
    setPhone(pro.phone || '');
    setWebsite(pro.website || '');
    setDescription(pro.description || '');
    setTagsInput(pro.tags ? pro.tags.join(', ') : '');
    setPriceTier(pro.price || '$$');
    setVerified(pro.verified || false);
    setFeatured(pro.featured || false);
    setReviewSource(pro.reviewSource || 'Google Reviews');
    setReviewRating(pro.rating || '4.9');
    setIsReferralEligible(pro.isReferralEligible !== undefined ? pro.isReferralEligible : true);
    setIncentiveRate(pro.incentiveRate || '$35 / lead');
    setIsModalOpen(true);
  };

  const handleSavePro = (e) => {
    e.preventDefault();
    
    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      name,
      role,
      location,
      email,
      phone,
      website,
      description,
      tags: tagsArray,
      price: priceTier,
      verified,
      featured,
      reviewSource,
      rating: parseFloat(reviewRating) || 4.8,
      isReferralEligible,
      incentiveRate
    };

    if (editingPro) {
      // Edit
      const updated = dbService.updatePro(editingPro.id, payload);
      dbService.addLog(`Updated Directory listing profile for: "${name}"`);
    } else {
      // Create
      const added = dbService.addPro(payload);
      dbService.addLog(`Created Directory listing for: "${name}"`);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleDeletePro = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name} from the platform directory?`)) {
      dbService.deletePro(id);
      loadData();
      dbService.addLog(`Deleted Directory listing profile: "${name}"`);
    }
  };

  const handleToggleVerify = (pro) => {
    const updated = dbService.updatePro(pro.id, { verified: !pro.verified });
    loadData();
    dbService.addLog(`Toggled directory verification for "${pro.name}" to ${!pro.verified}`);
  };

  const handleToggleReferral = (pro) => {
    const nextVal = !pro.isReferralEligible;
    dbService.updatePro(pro.id, { isReferralEligible: nextVal });
    loadData();
    dbService.addLog(`Toggled Referral Partner Approval for "${pro.name}" to ${nextVal}`);
  };

  const handleToggleFeatured = (pro) => {
    const updated = dbService.updatePro(pro.id, { featured: !pro.featured });
    loadData();
    dbService.addLog(`Toggled featured listing flag for "${pro.name}" to ${!pro.featured}`);
  };

  const tableHeaders = [
    { label: "Company / Pro" },
    { label: "Role Category" },
    { label: "Location & Rating" },
    { label: "Referral & Incentives" },
    { label: "Actions", className: "text-right" }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Listed Professionals & Program Referrals</h2>
          <p className="text-xs text-slate-400 mt-1">Manage top Google/Yelp/Angi rated ADU builders, approve referral partners, and track lead incentives.</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-xs font-bold shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Professional
        </button>
      </div>

      {/* --- REFERRAL PROGRAM INCENTIVES METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Approved Partners" 
          value={refStats.partnerCount} 
          icon={Award} 
          change="Referral Program Ready" 
          colorClass="indigo" 
        />
        <StatsCard 
          label="Total Lead Inquiries" 
          value={refStats.totalLeads} 
          icon={MessageSquare} 
          change="Form / Phone Leads" 
          colorClass="emerald" 
        />
        <StatsCard 
          label="Outbound Link Clicks" 
          value={refStats.totalWebClicks} 
          icon={ExternalLink} 
          change="Website Outbound" 
          colorClass="blue" 
        />
        <StatsCard 
          label="Est. ADUNAVI Revenue" 
          value={`$${refStats.estimatedIncentives.toLocaleString()}`} 
          icon={DollarSign} 
          change="Incentives Earned" 
          colorClass="amber" 
        />
      </div>

      {/* Main Table view */}
      <AdminTable 
        headers={tableHeaders}
        data={pros}
        searchPlaceholder="Search contractor name or location..."
        searchField="name"
        renderRow={(pro) => (
          <tr key={pro?.id || Math.random()} className="hover:bg-slate-50/50">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0 border border-slate-200">
                  {pro.images && pro.images[0] ? (
                    <img src={pro.images[0]} alt="Pro" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Building className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 text-sm flex items-center gap-1.5">
                    {pro.name}
                    {pro.featured && (
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" title="Featured Partner" />
                    )}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    <span>{pro.price || '$$'}</span>
                    <span>•</span>
                    <span className="text-amber-600 font-extrabold">{pro.reviewSource || 'Google'} {pro.rating || '4.8'}★ ({pro.reviews || 0})</span>
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 font-semibold text-slate-600 text-xs sm:text-sm">{pro.role}</td>
            <td className="px-6 py-4 text-slate-500 font-semibold text-xs">{pro.location}</td>
            <td className="px-6 py-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    pro.isReferralEligible
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {pro.isReferralEligible ? 'Program Referral Active' : 'Standard Directory'}
                  </span>
                  {pro.incentiveRate && (
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                      {pro.incentiveRate}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-2">
                  <span>Leads: <strong className="text-slate-700">{pro.leadClickCount || 0}</strong></span>
                  <span>•</span>
                  <span>Clicks: <strong className="text-slate-700">{pro.websiteClickCount || 0}</strong></span>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-right flex justify-end gap-2">
              <button 
                onClick={() => handleToggleReferral(pro)}
                className={`p-1.5 border rounded-lg transition-colors ${
                  pro.isReferralEligible 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100' 
                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
                title={pro.isReferralEligible ? "Disable Referral Program Incentive" : "Enable ADUNAVI Partner Referral Program"}
              >
                <Award className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleToggleFeatured(pro)}
                className={`p-1.5 border rounded-lg transition-colors ${
                  pro.featured 
                    ? 'bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100' 
                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
                title="Toggle Featured placement"
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
              <button 
                onClick={() => openEditModal(pro)}
                className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg hover:text-slate-800 transition-colors"
                title="Edit Profile"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDeletePro(pro.id, pro.name)}
                className="p-1.5 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                title="Delete Listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        )}
      />

      {/* --- ADD/EDIT MODAL --- */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingPro ? "Edit listing profile" : "Add contractor listing"}
        size="lg"
      >
        <form onSubmit={handleSavePro} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Company / Architect Name</label>
              <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Directory category</label>
              <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
                <option value="Architect">Architect</option>
                <option value="General Contractor">General Contractor</option>
                <option value="ADU Consultant">ADU Consultant</option>
                <option value="Engineer">Engineer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Operating location</label>
              <input type="text" className="input-field" value={location} onChange={e => setLocation(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
              <input type="text" className="input-field" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Website URL</label>
              <input type="url" className="input-field" value={website} onChange={e => setWebsite(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Review Platform Source</label>
              <select className="input-field" value={reviewSource} onChange={e => setReviewSource(e.target.value)}>
                <option value="Google Reviews">Google Reviews 4.5+ ★</option>
                <option value="Yelp 4.5+">Yelp 4.5+ ★</option>
                <option value="Angi Approved">Angi Approved</option>
                <option value="Direct Partner">ADUNAVI Direct Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Rating (4.5 to 5.0)</label>
              <input type="number" step="0.1" max="5.0" min="4.0" className="input-field" value={reviewRating} onChange={e => setReviewRating(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Incentive / Referral Rate</label>
              <input type="text" placeholder="e.g. $35 / lead" className="input-field" value={incentiveRate} onChange={e => setIncentiveRate(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Price tier</label>
              <select className="input-field" value={priceTier} onChange={e => setPriceTier(e.target.value)}>
                <option value="$">$ (Value Builder)</option>
                <option value="$$">$$ (Moderate Cost)</option>
                <option value="$$$">$$$ (Premium Builder)</option>
                <option value="$$$$">$$$$ (Luxury Design)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tags / Specialities (Comma separated)</label>
            <input type="text" placeholder="e.g. Detached, Modular, Eco-Friendly" className="input-field" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Firm description</label>
            <textarea rows={3} className="input-field" value={description} onChange={e => setDescription(e.target.value)} placeholder="Explain specialities, past build locations, and municipal compliance expertise..." />
          </div>

          <div className="flex flex-wrap items-center gap-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="proVerified" 
                className="w-4 h-4 text-emerald-600 border-slate-350 rounded-xs focus:ring-emerald-500"
                checked={verified} 
                onChange={e => setVerified(e.target.checked)} 
              />
              <label htmlFor="proVerified" className="text-xs text-slate-600 font-bold select-none">Verified Partner Badge</label>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="proReferral" 
                className="w-4 h-4 text-indigo-600 border-slate-350 rounded-xs focus:ring-indigo-500"
                checked={isReferralEligible} 
                onChange={e => setIsReferralEligible(e.target.checked)} 
              />
              <label htmlFor="proReferral" className="text-xs text-indigo-700 font-bold select-none">Approve for Referral Program Incentives</label>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="proFeatured" 
                className="w-4 h-4 text-amber-600 border-slate-350 rounded-xs focus:ring-amber-500"
                checked={featured} 
                onChange={e => setFeatured(e.target.checked)} 
              />
              <label htmlFor="proFeatured" className="text-xs text-slate-600 font-bold select-none">Featured Star Flag</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary !py-2 !px-5 text-xs font-bold">Cancel</button>
            <button type="submit" className="btn-primary !py-2 !px-5 text-xs font-bold">Save listing</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default Professionals;
