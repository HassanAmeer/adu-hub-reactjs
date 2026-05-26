import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, X,
  ShieldAlert, CheckCircle2, Clock, ListChecks, AlertTriangle
} from 'lucide-react';
import { dbService } from '../../services/dbService';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';

const StepsManager = () => {
  const [steps, setSteps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [typicalTimeline, setTypicalTimeline] = useState('');
  const [checklist, setChecklist] = useState(['']);
  const [commonRejectionReasons, setCommonRejectionReasons] = useState(['']);

  useEffect(() => {
    setSteps(dbService.getBuildSteps());
  }, []);

  const openAddModal = () => {
    setEditingStep(null);
    setTitle('');
    setDescription('');
    setTypicalTimeline('');
    setChecklist(['']);
    setCommonRejectionReasons(['']);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (step) => {
    setEditingStep(step);
    setTitle(step.title);
    setDescription(step.description || '');
    setTypicalTimeline(step.typicalTimeline || '');
    setChecklist(step.checklist?.length ? step.checklist : ['']);
    setCommonRejectionReasons(step.commonRejectionReasons?.length ? step.commonRejectionReasons : ['']);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleArrayItemChange = (setter, index, value) => {
    setter(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addArrayItem = (setter) => {
    setter(prev => [...prev, '']);
  };

  const removeArrayItem = (setter, index) => {
    setter(prev => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.length ? updated : [''];
    });
  };

  const handleSaveStep = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please provide both title and description.');
      return;
    }

    const cleanArray = (arr) => arr.map(s => s.trim()).filter(Boolean);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        typicalTimeline: typicalTimeline.trim(),
        checklist: cleanArray(checklist),
        commonRejectionReasons: cleanArray(commonRejectionReasons)
      };

      if (editingStep) {
        const updated = dbService.updateBuildStep(editingStep.id, payload);
        if (updated) {
          setSteps(prev => prev.map(s => s.id === editingStep.id ? updated : s));
          setSuccessMsg('Build step updated successfully!');
        }
      } else {
        const added = dbService.addBuildStep(payload);
        setSteps(prev => [...prev, added]);
        setSuccessMsg('New build step added successfully!');
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to save step.');
    }
  };

  const handleDeleteStep = (id, stepTitle) => {
    if (window.confirm(`Permanently delete step: "${stepTitle}"?`)) {
      try {
        dbService.deleteBuildStep(id);
        setSteps(prev => prev.filter(s => s.id !== Number(id)));
        setSuccessMsg('Build step deleted.');
        setTimeout(() => setSuccessMsg(''), 4500);
      } catch (err) {
        setErrorMsg('Failed to delete step.');
      }
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...steps];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setSteps(updated);
    dbService.saveBuildSteps(updated);
    dbService.addLog('Reordered build steps');
  };

  const handleMoveDown = (index) => {
    if (index === steps.length - 1) return;
    const updated = [...steps];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setSteps(updated);
    dbService.saveBuildSteps(updated);
    dbService.addLog('Reordered build steps');
  };

  const tableHeaders = [
    { label: "#" },
    { label: "Step Details" },
    { label: "Timeline" },
    { label: "Checklist" },
    { label: "Rejection Reasons" },
    { label: "Actions", className: "text-right" }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">How To Build</h2>
          <p className="text-xs text-slate-400 mt-1">Manage the "How to Build" steps shown on the landing page.</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary !py-2.5 !px-5 text-xs font-bold flex items-center justify-center gap-2 text-white shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" /> Add New Step
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl border border-emerald-200 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-200 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
          {errorMsg}
        </div>
      )}

      <AdminTable
        headers={tableHeaders}
        data={steps}
        searchPlaceholder="Search steps by title..."
        searchField="title"
        renderRow={(step, index) => (
          <tr key={step.id} className="hover:bg-slate-50/50">
            <td className="px-6 py-4 w-16 align-top">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move up"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </button>
                <span className="text-xs font-bold text-slate-400 w-4 text-center">{index + 1}</span>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === steps.length - 1}
                  className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move down"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-xs font-bold text-secondary shrink-0 mt-0.5">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm">{step.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              {step.typicalTimeline ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/50">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {step.typicalTimeline}
                </span>
              ) : (
                <span className="text-xs text-slate-300">—</span>
              )}
            </td>
            <td className="px-6 py-4">
              {step.checklist?.length ? (
                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                  {step.checklist.slice(0, 2).map((item, i) => (
                    <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold truncate max-w-[180px]">
                      {item}
                    </span>
                  ))}
                  {step.checklist.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-bold">+{step.checklist.length - 2} more</span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-slate-300">—</span>
              )}
            </td>
            <td className="px-6 py-4">
              {step.commonRejectionReasons?.length ? (
                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                  {step.commonRejectionReasons.slice(0, 2).map((item, i) => (
                    <span key={i} className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded font-semibold truncate max-w-[180px]">
                      {item}
                    </span>
                  ))}
                  {step.commonRejectionReasons.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-bold">+{step.commonRejectionReasons.length - 2} more</span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-slate-300">—</span>
              )}
            </td>
            <td className="px-6 py-4 text-right flex justify-end gap-2 align-top">
              <button
                onClick={() => openEditModal(step)}
                className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg hover:text-slate-800 transition-colors cursor-pointer"
                title="Edit Step"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteStep(step.id, step.title)}
                className="p-1.5 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-650 rounded-lg transition-colors cursor-pointer"
                title="Delete Step"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        )}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStep ? `Edit Step: ${editingStep.title}` : 'Add New Build Step'}
        size="lg"
      >
        <form onSubmit={handleSaveStep} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Step Title</label>
              <input
                type="text"
                className="input-field"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Feasibility Check"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
              <textarea
                rows={2}
                className="input-field"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what this step entails..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                Typical Timeline
              </label>
              <input
                type="text"
                className="input-field"
                value={typicalTimeline}
                onChange={e => setTypicalTimeline(e.target.value)}
                placeholder="e.g. 2-4 weeks, 1-2 months"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                <ListChecks className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                Step Checklist
              </label>
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    value={item}
                    onChange={e => handleArrayItemChange(setChecklist, idx, e.target.value)}
                    placeholder="e.g. Verify property zoning classification"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(setChecklist, idx)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(setChecklist)}
                className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-emerald-600 transition-colors mt-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add checklist item
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                <AlertTriangle className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                Common Rejection Reasons
              </label>
              {commonRejectionReasons.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    value={item}
                    onChange={e => handleArrayItemChange(setCommonRejectionReasons, idx, e.target.value)}
                    placeholder="e.g. Lot too small for proposed ADU size"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(setCommonRejectionReasons, idx)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(setCommonRejectionReasons)}
                className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-emerald-600 transition-colors mt-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add rejection reason
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary !py-2 !px-5 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary !py-2 !px-5 text-xs font-bold cursor-pointer"
            >
              Save Step
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default StepsManager;
