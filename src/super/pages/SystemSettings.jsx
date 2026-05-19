// SystemSettings.jsx
// Global platform configuration editor with tabs: General Settings, Appearance, SEO, Emails, and Security.
// Integrates with local dbService settings store and updates Admin Credentials directly in Firestore.

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Palette,
  Search,
  Mail,
  ShieldCheck,
  Save,
  CheckCircle2,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Lock,
  User,
  Eye,
  EyeOff
} from 'lucide-react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { COLLECTIONS } from '../../config';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';

const SystemSettings = () => {
  const { currentUser, logout, refreshUser } = useAuth();

  // Current active tab state
  const [activeTab, setActiveTab] = useState('general');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // General Settings State
  const [siteName, setSiteName] = useState('ADU Navi');
  const [contactEmail, setContactEmail] = useState('support@adunavi.com');
  const [contactPhone, setContactPhone] = useState('+1 (800) 555-0142');
  const [logoUrl, setLogoUrl] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [signupAllowed, setSignupAllowed] = useState(true); // Moved to General

  // Appearance State
  const [themeColor, setThemeColor] = useState('#10b981');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState('solid');

  // SEO State
  const [siteTitle, setSiteTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [robotsTxt, setRobotsTxt] = useState('Index, Follow');

  // Emails State
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);
  const [enableSmsAlerts, setEnableSmsAlerts] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('');
  const [smsTemplate, setSmsTemplate] = useState('');

  // Mail Provider / SMTP Credentials State
  const [mailProvider, setMailProvider] = useState('smtp');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [fromEmail, setFromEmail] = useState('no-reply@adunavi.com');
  const [fromName, setFromName] = useState('ADU Navi');

  // Security Credentials State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const settings = dbService.getSettings();

    // General
    setSiteName(settings.siteName || 'ADU Navi');
    setContactEmail(settings.contactEmail || 'support@adunavi.com');
    setContactPhone(settings.contactPhone || '+1 (800) 555-0142');
    setLogoUrl(settings.logoUrl || '');
    setMaintenanceMode(settings.maintenanceMode !== undefined ? settings.maintenanceMode : false);
    setSignupAllowed(settings.signupAllowed !== undefined ? settings.signupAllowed : true);

    // Appearance
    setThemeColor(settings.themeColor || '#10b981');
    setDarkMode(settings.darkMode !== undefined ? settings.darkMode : false);
    setSidebarStyle(settings.sidebarStyle || 'solid');

    // SEO
    setSiteTitle(settings.siteTitle || 'ADU Navi - All-in-One ADU Platform');
    setMetaDescription(settings.metaDescription || 'Find state-by-state ADU laws, property checkers, cost estimation libraries, and professional directory lists for building ADUs.');
    setMetaKeywords(settings.metaKeywords || 'adu, accessory dwelling unit, zoning, permitting');
    setRobotsTxt(settings.robotsTxt || 'Index, Follow');

    // Emails
    setEmailTemplate(settings.notificationEmailTemplate || '');
    setSmsTemplate(settings.notificationSmsTemplate || '');
    setEnableEmailAlerts(settings.enableEmailAlerts !== undefined ? settings.enableEmailAlerts : true);
    setEnableSmsAlerts(settings.enableSmsAlerts !== undefined ? settings.enableSmsAlerts : false);

    // Mail Settings
    setMailProvider(settings.mailProvider || 'smtp');
    setSmtpHost(settings.smtpHost || '');
    setSmtpPort(settings.smtpPort || '587');
    setSmtpUser(settings.smtpUser || '');
    setSmtpPass(settings.smtpPass || '');
    setFromEmail(settings.fromEmail || 'no-reply@adunavi.com');
    setFromName(settings.fromName || 'ADU Navi');

    // Credentials prefill
    if (currentUser) {
      setAdminEmail(currentUser.email || '');
      setAdminPassword(currentUser.password || '');
      setAdminConfirmPassword(currentUser.password || '');
    }
  }, [currentUser]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Save all general config to LocalStorage settings DB
      dbService.saveSettings({
        siteName,
        contactEmail,
        contactPhone,
        logoUrl,
        maintenanceMode,
        signupAllowed,
        themeColor,
        darkMode,
        sidebarStyle,
        siteTitle,
        metaDescription,
        metaKeywords,
        robotsTxt,
        notificationEmailTemplate: emailTemplate,
        notificationSmsTemplate: smsTemplate,
        enableEmailAlerts,
        enableSmsAlerts,
        mailProvider,
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass,
        fromEmail,
        fromName
      });

      // 2. If credentials changed, update Firestore doc
      if (currentUser && (adminEmail.trim().toLowerCase() !== currentUser.email || adminPassword !== currentUser.password)) {
        const cleanOldEmail = currentUser.email.trim().toLowerCase();
        const cleanNewEmail = adminEmail.trim().toLowerCase();

        if (adminPassword !== adminConfirmPassword) {
          alert("Passwords do not match!");
          setSaving(false);
          return;
        }

        if (adminPassword.length < 6) {
          alert("Password must be at least 6 characters long.");
          setSaving(false);
          return;
        }

        const oldRef = doc(db, COLLECTIONS.USERS, cleanOldEmail);
        const newRef = doc(db, COLLECTIONS.USERS, cleanNewEmail);

        // Fetch current document details
        const oldSnap = await getDoc(oldRef);
        let adminData = oldSnap.exists() ? oldSnap.data() : {};

        // Update fields
        const updatedAdminData = {
          ...adminData,
          email: cleanNewEmail,
          password: adminPassword
        };

        if (cleanOldEmail !== cleanNewEmail) {
          // Confirm if the new target email is available
          const checkNewSnap = await getDoc(newRef);
          if (checkNewSnap.exists()) {
            alert("This email is already in use by another account.");
            setSaving(false);
            return;
          }

          await setDoc(newRef, updatedAdminData);
          await deleteDoc(oldRef);
        } else {
          await setDoc(oldRef, updatedAdminData);
        }

        // Update local database list
        try {
          const users = dbService.getUsers();
          const idxOld = users.findIndex(u => u.id === cleanOldEmail);
          const updatedUserEntry = { id: cleanNewEmail, ...updatedAdminData };
          if (idxOld !== -1) {
            if (cleanOldEmail !== cleanNewEmail) {
              users.splice(idxOld, 1);
              users.push(updatedUserEntry);
            } else {
              users[idxOld] = updatedUserEntry;
            }
          } else {
            users.push(updatedUserEntry);
          }
          dbService.saveUsers(users);
        } catch (err) {
          console.error("Local users db sync failed:", err);
        }

        // Log out admin if email changed
        if (cleanOldEmail !== cleanNewEmail) {
          alert("Admin email has been changed. Please log in again using the new email.");
          setSaving(false);
          logout();
          return;
        } else {
          await refreshUser();
        }
      }

      dbService.addLog('Modified global admin system settings & security parameters');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Save settings failed:", err);
      alert("Failed to save settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'seo', label: 'SEO Metadata', icon: Search },
    { id: 'emails', label: 'Emails & Alerts', icon: Mail },
    { id: 'security', label: 'Admin Credentials', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">System Control Center</h2>
          <p className="text-xs text-slate-400 mt-1">Configure global preferences, design colors, SEO, notification rules, and security locks.</p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Global platform configuration updated successfully!</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all ${isActive
                ? 'border-emerald-600 text-emerald-600 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-8">

        {/* TAB 1: General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <Sliders className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">General Configurations</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Website Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={siteName}
                  onChange={e => setSiteName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Branding Logo URL</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. /assets/logo.png"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Support Contact Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Support Phone Number</label>
                <input
                  type="text"
                  className="input-field"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-slate-700">Allow New Public Sign-Ups</h5>
                  <p className="text-[10px] text-slate-500 font-medium">Toggling off blocks homeowners and builders registrations.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSignupAllowed(!signupAllowed)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {signupAllowed ? (
                    <ToggleRight className="w-10 h-10 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-300" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-500/[0.03]">
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-slate-700">Platform Maintenance Mode</h5>
                  <p className="text-[10px] text-slate-500 font-medium">Restrict public access to site, showing maintenance notice.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {maintenanceMode ? (
                    <ToggleRight className="w-10 h-10 text-amber-500" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Appearance */}
        {activeTab === 'appearance' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <Palette className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Appearance & Theme Branding</h3>
            </div>

            <div className="max-w-sm space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Primary Accent Color Theme</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer overflow-hidden p-0.5 bg-white shrink-0"
                  value={themeColor}
                  onChange={e => setThemeColor(e.target.value)}
                />
                <input
                  type="text"
                  className="input-field font-mono"
                  placeholder="#10b981"
                  value={themeColor}
                  onChange={e => setThemeColor(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SEO */}
        {activeTab === 'seo' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <Search className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Search Engine Optimization (SEO)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Platform Document Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={siteTitle}
                  onChange={e => setSiteTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Meta Keywords</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. adu, planning, zoning"
                  value={metaKeywords}
                  onChange={e => setMetaKeywords(e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Platform Meta Description</label>
                <textarea
                  rows={3}
                  className="input-field"
                  value={metaDescription}
                  onChange={e => setMetaDescription(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Emails */}
        {activeTab === 'emails' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <Mail className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Emails & Alerts dispatchers</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mail Provider Type</label>
                <select
                  className="input-field"
                  value={mailProvider}
                  onChange={e => setMailProvider(e.target.value)}
                >
                  <option value="smtp">Standard SMTP Server</option>
                  <option value="sendgrid">SendGrid API</option>
                  <option value="mailgun">Mailgun API</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SMTP Host / Server Address</label>
                <input
                  type="text"
                  placeholder="e.g. smtp.sendgrid.net"
                  className="input-field font-mono"
                  value={smtpHost}
                  onChange={e => setSmtpHost(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SMTP Port</label>
                <input
                  type="text"
                  placeholder="e.g. 587"
                  className="input-field font-mono"
                  value={smtpPort}
                  onChange={e => setSmtpPort(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SMTP Username / API User</label>
                <input
                  type="text"
                  placeholder="e.g. apikey"
                  className="input-field font-mono"
                  value={smtpUser}
                  onChange={e => setSmtpUser(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SMTP Password / API Key</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="input-field font-mono"
                  value={smtpPass}
                  onChange={e => setSmtpPass(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sender From Email</label>
                <input
                  type="email"
                  placeholder="no-reply@yourdomain.com"
                  className="input-field"
                  value={fromEmail}
                  onChange={e => setFromEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sender Name</label>
                <input
                  type="text"
                  placeholder="e.g. ADU Navi Notifications"
                  className="input-field"
                  value={fromName}
                  onChange={e => setFromName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Zoning Alert Email Template (Markdown)</label>
                <textarea
                  rows={4}
                  className="input-field font-mono text-xs"
                  value={emailTemplate}
                  onChange={e => setEmailTemplate(e.target.value)}
                />
                <p className="text-[10px] text-slate-400 mt-2 font-semibold">Available placeholders: {"{{name}}"}, {"{{location}}"}, {"{{details}}"}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SMS Alert Template</label>
                <input
                  type="text"
                  className="input-field font-mono text-xs"
                  value={smsTemplate}
                  onChange={e => setSmsTemplate(e.target.value)}
                />
                <p className="text-[10px] text-slate-400 mt-2 font-semibold">Available placeholders: {"{{location}}"}, {"{{details}}"}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Security (Admin Credentials Only) */}
        {activeTab === 'security' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <Lock className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Change Admin Credentials</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Administrator Email Address</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    className="input-field !pl-10"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field !pl-10 !pr-10 font-mono"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="input-field !pl-10 !pr-10 font-mono"
                    placeholder="••••••••"
                    value={adminConfirmPassword}
                    onChange={e => setAdminConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 !py-3 !px-8 font-bold text-xs uppercase tracking-wider disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                Saving Config...
              </>
            ) : (
              <>
                <Save className="w-4.5 h-4.5" />
                Save Site Settings
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SystemSettings;
