import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Building2, Calculator, Search, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Explore', path: '/', icon: Map },
    { name: 'Property Checker', path: '/property-checker', icon: Search },
    { name: 'Directory', path: '/directory', icon: Building2 },
    { name: 'Costs', path: '/costs', icon: Calculator },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">A</div>
              <span className="text-2xl font-display font-bold tracking-tight text-primary">ADU<span className="text-secondary">Hub</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                  isActive(link.path) ? 'text-secondary' : 'text-slate-600 hover:text-primary'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            <Link to="/login" className="btn-outline !py-2 !px-5 text-sm">Log In</Link>
            <Link to="/signup" className="btn-primary !py-2 !px-5 text-sm">Get Started</Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-primary p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-border animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${
                  isActive(link.path) ? 'bg-secondary/10 text-secondary' : 'text-slate-600'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/login" className="btn-outline w-full text-center">Log In</Link>
              <Link to="/signup" className="btn-primary w-full text-center">Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
