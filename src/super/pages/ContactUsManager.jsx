// ContactUsManager.jsx
// Super Admin panel to view, inspect, and manage Contact Us messages submitted by users.
// Synchronizes real-time from Firestore database and falls back to LocalStorage representation.

import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2, Loader2, MessageSquare, Clock, User, Inbox } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { COLLECTIONS } from '../../config';
import AdminTable from '../components/AdminTable';

const ContactUsManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, COLLECTIONS.CONTACT_US);
      const snapshot = await getDocs(colRef);
      const list = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      
      // Sort by timestamp descending
      list.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
      setMessages(list);
      
      // Sync local storage
      localStorage.setItem('adu-db-contactus', JSON.stringify(list));
    } catch (err) {
      console.error("Firestore contactus fetch failed, falling back to local storage:", err);
      const localStr = localStorage.getItem('adu-db-contactus');
      setMessages(localStr ? JSON.parse(localStr) : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this contact message?")) {
      try {
        const docRef = doc(db, COLLECTIONS.CONTACT_US, id);
        await deleteDoc(docRef);
        
        // Sync state
        const updated = messages.filter(msg => msg.id !== id);
        setMessages(updated);
        localStorage.setItem('adu-db-contactus', JSON.stringify(updated));
        
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }

        setSuccessMsg('Message deleted successfully!');
        setTimeout(() => setSuccessMsg(''), 2500);
      } catch (err) {
        console.error("Delete message failed:", err);
        alert("Failed to delete message: " + err.message);
      }
    }
  };

  const handleMarkAsRead = async (messageObj) => {
    if (messageObj.status === 'read') return;
    try {
      const docRef = doc(db, COLLECTIONS.CONTACT_US, messageObj.id);
      await updateDoc(docRef, { status: 'read' });

      // Update state
      const updated = messages.map(msg => msg.id === messageObj.id ? { ...msg, status: 'read' } : msg);
      setMessages(updated);
      localStorage.setItem('adu-db-contactus', JSON.stringify(updated));
      
      if (selectedMessage?.id === messageObj.id) {
        setSelectedMessage(prev => ({ ...prev, status: 'read' }));
      }
    } catch (err) {
      console.error("Failed to update message status:", err);
    }
  };

  const handleSelectMessage = (messageObj) => {
    setSelectedMessage(messageObj);
    handleMarkAsRead(messageObj);
  };

  const tableHeaders = [
    { label: "Date Submitted" },
    { label: "User Name" },
    { label: "Email Address" },
    { label: "Message Snippet" },
    { label: "Status" },
    { label: "Actions", className: "text-right" }
  ];

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Contact Us Messages</h2>
          <p className="text-xs text-slate-400 mt-1">View, track, and manage inquiries submitted by users from the public site.</p>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="btn-primary !py-2.5 !px-4 text-xs font-bold flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Inbox className="w-4 h-4" />}
          Refresh Inbox
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Table/List Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Mail className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Messages Inbox</h3>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-xs text-slate-400">Loading submitted messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-20 text-center text-slate-400 space-y-2">
              <Inbox className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">No contact messages submitted yet</p>
              <p className="text-xs">Submissions from the public Contact page will appear here.</p>
            </div>
          ) : (
            <AdminTable
              headers={tableHeaders}
              data={messages}
              searchPlaceholder="Search by name, email, or message..."
              searchField="name"
              renderRow={(msg) => (
                <tr 
                  key={msg.id} 
                  onClick={() => handleSelectMessage(msg)}
                  className={`hover:bg-slate-50/70 cursor-pointer transition-all ${
                    selectedMessage?.id === msg.id ? 'bg-slate-50' : ''
                  } ${msg.status === 'unread' ? 'font-bold text-slate-900 bg-emerald-500/[0.01]' : ''}`}
                >
                  <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                    {msg.name}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">
                    {msg.email}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">
                    {msg.message}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${
                      msg.status === 'unread' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {msg.status || 'unread'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => handleDeleteMessage(msg.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )}
            />
          )}
        </div>

        {/* Selected Message Inspector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col h-full">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Message Details</h3>
          </div>

          {selectedMessage ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Meta details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">From</p>
                      <p className="text-sm font-bold text-slate-800">{selectedMessage.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                      <a href={`mailto:${selectedMessage.email}`} className="text-xs font-semibold text-emerald-600 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Submitted</p>
                      <p className="text-xs font-semibold text-slate-600">
                        {selectedMessage.timestamp ? new Date(selectedMessage.timestamp).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Box */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Message</p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto font-medium">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ADU Navi Inquiry`}
                  className="w-full btn-primary flex items-center justify-center gap-2 text-center text-xs font-bold uppercase py-2.5 rounded-xl"
                >
                  <Mail className="w-4 h-4" /> Reply via Email
                </a>
                <button
                  onClick={(e) => handleDeleteMessage(selectedMessage.id, e)}
                  className="px-3.5 border border-slate-200 hover:border-rose-350 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-xl transition-all"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-20">
              <Mail className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider">Select a message</p>
              <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                Click on any message in the inbox to view full contents, responder email, and trigger replies.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ContactUsManager;
