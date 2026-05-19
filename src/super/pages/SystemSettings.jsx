import React, { useState, useEffect } from 'react';
import { Settings, Globe, Mail, Save, CheckCircle2 } from 'lucide-react';
import { dbService } from '../../services/dbService';

const SystemSettings = () => {
  const [siteTitle, setSiteTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('');
  const [smsTemplate, setSmsTemplate] = useState('');
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);
  const [enableSmsAlerts, setEnableSmsAlerts] = useState(false);
  
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const settings = dbService.getSettings();
    setSiteTitle(settings.siteTitle || 'ADU Navi - All-in-One ADU Platform');
    setMetaDescription(settings.metaDescription || 'Find state-by-state ADU laws, property checkers, cost estimation libraries, and professional directory lists for building ADUs.');
    setEmailTemplate(settings.notificationEmailTemplate || '');
    setSmsTemplate(settings.notificationSmsTemplate || '');
    setEnableEmailAlerts(settings.enableEmailAlerts !== undefined ? settings.enableEmailAlerts : true);
    setEnableSmsAlerts(settings.enableSmsAlerts !== undefined ? settings.enableSmsAlerts : false);
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    dbService.saveSettings({
      siteTitle,
      metaDescription,
      notificationEmailTemplate: emailTemplate,
      notificationSmsTemplate: smsTemplate,
      enableEmailAlerts,
      enableSmsAlerts
    });
    
    dbService.addLog('Modified global SEO meta configurations & subscriber alerts templates');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800">Global Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Configure global search index metadata, email notifications copy, and delivery routes.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Global platform configuration updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* SEO Metadata Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Globe className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-855 text-sm uppercase tracking-wider">Search Engine Optimization (SEO)</h3>
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
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Platform Meta Description</label>
              <input 
                type="text" 
                className="input-field" 
                value={metaDescription} 
                onChange={e => setMetaDescription(e.target.value)} 
                required 
              />
            </div>
          </div>
        </div>

        {/* Notifications & Dispatch settings */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Mail className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-855 text-sm uppercase tracking-wider">Notification Delivery Templates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <input 
                type="checkbox" 
                id="enableEmail" 
                className="w-4 h-4 text-emerald-600 border-slate-350 rounded-xs focus:ring-emerald-500"
                checked={enableEmailAlerts} 
                onChange={e => setEnableEmailAlerts(e.target.checked)} 
              />
              <label htmlFor="enableEmail" className="text-xs text-slate-700 font-bold select-none">
                Enable Email Alerts Dispatcher
              </label>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <input 
                type="checkbox" 
                id="enableSms" 
                className="w-4 h-4 text-emerald-600 border-slate-350 rounded-xs focus:ring-emerald-500"
                checked={enableSmsAlerts} 
                onChange={e => setEnableSmsAlerts(e.target.checked)} 
              />
              <label htmlFor="enableSms" className="text-xs text-slate-700 font-bold select-none">
                Enable SMS Text Notifications
              </label>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Zoning Alert Email Template (Markdown)</label>
              <textarea 
                rows={6} 
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

        {/* Form Action */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="btn-primary flex items-center gap-2 !py-3 !px-8 font-bold"
          >
            <Save className="w-4.5 h-4.5" /> Save Site Settings
          </button>
        </div>

      </form>
    </div>
  );
};

export default SystemSettings;
