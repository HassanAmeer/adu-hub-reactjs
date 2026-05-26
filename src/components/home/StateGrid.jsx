import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { COLLECTIONS, ROUTES } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { states } from '../../data/mockData';
import { ArrowRight, ChevronRight, X, Send, CheckCircle, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const StateGrid = () => {
  const { currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEmail, setModalEmail] = useState(currentUser?.email || '');
  const [modalName, setModalName] = useState(currentUser?.name || '');
  const [modalSent, setModalSent] = useState(false);
  const [modalSending, setModalSending] = useState(false);

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    if (!modalEmail || !modalName) return;
    setModalSending(true);
    try {
      const inqId = 'inq-' + Date.now();
      const inqRef = doc(db, COLLECTIONS.CONTACT_US, inqId);
      const msg = `[State Notification Request]\n\nName: ${modalName.trim()}\nEmail: ${modalEmail.trim().toLowerCase()}\nRequest: User wants to be notified when their state is added to the platform.`;
      await setDoc(inqRef, {
        id: inqId, name: modalName.trim(), email: modalEmail.trim().toLowerCase(), message: msg,
        timestamp: new Date().toISOString(), status: 'unread'
      });
      const existingStr = localStorage.getItem('adu-db-contactus');
      let existing = [];
      try { existing = existingStr ? JSON.parse(existingStr) : []; } catch { existing = []; }
      existing.unshift({ id: inqId, name: modalName.trim(), email: modalEmail.trim().toLowerCase(), message: msg, timestamp: new Date().toISOString(), status: 'unread' });
      localStorage.setItem('adu-db-contactus', JSON.stringify(existing));
      setModalSent(true);
    } catch (err) {
      console.error("Error submitting:", err);
      alert("Error submitting: " + err.message);
    } finally {
      setModalSending(false);
    }
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl text-primary mb-4">Explore by State</h2>
            <p className="text-slate-500">
              Select your state to view specific ADU regulations, upcoming legislation changes, and local building guidelines.
            </p>
          </div>
          <Link to={ROUTES.STATES} className="text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All States <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {states.map((state) => (
            <Link 
              key={state.id} 
              to={`/state/${state.name.toLowerCase()}`}
              className="bg-white p-6 rounded-2xl border border-border hover:shadow-soft transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`badge ${state.status === 'Allowed' ? 'badge-allowed' : 'badge-conditional'}`}>
                  {state.status}
                </span>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{state.name}</h3>
              <p className="text-slate-500 text-sm">{state.cities.length} major cities tracked</p>
            </Link>
          ))}
          
          <div className="bg-primary p-6 rounded-2xl flex flex-col justify-between text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Don't see your state?</h3>
              <p className="text-slate-300 text-sm mb-6">We're expanding nationwide. Get notified when your state is added.</p>
              <button onClick={() => { setModalOpen(true); setModalSent(false); }} className="text-sm font-bold flex items-center gap-2 text-secondary group-hover:gap-3 transition-all">
                Notify Me <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Notify Me Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !modalSending && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[24px] w-full max-w-md p-8 shadow-2xl relative"
            >
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>

              {modalSent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">You're on the List!</h3>
                  <p className="text-sm text-slate-500">We'll notify you when your state becomes available on ADU Navi.</p>
                  <button onClick={() => setModalOpen(false)} className="btn-primary mt-6 !px-8">Done</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary">Get Notified</h3>
                      <p className="text-sm text-slate-500">We'll email you when we add new states.</p>
                    </div>
                  </div>
                  <form onSubmit={handleNotifySubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
                      <input type="text" className="input-field" placeholder="John Doe" value={modalName} onChange={e => setModalName(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                      <input type="email" className="input-field" placeholder="john@example.com" value={modalEmail} onChange={e => setModalEmail(e.target.value)} required />
                    </div>
                    <button type="submit" disabled={modalSending} className="btn-primary w-full flex items-center justify-center gap-2 !py-3">
                      {modalSending ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <><Send className="w-4 h-4" /> Notify Me</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StateGrid;
