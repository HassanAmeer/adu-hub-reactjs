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

function App() {
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
