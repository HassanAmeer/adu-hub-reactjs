import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  MapPin,
  Users,
  Compass,
  Check,
  Briefcase,
  FileText,
  TrendingUp,
  ShieldCheck,
  Download,
  Lock
} from 'lucide-react';
import { useAuth } from '../hooks/useUserAuth';
import { dbService } from '../../services/dbService';
import { ROUTES } from '../../config';
import { usePlanLimits } from '../hooks/usePlanLimits';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const limits = usePlanLimits(currentUser);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [savedPros, setSavedPros] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const freshUser = dbService.getUsers().find(u => u.id === currentUser.id);
    if (freshUser) {
      setProperties(freshUser.savedProperties || []);
      setSavedPros(freshUser.savedPros || []);
      setProjects(freshUser.projects || [
        { id: 'proj-1', name: 'Backyard Rental ADU', type: 'Detached', status: 'Design Phase', progress: 25 },
        { id: 'proj-2', name: 'Garage Conversion Studio', type: 'Attached', status: 'Permit Review', progress: 60 }
      ]);
    }
  }, [currentUser]);

  const isPro = currentUser?.role === 'professional';

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Hello, {currentUser?.name || 'ADU Member'}! 👋</h1>
          <p className="text-slate-500 font-medium">
            {isPro
              ? 'Manage your professional business listing, monitor incoming homeowner leads, and update services.'
              : 'Explore local regulations, run property checks, track your ADU builds, and connect with pros.'
            }
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(ROUTES.USER_CHECKS)}
            className="btn-primary flex items-center gap-2"
          >
            <Compass className="w-5 h-5" /> Start Zoning Check
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            label: 'ADU Projects',
            value: projects.length,
            icon: Briefcase,
            bg: 'bg-emerald-50 text-emerald-600',
            border: 'border-emerald-100'
          },
          {
            label: 'Zoning Checks Run',
            value: `${properties.length} / ${limits.propertyCheckerLimit === -1 ? '∞' : limits.propertyCheckerLimit}`,
            icon: Compass,
            bg: 'bg-indigo-50 text-indigo-600',
            border: 'border-indigo-100'
          },
          {
            label: 'Active Subscription',
            value: currentUser?.subscription === 'pro' ? 'Pro Plan' : 'Free Tier',
            icon: ShieldCheck,
            bg: currentUser?.subscription === 'pro' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500',
            border: currentUser?.subscription === 'pro' ? 'border-amber-100' : 'border-slate-200'
          }
        ].map((stat, idx) => {
          const isSubCard = stat.label === 'Active Subscription';
          const shimmerClass = isSubCard
            ? (currentUser?.subscription === 'pro' ? 'shimmer-card-pro' : 'shimmer-card-free')
            : '';
          return (
            <div key={idx} className={`bg-white rounded-2xl p-6 border ${stat.border} shadow-sm ${shimmerClass}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-primary">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-secondary" />
            Your Active ADU Builds
          </h3>
          {projects.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No active builds. Go to "My ADU Projects" to create one.</p>
          ) : (
            <div className="space-y-6">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{proj.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{proj.type} ADU • {proj.status}</p>
                    </div>
                    <span className="text-xs font-black text-secondary">{proj.progress}% Done</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full transition-all duration-500" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Access Grid */}
        <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-primary mb-4">Quick Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <button
              onClick={() => navigate(ROUTES.USER_PROFILE)}
              className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 transition-all text-center space-y-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-600">
                <User className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">Update Profile</p>
            </button>

            <button
              onClick={() => navigate(ROUTES.USER_RESOURCES)}
              className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 transition-all text-center space-y-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-600">
                <Download className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">Get Checklists</p>
            </button>

            <button
              onClick={() => navigate(ROUTES.USER_PROJECTS)}
              className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 transition-all text-center space-y-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">Manage Projects</p>
            </button>

            <button
              onClick={() => navigate(ROUTES.USER_CHECKS)}
              className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 transition-all text-center space-y-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-600">
                <Compass className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">Zoning Checker</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple User Icon helper
const User = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const Settings = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default UserDashboard;
