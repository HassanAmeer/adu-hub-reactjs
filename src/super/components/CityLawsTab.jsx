import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Clock,
  Settings,
  BookOpen
} from 'lucide-react';
import { dbService } from '../../services/dbService';

const slugify = (text) => 
  text ? text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';

const CityLawsTab = ({ stateId, onSaveSuccess }) => {
  const [states, setStates] = useState([]);
  const [currentState, setCurrentState] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCitySlug, setSelectedCitySlug] = useState('');
  
  // New City input
  const [newCityName, setNewCityName] = useState('');
  const [showAddCity, setShowAddCity] = useState(false);

  // Form states for the selected city
  const [permitTime, setPermitTime] = useState('');
  const [impactFees, setImpactFees] = useState('');
  
  // Lists
  const [alerts, setAlerts] = useState([]);
  const [amendments, setAmendments] = useState([]);
  const [zoningStandards, setZoningStandards] = useState([]);
  const [permitTimeline, setPermitTimeline] = useState([]);
  const [zoningChips, setZoningChips] = useState([]);
  
  // List form inputs
  // 1. Alerts
  const [alertIndex, setAlertIndex] = useState(-1);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertType, setAlertType] = useState('amber'); // amber, emerald, blue
  
  // 2. Amendments
  const [amendmentIndex, setAmendmentIndex] = useState(-1);
  const [amendmentTitle, setAmendmentTitle] = useState('');
  const [amendmentDesc, setAmendmentDesc] = useState('');
  const [amendmentType, setAmendmentType] = useState('success'); // success, warning

  // 3. Standards
  const [standardIndex, setStandardIndex] = useState(-1);
  const [standardCategory, setStandardCategory] = useState('');
  const [standardVal, setStandardVal] = useState('');
  const [standardNotes, setStandardNotes] = useState('');

  // 4. Timeline
  const [timelineIndex, setTimelineIndex] = useState(-1);
  const [timelineStep, setTimelineStep] = useState('');
  const [timelineTime, setTimelineTime] = useState('');

  // 5. Zoning Chips
  const [chipInput, setChipInput] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, [stateId]);

  const loadData = () => {
    const loadedStates = dbService.getStates();
    setStates(loadedStates);
    const activeState = loadedStates.find(s => s.id === stateId);
    setCurrentState(activeState);
    if (activeState) {
      const stateCities = activeState.cities || [];
      setCities(stateCities);
      
      // Select the first city by default if there is one
      if (stateCities.length > 0) {
        const firstSlug = slugify(stateCities[0]);
        setSelectedCitySlug(firstSlug);
        loadCityData(activeState, firstSlug);
      } else {
        setSelectedCitySlug('');
        clearCityForm();
      }
    }
  };

  const loadCityData = (stateObj, citySlug) => {
    if (!stateObj) return;
    const details = stateObj.cityDetails || {};
    const cityData = details[citySlug] || {};

    // Get city name from list
    const stateCities = stateObj.cities || [];
    const cityName = stateCities.find(c => slugify(c) === citySlug) || 'City';

    setPermitTime(cityData.permitTime || '30-90 Days');
    setImpactFees(cityData.impactFees || '$0 - $5k');
    setAlerts(cityData.alerts || []);
    setAmendments(cityData.amendments || []);
    setZoningStandards(cityData.zoningStandards || []);
    setPermitTimeline(cityData.permitTimeline || []);
    setZoningChips(cityData.zoningChips || []);
    
    resetAlertForm();
    resetAmendmentForm();
    resetStandardForm();
    resetTimelineForm();
  };

  const handleCityChange = (e) => {
    const slug = e.target.value;
    setSelectedCitySlug(slug);
    loadCityData(currentState, slug);
  };

  const clearCityForm = () => {
    setPermitTime('');
    setImpactFees('');
    setAlerts([]);
    setAmendments([]);
    setZoningStandards([]);
    setPermitTimeline([]);
    setZoningChips([]);
  };

  // Add a new city to this state
  const handleAddCity = (e) => {
    e.preventDefault();
    if (!newCityName.trim() || !currentState) return;
    
    const cityName = newCityName.trim();
    const citySlug = slugify(cityName);
    
    if (currentState.cities.some(c => slugify(c) === citySlug)) {
      alert('This city already exists.');
      return;
    }

    const updatedCities = [...(currentState.cities || []), cityName];
    const updatedDetails = {
      ...(currentState.cityDetails || {}),
      [citySlug]: {
        name: cityName,
        permitTime: '30-90 Days',
        impactFees: '$0 - $5k',
        alerts: [],
        amendments: [],
        zoningStandards: [],
        permitTimeline: [],
        zoningChips: []
      }
    };

    const updatedState = {
      ...currentState,
      cities: updatedCities,
      cityDetails: updatedDetails
    };

    dbService.updateState(stateId, updatedState);
    dbService.addLog(`Added city "${cityName}" to state "${currentState.name}"`);

    // Reload
    setNewCityName('');
    setShowAddCity(false);
    
    // Refresh parent and local states
    const loadedStates = dbService.getStates();
    setStates(loadedStates);
    const activeState = loadedStates.find(s => s.id === stateId);
    setCurrentState(activeState);
    setCities(updatedCities);
    
    // Select newly added city
    setSelectedCitySlug(citySlug);
    loadCityData(activeState, citySlug);
  };

  // Delete a city
  const handleDeleteCity = () => {
    if (!selectedCitySlug || !currentState) return;
    const cityName = cities.find(c => slugify(c) === selectedCitySlug);
    if (!window.confirm(`Are you sure you want to delete all city laws data for "${cityName}"?`)) return;

    const updatedCities = cities.filter(c => slugify(c) !== selectedCitySlug);
    const updatedDetails = { ...(currentState.cityDetails || {}) };
    delete updatedDetails[selectedCitySlug];

    const updatedState = {
      ...currentState,
      cities: updatedCities,
      cityDetails: updatedDetails
    };

    dbService.updateState(stateId, updatedState);
    dbService.addLog(`Deleted city "${cityName}" from state "${currentState.name}"`);

    // Refresh
    const loadedStates = dbService.getStates();
    setStates(loadedStates);
    const activeState = loadedStates.find(s => s.id === stateId);
    setCurrentState(activeState);
    setCities(updatedCities);

    if (updatedCities.length > 0) {
      const firstSlug = slugify(updatedCities[0]);
      setSelectedCitySlug(firstSlug);
      loadCityData(activeState, firstSlug);
    } else {
      setSelectedCitySlug('');
      clearCityForm();
    }
  };

  // --- Reset Forms ---
  const resetAlertForm = () => {
    setAlertIndex(-1);
    setAlertTitle('');
    setAlertDesc('');
    setAlertType('amber');
  };

  const resetAmendmentForm = () => {
    setAmendmentIndex(-1);
    setAmendmentTitle('');
    setAmendmentDesc('');
    setAmendmentType('success');
  };

  const resetStandardForm = () => {
    setStandardIndex(-1);
    setStandardCategory('');
    setStandardVal('');
    setStandardNotes('');
  };

  const resetTimelineForm = () => {
    setTimelineIndex(-1);
    setTimelineStep('');
    setTimelineTime('');
  };

  // --- Alert Handlers ---
  const handleSaveAlert = (e) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertDesc.trim()) return;

    const newAlert = {
      title: alertTitle.trim(),
      desc: alertDesc.trim(),
      type: alertType
    };

    let updated = [...alerts];
    if (alertIndex === -1) {
      updated.push(newAlert);
    } else {
      updated[alertIndex] = newAlert;
    }

    setAlerts(updated);
    resetAlertForm();
  };

  // --- Amendment Handlers ---
  const handleSaveAmendment = (e) => {
    e.preventDefault();
    if (!amendmentTitle.trim() || !amendmentDesc.trim()) return;

    const newAmend = {
      title: amendmentTitle.trim(),
      desc: amendmentDesc.trim(),
      type: amendmentType
    };

    let updated = [...amendments];
    if (amendmentIndex === -1) {
      updated.push(newAmend);
    } else {
      updated[amendmentIndex] = newAmend;
    }

    setAmendments(updated);
    resetAmendmentForm();
  };

  // --- Standard Handlers ---
  const handleSaveStandard = (e) => {
    e.preventDefault();
    if (!standardCategory.trim() || !standardVal.trim()) return;

    const newStd = {
      category: standardCategory.trim(),
      standard: standardVal.trim(),
      notes: standardNotes.trim()
    };

    let updated = [...zoningStandards];
    if (standardIndex === -1) {
      updated.push(newStd);
    } else {
      updated[standardIndex] = newStd;
    }

    setZoningStandards(updated);
    resetStandardForm();
  };

  // --- Timeline Handlers ---
  const handleSaveTimeline = (e) => {
    e.preventDefault();
    if (!timelineStep.trim() || !timelineTime.trim()) return;

    const newTime = {
      step: timelineStep.trim(),
      time: timelineTime.trim()
    };

    let updated = [...permitTimeline];
    if (timelineIndex === -1) {
      updated.push(newTime);
    } else {
      updated[timelineIndex] = newTime;
    }

    setPermitTimeline(updated);
    resetTimelineForm();
  };

  // --- Chips Handlers ---
  const handleAddChip = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      e.preventDefault();
      const val = chipInput.trim();
      if (val && !zoningChips.includes(val)) {
        setZoningChips([...zoningChips, val]);
        setChipInput('');
      }
    }
  };

  const handleRemoveChip = (chipToRemove) => {
    setZoningChips(zoningChips.filter(c => c !== chipToRemove));
  };

  // --- Final Save ---
  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!selectedCitySlug || !currentState) return;

    const cityName = cities.find(c => slugify(c) === selectedCitySlug);
    const updatedDetails = {
      ...(currentState.cityDetails || {}),
      [selectedCitySlug]: {
        name: cityName,
        permitTime,
        impactFees,
        alerts,
        amendments,
        zoningStandards,
        permitTimeline,
        zoningChips
      }
    };

    const updatedState = {
      ...currentState,
      cityDetails: updatedDetails
    };

    dbService.updateState(stateId, updatedState);
    dbService.addLog(`Updated city laws details for "${cityName}" in state "${currentState.name}"`);

    // Reload local data
    const loadedStates = dbService.getStates();
    setStates(loadedStates);
    const activeState = loadedStates.find(s => s.id === stateId);
    setCurrentState(activeState);

    setSaveSuccess(true);
    if (onSaveSuccess) onSaveSuccess();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-800 text-base">City Laws & Local Overlays</h3>
            <p className="text-xs text-slate-400">Configure zoning standards, fee exemptions, local amendments and overlays for this city.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {!showAddCity ? (
            <>
              <select
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 w-full sm:w-48"
                value={selectedCitySlug}
                onChange={handleCityChange}
                disabled={cities.length === 0}
              >
                {cities.length === 0 ? (
                  <option value="">No Cities Configured</option>
                ) : (
                  cities.map(c => (
                    <option key={slugify(c)} value={slugify(c)}>{c}</option>
                  ))
                )}
              </select>
              <button
                type="button"
                onClick={() => setShowAddCity(true)}
                className="flex items-center gap-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer w-full sm:w-auto justify-center"
              >
                <Plus className="w-3.5 h-3.5" /> Add City
              </button>
              {selectedCitySlug && (
                <button
                  type="button"
                  onClick={handleDeleteCity}
                  className="bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer w-full sm:w-auto justify-center"
                >
                  Delete City
                </button>
              )}
            </>
          ) : (
            <form onSubmit={handleAddCity} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="City Name (e.g. San Diego)"
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 w-full sm:w-48"
                value={newCityName}
                onChange={e => setNewCityName(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs cursor-pointer shrink-0"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddCity(false)}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2 mb-6">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>City zoning and overlays saved successfully!</span>
        </div>
      )}

      {selectedCitySlug ? (
        <form onSubmit={handleSaveChanges} className="space-y-8">
          {/* Section 1: City Metrics */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-emerald-600" /> Basic City Metrics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Local Permit Timeframe
                </label>
                <input
                  type="text"
                  placeholder="e.g. 60-90 Days"
                  className="input-field py-2 text-xs rounded-xl"
                  value={permitTime}
                  onChange={e => setPermitTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Typical Impact Fees
                </label>
                <input
                  type="text"
                  placeholder="e.g. $0 - $5k"
                  className="input-field py-2 text-xs rounded-xl"
                  value={impactFees}
                  onChange={e => setImpactFees(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Overlays (Alerts) Manager */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 space-y-4 lg:col-span-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Overlay Alerts ({alerts.length})
              </h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {alerts.map((al, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5 relative group">
                    <div className="flex justify-between items-start pr-8">
                      <span className="font-bold text-slate-800">{al.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
                        al.type === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        al.type === 'amber' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {al.type === 'emerald' ? 'success' : al.type === 'amber' ? 'warning' : 'info'}
                      </span>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-[11px] line-clamp-2">{al.desc}</p>
                    <div className="flex gap-1 absolute right-2 bottom-2 md:opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAlertIndex(idx);
                          setAlertTitle(al.title);
                          setAlertDesc(al.desc);
                          setAlertType(al.type);
                        }}
                        className="p-1 hover:bg-slate-100 text-slate-500 rounded cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAlerts(alerts.filter((_, i) => i !== idx))}
                        className="p-1 hover:bg-rose-50 text-rose-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <p className="text-[11px] text-slate-400 text-center py-4">No overlay alerts configured.</p>
                )}
              </div>
              <div className="border-t border-slate-200/60 pt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Alert Title"
                  className="input-field py-1.5 text-[11px] rounded-lg"
                  value={alertTitle}
                  onChange={e => setAlertTitle(e.target.value)}
                />
                <textarea
                  placeholder="Alert Description"
                  rows={2}
                  className="input-field py-1.5 text-[11px] rounded-lg"
                  value={alertDesc}
                  onChange={e => setAlertDesc(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <select
                    className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] outline-hidden focus:ring-2 focus:ring-emerald-500/15"
                    value={alertType}
                    onChange={e => setAlertType(e.target.value)}
                  >
                    <option value="amber">Amber (Warning)</option>
                    <option value="emerald">Emerald (Success)</option>
                    <option value="blue">Blue (Info)</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleSaveAlert}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] cursor-pointer"
                  >
                    {alertIndex === -1 ? 'Add Alert' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Local Amendments Manager */}
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 space-y-4 lg:col-span-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Local Amendments ({amendments.length})
              </h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {amendments.map((am, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5 relative group">
                    <div className="flex justify-between items-start pr-8">
                      <span className="font-bold text-slate-800">{am.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
                        am.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {am.type}
                      </span>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-[11px] line-clamp-2">{am.desc}</p>
                    <div className="flex gap-1 absolute right-2 bottom-2 md:opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAmendmentIndex(idx);
                          setAmendmentTitle(am.title);
                          setAmendmentDesc(am.desc);
                          setAmendmentType(am.type);
                        }}
                        className="p-1 hover:bg-slate-100 text-slate-500 rounded cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAmendments(amendments.filter((_, i) => i !== idx))}
                        className="p-1 hover:bg-rose-50 text-rose-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {amendments.length === 0 && (
                  <p className="text-[11px] text-slate-400 text-center py-4">No amendments configured.</p>
                )}
              </div>
              <div className="border-t border-slate-200/60 pt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Amendment Title"
                  className="input-field py-1.5 text-[11px] rounded-lg"
                  value={amendmentTitle}
                  onChange={e => setAmendmentTitle(e.target.value)}
                />
                <textarea
                  placeholder="Amendment Description"
                  rows={2}
                  className="input-field py-1.5 text-[11px] rounded-lg"
                  value={amendmentDesc}
                  onChange={e => setAmendmentDesc(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <select
                    className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] outline-hidden focus:ring-2 focus:ring-emerald-500/15"
                    value={amendmentType}
                    onChange={e => setAmendmentType(e.target.value)}
                  >
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleSaveAmendment}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] cursor-pointer"
                  >
                    {amendmentIndex === -1 ? 'Add Amendment' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            {/* Section 4: Zoning Standards Table */}
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 space-y-4 lg:col-span-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-emerald-600" /> Zoning Standards ({zoningStandards.length})
              </h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {zoningStandards.map((std, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 relative group">
                    <div className="flex justify-between pr-8">
                      <span className="font-bold text-slate-850">{std.category}</span>
                      <span className="text-emerald-600 font-semibold">{std.standard}</span>
                    </div>
                    {std.notes && <p className="text-slate-400 text-[10px] italic">Note: {std.notes}</p>}
                    <div className="flex gap-1 absolute right-2 bottom-1.5 md:opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStandardIndex(idx);
                          setStandardCategory(std.category);
                          setStandardVal(std.standard);
                          setStandardNotes(std.notes || '');
                        }}
                        className="p-1 hover:bg-slate-100 text-slate-500 rounded cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoningStandards(zoningStandards.filter((_, i) => i !== idx))}
                        className="p-1 hover:bg-rose-50 text-rose-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {zoningStandards.length === 0 && (
                  <p className="text-[11px] text-slate-400 text-center py-4">No standards configured.</p>
                )}
              </div>
              <div className="border-t border-slate-200/60 pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Category (e.g. Setbacks)"
                    className="input-field py-1.5 text-[11px] rounded-lg"
                    value={standardCategory}
                    onChange={e => setStandardCategory(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Standard (e.g. 4 ft)"
                    className="input-field py-1.5 text-[11px] rounded-lg"
                    value={standardVal}
                    onChange={e => setStandardVal(e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Additional Notes"
                  className="input-field py-1.5 text-[11px] rounded-lg"
                  value={standardNotes}
                  onChange={e => setStandardNotes(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveStandard}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] cursor-pointer"
                  >
                    {standardIndex === -1 ? 'Add Standard' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Timeline & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Permit Timeline */}
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" /> Permit Timeline Steps ({permitTimeline.length})
              </h4>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {permitTimeline.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex justify-between items-center group relative">
                    <div>
                      <span className="font-bold text-slate-800">{item.step}</span>
                      <span className="text-slate-400 ml-2">({item.time})</span>
                    </div>
                    <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTimelineIndex(idx);
                          setTimelineStep(item.step);
                          setTimelineTime(item.time);
                        }}
                        className="p-1 hover:bg-slate-100 text-slate-500 rounded cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPermitTimeline(permitTimeline.filter((_, i) => i !== idx))}
                        className="p-1 hover:bg-rose-50 text-rose-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {permitTimeline.length === 0 && (
                  <p className="text-[11px] text-slate-400 text-center py-4">No timeline steps configured.</p>
                )}
              </div>
              <div className="border-t border-slate-200/60 pt-4 flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    placeholder="Step (e.g. Plan Review)"
                    className="input-field py-1.5 text-[11px] rounded-lg"
                    value={timelineStep}
                    onChange={e => setTimelineStep(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Time (e.g. 4-6 Weeks)"
                    className="input-field py-1.5 text-[11px] rounded-lg"
                    value={timelineTime}
                    onChange={e => setTimelineTime(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveTimeline}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] cursor-pointer h-10 shrink-0"
                >
                  {timelineIndex === -1 ? 'Add Step' : 'Save'}
                </button>
              </div>
            </div>

            {/* Zoning Chips */}
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" /> Zoning Overlay Chips
              </h4>
              <div className="flex flex-wrap gap-2 min-h-[100px] p-3 bg-white border border-slate-200 rounded-xl">
                {zoningChips.map(chip => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
                  >
                    {chip}
                    <button
                      type="button"
                      onClick={() => handleRemoveChip(chip)}
                      className="text-slate-400 hover:text-slate-650 shrink-0 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {zoningChips.length === 0 && (
                  <span className="text-[11px] text-slate-400 m-auto">No zoning tags configured. Type below to add.</span>
                )}
              </div>
              <div className="border-t border-slate-200/60 pt-4">
                <input
                  type="text"
                  placeholder="Type a zone tag (e.g. Transit Priority) and press Enter"
                  className="input-field py-2 text-xs rounded-xl"
                  value={chipInput}
                  onChange={e => setChipInput(e.target.value)}
                  onKeyDown={handleAddChip}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 !py-2.5 !px-6 text-xs font-bold cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save City Laws & Overlays
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-16 text-center">
          <MapPin className="w-10 h-10 text-slate-350 mx-auto mb-3" />
          <p className="font-semibold text-slate-700">No City Selected</p>
          <p className="text-xs text-slate-400 mt-1">Please select or add a city in the top right to configure local rules.</p>
        </div>
      )}
    </div>
  );
};

export default CityLawsTab;
