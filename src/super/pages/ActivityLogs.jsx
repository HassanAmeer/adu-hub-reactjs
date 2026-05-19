import React, { useState, useEffect } from 'react';
import { Activity, Trash2, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import AdminTable from '../components/AdminTable';
import { dbService } from '../../services/dbService';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setLogs(dbService.getLogs());
  }, []);

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear all administration activity trails? This cannot be undone.")) {
      dbService.clearLogs();
      setLogs([]);
      setSuccessMsg('Logs cleared successfully!');
      setTimeout(() => setSuccessMsg(''), 2500);
    }
  };

  const handleExportBackup = () => {
    try {
      // Package localStorage data or DB state
      const databaseDump = {
        users: dbService.getUsers(),
        states: dbService.getStates(),
        directory: dbService.getDirectory(),
        costs: dbService.getCosts(),
        alerts: dbService.getAlerts(),
        settings: dbService.getSettings(),
        blogs: JSON.parse(localStorage.getItem('adu-db-blogs') || '[]'),
        timestamp: new Date().toISOString()
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(databaseDump, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `adu_navi_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      dbService.addLog('Created full system JSON database backup download');
      setLogs(dbService.getLogs());
      
      setSuccessMsg('Backup generated and downloading!');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (error) {
      console.error("Backup failure:", error);
      alert("Failed to export backup data. Please try again.");
    }
  };

  const tableHeaders = [
    { label: "Timestamp" },
    { label: "Administrator ID" },
    { label: "Executed Action" }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Activity Logs & Backups</h2>
          <p className="text-xs text-slate-400 mt-1">Audit administrative operations, clear trails, and download JSON backup packages.</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={handleClearLogs}
            className="btn-secondary !py-2.5 !px-4 text-xs font-bold flex items-center gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-250 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear Logs
          </button>
          
          <button 
            onClick={handleExportBackup}
            className="btn-primary !py-2.5 !px-4 text-xs font-bold flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Backup JSON
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main logs list */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Activity className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-slate-855 text-sm uppercase tracking-wider">System Audits</h3>
        </div>

        <AdminTable 
          headers={tableHeaders}
          data={logs}
          searchPlaceholder="Search logs by action description..."
          searchField="action"
          renderRow={(log) => (
            <tr key={log.id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4 text-slate-400 text-xs font-semibold whitespace-nowrap">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold">
                  {log.admin}
                </span>
              </td>
              <td className="px-6 py-4 font-semibold text-slate-700 text-xs sm:text-sm">
                {log.action}
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

export default ActivityLogs;
