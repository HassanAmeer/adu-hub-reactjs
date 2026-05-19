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

// New Pages
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages with Main Layout (Navbar + Footer) */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/states" element={<MainLayout><StatesPage /></MainLayout>} />
        <Route path="/state/:stateName" element={<MainLayout><StatePage /></MainLayout>} />
        <Route path="/state/:state/city/:cityName" element={<MainLayout><CityPage /></MainLayout>} />
        <Route path="/property-checker" element={<MainLayout><PropertyCheckerPage /></MainLayout>} />
        <Route path="/how-to-build" element={<MainLayout><HowToBuildPage /></MainLayout>} />
        <Route path="/directory" element={<MainLayout><DirectoryPage /></MainLayout>} />
        <Route path="/costs" element={<MainLayout><CostLibraryPage /></MainLayout>} />
        <Route path="/law-tracker" element={<MainLayout><LawTrackerPage /></MainLayout>} />
        <Route path="/alerts" element={<MainLayout><AlertsPage /></MainLayout>} />
        <Route path="/blog" element={<MainLayout><BlogPage /></MainLayout>} />
        <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path="/faq" element={<MainLayout><FAQPage /></MainLayout>} />
        <Route path="/privacy" element={<MainLayout><PrivacyPage /></MainLayout>} />
        <Route path="/terms" element={<MainLayout><TermsPage /></MainLayout>} />
        
        {/* Auth Pages & Redirection */}
        <Route path="/login" element={<Navigate to="/userpanel/login" replace />} />
        <Route path="/signup" element={<Navigate to="/userpanel/register" replace />} />
        <Route path="/super" element={<SuperLoginPage />} />
        <Route path="/dashboard" element={<Navigate to="/userpanel/dashboard" replace />} />

        {/* Segregated User Panel (Auth + Dashboard) */}
        <Route path="/userpanel/*" element={<UserRoutes />} />
        
        {/* Dedicated Admin Panel (Custom Layout & Role Security) */}
        <Route path="/super/*" element={<SuperApp />} />
      </Routes>
    </Router>
  );
}

export default App;
