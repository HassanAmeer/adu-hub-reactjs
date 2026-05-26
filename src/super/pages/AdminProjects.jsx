import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/dbService';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  CheckSquare, 
  DollarSign, 
  FileText, 
  ArrowLeft,
  Calendar,
  AlertCircle,
  Eye
} from 'lucide-react';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import { useSearchParams } from 'react-router-dom';

const AdminProjects = () => {
  const [users, setUsers] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const allUsers = dbService.getUsers() || [];
    setUsers(allUsers);

    // Flatten all projects with owner metadata
    const projectsList = [];
    allUsers.forEach((u) => {
      if (u.projects && Array.isArray(u.projects)) {
        u.projects.forEach((p) => {
          projectsList.push({
            ...p,
            ownerName: u.name || 'ADU Member',
            ownerEmail: u.email,
            ownerId: u.id
          });
        });
      }
    });
    setAllProjects(projectsList);

    // Pre-filter list if redirected with query
    const query = searchParams.get('search');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  const openAuditModal = (project) => {
    setSelectedProject(project);
    const owner = users.find(u => u.id === project.ownerId);
    setSelectedOwner(owner);
    setIsAuditModalOpen(true);
  };

  // Metrics calculation
  const totalProjects = allProjects.length;
  const totalBudget = allProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalSpent = allProjects.reduce((sum, p) => {
    const projSpent = (p.expenses || []).reduce((s, e) => s + e.amount, 0);
    return sum + projSpent;
  }, 0);
  const avgProgress = totalProjects > 0 
    ? Math.round(allProjects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects)
    : 0;

  // Filter projects list
  const filteredProjects = allProjects.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

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

  const tableHeaders = [
    { label: 'Project Owner' },
    { label: 'ADU Project Name' },
    { label: 'ADU Build Type' },
    { label: 'Current Phase' },
    { label: 'Financial (Spent / Budget)' },
    { label: 'Progress (%)' },
    { label: 'Actions', className: 'text-right' }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Homeowner ADU Projects</h2>
          <p className="text-xs text-slate-400 mt-1">Audit active builds, check architectural milestones, and track construction budgets across all user accounts.</p>
        </div>
      </div>

      {/* Overview Analytics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: 'Total ADU Projects', value: totalProjects, icon: Briefcase, bg: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
          { label: 'Total Allocated Budgets', value: formatCurrency(totalBudget), icon: DollarSign, bg: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
          { label: 'Total Combined Spending', value: formatCurrency(totalSpent), icon: DollarSign, bg: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
          { label: 'Average Build Progress', value: `${avgProgress}%`, icon: CheckSquare, bg: 'bg-amber-50 text-amber-500', border: 'border-amber-100' }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white rounded-2xl p-6 border ${stat.border} shadow-sm`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-extrabold text-primary mt-0.5">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            className="input-field pl-10 py-2.5 text-xs rounded-xl"
            placeholder="Search by name, owner, email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Type Filter */}
          <select 
            className="input-field py-2 px-3 text-xs rounded-xl w-full sm:w-40"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="all">All ADU Types</option>
            <option value="Detached">Detached</option>
            <option value="Attached">Attached</option>
            <option value="Garage Conversion">Garage Conversion</option>
            <option value="Junior ADU (JADU)">Junior ADU (JADU)</option>
          </select>

          {/* Status Filter */}
          <select 
            className="input-field py-2 px-3 text-xs rounded-xl w-full sm:w-40"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Stages</option>
            <option value="Feasibility check">Feasibility check</option>
            <option value="Design Phase">Design Phase</option>
            <option value="Permit Review">Permit Review</option>
            <option value="Construction">Construction</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Main Table view */}
      <AdminTable 
        headers={tableHeaders}
        data={filteredProjects}
        searchPlaceholder="Filter listed projects..."
        searchField="name"
        renderRow={(project) => {
          const projectSpent = (project.expenses || []).reduce((sum, e) => sum + e.amount, 0);

          return (
            <tr key={project.id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-normal">{project.ownerName}</h4>
                  <span className="text-[11px] text-slate-400 font-semibold block">{project.ownerEmail}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                {project.name}
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  {project.type} ADU
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusBadge(project.status)}`}>
                  {project.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-xs">
                  <span className={`font-bold ${projectSpent > (project.budget || 0) ? 'text-rose-600' : 'text-slate-800'}`}>
                    {formatCurrency(projectSpent)}
                  </span>
                  <span className="text-slate-400 font-semibold"> / {formatCurrency(project.budget || 0)}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0">
                    <div className="bg-secondary h-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{project.progress}%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right flex justify-end gap-2">
                <button 
                  onClick={() => openAuditModal(project)}
                  className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg hover:text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  title="Audit Project Workspace"
                >
                  <Eye className="w-4 h-4 text-secondary shrink-0" /> Audit Details
                </button>
              </td>
            </tr>
          );
        }}
      />

      {/* --- AUDIT USER PROJECTS MODAL --- */}
      <AdminModal 
        isOpen={isAuditModalOpen} 
        onClose={() => setIsAuditModalOpen(false)} 
        title={`ADU Project Audit Workspace: ${selectedProject?.name}`}
      >
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
          {selectedProject && (
            <div className="space-y-6">
              {/* Meta information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Owner</p>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">{selectedProject.ownerName}</p>
                  <p className="text-slate-450 block font-semibold">{selectedProject.ownerEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ADU Classification</p>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">{selectedProject.type} ADU</p>
                  <p className="text-slate-450 block font-semibold">{selectedProject.status}</p>
                </div>
              </div>

              {/* Progress and Budget summary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="uppercase tracking-widest text-[9px] text-slate-400">Build Progress</span>
                  <span>{selectedProject.progress}% Done</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full transition-all duration-350" style={{ width: `${selectedProject.progress}%` }}></div>
                </div>
              </div>

              {/* Details lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Tasks Summary */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 border-b border-slate-100 pb-1.5 shrink-0">
                    <CheckSquare className="w-4 h-4 text-secondary" /> Tasks Checklist ({(selectedProject.tasks || []).filter(t => t.completed).length}/{(selectedProject.tasks || []).length})
                  </p>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {(selectedProject.tasks || []).map(t => (
                      <div key={t.id} className="flex items-start gap-2 text-[10px] text-slate-600">
                        <span className={t.completed ? 'text-secondary font-bold shrink-0 mt-0.5' : 'text-slate-300 shrink-0 mt-0.5'}>●</span>
                        <span className={t.completed ? 'line-through text-slate-400' : ''}>{t.text}</span>
                      </div>
                    ))}
                    {(selectedProject.tasks || []).length === 0 && <p className="text-[10px] text-slate-400 italic">No checklist tasks logged.</p>}
                  </div>
                </div>

                {/* Expenses / Budget Summary */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 border-b border-slate-100 pb-1.5 shrink-0">
                    <DollarSign className="w-4 h-4 text-emerald-600" /> Expenses Spent ({formatCurrency((selectedProject.expenses || []).reduce((sum, e) => sum + e.amount, 0))})
                  </p>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {(selectedProject.expenses || []).map(e => (
                      <div key={e.id} className="flex justify-between items-center text-[10px] text-slate-600">
                        <span className="truncate pr-1">{e.title}</span>
                        <span className="font-bold text-slate-800 shrink-0">{formatCurrency(e.amount)}</span>
                      </div>
                    ))}
                    {(selectedProject.expenses || []).length === 0 && <p className="text-[10px] text-slate-400 italic">No expenses logged.</p>}
                  </div>
                </div>
              </div>

              {/* Timeline logs */}
              {selectedProject.logs && selectedProject.logs.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 border-b border-slate-100 pb-1.5">
                    <FileText className="w-4 h-4 text-indigo-500" /> Progress Timeline Logs
                  </p>
                  <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                    {selectedProject.logs.map(log => (
                      <div key={log.id} className="text-[10px] border-l-2 border-slate-100 pl-2.5 leading-normal">
                        <span className="text-[8px] font-bold text-slate-400 block">{log.date}</span>
                        <span className="text-slate-600">{log.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
          <button 
            type="button" 
            onClick={() => setIsAuditModalOpen(false)} 
            className="btn-secondary !py-2 !px-5 text-xs font-bold cursor-pointer"
          >
            Close Auditor
          </button>
        </div>
      </AdminModal>
    </div>
  );
};

export default AdminProjects;
