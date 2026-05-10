import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SeedingPage from './pages/SeedingPage';

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
        
        {/* Auth Pages (No Main Layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Dashboard (Custom Layout) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Development / Seeding Route */}
        <Route path="/seeding" element={<SeedingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
