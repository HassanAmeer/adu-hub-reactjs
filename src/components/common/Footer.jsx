import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Send, Briefcase, Mail } from 'lucide-react';
import { appConfig, ROUTES } from '../../config';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">{appConfig.logoChar}</div>
              <span className="text-xl font-display font-bold text-primary">ADU<span className="text-secondary">Navi</span></span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {appConfig.description}
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
              <li><Link to={ROUTES.PROPERTY_CHECKER} className="hover:text-secondary">Property Checker</Link></li>
              <li><Link to={ROUTES.DIRECTORY} className="hover:text-secondary">Professionals Directory</Link></li>
              <li><Link to={ROUTES.COSTS} className="hover:text-secondary">Cost Library</Link></li>
              <li><Link to={ROUTES.LAW_TRACKER} className="hover:text-secondary">Law Tracker</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to={ROUTES.HOW_TO_BUILD} className="hover:text-secondary">How to Build</Link></li>
              <li><Link to="/state/california" className="hover:text-secondary">California Laws</Link></li>
              <li><Link to={ROUTES.FAQ} className="hover:text-secondary">FAQ</Link></li>
              <li><Link to={ROUTES.BLOG} className="hover:text-secondary">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to={ROUTES.ABOUT} className="hover:text-secondary">About Us</Link></li>
              <li><Link to={ROUTES.CONTACT} className="hover:text-secondary">Contact</Link></li>
              <li><Link to={ROUTES.PRIVACY} className="hover:text-secondary">Privacy Policy</Link></li>
              <li><Link to={ROUTES.TERMS} className="hover:text-secondary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Section */}
        <div className="border-t border-slate-100 pt-8 mb-6">
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Disclaimer</p>
            <span className="text-xs text-slate-500 leading-relaxed">
              ADUNavi provides informational content only. Laws and requirements vary by location and may change.
              Users must verify all information independently. ADUNavi assumes no liability.{' '}
            </span>
            <Link
              to={ROUTES.DISCLAIMER}
              className="text-xs text-secondary hover:text-emerald-600 font-semibold underline underline-offset-2 transition-colors"
            >
              See full legal disclaimer →
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} {appConfig.name} Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {appConfig.contacts.email}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
