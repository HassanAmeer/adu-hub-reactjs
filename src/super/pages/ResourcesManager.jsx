import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Download, Save, X, 
  Layers, Search, ShieldAlert, ArrowRight, FileText, Info, CheckCircle2
} from 'lucide-react';
import { dbService } from '../../services/dbService';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';

const ResourcesManager = () => {
  const [resources, setResources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PDF Document');
  const [size, setSize] = useState('2.0 MB');
  const [desc, setDesc] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [access, setAccess] = useState('all');

  // Dual-mode Upload fields
  const [sourceMode, setSourceMode] = useState('url'); // url | upload
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileBase64, setUploadedFileBase64] = useState('');

  useEffect(() => {
    setResources(dbService.getResources());
  }, []);

  const openAddModal = () => {
    setEditingRes(null);
    setTitle('');
    setType('PDF Document');
    setSize('2.0 MB');
    setDesc('');
    setFileUrl('');
    setAccess('all');
    setSourceMode('url');
    setUploadedFileName('');
    setUploadedFileBase64('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (res) => {
    setEditingRes(res);
    setTitle(res.title);
    setType(res.type || 'PDF Document');
    setSize(res.size || '1.0 MB');
    setDesc(res.desc || '');
    setAccess(res.access || 'all');
    setErrorMsg('');

    if (res.fileUrl && res.fileUrl.startsWith('data:')) {
      setSourceMode('upload');
      setUploadedFileBase64(res.fileUrl);
      setUploadedFileName(res.fileName || 'Attached Document');
      setFileUrl('');
    } else {
      setSourceMode('url');
      setFileUrl(res.fileUrl || '');
      setUploadedFileBase64('');
      setUploadedFileName('');
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      
      // Auto-extract size
      const bytes = file.size;
      let sizeStr = '0 KB';
      if (bytes >= 1024 * 1024) {
        sizeStr = (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      } else {
        sizeStr = Math.round(bytes / 1024) + ' KB';
      }
      setSize(sizeStr);

      // Auto-extract format type
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'pdf') {
        setType('PDF Document');
      } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
        setType('Excel Spreadsheet');
      } else if (['docx', 'doc'].includes(ext)) {
        setType('Word Template');
      } else if (['dwg', 'dxf', 'cad'].includes(ext)) {
        setType('CAD / PDF Drawing');
      } else if (['zip', 'rar', '7z'].includes(ext)) {
        setType('ZIP Archive');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        reader.result && setUploadedFileBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveResource = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !desc.trim()) {
      setErrorMsg('Please populate the title and description.');
      return;
    }

    const finalFileUrl = sourceMode === 'upload' ? uploadedFileBase64 : fileUrl;
    if (!finalFileUrl) {
      setErrorMsg('Please upload a file or specify a download link URL.');
      return;
    }

    try {
      const payload = { 
        title, 
        type, 
        size, 
        desc, 
        fileUrl: finalFileUrl, 
        fileName: sourceMode === 'upload' ? uploadedFileName : '',
        access 
      };

      if (editingRes) {
        const updated = dbService.updateResource(editingRes.id, payload);
        if (updated) {
          setResources(prev => prev.map(r => r.id === editingRes.id ? updated : r));
          setSuccessMsg('Download resource updated successfully!');
        }
      } else {
        const added = dbService.addResource(payload);
        setResources(prev => [added, ...prev]);
        setSuccessMsg('New download resource added successfully!');
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save resource.');
    }
  };

  const handleDeleteResource = (id, resTitle) => {
    if (window.confirm(`Permanently delete resource file: "${resTitle}"?`)) {
      try {
        dbService.deleteResource(id);
        setResources(prev => prev.filter(r => r.id !== id));
        setSuccessMsg('Download resource deleted.');
        setTimeout(() => setSuccessMsg(''), 4500);
      } catch (err) {
        setErrorMsg('Failed to delete resource.');
      }
    }
  };

  const tableHeaders = [
    { label: "Document Detail" },
    { label: "Format Type" },
    { label: "File Size" },
    { label: "Membership Access" },
    { label: "Actions", className: "text-right" }
  ];

  const totalFiles = resources.length;
  const freeFiles = resources.filter(r => r.access === 'all').length;
  const proFiles = resources.filter(r => r.access === 'pro').length;

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Downloads & Resources Manager</h2>
          <p className="text-xs text-slate-400 mt-1">Upload and manage downloadable guides, checklists, contract structures, and CAD blueprints.</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary !py-2.5 !px-5 text-xs font-bold flex items-center justify-center gap-2 text-white shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" /> Add New Document
        </button>
      </div>

      {/* ── Quick Counters ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Documents</span>
          <p className="text-2xl font-black text-slate-800">{totalFiles}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Free Access Documents</span>
          <p className="text-2xl font-black text-slate-800">{freeFiles}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pro Only Benefits</span>
          <p className="text-2xl font-black text-slate-800">{proFiles}</p>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl border border-emerald-200 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-200 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Main Table */}
      <AdminTable
        headers={tableHeaders}
        data={resources}
        searchPlaceholder="Search files by title or description..."
        searchField="title"
        renderRow={(res) => (
          <tr key={res.id} className="hover:bg-slate-50/50">
            <td className="px-6 py-4 max-w-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-0.5 animate-in fade-in zoom-in duration-200">
                  <FileText className="w-4.5 h-4.5 text-secondary" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate flex items-center gap-2">
                    {res.title}
                    {res.fileName && (
                      <span className="text-[8px] bg-slate-100 border border-slate-200 text-slate-500 font-bold px-1.5 py-0.5 rounded leading-none shrink-0" title={`File uploaded: ${res.fileName}`}>
                        Uploaded
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-semibold">{res.desc}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/50 whitespace-nowrap">
                {res.type}
              </span>
            </td>
            <td className="px-6 py-4 text-xs font-bold text-slate-700">
              {res.size}
            </td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                res.access === 'pro'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {res.access === 'pro' ? 'Pro Only' : 'All Users'}
              </span>
            </td>
            <td className="px-6 py-4 text-right flex justify-end gap-2">
              <button
                onClick={() => openEditModal(res)}
                className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg hover:text-slate-800 transition-colors cursor-pointer"
                title="Edit Document"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteResource(res.id, res.title)}
                className="p-1.5 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-650 rounded-lg transition-colors cursor-pointer"
                title="Delete Document"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        )}
      />

      {/* --- ADD / EDIT RESOURCE MODAL --- */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRes ? `Edit Document: ${editingRes.title}` : 'Add New Download Document'}
      >
        <form onSubmit={handleSaveResource} className="space-y-5">
          <div className="space-y-4">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Document Title</label>
              <input
                type="text"
                className="input-field"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Detached ADU Blueprint Guide"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Format Type</label>
                <select className="input-field" value={type} onChange={e => setType(e.target.value)}>
                  <option value="PDF Document">PDF Document</option>
                  <option value="Excel Spreadsheet">Excel Spreadsheet</option>
                  <option value="Word Template">Word Template</option>
                  <option value="CAD / PDF Drawing">CAD / PDF Drawing</option>
                  <option value="ZIP Archive">ZIP Archive</option>
                </select>
              </div>

              {/* Size */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">File Size</label>
                <input
                  type="text"
                  className="input-field"
                  value={size}
                  onChange={e => setSize(e.target.value)}
                  placeholder="e.g. 4.8 MB"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
              <textarea
                rows={2}
                className="input-field"
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Explain what resources/checklists are included inside this download..."
                required
              />
            </div>

            {/* Document Source Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider">File Source Selection</label>
              <div className="flex gap-2 bg-slate-50 p-1 border border-slate-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSourceMode('url')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    sourceMode === 'url' ? 'bg-white text-slate-800 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  External File Link URL
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('upload')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    sourceMode === 'upload' ? 'bg-white text-slate-800 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Direct File Upload
                </button>
              </div>
            </div>

            {sourceMode === 'url' ? (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Download File URL</label>
                <input
                  type="url"
                  className="input-field"
                  value={fileUrl}
                  onChange={e => setFileUrl(e.target.value)}
                  placeholder="e.g. https://example.com/blueprint.pdf"
                  required={sourceMode === 'url'}
                />
              </div>
            ) : (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Upload File Document</label>
                
                {!uploadedFileBase64 ? (
                  <div className="border-2 border-dashed border-slate-250 hover:border-secondary hover:bg-secondary/[0.02] rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      required={sourceMode === 'upload' && !uploadedFileBase64}
                    />
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <Download className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-700">Choose or drop document file here</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">Supports PDF, CAD zip, Excel, Word etc.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-secondary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{uploadedFileName}</p>
                        <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">File attached successfully</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setUploadedFileBase64(''); setUploadedFileName(''); }}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-450 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Membership Access */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Membership Restriction</label>
              <select className="input-field" value={access} onChange={e => setAccess(e.target.value)}>
                <option value="all">Free (All Platform Users)</option>
                <option value="pro">Pro Only (Requires Active Upgrade)</option>
              </select>
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary !py-2 !px-5 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary !py-2 !px-5 text-xs font-bold cursor-pointer"
            >
              Save Resource
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default ResourcesManager;
