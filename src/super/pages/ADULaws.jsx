import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Calendar, 
  Landmark, 
  Layers, 
  Plus, 
  Trash2, 
  Edit2, 
  Upload, 
  X,
  MapPin
} from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import CityLawsTab from '../components/CityLawsTab';
import { dbService } from '../../services/dbService';

const ADULaws = () => {
  const [states, setStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState('');
  
  // Tab State
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'metrics' | 'grants' | 'timeline'
  
  // 1. Rules (Zoning) States
  const [rules, setRules] = useState([]);
  const [activeRuleIdx, setActiveRuleIdx] = useState(0);
  const [ruleValue, setRuleValue] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');

  // 2. Metrics & PDF States
  const [avgCost, setAvgCost] = useState('');
  const [typicalRoi, setTypicalRoi] = useState('');
  const [permitTime, setPermitTime] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  // 3. Grants States
  const [grants, setGrants] = useState([]);
  const [grantIndex, setGrantIndex] = useState(-1); // -1 for adding, >=0 for editing
  const [grantName, setGrantName] = useState('');
  const [grantValue, setGrantValue] = useState('');
  const [grantStatus, setGrantStatus] = useState('Active');
  const [grantDesc, setGrantDesc] = useState('');

  // 4. Timeline States
  const [timeline, setTimeline] = useState([]);
  const [timelineIndex, setTimelineIndex] = useState(-1); // -1 for adding, >=0 for editing
  const [timelineYear, setTimelineYear] = useState('');
  const [timelineTitle, setTimelineTitle] = useState('');
  const [timelineDesc, setTimelineDesc] = useState('');
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loaded = dbService.getStates();
    setStates(loaded);
    if (loaded.length > 0) {
      setSelectedStateId(loaded[0].id);
      loadStateData(loaded[0]);
    }
  }, []);

  const loadStateData = (stateObj) => {
    // 1. Rules
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

    // 2. Metrics & PDF
    setAvgCost(stateObj.avgCost || '$180,000 - $250,000');
    setTypicalRoi(stateObj.typicalRoi || '8% - 12%');
    setPermitTime(stateObj.permitTime || '2 - 6 Months');
    setPdfUrl(stateObj.pdfUrl || '');

    // 3. Grants
    setGrants(stateObj.grants || []);

    // 4. Timeline
    setTimeline(stateObj.timeline || []);
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedStateId(stateId);
    const stateObj = states.find(s => s.id === stateId);
    if (stateObj) {
      loadStateData(stateObj);
      resetGrantForm();
      resetTimelineForm();
    }
  };

  const resetGrantForm = () => {
    setGrantIndex(-1);
    setGrantName('');
    setGrantValue('');
    setGrantStatus('Active');
    setGrantDesc('');
  };

  const resetTimelineForm = () => {
    setTimelineIndex(-1);
    setTimelineYear('');
    setTimelineTitle('');
    setTimelineDesc('');
  };

  // --- 1. Rules (Zoning) Handlers ---
  const handleSelectRule = (index) => {
    const updated = [...rules];
    updated[activeRuleIdx] = {
      ...updated[activeRuleIdx],
      value: ruleValue,
      description: ruleDesc
    };
    setRules(updated);

    setActiveRuleIdx(index);
    setRuleValue(updated[index]?.value || '');
    setRuleDesc(updated[index]?.description || '');
  };

  const handleSaveRules = (e) => {
    e.preventDefault();
    if (!selectedStateId) return;

    const finalRules = [...rules];
    finalRules[activeRuleIdx] = {
      ...finalRules[activeRuleIdx],
      value: ruleValue,
      description: ruleDesc
    };
    setRules(finalRules);

    dbService.updateState(selectedStateId, { rules: finalRules });
    dbService.addLog(`Updated zoning laws categories for state: "${states.find(s => s.id === selectedStateId)?.name}"`);
    
    // Refresh local list cache
    const fresh = dbService.getStates();
    setStates(fresh);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // --- 2. Metrics & PDF Handlers ---
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('File is too large. Max size allowed is 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPdfUrl(reader.result);
      alert('PDF uploaded successfully! Click "Save Page Metrics" to persist changes.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMetrics = (e) => {
    e.preventDefault();
    if (!selectedStateId) return;

    const updatedFields = {
      avgCost,
      typicalRoi,
      permitTime,
      pdfUrl
    };

    dbService.updateState(selectedStateId, updatedFields);
    dbService.addLog(`Updated financials and PDF reference for state: "${states.find(s => s.id === selectedStateId)?.name}"`);

    const fresh = dbService.getStates();
    setStates(fresh);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // --- 3. Grants Program Handlers ---
  const handleSaveGrant = (e) => {
    e.preventDefault();
    if (!grantName || !grantValue) return;

    const newGrant = {
      name: grantName.trim(),
      value: grantValue.trim(),
      status: grantStatus,
      desc: grantDesc.trim()
    };

    let updatedGrants = [...grants];
    if (grantIndex === -1) {
      updatedGrants.push(newGrant);
    } else {
      updatedGrants[grantIndex] = newGrant;
    }

    setGrants(updatedGrants);
    dbService.updateState(selectedStateId, { grants: updatedGrants });
    dbService.addLog(`Updated Grants programs for state: "${states.find(s => s.id === selectedStateId)?.name}"`);

    const fresh = dbService.getStates();
    setStates(fresh);

    resetGrantForm();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleEditGrant = (idx) => {
    const target = grants[idx];
    if (target) {
      setGrantIndex(idx);
      setGrantName(target.name);
      setGrantValue(target.value);
      setGrantStatus(target.status || 'Active');
      setGrantDesc(target.desc || '');
    }
  };

  const handleDeleteGrant = (idx) => {
    if (window.confirm("Are you sure you want to delete this grant program?")) {
      const updated = grants.filter((_, i) => i !== idx);
      setGrants(updated);
      dbService.updateState(selectedStateId, { grants: updated });
      dbService.addLog(`Deleted a Grant program for state: "${states.find(s => s.id === selectedStateId)?.name}"`);
      
      const fresh = dbService.getStates();
      setStates(fresh);
      resetGrantForm();
    }
  };

  // --- 4. Legislative Timeline Handlers ---
  const handleSaveTimeline = (e) => {
    e.preventDefault();
    if (!timelineYear || !timelineTitle || !timelineDesc) return;

    const newMilestone = {
      year: timelineYear.trim(),
      title: timelineTitle.trim(),
      desc: timelineDesc.trim()
    };

    let updatedTimeline = [...timeline];
    if (timelineIndex === -1) {
      updatedTimeline.push(newMilestone);
    } else {
      updatedTimeline[timelineIndex] = newMilestone;
    }

    setTimeline(updatedTimeline);
    dbService.updateState(selectedStateId, { timeline: updatedTimeline });
    dbService.addLog(`Updated Legislative Timeline for state: "${states.find(s => s.id === selectedStateId)?.name}"`);

    const fresh = dbService.getStates();
    setStates(fresh);

    resetTimelineForm();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleEditTimeline = (idx) => {
    const target = timeline[idx];
    if (target) {
      setTimelineIndex(idx);
      setTimelineYear(target.year);
      setTimelineTitle(target.title);
      setTimelineDesc(target.desc || '');
    }
  };

  const handleDeleteTimeline = (idx) => {
    if (window.confirm("Are you sure you want to delete this timeline milestone?")) {
      const updated = timeline.filter((_, i) => i !== idx);
      setTimeline(updated);
      dbService.updateState(selectedStateId, { timeline: updated });
      dbService.addLog(`Deleted a timeline milestone for state: "${states.find(s => s.id === selectedStateId)?.name}"`);
      
      const fresh = dbService.getStates();
      setStates(fresh);
      resetTimelineForm();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">ADU Laws Database</h2>
          <p className="text-xs text-slate-400 mt-1">Configure legal standards, financials, downloads, grants, and timelines per state.</p>
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
          <span>ADU laws database synchronized successfully!</span>
        </div>
      )}

      {/* Tabs Menu Navigation */}
      <div className="flex border-b border-slate-200 gap-6 bg-white px-6 pt-4 rounded-t-2xl border-x border-t border-slate-200 overflow-x-auto">
        {[
          { id: 'rules', label: 'Zoning Rules', icon: FileText },
          { id: 'cities', label: 'City Laws', icon: MapPin },
          { id: 'metrics', label: 'Metrics & PDF', icon: Layers },
          { id: 'grants', label: 'Grant Programs', icon: Landmark },
          { id: 'timeline', label: 'Legislation Timeline', icon: Calendar }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all uppercase tracking-wider whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-600 text-slate-800'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4 text-secondary shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Workspaces */}
      <div>
        {/* Workspace: City Laws */}
        {activeTab === 'cities' && (
          <CityLawsTab 
            stateId={selectedStateId} 
            onSaveSuccess={() => {
              const fresh = dbService.getStates();
              setStates(fresh);
            }} 
          />
        )}

        {/* Workspace 1: Zoning Rules (Existing categories list) */}
        {activeTab === 'rules' && (
          rules.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Categories Tab Selector */}
              <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-5 shadow-xs space-y-1.5 flex flex-col h-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 block">
                  Zoning Categories
                </span>
                
                {rules.map((rule, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectRule(idx)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
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
              <div className="lg:col-span-2 bg-white rounded-b-2xl lg:rounded-bl-none border-x lg:border-l-0 border-b border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
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

                  <RichTextEditor 
                    label="Municipal Notes & Explanations (Markdown)"
                    value={ruleDesc}
                    onChange={setRuleDesc}
                    placeholder="Include setback calculations, square footage exceptions, local transit rules, etc."
                  />

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <button 
                      type="submit" 
                      className="btn-primary flex items-center gap-2 !py-2.5 !px-6 text-xs font-bold cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Save Category Rules
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-b-2xl p-16 text-center">
              <HelpCircle className="w-10 h-10 text-slate-350 mx-auto mb-3" />
              <p className="font-semibold text-slate-700">No laws found</p>
              <p className="text-xs text-slate-400 mt-1">Please select another state or add state database coverages first.</p>
            </div>
          )
        )}

        {/* Workspace 2: Metrics & PDF (Financials, ROI, download button setup) */}
        {activeTab === 'metrics' && (
          <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <Layers className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <h3 className="font-bold text-slate-800 text-base">State Page Metrics & PDF Downloads</h3>
                <p className="text-xs text-slate-400">Configure financial statistics cards and upload handbooks for the client detail page.</p>
              </div>
            </div>
            
            <form onSubmit={handleSaveMetrics} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Average Cost ($)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. $180,000 - $250,000" 
                    className="input-field"
                    value={avgCost}
                    onChange={e => setAvgCost(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Typical ROI (%)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 8% - 12%" 
                    className="input-field"
                    value={typicalRoi}
                    onChange={e => setTypicalRoi(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Permit Time Frame
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2 - 6 Months" 
                    className="input-field"
                    value={permitTime}
                    onChange={e => setPermitTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* PDF Settings */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  ADU Laws Reference PDF Handbook
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Direct PDF URL Link
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. https://example.com/california-adu-handbook.pdf" 
                      className="input-field"
                      value={pdfUrl}
                      onChange={e => setPdfUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Or Upload PDF Document
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-250 hover:bg-slate-100/50 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-colors w-full">
                        <Upload className="w-4 h-4 text-secondary shrink-0" />
                        <span>Upload File</span>
                        <input 
                          type="file" 
                          accept="application/pdf"
                          className="hidden"
                          onChange={handlePdfUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {pdfUrl && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-850 flex items-center justify-between">
                    <span className="truncate pr-4 font-semibold">Active PDF Attachment: {pdfUrl.substring(0, 70)}...</span>
                    <button 
                      type="button" 
                      onClick={() => setPdfUrl('')}
                      className="text-rose-500 font-bold hover:underline shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button type="submit" className="btn-primary flex items-center gap-2 !py-2.5 !px-6 text-xs font-bold cursor-pointer">
                  <Save className="w-4 h-4" /> Save Page Metrics
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Workspace 3: Grants programs */}
        {activeTab === 'grants' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Grants List panel */}
            <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-5 shadow-xs space-y-4 flex flex-col h-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 block">
                Grants Listed ({grants.length})
              </span>
              
              <div className="space-y-2 overflow-y-auto max-h-96 pr-1">
                {grants.map((grant, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2 hover:bg-slate-100/40 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs">{grant.name}</h4>
                        <p className="text-[10px] text-emerald-600 font-extrabold mt-0.5">Value: {grant.value}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        grant.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {grant.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{grant.desc}</p>
                    
                    <div className="flex justify-end gap-1.5 pt-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditGrant(idx)}
                        className="p-1 bg-white border border-slate-200 hover:border-slate-350 text-slate-500 hover:text-slate-850 rounded-lg transition-colors cursor-pointer"
                        title="Edit Grant"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteGrant(idx)}
                        className="p-1 bg-white border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Grant"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {grants.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                    <Landmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">No grant programs</p>
                    <p className="text-[10px] text-slate-400">Fill the form to list dynamic incentive grants.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Grant Form panel */}
            <div className="lg:col-span-2 bg-white rounded-b-2xl lg:rounded-bl-none border-x lg:border-l-0 border-b border-slate-200 p-6 sm:p-8 shadow-xs">
              <form onSubmit={handleSaveGrant} className="space-y-6 max-w-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <Landmark className="w-6 h-6 text-emerald-500 shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">
                        {grantIndex === -1 ? 'Add New Grant Program' : 'Edit Grant Program'}
                      </h3>
                      <p className="text-xs text-slate-400">Setup governmental assistance or fee-waiver overlays</p>
                    </div>
                  </div>
                  {grantIndex !== -1 && (
                    <button 
                      type="button" 
                      onClick={resetGrantForm} 
                      className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Grant Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. CalHFA Pre-development Grant" 
                      className="input-field py-2.5 text-xs rounded-xl"
                      value={grantName}
                      onChange={e => setGrantName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Grant Value / Cap
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. $40,000 Assistance" 
                      className="input-field py-2.5 text-xs rounded-xl"
                      value={grantValue}
                      onChange={e => setGrantValue(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Program Active Status
                  </label>
                  <select 
                    className="input-field py-2.5 text-xs rounded-xl"
                    value={grantStatus}
                    onChange={e => setGrantStatus(e.target.value)}
                  >
                    <option value="Active">Active (Currently open to applications)</option>
                    <option value="Suspended">Suspended (Temporarily inactive / out of funds)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Description & Guidelines
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Describe program qualifications, pre-requisites, application steps..."
                    className="input-field py-2.5 text-xs rounded-xl"
                    value={grantDesc}
                    onChange={e => setGrantDesc(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="submit" className="btn-primary flex items-center gap-2 !py-2.5 !px-6 text-xs font-bold cursor-pointer">
                    <Plus className="w-4 h-4" /> {grantIndex === -1 ? 'Add Grant Program' : 'Save Grant Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Workspace 4: Legislative timeline */}
        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Timeline Milestones list */}
            <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-5 shadow-xs space-y-4 flex flex-col h-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 block">
                Legislative Timeline ({timeline.length})
              </span>
              
              <div className="space-y-2 overflow-y-auto max-h-96 pr-1">
                {timeline.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2 hover:bg-slate-100/40 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs">{item.title}</h4>
                        <span className="text-[10px] text-secondary font-black block mt-0.5">Year: {item.year}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{item.desc}</p>
                    
                    <div className="flex justify-end gap-1.5 pt-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditTimeline(idx)}
                        className="p-1 bg-white border border-slate-200 hover:border-slate-350 text-slate-500 hover:text-slate-850 rounded-lg transition-colors cursor-pointer"
                        title="Edit Milestone"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTimeline(idx)}
                        className="p-1 bg-white border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {timeline.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                    <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">No timeline items</p>
                    <p className="text-[10px] text-slate-400">Fill the form to list legislative milestone logs.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Form panel */}
            <div className="lg:col-span-2 bg-white rounded-b-2xl lg:rounded-bl-none border-x lg:border-l-0 border-b border-slate-200 p-6 sm:p-8 shadow-xs">
              <form onSubmit={handleSaveTimeline} className="space-y-6 max-w-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-emerald-500 shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">
                        {timelineIndex === -1 ? 'Add Legislative Milestone' : 'Edit Legislative Milestone'}
                      </h3>
                      <p className="text-xs text-slate-400">Document local and state ADU codes revisions timeline</p>
                    </div>
                  </div>
                  {timelineIndex !== -1 && (
                    <button 
                      type="button" 
                      onClick={resetTimelineForm} 
                      className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Year
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2024" 
                      className="input-field py-2.5 text-xs rounded-xl"
                      value={timelineYear}
                      onChange={e => setTimelineYear(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Milestone Bill / Title
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. AB 1033 - Separate Condos Option" 
                      className="input-field py-2.5 text-xs rounded-xl"
                      value={timelineTitle}
                      onChange={e => setTimelineTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Impact Description
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Describe legal changes and how it impacts homeowners building ADUs..."
                    className="input-field py-2.5 text-xs rounded-xl"
                    value={timelineDesc}
                    onChange={e => setTimelineDesc(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="submit" className="btn-primary flex items-center gap-2 !py-2.5 !px-6 text-xs font-bold cursor-pointer">
                    <Plus className="w-4 h-4" /> {timelineIndex === -1 ? 'Add Milestone' : 'Save Milestone Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ADULaws;
