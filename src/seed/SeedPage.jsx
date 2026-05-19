// SeedPage.jsx
// Interactive Firestore Database Seeding Control Center.
// Provides Super Admins with selective, action-based seeding control with warnings, status logs, and toast notifications.

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../config/routes';
import { COLLECTIONS } from '../config/collections';
import { seedCollection, SEED_DATA_MAP } from './seeder';
import { 
  ShieldAlert, 
  Database, 
  RefreshCw, 
  Trash2, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ArrowLeft,
  Loader2,
  Terminal,
  FileCheck,
  ChevronRight
} from 'lucide-react';

const SeedPage = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!currentUser || currentUser.role !== 'superAdmin') {
      navigate('/super');
    }
  }, [currentUser, loading, navigate]);

  if (loading || !currentUser || currentUser.role !== 'superAdmin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Verifying authorization...</span>
        </div>
      </div>
    );
  }

  // Seeding States
  const [selectedCollections, setSelectedCollections] = useState(
    Object.keys(COLLECTIONS).reduce((acc, key) => ({ ...acc, [COLLECTIONS[key]]: true }), {})
  );
  
  const [actions, setActions] = useState(
    Object.keys(COLLECTIONS).reduce((acc, key) => ({ ...acc, [COLLECTIONS[key]]: 'seed' }), {})
  );

  const [globalAction, setGlobalAction] = useState('seed');
  const [executionLogs, setExecutionLogs] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingRunInfo, setPendingRunInfo] = useState(null); // { single: true, collectionName: '...' } or { single: false }
  
  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setExecutionLogs((prev) => [...prev, { time, message, type }]);
  };

  // Toggle selection
  const handleToggleSelect = (colName) => {
    setSelectedCollections(prev => ({ ...prev, [colName]: !prev[colName] }));
  };

  // Handle action change
  const handleActionChange = (colName, actionVal) => {
    setActions(prev => ({ ...prev, [colName]: actionVal }));
  };

  // Apply global action to all selected
  const handleApplyGlobalAction = (actionVal) => {
    setGlobalAction(actionVal);
    setActions(prev => {
      const updated = { ...prev };
      Object.keys(selectedCollections).forEach((colName) => {
        if (selectedCollections[colName]) {
          updated[colName] = actionVal;
        }
      });
      return updated;
    });
    addLog(`Applied global action "${actionVal}" to all selected collections`, 'info');
  };

  // Run seeding process
  const triggerSeeding = (isSingle = false, collectionName = null) => {
    // Check if dangerous action is chosen (replace or delete)
    let isDangerous = false;
    
    if (isSingle) {
      const act = actions[collectionName];
      if (act === 'replace' || act === 'delete') {
        isDangerous = true;
      }
    } else {
      // Multiple selection check
      Object.keys(selectedCollections).forEach((colName) => {
        if (selectedCollections[colName]) {
          const act = actions[colName];
          if (act === 'replace' || act === 'delete') {
            isDangerous = true;
          }
        }
      });
    }

    if (isDangerous) {
      setPendingRunInfo({ single: isSingle, collectionName });
      setShowWarningModal(true);
    } else {
      executeSeeding(isSingle, collectionName);
    }
  };

  const executeSeeding = async (isSingle, collectionName) => {
    setIsExecuting(true);
    setExecutionLogs([]);
    addLog('⚡ Starting Firestore Seeding operations...', 'info');

    const targets = isSingle 
      ? [collectionName] 
      : Object.keys(selectedCollections).filter(k => selectedCollections[k]);

    if (targets.length === 0) {
      addLog('⚠️ No collections selected for execution.', 'warning');
      showToast('No Seeding Target', 'Please select at least one collection to seed.', 'warning');
      setIsExecuting(false);
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const colName of targets) {
      const action = actions[colName];
      const count = SEED_DATA_MAP[colName]?.length || 0;
      addLog(`Processing collection: "${colName}" with action: [${action.toUpperCase()}]`, 'info');

      try {
        await seedCollection(colName, action);
        successCount++;
        addLog(`✅ Successfully completed operation on [${colName}] (${count} docs handled)`, 'success');
      } catch (err) {
        failCount++;
        addLog(`❌ Failed operation on [${colName}]: ${err.message}`, 'error');
        console.error(err);
      }
    }

    addLog(`✨ Seeding completed. Success: ${successCount}, Failures: ${failCount}`, 'info');
    
    if (failCount === 0) {
      showToast('Seeding Succeeded', 'Firestore collections have been seeded and synchronized successfully.', 'success');
    } else {
      showToast('Seeding Finished with errors', 'Some collections failed to seed. Check the log screen.', 'error');
    }
    
    setIsExecuting(false);
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />

      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-start gap-3 transition-all duration-300 transform translate-x-0 ${
              t.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' :
              t.type === 'error' ? 'bg-rose-950/90 border-rose-500/30 text-rose-300' :
              'bg-amber-950/90 border-amber-500/30 text-amber-300'
            }`}
          >
            {t.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />}
            {t.type === 'error' && <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />}
            {t.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />}
            <div>
              <h5 className="font-bold text-sm text-white">{t.title}</h5>
              <p className="text-xs mt-1 leading-relaxed opacity-90">{t.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header Bar */}
      <nav className="h-20 bg-slate-900/40 border-b border-slate-900 backdrop-blur-xs flex items-center justify-between px-6 sm:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">A</div>
          <span className="text-xl font-bold tracking-tight text-white">ADU<span className="text-emerald-500">Navi</span></span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Seeder v1.0</span>
        </div>
        <Link 
          to={ROUTES.SUPER_DASHBOARD}
          className="text-xs text-slate-400 hover:text-white font-bold border border-slate-800 bg-slate-900 px-4 py-2 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </nav>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 pt-12 space-y-10">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-900 pb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Database className="w-8 h-8 text-emerald-500" />
              Firestore Database Seeder
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Initialize, populate, update, or clear demo datasets in Cloud Firestore. Seeding operations automatically synchronize state into local storage lists for real-time dashboard operation.
            </p>
          </div>
          {currentUser && (
            <div className="bg-slate-900/60 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Logged in as</p>
                <p className="text-xs font-black text-slate-200">{currentUser.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Global Controls Panel */}
        <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-3xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-200">Global Settings Override</h4>
            <p className="text-xs text-slate-500">Apply a seeding rule globally to all selected database collections.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <select
              value={globalAction}
              onChange={(e) => handleApplyGlobalAction(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
            >
              <option value="seed">Seed New Data (Add Without Deleting)</option>
              <option value="replace">Replace All Data (Clear + Seed)</option>
              <option value="update">Update Existing (Upsert)</option>
              <option value="delete">Delete All Data (Clear Collection)</option>
            </select>
            <button
              onClick={() => triggerSeeding(false)}
              disabled={isExecuting}
              className="btn-primary !bg-emerald-600 hover:!bg-emerald-500 text-white font-bold !py-3 !px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed w-full md:w-auto justify-center"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Seeder...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Run Seeding Process
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collections Table Grid */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-[28px] overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/40 text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">
                  <th className="py-4 px-6 text-center w-12">
                    <input 
                      type="checkbox"
                      checked={Object.values(selectedCollections).every(v => v)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedCollections(
                          Object.keys(selectedCollections).reduce((acc, col) => ({ ...acc, [col]: checked }), {})
                        );
                      }}
                      className="w-4 h-4 accent-emerald-500 rounded border-slate-800"
                    />
                  </th>
                  <th className="py-4 px-6">Collection Key</th>
                  <th className="py-4 px-6">Firestore collection</th>
                  <th className="py-4 px-6 text-center">Docs to seed</th>
                  <th className="py-4 px-6">Seeding Rule</th>
                  <th className="py-4 px-6 text-right">Direct Run</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 font-medium">
                {Object.keys(COLLECTIONS).map((key) => {
                  const colName = COLLECTIONS[key];
                  const docCount = SEED_DATA_MAP[colName]?.length || 0;
                  const isChecked = selectedCollections[colName];
                  
                  return (
                    <tr 
                      key={colName} 
                      className={`hover:bg-slate-900/10 transition-colors ${isChecked ? 'bg-emerald-500/[0.01]' : 'opacity-60'}`}
                    >
                      <td className="py-4 px-6 text-center">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(colName)}
                          className="w-4 h-4 accent-emerald-500 rounded border-slate-800"
                        />
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-200">
                        {key}
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        <span className="font-mono bg-slate-950 px-2.5 py-1 rounded-md text-[11px] border border-slate-900 text-slate-300">
                          {colName}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-emerald-400">
                        {docCount}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={actions[colName]}
                          onChange={(e) => handleActionChange(colName, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="seed">Seed New (Add)</option>
                          <option value="replace">Replace All (Delete + Add)</option>
                          <option value="update">Update Existing (Upsert)</option>
                          <option value="delete">Delete All (Clear)</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => triggerSeeding(true, colName)}
                          disabled={isExecuting}
                          className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Execute
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time output terminal logs */}
        <div className="bg-slate-950 border border-slate-900 rounded-[28px] p-6 space-y-4 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              Seeder execution Output Console
            </h4>
            <button 
              onClick={() => setExecutionLogs([])}
              className="text-[10px] text-slate-500 hover:text-slate-300 font-bold uppercase"
            >
              Clear Console
            </button>
          </div>
          
          <div className="h-60 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5 bg-slate-900/30 p-4 rounded-xl border border-slate-900/60 scrollbar-thin">
            {executionLogs.length === 0 ? (
              <p className="text-slate-600 italic">No operations executed yet. Selected collections will run outputs here...</p>
            ) : (
              executionLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={`flex gap-3 items-start ${
                    log.type === 'error' ? 'text-rose-400' :
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'warning' ? 'text-amber-400' :
                    'text-slate-400'
                  }`}
                >
                  <span className="text-slate-600 shrink-0 select-none">[{log.time}]</span>
                  <span className="break-all">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info panel explaining how to seed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/20 border border-slate-900 p-6 rounded-3xl">
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              Seed Instructions
            </h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc pl-5 leading-relaxed">
              <li><strong>Seed New Data</strong> inserts documents without deleting existing records. Perfect for adding additional records safely.</li>
              <li><strong>Replace All Data</strong> completely wipes the checked collection before adding fresh seed data. Use with caution.</li>
              <li><strong>Update Existing</strong> applies matching field updates by ID. Useful for schema expansion.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Default User Credentials
            </h4>
            <div className="text-xs text-slate-400 space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-900">
              <p>🔑 <strong className="text-slate-200">Super Admin:</strong> admin@gmail.com | 12345678</p>
              <p>👤 <strong className="text-slate-200">Homeowner:</strong> user1@gmail.com | 12345678</p>
              <p>💼 <strong className="text-slate-200">Investor:</strong> user2@gmail.com | 12345678</p>
              <p>🔨 <strong className="text-slate-200">Professional:</strong> pro1@gmail.com | 12345678</p>
            </div>
          </div>
        </div>

      </div>

      {/* Warning confirmation Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xs">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Destructive Action Alert</h3>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                You are about to run a **Replace** or **Delete** operation. This will permanently erase existing documents inside the chosen Firestore collections. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowWarningModal(false);
                  setPendingRunInfo(null);
                }}
                className="w-full btn-secondary text-slate-300 border-slate-800 hover:border-slate-700 bg-slate-950 font-bold py-3.5 rounded-xl cursor-pointer text-xs uppercase"
              >
                Cancel Run
              </button>
              <button
                onClick={() => {
                  setShowWarningModal(false);
                  if (pendingRunInfo) {
                    executeSeeding(pendingRunInfo.single, pendingRunInfo.collectionName);
                  }
                  setPendingRunInfo(null);
                }}
                className="w-full btn-primary !bg-amber-600 hover:!bg-amber-505 text-white font-bold py-3.5 rounded-xl cursor-pointer text-xs uppercase shadow-lg shadow-amber-500/10"
              >
                Proceed Operation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SeedPage;
