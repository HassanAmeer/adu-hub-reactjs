import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useUserAuth';
import { dbService } from '../../services/dbService';
import { usePlanLimits } from '../hooks/usePlanLimits';
import { Plus, Trash2, CheckCircle2, Compass, Lock, Zap } from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';
import { useNavigate } from 'react-router-dom';

const Checks = () => {
  const { currentUser, refreshUser } = useAuth();
  const limits = usePlanLimits(currentUser);
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [feasibilityReport, setFeasibilityReport] = useState(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    const freshUser = dbService.getUsers().find(u => u.id === currentUser.id);
    if (freshUser) {
      setProperties(freshUser.savedProperties || []);
    }
  }, [currentUser]);

  // How many checks has user already saved
  const usedChecks = properties.length;
  const maxChecks = limits.propertyCheckerLimit; // -1 = unlimited
  const isAtLimit = maxChecks !== -1 && usedChecks >= maxChecks;
  const isPro = currentUser?.subscription === 'pro';

  const handleSimulate = (e) => {
    e.preventDefault();
    if (!newAddress) return;
    if (isAtLimit) return;

    setSimulating(true);
    setFeasibilityReport(null);

    setTimeout(() => {
      const reports = [
        {
          address: newAddress,
          status: 'Feasible',
          maxSize: '1,200 sq ft',
          setbackFront: '15 ft',
          setbackRear: '4 ft',
          setbackSide: '4 ft',
          parkingRequired: 'No parking required (within 0.5 miles of public transit)',
          fireHazardZone: 'No',
          color: 'bg-emerald-500'
        },
        {
          address: newAddress,
          status: 'Conditional',
          maxSize: '850 sq ft',
          setbackFront: '20 ft',
          setbackRear: '5 ft',
          setbackSide: '5 ft',
          parkingRequired: '1 space required (unless transit exemption applies)',
          fireHazardZone: 'Yes (requires fire-resistant building materials)',
          color: 'bg-amber-500'
        }
      ];

      const report = reports[Math.floor(Math.random() * reports.length)];
      setFeasibilityReport(report);
      setSimulating(false);
    }, 1200);
  };

  const handleSaveReport = () => {
    if (!feasibilityReport) return;

    const item = {
      id: 'prop-' + Date.now(),
      address: feasibilityReport.address,
      status: feasibilityReport.status,
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
      tags: ['Zoning Verified', feasibilityReport.maxSize]
    };

    const updatedProperties = [...properties, item];
    dbService.updateUser(currentUser.id, { savedProperties: updatedProperties });
    setProperties(updatedProperties);

    setFeasibilityReport(null);
    setNewAddress('');
    setShowAdd(false);
    refreshUser();
  };

  const handleDelete = (id) => {
    const updatedProperties = properties.filter(p => p.id !== id);
    dbService.updateUser(currentUser.id, { savedProperties: updatedProperties });
    setProperties(updatedProperties);
    refreshUser();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-primary">Property Checker History</h3>
          <p className="text-xs text-slate-400 mt-1">Review saved sites or run a new zoning check.</p>
        </div>

        {/* Run Check button — disabled if at limit */}
        <button
          onClick={() => {
            if (isAtLimit) return;
            setShowAdd(!showAdd);
            setFeasibilityReport(null);
          }}
          disabled={isAtLimit}
          title={isAtLimit ? 'Upgrade to Pro for unlimited checks' : ''}
          className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all ${
            isAtLimit
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {showAdd ? 'Close Checker' : <><Plus className="w-4 h-4" /> Run Zoning Check</>}
        </button>
      </div>

      {/* ── Usage indicator for free users ── */}
      {maxChecks !== -1 && (
        <div className={`flex items-center justify-between px-5 py-3 rounded-xl border text-sm ${
          isAtLimit
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 shrink-0" />
            <span className="font-semibold">
              Property Checks: <strong>{usedChecks} / {maxChecks}</strong> used
            </span>
          </div>
          {isAtLimit && (
            <button
              onClick={() => navigate('/userpanel/subscriptions')}
              className="flex items-center gap-1.5 text-xs font-bold bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              Upgrade to Pro
            </button>
          )}
        </div>
      )}

      {/* Limit reached wall */}
      {isAtLimit && (
        <div className="bg-white border border-rose-200 rounded-2xl p-8 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-rose-400" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">Property Check Limit Reached</h4>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Your <span className="font-bold text-slate-700">Free Plan</span> allows up to <strong>{maxChecks}</strong> property checks.
            Upgrade to <span className="text-emerald-600 font-bold">Pro</span> for unlimited access.
          </p>
          <button
            onClick={() => navigate('/userpanel/subscriptions')}
            className="mt-2 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            View Upgrade Options
          </button>
        </div>
      )}

      {showAdd && !isAtLimit && (
        <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6 max-w-2xl">
          <h4 className="font-bold text-primary text-sm uppercase tracking-wider">Run Zoning Checker Simulator</h4>

          <form onSubmit={handleSimulate} className="flex gap-4">
            <input
              type="text"
              placeholder="Enter street address, city, zip code..."
              className="input-field flex-grow"
              value={newAddress}
              onChange={e => setNewAddress(e.target.value)}
              required
              disabled={simulating}
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap text-sm"
              disabled={simulating}
            >
              {simulating ? 'Analyzing...' : 'Simulate'}
            </button>
          </form>

          {simulating && (
            <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" className="w-8 h-8" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-3 w-1/2" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </div>
            </div>
          )}

          {feasibilityReport && (
            <div className="space-y-6 border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <h5 className="font-bold text-slate-800 text-sm line-clamp-1">{feasibilityReport.address}</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Zoning Feasibility Result</p>
                </div>
                <span className={`px-2.5 py-1 text-white text-[10px] font-bold rounded-lg ${feasibilityReport.color}`}>
                  {feasibilityReport.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 block uppercase mb-1">Max ADU Size</span>
                  <span className="text-primary font-bold">{feasibilityReport.maxSize}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 block uppercase mb-1">Rear/Side Setbacks</span>
                  <span className="text-primary font-bold">{feasibilityReport.setbackRear} / {feasibilityReport.setbackSide}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 block uppercase mb-1">Transit Parking Rule</span>
                  <span className="text-primary font-bold leading-relaxed">{feasibilityReport.parkingRequired}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 block uppercase mb-1">Fire Hazard Zone</span>
                  <span className="text-primary font-bold">{feasibilityReport.fireHazardZone}</span>
                </div>
              </div>

              <button
                onClick={handleSaveReport}
                className="w-full btn-primary !py-3 text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4.5 h-4.5" /> Save Feasibility Check to Profile
              </button>
            </div>
          )}
        </div>
      )}

      {properties.length === 0 && !isAtLimit ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
          <p className="text-slate-500 font-medium">You haven't saved any property checks yet.</p>
          <p className="text-xs text-slate-400 mt-1">Use the Zoning Check button to run a local compliance check.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="h-40 relative bg-slate-100">
                <img src={prop.img} alt="Property" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleDelete(prop.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-red-500 hover:bg-white flex items-center justify-center shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-secondary/90 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  {prop.status}
                </div>
              </div>
              <div className="p-5">
                <p className="font-bold text-slate-800 text-sm mb-3 line-clamp-1">{prop.address}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {prop.tags?.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold uppercase">{t}</span>
                  ))}
                </div>
                <button className="w-full btn-primary !py-2 text-xs">Run Live Check</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Checks;
