import React, { useState } from 'react';
import { X, Star, MapPin, Globe, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/dbService';

const Modal = ({ isOpen, onClose, professional }) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!professional) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    // Simulate sending lead
    setTimeout(() => {
      // Find the user account that owns this pro listing
      const users = dbService.getUsers();
      // Look up by listing ID or email
      const proUser = users.find(u => u.proListingId === professional.id || u.email === professional.email);

      const newLead = {
        id: 'lead-' + Date.now(),
        name: currentUser.name || currentUser.displayName || 'Homeowner',
        email: currentUser.email,
        phone: phoneInput || 'N/A',
        property: addressInput || 'Checked Location',
        message: message,
        date: new Date().toISOString().split('T')[0]
      };

      if (proUser) {
        const updatedLeads = [newLead, ...(proUser.leads || [])];
        dbService.updateUser(proUser.id, { leads: updatedLeads });
      } else {
        // Fallback: If no pro user account exists, we can append to a general leads log or simulated mailbox
        console.log('No user account linked to this professional. Lead saved in system logs.');
      }

      dbService.addLog(`Sent customer inquiry lead to "${professional.name}"`);
      setLoading(false);
      setSubmitted(true);
      setMessage('');
      setPhoneInput('');
      setAddressInput('');
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[60]"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[650px]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Image Section */}
            <div className="md:w-2/5 h-48 md:h-auto relative bg-slate-950 flex-shrink-0">
              <img src={professional.images ? professional.images[0] : professional.image} alt={professional.name} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white hidden md:block">
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block mb-1">{professional.role}</span>
                <h4 className="text-xl font-bold">{professional.name}</h4>
                <p className="text-xs text-slate-300 mt-2 font-medium">Located in {professional.location}</p>
              </div>
            </div>
            
            {/* Right Scrollable Info/Form Section */}
            <div className="p-6 sm:p-8 md:w-3/5 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-secondary font-bold text-xs uppercase tracking-widest">
                   {professional.role}
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">{professional.name}</h3>
                
                <div className="flex items-center gap-4 mb-4">
                   <div className="flex items-center gap-1 bg-amber-50 text-amber-500 px-3 py-1 rounded-full text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {professional.rating}
                   </div>
                   <div className="text-xs text-slate-400 font-bold">{professional.reviews} reviews</div>
                </div>

                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  {professional.description || `Specializing in ${professional.tags?.join(', ')} ADUs. Providing state-of-the-art designs and permitting consulting for your neighborhood.`}
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 font-semibold">
                   <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {professional.location}
                   </div>
                   {professional.website && (
                     <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <a href={professional.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-secondary">{professional.website.replace('https://', '')}</a>
                     </div>
                   )}
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="border-t border-slate-100 pt-6">
                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <h5 className="font-bold text-emerald-900 text-sm">Message Sent!</h5>
                    <p className="text-xs text-slate-500 font-medium">The contractor will reach out to you within 24-48 business hours.</p>
                  </div>
                ) : currentUser ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <h5 className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-2">Request Consultation</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="Phone Number" 
                        className="input-field !py-2 !text-xs" 
                        value={phoneInput}
                        onChange={e => setPhoneInput(e.target.value)}
                        required
                      />
                      <input 
                        type="text" 
                        placeholder="Property Address" 
                        className="input-field !py-2 !text-xs" 
                        value={addressInput}
                        onChange={e => setAddressInput(e.target.value)}
                        required
                      />
                    </div>
                    <textarea 
                      rows={2} 
                      placeholder="Write your project details..." 
                      className="input-field !py-2 !text-xs" 
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                    />
                    <button type="submit" className="w-full btn-primary !py-2.5 !text-xs flex items-center justify-center gap-2">
                      {loading ? 'Sending...' : 'Submit Inquiry'}
                    </button>
                  </form>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <p className="text-xs text-slate-500 font-semibold mb-3">Please sign in to send inquiries and request project estimates.</p>
                    <a href="/login" className="btn-secondary !py-2 text-xs block text-center">Sign In to Message</a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

