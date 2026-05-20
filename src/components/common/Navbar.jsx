import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PUBLIC_NAV_LINKS, ROUTES, appConfig } from '../../config';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = PUBLIC_NAV_LINKS;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-primary/90 backdrop-blur-[20px] border-b border-white/10 py-4' : 'bg-primary py-6'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-secondary/20">{appConfig.logoChar}</div>
              <span className="text-2xl font-bold tracking-tight text-white">ADU<span className="text-secondary">Navi</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors group ${isActive(link.path) ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-secondary transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
              </Link>
            ))}
            {currentUser && (
              <Link
                to={ROUTES.USER_DASHBOARD}
                className={`relative px-4 py-2 text-sm font-medium transition-colors group ${isActive(ROUTES.USER_DASHBOARD) ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Dashboard
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-secondary transform origin-left transition-transform duration-300 ${isActive(ROUTES.USER_DASHBOARD) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
              </Link>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-300">
                  Hi, {currentUser.name || currentUser.displayName || 'User'}
                </span>
                <Link to={ROUTES.USER_DASHBOARD} className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  {(currentUser.name || currentUser.displayName || 'U')[0].toUpperCase()}
                </Link>
                <button onClick={() => logout()} className="text-slate-400 hover:text-red-400 transition-colors p-1" title="Log Out">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link to={ROUTES.LOGIN_REDIRECT} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Log In</Link>
                <Link to={ROUTES.USER_REGISTER} className="btn-primary !py-2.5 !px-6 text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2 focus:outline-none"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-primary border-b border-white/10 shadow-2xl">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive(link.path) ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            {currentUser && (
              <Link
                to={ROUTES.USER_DASHBOARD}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive(ROUTES.USER_DASHBOARD) ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                Dashboard
              </Link>
            )}
            <div className="pt-6 mt-4 border-t border-white/10 flex flex-col gap-3">
              {currentUser ? (
                <div className="flex flex-col gap-3 text-center">
                  <p className="text-slate-300 text-sm">
                    Logged in as <span className="text-white font-bold">{currentUser.name || currentUser.email}</span>
                  </p>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="btn-ghost w-full text-center border border-white/20 text-red-400 flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN_REDIRECT} onClick={() => setIsOpen(false)} className="btn-ghost w-full text-center border border-white/20">Log In</Link>
                  <Link to={ROUTES.USER_REGISTER} onClick={() => setIsOpen(false)} className="btn-primary w-full text-center">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

