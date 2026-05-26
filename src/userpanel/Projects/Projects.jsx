import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useUserAuth';
import { dbService } from '../../services/dbService';
import { usePlanLimits } from '../hooks/usePlanLimits';
import { Plus, Briefcase, Trash2, CheckCircle2, Lock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const { currentUser, refreshUser } = useAuth();
  const limits = usePlanLimits(currentUser);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Detached');
  const [status, setStatus] = useState('Design Phase');
  const [progress, setProgress] = useState(10);
  const [successMsg, setSuccessMsg] = useState('');

  const canUpload = limits.canUploadADUProjects;

  useEffect(() => {
    const freshUser = dbService.getUsers().find(u => u.id === currentUser.id);
    if (freshUser && freshUser.projects) {
      setProjects(freshUser.projects);
    } else {
      const defaultProjects = [
        { id: 'proj-1', name: 'Backyard Rental ADU', type: 'Detached', status: 'Design Phase', progress: 25 },
        { id: 'proj-2', name: 'Garage Conversion Studio', type: 'Attached', status: 'Permit Review', progress: 60 }
      ];
      setProjects(defaultProjects);
    }
  }, [currentUser]);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!name || !canUpload) return;

    const newProject = {
      id: 'proj-' + Date.now(),
      name,
      type,
      status,
      progress: parseInt(progress) || 10
    };

    const updatedProjects = [...projects, newProject];
    dbService.updateUser(currentUser.id, { projects: updatedProjects });
    setProjects(updatedProjects);

    setName('');
    setType('Detached');
    setStatus('Design Phase');
    setProgress(10);
    setShowAddForm(false);
    setSuccessMsg('Project added successfully!');
    refreshUser();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    dbService.updateUser(currentUser.id, { projects: updatedProjects });
    setProjects(updatedProjects);
    refreshUser();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-primary">My ADU Projects</h3>
          <p className="text-xs text-slate-400 mt-1">Add and track milestones for your ADU builds.</p>
        </div>

        {canUpload ? (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center gap-2"
          >
            {showAddForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Project</>}
          </button>
        ) : (
          <button
            onClick={() => navigate('/userpanel/subscriptions')}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 cursor-pointer hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 transition-all"
            title="Upgrade to Pro to upload projects"
          >
            <Lock className="w-4 h-4" />
            Pro Feature
          </button>
        )}
      </div>

      {/* Upgrade wall for free users */}
      {!canUpload && (
        <div className="bg-white border border-amber-200 rounded-2xl p-8 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">ADU Projects Upload — Pro Feature</h4>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Your <span className="font-bold text-slate-700">Free Plan</span> doesn't include project portfolio management.
            Upgrade to <span className="text-emerald-600 font-bold">Pro</span> to create and track your ADU builds.
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

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {successMsg}
        </div>
      )}

      {showAddForm && canUpload && (
        <form onSubmit={handleAddProject} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm max-w-xl space-y-4">
          <h4 className="font-bold text-primary text-sm uppercase tracking-wider mb-2">New ADU Project Details</h4>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Project Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Backyard Granny Flat"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">ADU Type</label>
              <select className="input-field" value={type} onChange={e => setType(e.target.value)}>
                <option>Detached</option>
                <option>Attached</option>
                <option>Garage Conversion</option>
                <option>Junior ADU (JADU)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Current Status</label>
              <select className="input-field" value={status} onChange={e => setStatus(e.target.value)}>
                <option>Feasibility check</option>
                <option>Design Phase</option>
                <option>Permit Review</option>
                <option>Construction</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Overall Progress ({progress}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full accent-secondary"
              value={progress}
              onChange={e => setProgress(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full text-sm">Add to Build List</button>
        </form>
      )}

      {projects.length === 0 && canUpload ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
          <p className="text-slate-500 font-medium">You haven't added any ADU projects yet.</p>
          <p className="text-xs text-slate-400 mt-1">Track architectural plans, compliance filings, and build steps here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className={`bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm space-y-4 ${!canUpload ? 'opacity-50 pointer-events-none select-none blur-[1px]' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary">
                    <Briefcase className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{proj.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{proj.type} ADU</p>
                  </div>
                </div>
                {canUpload && (
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-2 border border-slate-100 hover:border-rose-100 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Current Milestone:</span>
                  <span className="text-primary font-bold">{proj.status}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full transition-all duration-300" style={{ width: `${proj.progress}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase pt-1">
                  <span>Step 1: Check site</span>
                  <span>Step 5: Finish</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
