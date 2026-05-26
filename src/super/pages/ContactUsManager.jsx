// ContactUsManager.jsx
// Super Admin panel to view, inspect, and manage Contact Us messages submitted by users.
// Synchronizes real-time from Firestore database and falls back to LocalStorage representation.

import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2, Loader2, MessageSquare, Clock, User, Inbox, PhoneCall, Bell, Tag } from 'lucide-react';
import { TableSkeleton } from '../../components/common/Skeleton';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { COLLECTIONS } from '../../config';
import AdminTable from '../components/AdminTable';

const getMessageType = (msg) => {
  const match = msg.message?.match(/^\[(.+?)\]/);
  if (match) return match[1];
  return 'General Inquiry';
};

const TYPE_CONFIG = {
  'Book Free Consult': { icon: PhoneCall, color: 'text-indigo-600' },
  'Get Alerted on Changes': { icon: Bell, color: 'text-amber-600' },
  'General Inquiry': { icon: MessageSquare, color: 'text-slate-600' }
};

const TypeBadge = ({ msg }) => {
  const type = getMessageType(msg);
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG['General Inquiry'];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold ${cfg.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {type}
    </span>
  );
};

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
      list.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
      setMessages(list);
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

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const consultCount = messages.filter(m => getMessageType(m) === 'Book Free Consult').length;
  const alertCount = messages.filter(m => getMessageType(m) === 'Get Alerted on Changes').length;

  const handleDeleteMessage = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this contact message?")) {
      try {
        const docRef = doc(db, COLLECTIONS.CONTACT_US, id);
        await deleteDoc(docRef);
        const updated = messages.filter(msg => msg.id !== id);
        setMessages(updated);
        localStorage.setItem('adu-db-contactus', JSON.stringify(updated));
        if (selectedMessage?.id === id) setSelectedMessage(null);
        setSuccessMsg('Message deleted successfully!');
        setTimeout(() => setSuccessMsg(''), 2500);
      } catch (err) {
        console.error("Delete message failed:", err);
        alert("Failed to delete message: " + err.message);
      }
    }
  };

  const handleMarkAsRead = async (messageObj, read = true) => {
    const newStatus = read ? 'read' : 'unread';
    if (messageObj.status === newStatus) return;
    try {
      const docRef = doc(db, COLLECTIONS.CONTACT_US, messageObj.id);
      await updateDoc(docRef, { status: newStatus });
      const updated = messages.map(msg => msg.id === messageObj.id ? { ...msg, status: newStatus } : msg);
      setMessages(updated);
      localStorage.setItem('adu-db-contactus', JSON.stringify(updated));
      if (selectedMessage?.id === messageObj.id) {
        setSelectedMessage(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update message status:", err);
    }
  };

  const handleSelectMessage = (messageObj) => {
    setSelectedMessage(messageObj);
    if (messageObj.status === 'unread') handleMarkAsRead(messageObj, true);
  };

  const tableHeaders = [
    { label: "Date" },
    { label: "Name" },
    { label: "Email" },
    { label: "Type" },
    { label: "Message" },
    { label: "Status" },
    { label: "", className: "text-right" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Messages', value: messages.length, icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Unread', value: unreadCount, icon: Inbox, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Consultations', value: consultCount, icon: PhoneCall, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Change Alerts', value: alertCount, icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 shadow-xs">
            <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-primary">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Inbox</h2>
            <p className="text-xs text-slate-400">{messages.length} message{messages.length !== 1 ? 's' : ''} • {unreadCount} unread</p>
          </div>
        </div>
        <button onClick={fetchMessages} disabled={loading} className="btn-primary !py-2 !px-3.5 text-xs font-bold flex items-center gap-2">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Inbox className="w-3.5 h-3.5" />}
          Refresh
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : messages.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold">No messages yet</p>
              <p className="text-xs mt-1">Submissions from the public Contact page will appear here.</p>
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
                  className={`cursor-pointer transition-all ${
                    selectedMessage?.id === msg.id ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                  } ${msg.status === 'unread' ? 'bg-emerald-500/[0.02]' : ''}`}
                >
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <p className="text-xs text-slate-500">{msg.timestamp ? new Date(msg.timestamp).toLocaleDateString() : '—'}</p>
                    <p className="text-[10px] text-slate-400">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className={`text-sm ${msg.status === 'unread' ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{msg.name}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-slate-500 font-mono">{msg.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <TypeBadge msg={msg} />
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-slate-500 max-w-[200px] truncate">{msg.message?.replace(/^\[.+?\]\s*-\s*\w+\s*/, '').substring(0, 60) || '—'}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      msg.status === 'unread' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/40' : 'bg-slate-300'
                    }`} title={msg.status || 'unread'} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={(e) => handleDeleteMessage(msg.id, e)} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              )}
            />
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full min-h-[400px]">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  Message Details
                </h3>
                <button
                  onClick={() => handleMarkAsRead(selectedMessage, selectedMessage.status !== 'read')}
                  className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border transition-all ${
                    selectedMessage.status === 'read'
                      ? 'text-slate-400 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {selectedMessage.status === 'read' ? 'Mark Unread' : 'Mark Read'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Contact Info Card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {selectedMessage.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{selectedMessage.name}</p>
                      <p className="text-xs text-slate-500">{getMessageType(selectedMessage)}</p>
                    </div>
                  </div>
                  <a href={`mailto:${selectedMessage.email}`} className="flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    {selectedMessage.email}
                  </a>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedMessage.timestamp ? new Date(selectedMessage.timestamp).toLocaleString() : 'N/A'}
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Message</p>
                  <div className="bg-white rounded-xl border border-slate-200 p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto font-medium shadow-xs">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
                <a href={`mailto:${selectedMessage.email}?subject=Re: ADU Navi Inquiry`} className="flex-1 btn-primary flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-lg">
                  <Mail className="w-3.5 h-3.5" /> Reply
                </a>
                <button onClick={(e) => handleDeleteMessage(selectedMessage.id, e)} className="px-3 border border-slate-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-lg transition-all" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 px-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-500">No message selected</p>
              <p className="text-xs mt-1 max-w-xs">Click on any message from the inbox to view its full contents here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUsManager;
