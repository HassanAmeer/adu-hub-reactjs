import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../hooks/useUserAuth';
import UserSidebar from './UserSidebar';
import { ROUTES } from '../../config';
import Skeleton from '../../components/common/Skeleton';

const UserLayout = () => {
  const { currentUser, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if not logged in
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 shadow-xs">
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        </div>
        <p className="text-xs font-bold text-slate-600">Loading your account...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={ROUTES.USER_LOGIN} replace />;
  }

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/profile')) return 'My Profile';
    if (path.includes('/projects')) return 'My ADU Projects';
    if (path.includes('/checks')) return 'Property Checks';
    if (path.includes('/notifications')) return 'Notifications';
    if (path.includes('/subscriptions')) return 'Subscriptions';
    if (path.includes('/resources')) return 'Downloads & Resources';
    if (path.includes('/professionals')) return 'Pro Partner Portal';
    if (path.includes('/settings')) return 'Settings';
    return 'User Panel';
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <UserSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Panel Content */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-10 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-600 border border-slate-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-primary">{currentUser?.name || 'ADU Member'}</p>
                <p className="text-[10px] text-secondary uppercase font-extrabold tracking-wider">{currentUser?.role} Account</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary font-bold text-sm shadow-inner">
                {(currentUser?.name || 'U')[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Routes View */}
        <main className="flex-grow overflow-y-auto p-6 sm:p-10 bg-slate-50 scroll-smooth">
          <div className="max-w-[1400px] mx-auto w-full pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
