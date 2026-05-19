import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import StatesPage from './pages/StatesPage';
import StatePage from './pages/StatePage';
import CityPage from './pages/CityPage';
import PropertyCheckerPage from './pages/PropertyCheckerPage';
import HowToBuildPage from './pages/HowToBuildPage';
import DirectoryPage from './pages/DirectoryPage';
import CostLibraryPage from './pages/CostLibraryPage';
import LawTrackerPage from './pages/LawTrackerPage';
import AlertsPage from './pages/AlertsPage';
import SuperApp from './super/superApp';
import SuperLoginPage from './pages/SuperLoginPage';
import UserRoutes from './userpanel';
import { ROUTES } from './config';

// New Pages
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SeedPage from './seed';
import { dbService } from './services/dbService';

function App() {
  // 1. Theme Accent Injector
  React.useEffect(() => {
    const settings = dbService.getSettings();
    const primaryColor = settings.themeColor || '#059669';
    
    // Hex to HSL helper
    const hexToHSL = (hex) => {
      hex = hex.replace(/^#/, '');
      let r = parseInt(hex.substring(0, 2), 16) / 255;
      let g = parseInt(hex.substring(2, 4), 16) / 255;
      let b = parseInt(hex.substring(4, 6), 16) / 255;
      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    };

    const hsl = hexToHSL(primaryColor);

    let styleTag = document.getElementById('custom-theme-variables');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'custom-theme-variables';
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
      :root {
        --color-secondary: ${primaryColor} !important;
        --color-secondary-hover: hsl(${hsl.h}, ${hsl.s}%, ${Math.max(5, hsl.l - 8)}%) !important;

        --color-emerald-50: hsl(${hsl.h}, ${hsl.s}%, 97%) !important;
        --color-emerald-100: hsl(${hsl.h}, ${hsl.s}%, 92%) !important;
        --color-emerald-200: hsl(${hsl.h}, ${hsl.s}%, 85%) !important;
        --color-emerald-300: hsl(${hsl.h}, ${hsl.s}%, 75%) !important;
        --color-emerald-400: hsl(${hsl.h}, ${hsl.s}%, 65%) !important;
        --color-emerald-500: ${primaryColor} !important;
        --color-emerald-600: hsl(${hsl.h}, ${hsl.s}%, ${Math.max(5, hsl.l - 8)}%) !important;
        --color-emerald-700: hsl(${hsl.h}, ${hsl.s}%, ${Math.max(5, hsl.l - 16)}%) !important;
        --color-emerald-800: hsl(${hsl.h}, ${hsl.s}%, ${Math.max(5, hsl.l - 24)}%) !important;
        --color-emerald-900: hsl(${hsl.h}, ${hsl.s}%, ${Math.max(5, hsl.l - 32)}%) !important;
      }
    `;
  }, []);

  // 2. Maintenance Mode Interceptor
  const settings = dbService.getSettings();
  const isMaintenance = settings.maintenanceMode === true;
  const isSuperRoute = window.location.pathname.startsWith('/super') || window.location.pathname === '/seed';

  if (isMaintenance && !isSuperRoute) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-500 text-3xl">
            🛠️
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Under Maintenance</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            ADU Navi is currently undergoing scheduled maintenance to upgrade our system features. We apologize for any inconvenience.
          </p>
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            We will be back shortly
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Pages with Main Layout (Navbar + Footer) */}
        <Route path={ROUTES.HOME} element={<MainLayout><Home /></MainLayout>} />
        <Route path={ROUTES.STATES} element={<MainLayout><StatesPage /></MainLayout>} />
        <Route path={ROUTES.STATE_DETAIL} element={<MainLayout><StatePage /></MainLayout>} />
        <Route path={ROUTES.CITY_DETAIL} element={<MainLayout><CityPage /></MainLayout>} />
        <Route path={ROUTES.PROPERTY_CHECKER} element={<MainLayout><PropertyCheckerPage /></MainLayout>} />
        <Route path={ROUTES.HOW_TO_BUILD} element={<MainLayout><HowToBuildPage /></MainLayout>} />
        <Route path={ROUTES.DIRECTORY} element={<MainLayout><DirectoryPage /></MainLayout>} />
        <Route path={ROUTES.COSTS} element={<MainLayout><CostLibraryPage /></MainLayout>} />
        <Route path={ROUTES.LAW_TRACKER} element={<MainLayout><LawTrackerPage /></MainLayout>} />
        <Route path={ROUTES.ALERTS} element={<MainLayout><AlertsPage /></MainLayout>} />
        <Route path={ROUTES.BLOG} element={<MainLayout><BlogPage /></MainLayout>} />
        <Route path={ROUTES.ABOUT} element={<MainLayout><AboutPage /></MainLayout>} />
        <Route path={ROUTES.CONTACT} element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path={ROUTES.FAQ} element={<MainLayout><FAQPage /></MainLayout>} />
        <Route path={ROUTES.PRIVACY} element={<MainLayout><PrivacyPage /></MainLayout>} />
        <Route path={ROUTES.TERMS} element={<MainLayout><TermsPage /></MainLayout>} />
        
        {/* Auth Pages & Redirection */}
        <Route path={ROUTES.LOGIN_REDIRECT} element={<Navigate to={ROUTES.USER_LOGIN} replace />} />
        <Route path={ROUTES.SIGNUP_REDIRECT} element={<Navigate to={ROUTES.USER_REGISTER} replace />} />
        <Route path={ROUTES.SUPER_GATEWAY} element={<SuperLoginPage />} />
        <Route path={ROUTES.DASHBOARD_REDIRECT} element={<Navigate to={ROUTES.USER_DASHBOARD} replace />} />

        {/* Segregated User Panel (Auth + Dashboard) */}
        <Route path={ROUTES.USER_PANEL_WILDCARD} element={<UserRoutes />} />
        
        {/* Dedicated Admin Panel (Custom Layout & Role Security) */}
        <Route path={ROUTES.SUPER_APP_WILDCARD} element={<SuperApp />} />

        {/* Database Seeder Gateway */}
        <Route path={ROUTES.SEED} element={<SeedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
