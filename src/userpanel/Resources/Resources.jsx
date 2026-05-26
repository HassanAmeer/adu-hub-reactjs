import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useUserAuth';
import { dbService } from '../../services/dbService';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { COLLECTIONS } from '../../config';
import { Download, FileText, Lock, ChevronRight, Sparkles, FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resources = () => {
  const { currentUser } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const isPro = currentUser?.subscription === 'pro';

  useEffect(() => {
    // Setup real-time listener on resources collection
    let unsubscribe = () => {};

    const setupListener = async () => {
      try {
        const resourcesRef = collection(db, COLLECTIONS.RESOURCES);
        unsubscribe = onSnapshot(resourcesRef, (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMaterials(list);
            localStorage.setItem('adu-db-resources', JSON.stringify(list));
          } else {
            // fallback to local storage
            setMaterials(dbService.getResources());
          }
          setLoading(false);
        }, (err) => {
          console.error("Resources stream error:", err);
          setMaterials(dbService.getResources());
          setLoading(false);
        });
      } catch (err) {
        console.error("Resources load error:", err);
        setMaterials(dbService.getResources());
        setLoading(false);
      }
    };

    setupListener();
    return () => unsubscribe();
  }, []);

  const handleDownload = (m) => {
    // If restricted to Pro and user is Free, block
    const isRestricted = m.access === 'pro';
    if (isRestricted && !isPro) {
      alert("This resource is locked. Please upgrade to Pro Tier to download.");
      return;
    }

    if (m.fileUrl) {
      if (m.fileUrl.startsWith('data:')) {
        // Base64 file download trigger
        const element = document.createElement("a");
        element.href = m.fileUrl;
        element.download = m.fileName || `${m.title.replace(/\s+/g, '_')}_document`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } else {
        // External link download trigger
        window.open(m.fileUrl, '_blank');
      }
    } else {
      // Simulate premium download
      const element = document.createElement("a");
      const file = new Blob([`Simulating download of resource file: ${m.title}\nDescription: ${m.desc}\nSize: ${m.size}`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${m.title.replace(/\s+/g, '_')}_mock_file.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm h-48 animate-pulse space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-150 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-150 rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-8 bg-slate-150 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-primary">Downloads & Resources</h3>
          <p className="text-xs text-slate-400 mt-1">Get pre-vetted architectural blueprints, planning checklists, and agreement forms.</p>
        </div>
        
        {!isPro && (
          <Link 
            to="/userpanel/subscriptions" 
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl shrink-0 self-start sm:self-auto text-xs font-bold text-amber-850 hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Unlock Pro templates & blueprints</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {materials.map((m) => {
          const isRestricted = m.access === 'pro';
          const isLocked = isRestricted && !isPro;
          return (
            <div 
              key={m.id} 
              className={`bg-white p-6 rounded-[24px] border flex flex-col justify-between space-y-6 group transition-all duration-300 hover:shadow-md ${
                isLocked 
                  ? 'border-slate-250 bg-slate-50/20 opacity-80' 
                  : 'border-slate-200 hover:border-secondary shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    isLocked 
                      ? 'bg-slate-100 text-slate-400 border-slate-200' 
                      : 'bg-slate-50 border-slate-100 text-primary group-hover:bg-secondary/15 group-hover:text-secondary'
                  }`}>
                    <FileText className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 justify-between">
                      <h4 className="font-bold text-slate-800 text-sm truncate leading-snug flex-1">{m.title}</h4>
                      {isRestricted && (
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                          isLocked ? 'bg-slate-200 text-slate-500' : 'bg-secondary/10 text-secondary'
                        }`}>
                          Pro Benefit
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{m.type} • {m.size}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{m.desc}</p>
              </div>

              {isLocked ? (
                <div className="space-y-3 pt-2">
                  <Link 
                    to="/userpanel/subscriptions"
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-250 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" /> Unlock Pro Access
                  </Link>
                  <p className="text-[10px] text-center text-slate-450 font-medium leading-normal">
                    This file is locked for free users. Upgrade to standard Pro tier to download.
                  </p>
                </div>
              ) : (
                <button 
                  onClick={() => handleDownload(m)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-secondary hover:text-white text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <FileDown className="w-4 h-4" /> Download Resource
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Resources;
