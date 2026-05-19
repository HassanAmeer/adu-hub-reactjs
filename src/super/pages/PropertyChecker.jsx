import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Play, Save } from 'lucide-react';
import { dbService } from '../../services/dbService';

const PropertyChecker = () => {
  const [states, setStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  // Rules State
  const [minLotSize, setMinLotSize] = useState(0);
  const [maxAduSizeDetached, setMaxAduSizeDetached] = useState(1200);
  const [maxAduSizeAttached, setMaxAduSizeAttached] = useState(1000);
  const [rearSetback, setRearSetback] = useState(4);
  const [sideSetback, setSideSetback] = useState(4);
  const [requiresTransitProximity, setRequiresTransitProximity] = useState(true);

  // Simulator Inputs
  const [simLotSize, setSimLotSize] = useState(5000);
  const [simAduType, setSimAduType] = useState('Detached');
  const [simProposedSize, setSimProposedSize] = useState(800);
  const [simTransitDistance, setSimTransitDistance] = useState(0.3); // miles
  const [simHasPrimarySprinklers, setSimHasPrimarySprinklers] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loaded = dbService.getStates();
    setStates(loaded);
    if (loaded.length > 0) {
      setSelectedStateId(loaded[0].id);
      setCities(loaded[0].cities || []);
      if (loaded[0].cities?.length > 0) {
        setSelectedCity(loaded[0].cities[0]);
        loadZoningRules(loaded[0].id, loaded[0].cities[0]);
      }
    }
  }, []);

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedStateId(stateId);
    const stateObj = states.find(s => s.id === stateId);
    if (stateObj) {
      const stateCities = stateObj.cities || [];
      setCities(stateCities);
      if (stateCities.length > 0) {
        setSelectedCity(stateCities[0]);
        loadZoningRules(stateId, stateCities[0]);
      } else {
        setSelectedCity('');
        clearRules();
      }
    }
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    loadZoningRules(selectedStateId, cityName);
  };

  const loadZoningRules = (stateId, cityName) => {
    // In a fully persistent Firestore layout, we fetch the checker config.
    // For now we simulate load, falling back to California style defaults.
    const storageKey = `adu-checker-${stateId}-${cityName.toLowerCase().replace(/\s+/g, '-')}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      setMinLotSize(data.minLotSize);
      setMaxAduSizeDetached(data.maxAduSizeDetached);
      setMaxAduSizeAttached(data.maxAduSizeAttached);
      setRearSetback(data.rearSetback);
      setSideSetback(data.sideSetback);
      setRequiresTransitProximity(data.requiresTransitProximity);
    } else {
      // Default fallback values
      setMinLotSize(0);
      setMaxAduSizeDetached(1200);
      setMaxAduSizeAttached(1000);
      setRearSetback(4);
      setSideSetback(4);
      setRequiresTransitProximity(true);
    }
    setSimulationResult(null);
  };

  const clearRules = () => {
    setMinLotSize(0);
    setMaxAduSizeDetached(1200);
    setMaxAduSizeAttached(1000);
    setRearSetback(4);
    setSideSetback(4);
    setRequiresTransitProximity(true);
    setSimulationResult(null);
  };

  const handleSaveRules = (e) => {
    e.preventDefault();
    if (!selectedStateId || !selectedCity) {
      alert("Please select a state and city to save checker rules.");
      return;
    }

    const payload = {
      minLotSize: Number(minLotSize),
      maxAduSizeDetached: Number(maxAduSizeDetached),
      maxAduSizeAttached: Number(maxAduSizeAttached),
      rearSetback: Number(rearSetback),
      sideSetback: Number(sideSetback),
      requiresTransitProximity
    };

    const storageKey = `adu-checker-${selectedStateId}-${selectedCity.toLowerCase().replace(/\s+/g, '-')}`;
    localStorage.setItem(storageKey, JSON.stringify(payload));
    
    dbService.addLog(`Updated Property Checker rules for ${selectedCity}, ${selectedStateId.toUpperCase()}`);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const runSimulation = () => {
    const limits = {
      minLotSize,
      maxAduSizeDetached,
      maxAduSizeAttached,
      rearSetback,
      sideSetback,
      requiresTransitProximity
    };

    const logs = [];
    let isFeasible = true;

    // Check 1: Lot size feasibility
    if (simLotSize < limits.minLotSize) {
      isFeasible = false;
      logs.push({ pass: false, msg: `Lot size of ${simLotSize} sq ft is smaller than minimum required limit of ${limits.minLotSize} sq ft.` });
    } else {
      logs.push({ pass: true, msg: `Lot size is feasible. Minimum limit is ${limits.minLotSize} sq ft.` });
    }

    // Check 2: Max proposed size
    const limitSize = simAduType === 'Detached' ? limits.maxAduSizeDetached : limits.maxAduSizeAttached;
    if (simProposedSize > limitSize) {
      isFeasible = false;
      logs.push({ pass: false, msg: `Proposed size of ${simProposedSize} sq ft exceeds maximum size caps of ${limitSize} sq ft for ${simAduType} ADUs.` });
    } else {
      logs.push({ pass: true, msg: `Proposed size is within limits. Maximum cap is ${limitSize} sq ft.` });
    }

    // Check 3: Parking replacement relief
    if (limits.requiresTransitProximity) {
      if (simTransitDistance > 0.5) {
        logs.push({ pass: true, warning: true, msg: `Property is outside 0.5 miles from public transit (${simTransitDistance} miles). Replacement parking space may be required.` });
      } else {
        logs.push({ pass: true, msg: `Property is close to public transit (${simTransitDistance} miles). No replacement parking spaces can be mandated.` });
      }
    }

    // Check 4: Sprinkler mandates
    if (!simHasPrimarySprinklers) {
      logs.push({ pass: true, msg: "Fire sprinklers not required in ADU since primary dwelling does not have them." });
    } else {
      logs.push({ pass: true, warning: true, msg: "Primary home has sprinklers. Fire sprinklers must be included in the ADU design." });
    }

    setSimulationResult({
      feasible: isFeasible,
      logs
    });
  };

  return (
    <div className="space-y-8">
      {/* Selector Heading */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Property Checker Rules Manager</h2>
          <p className="text-xs text-slate-400 mt-1">Configure zoning checker constraints and run live feasibility simulations.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <select 
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
            value={selectedStateId}
            onChange={handleStateChange}
          >
            {states.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select 
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
            value={selectedCity}
            onChange={handleCityChange}
            disabled={cities.length === 0}
          >
            {cities.length === 0 ? (
              <option value="">No cities listed</option>
            ) : (
              cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))
            )}
          </select>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Feasibility guidelines saved to active checker records!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Rule configurations */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Compass className="w-5.5 h-5.5 text-emerald-500" />
            <h3 className="font-bold text-slate-800 text-base">Zoning Constraints Rules</h3>
          </div>

          <form onSubmit={handleSaveRules} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Minimum Lot Size (sq ft)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={minLotSize} 
                  onChange={e => setMinLotSize(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Max Size Detached ADU (sq ft)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={maxAduSizeDetached} 
                  onChange={e => setMaxAduSizeDetached(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Max Size Attached ADU (sq ft)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={maxAduSizeAttached} 
                  onChange={e => setMaxAduSizeAttached(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Rear Setback Limit (ft)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={rearSetback} 
                  onChange={e => setRearSetback(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Side Setback Limit (ft)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={sideSetback} 
                  onChange={e => setSideSetback(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Transit parking relief active</label>
                <div className="flex items-center gap-3 h-11">
                  <input 
                    type="checkbox" 
                    id="requiresTransit" 
                    className="w-4 h-4 text-emerald-600 border-slate-350 rounded-xs focus:ring-emerald-500"
                    checked={requiresTransitProximity}
                    onChange={e => setRequiresTransitProximity(e.target.checked)}
                  />
                  <label htmlFor="requiresTransit" className="text-xs text-slate-600 font-semibold select-none">
                    Waive parking if within 0.5 mi of transit
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button 
                type="submit" 
                className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-xs font-bold"
                disabled={!selectedCity}
              >
                <Save className="w-4 h-4" /> Save Constraints
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Live simulator */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Play className="w-5.5 h-5.5 text-emerald-500" />
            <h3 className="font-bold text-slate-800 text-base">Zoning Feasibility Simulator</h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject Lot Size (sq ft)</label>
                <input type="number" className="input-field" value={simLotSize} onChange={e => setSimLotSize(Number(e.target.value))} />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Proposed ADU Type</label>
                <select className="input-field" value={simAduType} onChange={e => setSimAduType(e.target.value)}>
                  <option value="Detached">Detached (Free Standing)</option>
                  <option value="Attached">Attached (Addition)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Proposed ADU Size (sq ft)</label>
                <input type="number" className="input-field" value={simProposedSize} onChange={e => setSimProposedSize(Number(e.target.value))} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Transit Proximity (miles)</label>
                <input type="number" step="0.1" className="input-field" value={simTransitDistance} onChange={e => setSimTransitDistance(Number(e.target.value))} />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="simSprinklers" 
                    className="w-4 h-4 text-emerald-600 border-slate-350 rounded-xs focus:ring-emerald-500"
                    checked={simHasPrimarySprinklers}
                    onChange={e => setSimHasPrimarySprinklers(e.target.checked)}
                  />
                  <label htmlFor="simSprinklers" className="text-xs text-slate-600 font-semibold select-none">
                    Primary Dwelling has fire sprinklers installed
                  </label>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              onClick={runSimulation}
              className="w-full btn-primary flex items-center justify-center gap-2 !py-3 font-bold"
              disabled={!selectedCity}
            >
              <Play className="w-4.5 h-4.5" /> Execute Feasibility Test
            </button>

            {/* Simulation Results Display */}
            {simulationResult && (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs mt-6">
                <div className={`p-4 font-bold flex items-center gap-2.5 text-sm ${
                  simulationResult.feasible 
                    ? 'bg-emerald-50 text-emerald-700 border-b border-emerald-100' 
                    : 'bg-rose-50 text-rose-700 border-b border-rose-100'
                }`}>
                  {simulationResult.feasible ? (
                    <>
                      <ShieldCheck className="w-5.5 h-5.5 text-emerald-500" />
                      <span>Result: Feasible / Permissible project</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5.5 h-5.5 text-rose-500" />
                      <span>Result: Restricted / Zoning Failures</span>
                    </>
                  )}
                </div>

                <div className="p-4 bg-slate-50 space-y-3">
                  {simulationResult.logs.map((log, index) => (
                    <div key={index} className="flex gap-2.5 items-start text-xs font-medium">
                      {log.warning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : log.pass ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <span className={log.pass ? 'text-slate-600' : 'text-rose-600 font-semibold'}>
                        {log.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyChecker;
