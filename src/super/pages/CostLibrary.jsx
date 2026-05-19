import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CreditCard, Save, CheckCircle2 } from 'lucide-react';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import { dbService } from '../../services/dbService';

const CostLibrary = () => {
  const [costs, setCosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCost, setEditingCost] = useState(null);

  // Form Fields
  const [stateName, setStateName] = useState('California');
  const [aduType, setAduType] = useState('Detached');
  const [minSize, setMinSize] = useState(400);
  const [maxSize, setMaxSize] = useState(1000);
  const [avgCost, setAvgCost] = useState(240000);
  const [pricePerSqFt, setPricePerSqFt] = useState(320);
  const [constructionCost, setConstructionCost] = useState(190000);
  const [permitCost, setPermitCost] = useState(8000);
  const [designCost, setDesignCost] = useState(12000);
  const [utilityCost, setUtilityCost] = useState(5000);
  const [impactCost, setImpactCost] = useState(2500);

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setCosts(dbService.getCosts());
  }, []);

  const openAddModal = () => {
    setEditingCost(null);
    setStateName('California');
    setAduType('Detached');
    setMinSize(400);
    setMaxSize(1000);
    setAvgCost(240000);
    setPricePerSqFt(320);
    setConstructionCost(190000);
    setPermitCost(8000);
    setDesignCost(12000);
    setUtilityCost(5000);
    setImpactCost(2500);
    setIsModalOpen(true);
  };

  const openEditModal = (cost) => {
    setEditingCost(cost);
    setStateName(cost.state);
    setAduType(cost.type);
    setMinSize(cost.minSize || 400);
    setMaxSize(cost.maxSize || 1000);
    setAvgCost(cost.avgCost);
    setPricePerSqFt(cost.pricePerSqFt);
    setConstructionCost(cost.constructionCost || Math.round(cost.avgCost * 0.85));
    setPermitCost(cost.permitCost || Math.round(cost.avgCost * 0.03));
    setDesignCost(cost.designCost || Math.round(cost.avgCost * 0.05));
    setUtilityCost(cost.utilityCost || Math.round(cost.avgCost * 0.02));
    setImpactCost(cost.impactCost || Math.round(cost.avgCost * 0.01));
    setIsModalOpen(true);
  };

  const handleSaveCost = (e) => {
    e.preventDefault();

    const payload = {
      state: stateName,
      type: aduType,
      minSize: Number(minSize),
      maxSize: Number(maxSize),
      avgCost: Number(avgCost),
      pricePerSqFt: Number(pricePerSqFt),
      constructionCost: Number(constructionCost),
      permitCost: Number(permitCost),
      designCost: Number(designCost),
      utilityCost: Number(utilityCost),
      impactCost: Number(impactCost)
    };

    if (editingCost) {
      // Update
      const updated = dbService.updateCost(editingCost.id, payload);
      setCosts(costs.map(c => c.id === editingCost.id ? updated : c));
      dbService.addLog(`Updated cost estimate metrics for: ${stateName} (${aduType})`);
    } else {
      // Create
      const added = dbService.addCost(payload);
      setCosts([...costs, added]);
      dbService.addLog(`Created cost estimate metrics for: ${stateName} (${aduType})`);
    }

    setSaveSuccess(true);
    setIsModalOpen(false);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteCost = (id, state, type) => {
    if (window.confirm(`Are you sure you want to delete the cost metrics for ${state} (${type})?`)) {
      dbService.deleteCost(id);
      setCosts(costs.filter(c => c.id !== id));
      dbService.addLog(`Deleted cost estimate metrics for: ${state} (${type})`);
    }
  };

  const tableHeaders = [
    { label: "State / Region" },
    { label: "ADU Design" },
    { label: "Cost Ranges" },
    { label: "Avg. Cost" },
    { label: "Sq Ft Rate" },
    { label: "Actions", className: "text-right" }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Cost Library Management</h2>
          <p className="text-xs text-slate-400 mt-1">Manage project budgets, permit cost metrics, and build cost indices by state.</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-xs font-bold shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Cost Metric
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Cost library metrics synchronized!</span>
        </div>
      )}

      {/* Main Table View */}
      <AdminTable 
        headers={tableHeaders}
        data={costs}
        searchPlaceholder="Search by state name..."
        searchField="state"
        renderRow={(cost) => (
          <tr key={cost.id} className="hover:bg-slate-50/50">
            <td className="px-6 py-4 font-bold text-slate-800">{cost.state}</td>
            <td className="px-6 py-4 font-semibold text-slate-600 capitalize">{cost.type}</td>
            <td className="px-6 py-4 text-xs font-bold text-slate-400">
              {cost.minSize || 400} - {cost.maxSize || 1000} sq ft
            </td>
            <td className="px-6 py-4 font-bold text-emerald-600">
              ${cost.avgCost.toLocaleString()}
            </td>
            <td className="px-6 py-4 font-bold text-slate-700">
              ${cost.pricePerSqFt}/sq ft
            </td>
            <td className="px-6 py-4 text-right flex justify-end gap-2">
              <button 
                onClick={() => openEditModal(cost)}
                className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg hover:text-slate-800 transition-colors"
                title="Edit Cost breakdown"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDeleteCost(cost.id, cost.state, cost.type)}
                className="p-1.5 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                title="Delete Metric"
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
        title={editingCost ? "Edit regional Cost metrics" : "Create regional Cost metrics"}
        size="lg"
      >
        <form onSubmit={handleSaveCost} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">State Name</label>
              <input 
                type="text" 
                placeholder="e.g. California" 
                className="input-field"
                value={stateName}
                onChange={e => setStateName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ADU Design type</label>
              <select 
                className="input-field"
                value={aduType}
                onChange={e => setAduType(e.target.value)}
              >
                <option value="Detached">Detached (Free Standing)</option>
                <option value="Attached">Attached (Addition)</option>
                <option value="Garage Conversion">Garage Conversion</option>
                <option value="Junior ADU">Junior ADU (JADU)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Min. Size cap (sq ft)</label>
              <input 
                type="number" 
                className="input-field"
                value={minSize}
                onChange={e => setMinSize(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Max. Size cap (sq ft)</label>
              <input 
                type="number" 
                className="input-field"
                value={maxSize}
                onChange={e => setMaxSize(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Avg. Project Budget ($)</label>
              <input 
                type="number" 
                className="input-field"
                value={avgCost}
                onChange={e => setAvgCost(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Avg. Sq Ft Build Rate ($)</label>
              <input 
                type="number" 
                className="input-field"
                value={pricePerSqFt}
                onChange={e => setPricePerSqFt(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Detailed Fee Breakdowns */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fee breakdowns</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Construction Cost ($)</label>
                <input 
                  type="number" 
                  className="input-field !py-2 text-xs"
                  value={constructionCost}
                  onChange={e => setConstructionCost(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Permit / Plan Check ($)</label>
                <input 
                  type="number" 
                  className="input-field !py-2 text-xs"
                  value={permitCost}
                  onChange={e => setPermitCost(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Architecture & Design ($)</label>
                <input 
                  type="number" 
                  className="input-field !py-2 text-xs"
                  value={designCost}
                  onChange={e => setDesignCost(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Utility Connection ($)</label>
                <input 
                  type="number" 
                  className="input-field !py-2 text-xs"
                  value={utilityCost}
                  onChange={e => setUtilityCost(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Impact Fees ($)</label>
                <input 
                  type="number" 
                  className="input-field !py-2 text-xs"
                  value={impactCost}
                  onChange={e => setImpactCost(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary !py-2 !px-5 text-xs font-bold">Cancel</button>
            <button type="submit" className="btn-primary !py-2 !px-5 text-xs font-bold">Save Cost Index</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default CostLibrary;
