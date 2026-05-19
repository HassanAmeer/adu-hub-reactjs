import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { COLLECTIONS } from '../config';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !msg) return;

    try {
      const inqId = 'inq-' + Date.now();
      const inqRef = doc(db, COLLECTIONS.CONTACT_US, inqId);
      await setDoc(inqRef, {
        id: inqId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: msg.trim(),
        timestamp: new Date().toISOString(),
        status: 'unread'
      });

      // Sync to local storage for local admin panel compatibility
      try {
        const existingStr = localStorage.getItem('adu-db-contactus');
        let existing = [];
        try {
          existing = existingStr ? JSON.parse(existingStr) : [];
        } catch {
          existing = [];
        }
        existing.unshift({
          id: inqId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: msg.trim(),
          timestamp: new Date().toISOString(),
          status: 'unread'
        });
        localStorage.setItem('adu-db-contactus', JSON.stringify(existing));
      } catch (err) {
        console.error("Local storage inquiry sync failed:", err);
      }

      setSent(true);
      setName('');
      setEmail('');
      setMsg('');
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      alert("Error submitting message: " + err.message);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-black text-primary uppercase tracking-tight">Contact Us</h1>
          <p className="text-slate-500 font-medium text-lg">Have questions about zoning rules or licensing? Get in touch with our team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Column */}
          <div className="bg-primary text-white p-8 rounded-[24px] space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Get In Touch</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our support team responds to questions within 24 business hours. Let us know how we can assist your ADU planning goals!
              </p>
            </div>

            <div className="space-y-4 text-sm font-semibold">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary" />
                <span>support@adunavi.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary" />
                <span>+1 (800) 555-0142</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>100 Pine Street, San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-primary">Send Message</h3>

            {sent && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Inquiry submitted successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Message</label>
                <textarea
                  rows={5}
                  className="input-field"
                  placeholder="How can we help?"
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary !py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
