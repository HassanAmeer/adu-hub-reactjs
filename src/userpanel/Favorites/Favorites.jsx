import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useUserAuth';
import { dbService } from '../../services/dbService';
import { Trash2, ShieldCheck, Heart, ExternalLink, Users, FileText } from 'lucide-react';

const Favorites = () => {
  const { currentUser, refreshUser } = useAuth();
  const [pros, setPros] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('pros');

  useEffect(() => {
    const freshUser = dbService.getUsers().find(u => u.id === currentUser.id);
    const directory = dbService.getDirectory();
    if (freshUser && freshUser.savedPros) {
      const savedList = directory.filter(p => freshUser.savedPros.includes(p.id));
      setPros(savedList);
    }
  }, [currentUser]);

  const handleRemove = (id) => {
    const freshUser = dbService.getUsers().find(u => u.id === currentUser.id);
    if (freshUser) {
      const updated = freshUser.savedPros.filter(pid => pid !== id);
      dbService.updateUser(currentUser.id, { savedPros: updated });
      setPros(pros.filter(p => p.id !== id));
      refreshUser();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-primary">Saved & Favorites</h3>
        <p className="text-xs text-slate-400 mt-1">Manage saved contractors, regional laws, and design layouts.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button 
          onClick={() => setActiveSubTab('pros')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'pros'
              ? 'border-secondary text-primary'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-4 h-4" /> Saved Contractors ({pros.length})
        </button>
        <button 
          onClick={() => setActiveSubTab('articles')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'articles'
              ? 'border-secondary text-primary'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className="w-4 h-4" /> Saved Guidelines
        </button>
      </div>

      {activeSubTab === 'pros' ? (
        pros.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
            <p className="text-slate-500 font-medium">You haven't saved any professional listings yet.</p>
            <p className="text-xs text-slate-400 mt-1">Search the regional directory to find and save verified builders.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pros.map((pro) => (
              <div key={pro.id} className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-sm flex gap-4 items-center group">
                <img src={pro.images[0]} alt={pro.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{pro.name}</h4>
                  <p className="text-xs text-secondary font-bold">{pro.role}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{pro.location}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRemove(pro.id)}
                    className="text-slate-400 hover:text-red-500 p-2 border border-slate-100 rounded-lg hover:bg-slate-50"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-400">
          No saved articles or guidelines in your list yet.
        </div>
      )}
    </div>
  );
};

export default Favorites;
