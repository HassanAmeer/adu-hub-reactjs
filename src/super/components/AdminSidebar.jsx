import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_NAV_ITEMS, ROUTES } from '../../config';

const SidebarGroup = ({ item, onNav }) => {
  const location = useLocation();
  const isActive = item.children.some(c => location.pathname === c.to);
  const [open, setOpen] = useState(isActive);

  return (
    <div className="pt-1.5">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-secondary/10 text-secondary'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
        }`}
      >
        <item.icon className="w-4.5 h-4.5 shrink-0" />
        <span className="flex-1 text-left font-bold tracking-wide">{item.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
        <div className="ml-3 pl-3 border-l-2 border-slate-700/60 space-y-0.5">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={onNav}
              className={({ isActive }) => 
                `flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'text-white bg-slate-800/80 shadow-sm border-l-2 -ml-[14px] pl-[14px] border-secondary' 
                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/20'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200 ${isActive ? 'bg-secondary shadow-sm shadow-secondary/50' : 'bg-slate-600'}`} />
                  <span>{child.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

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
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-secondary/20">A</div>
          <span className="text-lg font-bold tracking-tight text-white">ADU<span className="text-secondary">Navi</span></span>
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

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {navItems.map((item, idx) => {
          if (item.divider) {
            return <div key={`divider-${idx}`} className="border-t border-slate-800 my-2" />;
          }

          if (item.children) {
            return (
              <SidebarGroup
                key={item.label}
                item={item}
                onNav={() => setMobileOpen(false)}
              />
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
      <aside className="hidden lg:block w-64 h-screen shrink-0 border-r border-slate-800 shadow-xl z-20">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-xs h-full bg-slate-900 shadow-2xl animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
