import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Send, Briefcase, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
              <span className="text-xl font-display font-bold text-primary">ADU<span className="text-secondary">Navi</span></span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              The all-in-one platform for ADU research, design, and construction. Making housing more accessible across the nation.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-secondary transition-colors">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-secondary transition-colors">
                <Briefcase className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-secondary transition-colors">
                <Code className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/property-checker" className="hover:text-secondary">Property Checker</Link></li>
              <li><Link to="/directory" className="hover:text-secondary">Professionals Directory</Link></li>
              <li><Link to="/costs" className="hover:text-secondary">Cost Library</Link></li>
              <li><Link to="/law-tracker" className="hover:text-secondary">Law Tracker</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/how-to-build" className="hover:text-secondary">How to Build</Link></li>
              <li><Link to="/state/california" className="hover:text-secondary">California Laws</Link></li>
              <li><a href="#" className="hover:text-secondary">Case Studies</a></li>
              <li><a href="#" className="hover:text-secondary">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-secondary">About Us</a></li>
              <li><a href="#" className="hover:text-secondary">Contact</a></li>
              <li><a href="#" className="hover:text-secondary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-secondary">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © 2024 ADU Navi Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              support@adunavi.com
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
