import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Menu, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from './components/AdminSidebar';
import Skeleton from '../components/common/Skeleton';
import { ROUTES, ROLES, isAuthorizedAdmin } from '../config';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import StatesCities from './pages/StatesCities';
import ADULaws from './pages/ADULaws';
import PropertyChecker from './pages/PropertyChecker';
import CostLibrary from './pages/CostLibrary';
import Professionals from './pages/Professionals';
import UsersManager from './pages/UsersManager';
import AdminProjects from './pages/AdminProjects';
import Subscriptions from './pages/Subscriptions';
import Deposits from './pages/Deposits';
import BlogManager from './pages/BlogManager';
import SystemSettings from './pages/SystemSettings';
import ActivityLogs from './pages/ActivityLogs';
import ContactUsManager from './pages/ContactUsManager';
import ResourcesManager from './pages/ResourcesManager';
import StepsManager from './pages/StepsManager';

const SuperApp = () => {
  const { currentUser, loading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Security gate loader
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 w-full max-w-md px-8">
          <Skeleton variant="circular" className="w-16 h-16" />
          <div className="space-y-3 w-full">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-3 w-1/2 mx-auto" />
          </div>
          <Skeleton className="h-10 w-40 mx-auto" />
        </div>
      </div>
    );
  }

  // Enforce Admin access only
  if (!currentUser) {
    return <Navigate to={ROUTES.SUPER_GATEWAY} replace />;
  }

  if (!isAuthorizedAdmin(currentUser.role)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-950/40 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Access Restricted</h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2.5">
              Your account lacks the administrative clearances required to access this system. Contact the lead admin for verification.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="btn-secondary !py-2.5 !px-5 text-xs font-bold flex items-center justify-center gap-2 text-white border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 w-full"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex overflow-hidden">
      {/* Drawer / Sidebar Navigation */}
      <AdminSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Panel Content frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-xs flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-400 uppercase tracking-widest">
              Secured Connection
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-slate-850 font-bold border border-slate-200 bg-white px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> View Main Site
            </Link>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-10 bg-slate-50 scrollbar-thin">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="states" element={<StatesCities />} />
              <Route path="laws" element={<ADULaws />} />
              <Route path="checker" element={<PropertyChecker />} />
              <Route path="costs" element={<CostLibrary />} />
              <Route path="directory" element={<Professionals />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="deposits" element={<Deposits />} />
              <Route path="blogs" element={<BlogManager />} />
              <Route path="resources" element={<ResourcesManager />} />
              <Route path="steps" element={<StepsManager />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="logs" element={<ActivityLogs />} />
              <Route path="contactus" element={<ContactUsManager />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperApp;
