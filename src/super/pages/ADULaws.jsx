import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import { dbService } from '../../services/dbService';

const ADULaws = () => {
  const [states, setStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState('');
  
  // Rules State
  const [rules, setRules] = useState([]);
  const [activeRuleIdx, setActiveRuleIdx] = useState(0);
  const [ruleValue, setRuleValue] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loaded = dbService.getStates();
    setStates(loaded);
    if (loaded.length > 0) {
      setSelectedStateId(loaded[0].id);
      loadStateRules(loaded[0]);
    }
  }, []);

  const loadStateRules = (stateObj) => {
    // If state doesn't have rules, use initial rules list
    const stateRules = stateObj.rules || [
      { title: 'Legality', value: 'Allowed', description: 'Accessory Dwelling Units are allowed statewide on all residential zones.' },
      { title: 'Size & Height', value: '1,200 sq ft max', description: 'Detached ADUs are allowed up to 1,200 sq ft. Primary home ratios apply.' },
      { title: 'Setbacks', value: '4 ft side/rear', description: 'Side and rear setbacks cannot be required to exceed 4 feet.' },
      { title: 'Parking', value: 'None required', description: 'No replacement parking required for conversions or transit zones.' },
      { title: 'Utilities', value: 'Separate optional', description: 'No utility capacity charges or connection fees allowed for conversions.' },
      { title: 'Fire Safety', value: 'No sprinklers', description: 'Fire sprinklers are only required if they are required in the primary home.' },
      { title: 'Owner Occupancy', value: 'Not required', description: 'Owner occupancy is not required for ADUs built before 2025.' },
    ];
    setRules(stateRules);
    setActiveRuleIdx(0);
    setRuleValue(stateRules[0]?.value || '');
    setRuleDesc(stateRules[0]?.description || '');
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedStateId(stateId);
    const stateObj = states.find(s => s.id === stateId);
    if (stateObj) {
      loadStateRules(stateObj);
    }
  };

  const handleSelectRule = (index) => {
    // Save current editing values first to temp state rules
    const updated = [...rules];
    updated[activeRuleIdx] = {
      ...updated[activeRuleIdx],
      value: ruleValue,
      description: ruleDesc
    };
    setRules(updated);

    // Switch rule
    setActiveRuleIdx(index);
    setRuleValue(updated[index]?.value || '');
    setRuleDesc(updated[index]?.description || '');
  };

  const handleSaveRules = (e) => {
    e.preventDefault();
    if (!selectedStateId) return;

    // Apply current input changes
    const finalRules = [...rules];
    finalRules[activeRuleIdx] = {
      ...finalRules[activeRuleIdx],
      value: ruleValue,
      description: ruleDesc
    };
    setRules(finalRules);

    // Save to database
    dbService.updateState(selectedStateId, { rules: finalRules });
    dbService.addLog(`Updated zoning laws & ordinances database for: "${states.find(s => s.id === selectedStateId)?.name}"`);
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">ADU Laws Database</h2>
          <p className="text-xs text-slate-400 mt-1">Configure legal standards, size caps, and setback exceptions per state.</p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Select State:</label>
          <select 
            className="w-full sm:w-48 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
            value={selectedStateId}
            onChange={handleStateChange}
          >
            {states.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>ADU ordinances updated successfully in Firestore database!</span>
        </div>
      )}

      {rules.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Rules Category Tab Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1.5 flex flex-col h-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 block">
              Zoning Categories
            </span>
            
            {rules.map((rule, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectRule(idx)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${
                  activeRuleIdx === idx 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-100'
                }`}
              >
                <span className="truncate">{rule.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded ml-2 shrink-0 ${
                  activeRuleIdx === idx ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  Edit
                </span>
              </button>
            ))}
          </div>

          {/* Form Editor Column */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <form onSubmit={handleSaveRules} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <FileText className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    Category: {rules[activeRuleIdx]?.title}
                  </h3>
                  <p className="text-xs text-slate-400">Configure parameters for local code enforcement checks</p>
                </div>
              </div>

              {/* Standard value */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Zoning Limit / Base Standard
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 1,200 sq ft max" 
                  className="input-field"
                  value={ruleValue}
                  onChange={e => setRuleValue(e.target.value)}
                  required
                />
              </div>

              {/* Notes and description editor */}
              <RichTextEditor 
                label="Municipal Notes & Explanations (Markdown)"
                value={ruleDesc}
                onChange={setRuleDesc}
                placeholder="Include setback calculations, square footage exceptions, local transit rules, etc."
              />

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="submit" 
                  className="btn-primary flex items-center gap-2 !py-2.5 !px-6 text-xs font-bold"
                >
                  <Save className="w-4 h-4" /> Save Category Rules
                </button>
              </div>
            </form>
          </div>

        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-16 text-center">
          <HelpCircle className="w-10 h-10 text-slate-350 mx-auto mb-3" />
          <p className="font-semibold text-slate-700">No laws found</p>
          <p className="text-xs text-slate-400 mt-1">Please select another state or add state database coverages first.</p>
        </div>
      )}
    </div>
  );
};

export default ADULaws;
