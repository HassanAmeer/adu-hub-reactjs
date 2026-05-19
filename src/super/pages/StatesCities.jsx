import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Globe, Building2, UploadCloud, CheckCircle2, ChevronRight, X, AlertTriangle } from 'lucide-react';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import { dbService } from '../../services/dbService';

const StatesCities = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  
  // State Form states
  const [stateName, setStateName] = useState('');
  const [stateStatus, setStateStatus] = useState('Allowed');
  
  // City Form states
  const [cityName, setCityName] = useState('');
  
  // Bulk Upload state
  const [bulkJson, setBulkJson] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState(false);

  useEffect(() => {
    setStates(dbService.getStates());
  }, []);

  const handleCreateState = (e) => {
    e.preventDefault();
    if (!stateName) return;
    const added = dbService.addState({ name: stateName, status: stateStatus });
    setStates([...states, added]);
    dbService.addLog(`Created State database entries for: "${stateName}"`);
    setStateName('');
    setIsStateModalOpen(false);
  };

  const handleDeleteState = (id, name) => {
    if (window.confirm(`Are you sure you want to delete all zoning databases for ${name}? This cannot be undone.`)) {
      dbService.deleteState(id);
      setStates(states.filter(s => s.id !== id));
      dbService.addLog(`Deleted state database entries: "${name}"`);
      if (selectedState && selectedState.id === id) {
        setSelectedState(null);
      }
    }
  };

  const handleToggleStateStatus = (stateItem) => {
    const nextStatus = stateItem.status === 'Allowed' ? 'Restricted' : 'Allowed';
    const updated = dbService.updateState(stateItem.id, { status: nextStatus });
    setStates(states.map(s => s.id === stateItem.id ? updated : s));
    dbService.addLog(`Toggled baseline ADU permission to ${nextStatus} for ${stateItem.name}`);
    if (selectedState && selectedState.id === stateItem.id) {
      setSelectedState(updated);
    }
  };

  const handleAddCity = (e) => {
    e.preventDefault();
    if (!cityName || !selectedState) return;
    
    // Check if city already exists in state
    const currentCities = selectedState.cities || [];
    if (currentCities.some(c => c.toLowerCase() === cityName.trim().toLowerCase())) {
      alert("City already listed under this state.");
      return;
    }

    const updatedCities = [...currentCities, cityName.trim()];
    const updatedState = dbService.updateState(selectedState.id, { cities: updatedCities });
    
    setStates(states.map(s => s.id === selectedState.id ? updatedState : s));
    setSelectedState(updatedState);
    dbService.addLog(`Added City "${cityName}" to state database of ${selectedState.name}`);
    setCityName('');
    setIsCityModalOpen(false);
  };

  const handleDeleteCity = (cityToDelete) => {
    if (!selectedState) return;
    if (window.confirm(`Are you sure you want to delete ${cityToDelete} from ${selectedState.name}?`)) {
      const updatedCities = (selectedState.cities || []).filter(c => c !== cityToDelete);
      const updatedState = dbService.updateState(selectedState.id, { cities: updatedCities });
      
      setStates(states.map(s => s.id === selectedState.id ? updatedState : s));
      setSelectedState(updatedState);
      dbService.addLog(`Removed City "${cityToDelete}" from state database of ${selectedState.name}`);
    }
  };

  const handleBulkUpload = (e) => {
    e.preventDefault();
    setBulkError('');
    setBulkSuccess(false);
    
    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) {
        throw new Error("Bulk data must be a JSON array of state objects.");
      }

      // Basic validation
      parsed.forEach((item, index) => {
        if (!item.name) {
          throw new Error(`Item at index ${index} is missing "name" field.`);
        }
      });

      // Merge and save
      const currentStates = [...states];
      parsed.forEach(newState => {
        const existingIdx = currentStates.findIndex(s => s.name.toLowerCase() === newState.name.toLowerCase());
        
        if (existingIdx !== -1) {
          // Merge cities
          const mergedCities = Array.from(new Set([
            ...(currentStates[existingIdx].cities || []),
            ...(newState.cities || [])
          ]));
          currentStates[existingIdx] = dbService.updateState(currentStates[existingIdx].id, {
            status: newState.status || currentStates[existingIdx].status,
            cities: mergedCities
          });
        } else {
          // Add as new state
          const added = dbService.addState({
            name: newState.name,
            status: newState.status || 'Allowed',
            cities: newState.cities || []
          });
          currentStates.push(added);
        }
      });

      setStates(currentStates);
      dbService.addLog(`Dispatched bulk JSON upload containing ${parsed.length} state schemas`);
      setBulkSuccess(true);
      setBulkJson('');
      setTimeout(() => {
        setIsBulkModalOpen(false);
        setBulkSuccess(false);
      }, 1500);

    } catch (err) {
      setBulkError(err.message || "Failed to parse JSON. Please check syntax.");
    }
  };

  const tableHeaders = [
    { label: "State Code" },
    { label: "State Name" },
    { label: "Policy Status" },
    { label: "Cities Listed" },
    { label: "Actions", className: "text-right" }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">States & Cities Management</h2>
          <p className="text-xs text-slate-400 mt-1">Add covered locations, configure base rules policy, and upload bulk data.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="btn-secondary !py-2 !px-4 text-xs font-bold flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" /> Bulk Import
          </button>
          <button 
            onClick={() => setIsStateModalOpen(true)}
            className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add State
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: States list */}
        <div className="xl:col-span-2 space-y-6">
          <AdminTable 
            headers={tableHeaders}
            data={states}
            searchPlaceholder="Search states by name..."
            searchField="name"
            renderRow={(s) => (
              <tr 
                key={s.id} 
                className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                  selectedState && selectedState.id === s.id ? 'bg-emerald-50/20 border-l-4 border-l-emerald-500' : ''
                }`}
                onClick={() => setSelectedState(s)}
              >
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg font-mono text-xs font-bold">
                    {s.id.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">{s.name}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStateStatus(s);
                    }}
                    className={`badge font-sans cursor-pointer ${
                      s.status === 'Allowed' ? 'badge-allowed' : 'badge-restricted'
                    }`}
                  >
                    {s.status}
                  </button>
                </td>
                <td className="px-6 py-4 text-slate-500 font-semibold text-xs">
                  {s.cities?.length || 0} Cities monitored
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => setSelectedState(s)}
                    className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg hover:text-slate-800 transition-colors"
                    title="Manage Cities"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteState(s.id, s.name)}
                    className="p-1.5 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete State"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )}
          />
        </div>

        {/* Right Side: Selected State Cities Detail */}
        <div className="space-y-6">
          {selectedState ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 text-lg">{selectedState.name}</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono font-bold">
                      {selectedState.id.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Manage local cities and municipal rules</p>
                </div>
                <button 
                  onClick={() => setIsCityModalOpen(true)}
                  className="btn-primary !py-1.5 !px-3 text-[10px] font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add City
                </button>
              </div>

              {/* Cities List */}
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {(selectedState.cities || []).length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">No cities listed yet</p>
                    <p className="text-[10px] text-slate-400">Click Add City to include municipal overlays.</p>
                  </div>
                ) : (
                  (selectedState.cities || []).map((city, idx) => (
                    <div 
                      key={idx} 
                      className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                    >
                      <span className="text-sm font-semibold text-slate-700">{city}</span>
                      <button 
                        onClick={() => handleDeleteCity(city)}
                        className="p-1 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-lg transition-colors"
                        title="Remove City"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-12 text-center">
              <Globe className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-700">Select a State</p>
              <p className="text-[10px] text-slate-400 mt-1">Select a state from the table list to manage its local city zoning overrides.</p>
            </div>
          )}
        </div>

      </div>

      {/* --- MODAL WINDOWS --- */}

      {/* 1. Add State Modal */}
      <AdminModal isOpen={isStateModalOpen} onClose={() => setIsStateModalOpen(false)} title="Add New State covered">
        <form onSubmit={handleCreateState} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">State Name</label>
            <input 
              type="text" 
              placeholder="e.g. Arizona" 
              className="input-field"
              value={stateName}
              onChange={e => setStateName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Baseline ADU Permission</label>
            <select 
              className="input-field"
              value={stateStatus}
              onChange={e => setStateStatus(e.target.value)}
            >
              <option value="Allowed">Allowed (Statewide standard mandate)</option>
              <option value="Restricted">Restricted (Dependent on local ordinances)</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsStateModalOpen(false)} className="btn-secondary !py-2 !px-5 text-xs font-bold">Cancel</button>
            <button type="submit" className="btn-primary !py-2 !px-5 text-xs font-bold">Create State</button>
          </div>
        </form>
      </AdminModal>

      {/* 2. Add City Modal */}
      <AdminModal isOpen={isCityModalOpen} onClose={() => setIsCityModalOpen(false)} title={`Add City under ${selectedState?.name}`}>
        <form onSubmit={handleAddCity} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">City Name</label>
            <input 
              type="text" 
              placeholder="e.g. Oceanside" 
              className="input-field"
              value={cityName}
              onChange={e => setCityName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsCityModalOpen(false)} className="btn-secondary !py-2 !px-5 text-xs font-bold">Cancel</button>
            <button type="submit" className="btn-primary !py-2 !px-5 text-xs font-bold">Add City</button>
          </div>
        </form>
      </AdminModal>

      {/* 3. Bulk Upload Modal */}
      <AdminModal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} title="Bulk Upload State Databases" size="lg">
        <form onSubmit={handleBulkUpload} className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">JSON Payload Schema</label>
              <span className="text-[10px] text-emerald-500 font-bold">Validation Active</span>
            </div>
            <textarea 
              rows={8}
              placeholder={`[\n  { "name": "Arizona", "status": "Allowed", "cities": ["Phoenix", "Tucson"] },\n  { "name": "Colorado", "status": "Restricted", "cities": ["Denver", "Boulder"] }\n]`}
              className="input-field font-mono text-xs"
              value={bulkJson}
              onChange={e => setBulkJson(e.target.value)}
              required
            />
          </div>

          {bulkError && (
            <div className="bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-100 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
              <span>{bulkError}</span>
            </div>
          )}

          {bulkSuccess && (
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <span>Bulk data parsed and merged successfully!</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsBulkModalOpen(false)} className="btn-secondary !py-2 !px-5 text-xs font-bold">Cancel</button>
            <button type="submit" className="btn-primary !py-2 !px-5 text-xs font-bold">Execute Parse</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default StatesCities;
