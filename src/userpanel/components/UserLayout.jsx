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
    if (path.includes('/favorites')) return 'Saved & Favorites';
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
