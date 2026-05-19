import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, BookOpen, Save, CheckCircle2 } from 'lucide-react';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import RichTextEditor from '../components/RichTextEditor';
import { dbService } from '../../services/dbService';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Guides');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('ADU Navi Editor');

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Default blogs fallback list
  const DEFAULT_BLOGS = [
    { id: 'blog-1', title: 'Complete Guide to California ADU Legality in 2026', category: 'Legislation', date: '2026-05-18', author: 'ADU Navi Editor', coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop' },
    { id: 'blog-2', title: 'Garage Conversions vs Detached Units: Cost breakdown', category: 'Cost Estimation', date: '2026-05-14', author: 'Alex Rivera', coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop' },
    { id: 'blog-3', title: 'How SB 1211 removes local parking space mandates', category: 'Zoning Rules', date: '2026-05-10', author: 'ADU Navi Editor', coverImage: 'https://images.unsplash.com/photo-1541913007727-4dd01126ac03?q=80&w=400&auto=format&fit=crop' }
  ];

  const loadBlogs = () => {
    const data = localStorage.getItem('adu-db-blogs');
    if (data) {
      return JSON.parse(data);
    }
    localStorage.setItem('adu-db-blogs', JSON.stringify(DEFAULT_BLOGS));
    return DEFAULT_BLOGS;
  };

  useEffect(() => {
    setBlogs(loadBlogs());
  }, []);

  const openAddModal = () => {
    setEditingBlog(null);
    setTitle('');
    setCategory('Guides');
    setCoverImage('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop');
    setContent('');
    setAuthor('ADU Navi Editor');
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setCategory(blog.category);
    setCoverImage(blog.coverImage || '');
    setContent(blog.content || '');
    setAuthor(blog.author || 'ADU Navi Editor');
    setIsModalOpen(true);
  };

  const handleSaveBlog = (e) => {
    e.preventDefault();

    const payload = {
      title,
      category,
      coverImage,
      content,
      author,
      date: editingBlog ? editingBlog.date : new Date().toISOString().split('T')[0]
    };

    const currentBlogs = [...blogs];
    if (editingBlog) {
      // Update
      const idx = currentBlogs.findIndex(b => b.id === editingBlog.id);
      if (idx !== -1) {
        currentBlogs[idx] = { ...currentBlogs[idx], ...payload };
      }
      dbService.addLog(`Updated blog post: "${title}"`);
    } else {
      // Create
      const added = {
        id: 'blog-' + Date.now(),
        ...payload
      };
      currentBlogs.unshift(added);
      dbService.addLog(`Created and published blog article: "${title}"`);
    }

    setBlogs(currentBlogs);
    localStorage.setItem('adu-db-blogs', JSON.stringify(currentBlogs));
    
    setSaveSuccess(true);
    setIsModalOpen(false);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDeleteBlog = (id, blogTitle) => {
    if (window.confirm(`Delete the article "${blogTitle}"?`)) {
      const updated = blogs.filter(b => b.id !== id);
      setBlogs(updated);
      localStorage.setItem('adu-db-blogs', JSON.stringify(updated));
      dbService.addLog(`Deleted blog article: "${blogTitle}"`);
    }
  };

  const tableHeaders = [
    { label: "Cover & Title" },
    { label: "Category" },
    { label: "Author" },
    { label: "Published Date" },
    { label: "Actions", className: "text-right" }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Blog / News Management</h2>
          <p className="text-xs text-slate-400 mt-1">Publish homeowner educational guides, regulatory analysis, and regional newsletters.</p>
        </div>

        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-xs font-bold shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Article
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Blog article synced and published!</span>
        </div>
      )}

      {/* Main Table view */}
      <AdminTable 
        headers={tableHeaders}
        data={blogs}
        searchPlaceholder="Search articles by title..."
        searchField="title"
        renderRow={(blog) => (
          <tr key={blog.id} className="hover:bg-slate-50/50">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden shrink-0">
                  <img src={blog.coverImage} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 text-sm leading-snug max-w-sm line-clamp-2">{blog.title}</h4>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold uppercase">
                {blog.category}
              </span>
            </td>
            <td className="px-6 py-4 text-xs font-bold text-slate-600">{blog.author}</td>
            <td className="px-6 py-4 text-slate-400 text-xs font-semibold">{blog.date}</td>
            <td className="px-6 py-4 text-right flex justify-end gap-2">
              <button 
                onClick={() => openEditModal(blog)}
                className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg hover:text-slate-800 transition-colors"
                title="Edit Article"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDeleteBlog(blog.id, blog.title)}
                className="p-1.5 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                title="Delete Article"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        )}
      />

      {/* --- ADD/EDIT MODAL --- */}
      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBlog ? "Modify Blog Article" : "Publish Blog Article"} size="lg">
        <form onSubmit={handleSaveBlog} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Article Title</label>
              <input type="text" placeholder="e.g. How to convert your garage into a junior ADU" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category / Tag</label>
              <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Guides">Guides & Explanations</option>
                <option value="Legislation">Legislation & Zoning Updates</option>
                <option value="Cost Estimation">Cost & Budgeting Advice</option>
                <option value="Contractors">Contractor Tips</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Author Credit</label>
              <input type="text" className="input-field" value={author} onChange={e => setAuthor(e.target.value)} required />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cover Image URL</label>
              <input type="url" className="input-field text-xs font-mono" value={coverImage} onChange={e => setCoverImage(e.target.value)} required />
            </div>
          </div>

          <RichTextEditor 
            label="Article Content (Markdown Supported)"
            value={content}
            onChange={setContent}
            placeholder="Write the complete article here. You can use markdown headers, lists, and links."
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary !py-2 !px-5 text-xs font-bold">Cancel</button>
            <button type="submit" className="btn-primary !py-2 !px-5 text-xs font-bold">Publish Post</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default BlogManager;
