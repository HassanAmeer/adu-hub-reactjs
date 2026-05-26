import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useUserAuth';
import { dbService } from '../../services/dbService';
import { usePlanLimits } from '../hooks/usePlanLimits';
import { 
  Plus, 
  Briefcase, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  Square, 
  DollarSign, 
  Calendar, 
  FileText, 
  AlertCircle,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const { currentUser, refreshUser } = useAuth();
  const limits = usePlanLimits(currentUser);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Add Project Form States
  const [name, setName] = useState('');
  const [type, setType] = useState('Detached');
  const [status, setStatus] = useState('Design Phase');
  const [budget, setBudget] = useState('150000');
  const [successMsg, setSuccessMsg] = useState('');

  // Project expansion states
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'budget' | 'logs' | 'edit'

  // Input states for expanded card forms
  const [newTaskText, setNewTaskText] = useState('');
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [logNote, setLogNote] = useState('');

  // Editing existing project states
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('Detached');
  const [editStatus, setEditStatus] = useState('Design Phase');
  const [editBudget, setEditBudget] = useState('150000');

  const canUpload = limits.canUploadADUProjects;

  const getDefaultTasks = (aduType) => {
    const base = [
      { id: 't-1', text: 'Zoning setback feasibility check', completed: false },
      { id: 't-2', text: 'Finalize architectural blueprint package', completed: false },
      { id: 't-3', text: 'Submit city permit application docs', completed: false },
      { id: 't-4', text: 'Hire verified builder or contractor', completed: false },
      { id: 't-5', text: 'Pour site concrete foundation', completed: false },
      { id: 't-6', text: 'Framing, roof, and utility hookups', completed: false },
      { id: 't-7', text: 'Final occupancy inspection review', completed: false }
    ];
    if (aduType === 'Garage Conversion') {
      return [
        { id: 't-1', text: 'Garage structural integrity check', completed: false },
        { id: 't-2', text: 'Utility and sewer bypass design', completed: false },
        { id: 't-3', text: 'Submit city conversion permits', completed: false },
        { id: 't-4', text: 'Frame new door and window openings', completed: false },
        { id: 't-5', text: 'Install insulation, drywall, and paint', completed: false },
        { id: 't-6', text: 'Rough-in plumbing and electrical rewiring', completed: false },
        { id: 't-7', text: 'Final city zoning inspection approval', completed: false }
      ];
    }
    return base;
  };

  useEffect(() => {
    const freshUser = dbService.getUsers().find(u => u.id === currentUser.id);
    if (freshUser && freshUser.projects) {
      setProjects(freshUser.projects);
    } else {
      const defaultProjects = [
        {
          id: 'proj-1',
          name: 'Backyard Rental ADU',
          type: 'Detached',
          status: 'Design Phase',
          budget: 180000,
          progress: 25,
          tasks: [
            { id: 't-1', text: 'Zoning setback feasibility check', completed: true },
            { id: 't-2', text: 'Finalize architectural blueprints', completed: true },
            { id: 't-3', text: 'Submit soil survey reports', completed: false },
            { id: 't-4', text: 'Zoning permit board filing', completed: false },
            { id: 't-5', text: 'Pour concrete slab foundation', completed: false },
            { id: 't-6', text: 'Frame walls and timber roofing', completed: false },
            { id: 't-7', text: 'Sewer utility plumbing hookups', completed: false },
            { id: 't-8', text: 'Final occupancy inspection', completed: false }
          ],
          expenses: [
            { id: 'exp-1', title: 'Site Surveyor & Soil Test', amount: 3500, date: '2026-05-18' },
            { id: 'exp-2', title: 'Blueprint Architectural Package', amount: 4800, date: '2026-05-20' }
          ],
          logs: [
            { id: 'log-1', note: 'Project initialized and lot check verified.', date: '2026-05-10' },
            { id: 'log-2', note: 'Hired design consultancy for blueprint package.', date: '2026-05-18' }
          ]
        },
        {
          id: 'proj-2',
          name: 'Garage Conversion Studio',
          type: 'Garage Conversion',
          status: 'Permit Review',
          budget: 75000,
          progress: 60,
          tasks: [
            { id: 't-1', text: 'Garage structural framing check', completed: true },
            { id: 't-2', text: 'Submit city conversion permits', completed: true },
            { id: 't-3', text: 'Install plumbing rough-ins', completed: true },
            { id: 't-4', text: 'Wall insulation & drywall framing', completed: false },
            { id: 't-5', text: 'Electrical rewiring and panel hookup', completed: false }
          ],
          expenses: [
            { id: 'exp-1', title: 'City Permit & Review Fees', amount: 1800, date: '2026-05-12' },
            { id: 'exp-2', title: 'Plumbing Rough-in Material', amount: 3400, date: '2026-05-15' }
          ],
          logs: [
            { id: 'log-1', note: 'Garage cleanout completed.', date: '2026-05-02' },
            { id: 'log-2', note: 'Permits submitted under HOME guidelines.', date: '2026-05-12' }
          ]
        }
      ];
      setProjects(defaultProjects);
    }
  }, [currentUser]);

  // Unified helper to save state updates for a specific project
  const saveProjectChange = (projectId, updater) => {
    const updatedList = projects.map(p => {
      if (p.id === projectId) {
        const copy = JSON.parse(JSON.stringify(p)); // deep copy
        updater(copy);
        // Auto-recalculate progress based on tasks checklist
        const total = copy.tasks?.length || 0;
        const completed = copy.tasks?.filter(t => t.completed).length || 0;
        copy.progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return copy;
      }
      return p;
    });
    dbService.updateUser(currentUser.id, { projects: updatedList });
    setProjects(updatedList);
    refreshUser();
  };

  const handleExpand = (proj) => {
    if (expandedProjectId === proj.id) {
      setExpandedProjectId(null);
    } else {
      setExpandedProjectId(proj.id);
      setActiveTab('tasks');
      setEditName(proj.name);
      setEditType(proj.type);
      setEditStatus(proj.status);
      setEditBudget(String(proj.budget || 100000));
      // clear detail form inputs
      setNewTaskText('');
      setExpenseTitle('');
      setExpenseAmount('');
      setLogNote('');
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!name || !canUpload) return;

    const newProject = {
      id: 'proj-' + Date.now(),
      name,
      type,
      status,
      budget: parseFloat(budget) || 100000,
      progress: 0,
      tasks: getDefaultTasks(type),
      expenses: [],
      logs: [
        { id: 'log-' + Date.now(), note: 'Project created and initialized.', date: new Date().toISOString().split('T')[0] }
      ]
    };

    const updatedProjects = [...projects, newProject];
    dbService.updateUser(currentUser.id, { projects: updatedProjects });
    setProjects(updatedProjects);

    setName('');
    setType('Detached');
    setStatus('Design Phase');
    setBudget('150000');
    setShowAddForm(false);
    setSuccessMsg('Project added successfully!');
    refreshUser();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    dbService.updateUser(currentUser.id, { projects: updatedProjects });
    setProjects(updatedProjects);
    if (expandedProjectId === id) setExpandedProjectId(null);
    refreshUser();
  };

  // Checklist Actions
  const toggleTask = (projId, taskId) => {
    saveProjectChange(projId, (p) => {
      p.tasks = (p.tasks || []).map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    });
  };

  const addTask = (projId) => {
    if (!newTaskText.trim()) return;
    saveProjectChange(projId, (p) => {
      p.tasks = [...(p.tasks || []), { id: 't-' + Date.now(), text: newTaskText.trim(), completed: false }];
    });
    setNewTaskText('');
  };

  const deleteTask = (projId, taskId) => {
    saveProjectChange(projId, (p) => {
      p.tasks = (p.tasks || []).filter(t => t.id !== taskId);
    });
  };

  // Expense Actions
  const addExpense = (projId) => {
    if (!expenseTitle.trim() || !expenseAmount) return;
    saveProjectChange(projId, (p) => {
      p.expenses = [...(p.expenses || []), { 
        id: 'exp-' + Date.now(), 
        title: expenseTitle.trim(), 
        amount: parseFloat(expenseAmount) || 0,
        date: new Date().toISOString().split('T')[0]
      }];
    });
    setExpenseTitle('');
    setExpenseAmount('');
  };

  const deleteExpense = (projId, expId) => {
    saveProjectChange(projId, (p) => {
      p.expenses = (p.expenses || []).filter(e => e.id !== expId);
    });
  };

  // Log Actions
  const addLog = (projId) => {
    if (!logNote.trim()) return;
    saveProjectChange(projId, (p) => {
      p.logs = [
        { 
          id: 'log-' + Date.now(), 
          note: logNote.trim(), 
          date: new Date().toISOString().split('T')[0]
        },
        ...(p.logs || [])
      ];
    });
    setLogNote('');
  };

  const deleteLog = (projId, logId) => {
    saveProjectChange(projId, (p) => {
      p.logs = (p.logs || []).filter(l => l.id !== logId);
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Feasibility check':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Design Phase':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'Permit Review':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Construction':
        return 'bg-orange-50 text-orange-600 border border-orange-100';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-primary">My ADU Projects</h3>
          <p className="text-xs text-slate-400 mt-1">Add and track milestones, budget expenses, and logs for your ADU builds.</p>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
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
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Target Budget ($)</label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g. 150000"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                required
              />
            </div>
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
          <button type="submit" className="btn-primary w-full text-sm">Add to Build List</button>
        </form>
      )}

      {projects.length === 0 && canUpload ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
          <p className="text-slate-500 font-medium">You haven't added any ADU projects yet.</p>
          <p className="text-xs text-slate-400 mt-1">Track architectural plans, compliance filings, and build steps here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {projects.map((proj) => {
            const isExpanded = expandedProjectId === proj.id;
            const totalTasks = proj.tasks?.length || 0;
            const completedTasks = proj.tasks?.filter(t => t.completed).length || 0;
            
            // budget math
            const spent = (proj.expenses || []).reduce((sum, e) => sum + e.amount, 0);
            const remaining = (proj.budget || 0) - spent;
            const budgetUsedRatio = proj.budget > 0 ? (spent / proj.budget) * 100 : 0;

            return (
              <div 
                key={proj.id} 
                className={`bg-white rounded-[24px] border border-slate-200 shadow-sm transition-all overflow-hidden ${
                  !canUpload ? 'opacity-50 pointer-events-none select-none blur-[1px]' : ''
                } ${isExpanded ? 'ring-2 ring-emerald-500/10' : ''}`}
              >
                {/* Card Summary Header */}
                <div 
                  onClick={() => canUpload && handleExpand(proj)}
                  className={`p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors ${
                    isExpanded ? 'border-b border-slate-100 bg-slate-50/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-slate-700 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Briefcase className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base">{proj.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        {proj.type} ADU • {totalTasks} Tasks ({completedTasks} Done)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusBadge(proj.status)}`}>
                      {proj.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-slate-700">{proj.progress}% Complete</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{formatCurrency(spent)} Spent</p>
                      </div>
                      {isExpanded ? (
                        <div className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 shrink-0">
                          <ChevronUp className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 shrink-0">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      )}
                      {canUpload && !isExpanded && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Are you sure you want to delete this project?")) {
                              handleDeleteProject(proj.id);
                            }
                          }}
                          className="p-2 border border-slate-100 hover:border-rose-100 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar for collapsed card */}
                {!isExpanded && (
                  <div className="w-full bg-slate-100 h-1">
                    <div className="bg-secondary h-full transition-all duration-500" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                )}

                {/* Expanded Project Workspace Panel */}
                {isExpanded && (
                  <div className="p-6 bg-white space-y-6">
                    {/* Progress Indicator */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                        <span className="uppercase tracking-widest text-[10px]">Build Progress Tracker</span>
                        <span className="text-secondary font-black text-sm">{proj.progress}% Completed</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-500" style={{ width: `${proj.progress}%` }}></div>
                      </div>
                    </div>

                    {/* Tabs navigation */}
                    <div className="flex border-b border-slate-100 gap-6">
                      {[
                        { id: 'tasks', label: `Checklist (${totalTasks})`, icon: CheckSquare },
                        { id: 'budget', label: 'Budget & Cost', icon: DollarSign },
                        { id: 'logs', label: 'Notes Timeline', icon: FileText },
                        { id: 'edit', label: 'Settings', icon: Settings }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all uppercase tracking-wider ${
                            activeTab === tab.id
                              ? 'border-secondary text-primary'
                              : 'border-transparent text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Contents */}
                    <div>
                      {/* 1. Tasks Checklist Tab */}
                      {activeTab === 'tasks' && (
                        <div className="space-y-4">
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                            {(proj.tasks || []).map((t) => (
                              <div 
                                key={t.id} 
                                className="flex justify-between items-center p-3 sm:px-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/30 transition-all group"
                              >
                                <button
                                  onClick={() => toggleTask(proj.id, t.id)}
                                  className="flex items-center gap-3 font-semibold text-slate-700 text-xs sm:text-sm text-left flex-grow cursor-pointer"
                                >
                                  {t.completed ? (
                                    <CheckSquare className="w-5 h-5 text-secondary shrink-0" />
                                  ) : (
                                    <Square className="w-5 h-5 text-slate-300 shrink-0" />
                                  )}
                                  <span className={t.completed ? 'line-through text-slate-400' : ''}>{t.text}</span>
                                </button>
                                <button
                                  onClick={() => deleteTask(proj.id, t.id)}
                                  className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            {(proj.tasks || []).length === 0 && (
                              <p className="text-xs text-slate-400 py-6 text-center font-medium">No tasks in your checklist yet. Add one below!</p>
                            )}
                          </div>
                          
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              addTask(proj.id);
                            }}
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              className="input-field py-2.5 text-xs rounded-xl"
                              placeholder="Add a custom milestone (e.g. Schedule electric check)..."
                              value={newTaskText}
                              onChange={e => setNewTaskText(e.target.value)}
                              required
                            />
                            <button type="submit" className="bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 shrink-0">
                              <Plus className="w-4 h-4" /> Add Task
                            </button>
                          </form>
                        </div>
                      )}

                      {/* 2. Budget & Expense Tracking Tab */}
                      {activeTab === 'budget' && (
                        <div className="space-y-6">
                          {/* Financial Summary */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Budget</p>
                              <p className="text-base sm:text-lg font-black text-slate-800 mt-1">{formatCurrency(proj.budget || 0)}</p>
                            </div>
                            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Spent</p>
                              <p className={`text-base sm:text-lg font-black mt-1 ${spent > (proj.budget || 0) ? 'text-rose-600' : 'text-slate-800'}`}>
                                {formatCurrency(spent)}
                              </p>
                            </div>
                            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remaining</p>
                              <p className={`text-base sm:text-lg font-black mt-1 ${remaining < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                                {formatCurrency(remaining)}
                              </p>
                            </div>
                          </div>

                          {/* Budget Gauge bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-slate-400">Budget Spent Progress</span>
                              <span className={budgetUsedRatio > 100 ? 'text-rose-600 font-extrabold animate-pulse' : 'text-slate-500'}>
                                {Math.round(budgetUsedRatio)}% Expended
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ${budgetUsedRatio > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${Math.min(budgetUsedRatio, 100)}%` }}
                              ></div>
                            </div>
                            {spent > (proj.budget || 0) && (
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 mt-1.5">
                                <AlertCircle className="w-4 h-4" />
                                <span>Budget exceeded by {formatCurrency(spent - proj.budget)}! Consider adjusting constraints.</span>
                              </div>
                            )}
                          </div>

                          {/* Expense Items List */}
                          <div className="space-y-3">
                            <h5 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Expense Ledger</h5>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                              {(proj.expenses || []).map((exp) => (
                                <div key={exp.id} className="flex justify-between items-center p-3 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white shadow-sm transition-all text-xs group">
                                  <div>
                                    <p className="font-extrabold text-slate-800">{exp.title}</p>
                                    <p className="text-[9px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                                      <Calendar className="w-3 h-3" /> {exp.date}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-black text-slate-800">{formatCurrency(exp.amount)}</span>
                                    <button
                                      onClick={() => deleteExpense(proj.id, exp.id)}
                                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {(proj.expenses || []).length === 0 && (
                                <p className="text-xs text-slate-400 py-6 text-center font-medium bg-slate-50/20 border border-dashed border-slate-200 rounded-2xl">
                                  No expenses logged yet. Add contractor, layout, or lumber bills below.
                                </p>
                              )}
                            </div>

                            {/* Add Expense Form */}
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                addExpense(proj.id);
                              }}
                              className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2"
                            >
                              <input
                                type="text"
                                className="input-field py-2.5 text-xs rounded-xl sm:col-span-2"
                                placeholder="Expense Title (e.g. Design fees)..."
                                value={expenseTitle}
                                onChange={e => setExpenseTitle(e.target.value)}
                                required
                              />
                              <input
                                type="number"
                                className="input-field py-2.5 text-xs rounded-xl"
                                placeholder="Amount ($)..."
                                value={expenseAmount}
                                onChange={e => setExpenseAmount(e.target.value)}
                                required
                              />
                              <button type="submit" className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shrink-0">
                                <Plus className="w-4 h-4" /> Log Cost
                              </button>
                            </form>
                          </div>
                        </div>
                      )}

                      {/* 3. Timeline Progress Logs Tab */}
                      {activeTab === 'logs' && (
                        <div className="space-y-4">
                          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                            {(proj.logs || []).map((log) => (
                              <div key={log.id} className="relative pl-6 border-l-2 border-slate-100 pb-2 group">
                                {/* node indicator */}
                                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-secondary border border-white"></div>
                                
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5" /> {log.date}
                                    </p>
                                    <p className="text-xs text-slate-700 font-semibold mt-1 pr-6 leading-relaxed">{log.note}</p>
                                  </div>
                                  <button
                                    onClick={() => deleteLog(proj.id, log.id)}
                                    className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100 shrink-0"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            {(proj.logs || []).length === 0 && (
                              <p className="text-xs text-slate-400 py-6 text-center font-medium">No progress notes written yet. Log project updates below.</p>
                            )}
                          </div>

                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              addLog(proj.id);
                            }}
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              className="input-field py-2.5 text-xs rounded-xl"
                              placeholder="Write a progress entry (e.g. Framing passed municipal inspection)..."
                              value={logNote}
                              onChange={e => setLogNote(e.target.value)}
                              required
                            />
                            <button type="submit" className="bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 shrink-0">
                              <Plus className="w-4 h-4" /> Save Note
                            </button>
                          </form>
                        </div>
                      )}

                      {/* 4. Edit Settings Tab */}
                      {activeTab === 'edit' && (
                        <div className="space-y-4 max-w-xl">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Project Name</label>
                              <input
                                type="text"
                                className="input-field py-2.5 text-xs rounded-xl"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Target Budget ($)</label>
                              <input
                                type="number"
                                className="input-field py-2.5 text-xs rounded-xl"
                                value={editBudget}
                                onChange={e => setEditBudget(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">ADU Type</label>
                              <select 
                                className="input-field py-2.5 text-xs rounded-xl" 
                                value={editType} 
                                onChange={e => setEditType(e.target.value)}
                              >
                                <option>Detached</option>
                                <option>Attached</option>
                                <option>Garage Conversion</option>
                                <option>Junior ADU (JADU)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Current Status</label>
                              <select 
                                className="input-field py-2.5 text-xs rounded-xl" 
                                value={editStatus} 
                                onChange={e => setEditStatus(e.target.value)}
                              >
                                <option>Feasibility check</option>
                                <option>Design Phase</option>
                                <option>Permit Review</option>
                                <option>Construction</option>
                                <option>Completed</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button 
                              onClick={() => {
                                saveProjectChange(proj.id, (p) => {
                                  p.name = editName.trim();
                                  p.type = editType;
                                  p.status = editStatus;
                                  p.budget = parseFloat(editBudget) || 100000;
                                });
                                setSuccessMsg('Project updated successfully!');
                                setTimeout(() => setSuccessMsg(''), 3000);
                              }}
                              className="btn-primary flex-grow text-xs py-2.5 rounded-xl cursor-pointer"
                            >
                              Save Details Changes
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this project?")) {
                                  handleDeleteProject(proj.id);
                                }
                              }}
                              className="px-4 py-2.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" /> Delete Project
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Collapse Button */}
                    <div className="flex justify-center border-t border-slate-100 pt-4">
                      <button
                        onClick={() => handleExpand(proj)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                      >
                        <ChevronUp className="w-4 h-4" /> Collapse details panel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;
