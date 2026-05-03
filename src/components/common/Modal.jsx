import React from 'react';
import { X, Star, MapPin, Globe, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, professional }) => {
  if (!professional) return null;

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
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-2/5 h-64 md:h-auto relative">
                <img src={professional.image} alt={professional.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
              </div>
              
              <div className="p-8 md:w-3/5">
                <div className="flex items-center gap-2 mb-2 text-secondary font-bold text-xs uppercase tracking-widest">
                   {professional.role}
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{professional.name}</h3>
                
                <div className="flex items-center gap-4 mb-8">
                   <div className="flex items-center gap-1 bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-bold">
                      <Star className="w-4 h-4 fill-warning" />
                      {professional.rating}
                   </div>
                   <div className="text-sm text-slate-400 font-medium">{professional.reviews} reviews</div>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Specializing in {professional.tags.join(', ')} ADUs. With over 10 years of experience in {professional.location}, we help homeowners maximize their property value.
                </p>

                <div className="space-y-4 mb-8">
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {professional.location}
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Globe className="w-4 h-4 text-slate-400" />
                      www.coastaldesign.com
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <button className="btn-primary flex items-center justify-center gap-2 !py-3">
                      <Mail className="w-4 h-4" />
                      Email
                   </button>
                   <button className="btn-outline flex items-center justify-center gap-2 !py-3">
                      <Phone className="w-4 h-4" />
                      Call
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
