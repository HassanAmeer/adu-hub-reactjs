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
import Login from './userpanel/Login';
import Register from './userpanel/Register';
import ForgotPassword from './userpanel/ForgotPassword';
import { ROUTES, COLLECTIONS } from './config';

// New Pages
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import LandingPage from './pages/LandingPage';
import SeedPage from './seed';
import { dbService } from './services/dbService';

function App() {
  const [settings, setSettings] = React.useState(() => dbService.getSettings());

  // 1. Theme Accent Injector & Firestore Sync
  React.useEffect(() => {
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

    const applyTheme = (color) => {
      const hsl = hexToHSL(color);
      let styleTag = document.getElementById('custom-theme-variables');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'custom-theme-variables';
        document.head.appendChild(styleTag);
      }
      styleTag.innerHTML = `
        :root {
          --color-secondary: ${color} !important;
          --color-secondary-hover: hsl(${hsl.h}, ${hsl.s}%, ${Math.max(5, hsl.l - 8)}%) !important;

          --color-emerald-50: hsl(${hsl.h}, ${hsl.s}%, 97%) !important;
          --color-emerald-100: hsl(${hsl.h}, ${hsl.s}%, 92%) !important;
          --color-emerald-200: hsl(${hsl.h}, ${hsl.s}%, 85%) !important;
          --color-emerald-300: hsl(${hsl.h}, ${hsl.s}%, 75%) !important;
          --color-emerald-400: hsl(${hsl.h}, ${hsl.s}%, 65%) !important;
          --color-emerald-500: ${color} !important;
          --color-emerald-600: hsl(${hsl.h}, ${hsl.s}%, ${Math.max(5, hsl.l - 8)}%) !important;
          --color-emerald-700: hsl(${hsl.h}, ${hsl.s}%, ${Math.max(5, hsl.l - 16)}%) !important;
          --color-emerald-800: hsl(${hsl.h}, ${hsl.s}%, ${Math.max(5, hsl.l - 24)}%) !important;
          --color-emerald-900: hsl(${hsl.h}, ${hsl.s}%, ${Math.max(5, hsl.l - 32)}%) !important;
        }
      `;
    };

    // Apply initial cached theme instantly
    applyTheme(settings.themeColor || '#059669');

    // Async pull settings from Firestore in background
    const pullRemoteSettings = async () => {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('./services/firebase');
        const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'global');
        const snap = await getDoc(settingsRef);
        if (snap.exists()) {
          const remoteData = snap.data();
          // Write to local storage database cache
          localStorage.setItem('adu-db-settings', JSON.stringify(remoteData));
          setSettings(remoteData);
          if (remoteData.themeColor) {
            applyTheme(remoteData.themeColor);
          }
        }
      } catch (err) {
        console.error("Firestore settings sync error during boot:", err);
      }
    };

    // Async sync other collections from Firestore in background
    const syncCollections = async () => {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('./services/firebase');

        const syncCollection = async (firestoreColl, lsKey) => {
          const snap = await getDocs(collection(db, firestoreColl));
          if (!snap.empty) {
            const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            localStorage.setItem(lsKey, JSON.stringify(list));
          }
        };

        await Promise.all([
          syncCollection(COLLECTIONS.STATES, 'adu-db-states'),
          syncCollection(COLLECTIONS.COSTS, 'adu-db-costs'),
          syncCollection(COLLECTIONS.PROFESSIONALS, 'adu-db-directory'),
          syncCollection(COLLECTIONS.ALERTS, 'adu-db-alerts'),
          syncCollection(COLLECTIONS.USERS, 'adu-db-users'),
          syncCollection(COLLECTIONS.LOGS, 'adu-db-logs')
        ]);
      } catch (err) {
        console.error("Firestore collections sync error:", err);
      }
    };

    pullRemoteSettings();
    syncCollections();
  }, []);

  // 2. Maintenance Mode Interceptor
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
        <Route path={ROUTES.DISCLAIMER} element={<MainLayout><DisclaimerPage /></MainLayout>} />
        <Route path={ROUTES.LANDING} element={<LandingPage />} />

        {/* Auth Pages & Redirection */}
        <Route path={ROUTES.USER_LOGIN} element={<Login />} />
        <Route path={ROUTES.USER_REGISTER} element={<Register />} />
        <Route path={ROUTES.USER_FORGOT_PASSWORD} element={<ForgotPassword />} />
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
