import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_NAV_ITEMS, ROUTES } from '../../config';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.SUPER_GATEWAY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = ADMIN_NAV_ITEMS;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">A</div>
          <span className="text-lg font-bold tracking-tight text-white">ADU<span className="text-emerald-500">Navi</span> <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded ml-1">Admin</span></span>
        </div>
        {mobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            <item.icon className="w-4.5 h-4.5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
            {(currentUser?.name || currentUser?.email || 'A')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Super Admin'}</p>
            <p className="text-[10px] text-slate-500 truncate">{currentUser?.email || 'admin@adunavi.com'}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-semibold text-xs"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen shrink-0 border-r border-slate-800 shadow-xl z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="relative flex flex-col w-72 max-w-xs h-full bg-slate-900 shadow-2xl animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
