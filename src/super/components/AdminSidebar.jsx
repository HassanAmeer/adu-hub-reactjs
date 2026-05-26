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

  const navItems = currentUser?.email === 'dev@gmail.com'
    ? ADMIN_NAV_ITEMS
    : ADMIN_NAV_ITEMS.filter(item => !item.to || (item.to !== '/super/logs' && item.to !== '/seed'));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">A</div>
          <span className="text-lg font-bold tracking-tight text-white">ADU<span className="text-secondary">Navi</span> <span className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded ml-1">Admin</span></span>
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
        {navItems.map((item) => {
          if (item.children) {
            return (
              <div key={item.label} className="pt-2 pb-1">
                <div className="px-4 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </div>
                
                <div className="pl-4 space-y-1 border-l border-slate-800 ml-6 my-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) => 
                        `flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          isActive 
                            ? 'text-white bg-slate-800 shadow-sm font-bold border-r border-slate-700' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/20'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200 ${isActive ? 'bg-secondary' : 'bg-slate-600'}`} />
                          <span>{child.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-secondary text-white shadow-md shadow-secondary/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`
              }
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary font-bold text-sm">
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
