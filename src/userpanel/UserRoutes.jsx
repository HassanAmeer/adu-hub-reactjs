import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

// Protected pages
import UserLayout from './components/UserLayout';
import UserDashboard from './Dashboard/UserDashboard';
import Profile from './Profile/Profile';
import Projects from './Projects/Projects';
import Checks from './Checks/Checks';
import Subscriptions from './Subscriptions/Subscriptions';
import Resources from './Resources/Resources';
import Professionals from './Professionals/Professionals';

const UserRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />

      {/* Protected User Dashboard Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="projects" element={<Projects />} />
        <Route path="checks" element={<Checks />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="resources" element={<Resources />} />
        <Route path="professionals" element={<Professionals />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default UserRoutes;
