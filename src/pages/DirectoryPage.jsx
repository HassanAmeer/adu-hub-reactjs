import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  ChevronDown, 
  ExternalLink,
  MessageCircle,
  Building2,
  HardHat,
  Palette,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton, { CardSkeleton } from '../components/common/Skeleton';
import Modal from '../components/common/Modal';

const professionals = [
  {
    id: 1,
    name: 'Coastal Design Studio',
    role: 'Architect',
    rating: 4.9,
    reviews: 124,
    location: 'San Diego, CA',
    tags: ['Detached', 'Conversion', 'Modern'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$$',
    verified: true
  },
  {
    id: 2,
    name: 'Precision Build ADU',
    role: 'General Contractor',
    rating: 4.7,
    reviews: 89,
    location: 'Los Angeles, CA',
    tags: ['Modular', 'Eco-Friendly'],
    images: [
      'https://images.unsplash.com/photo-1541913007727-4dd01126ac03?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$',
    verified: true
  },
  {
    id: 3,
    name: 'Urban Dwelling Co.',
    role: 'ADU Consultant',
    rating: 5.0,
    reviews: 42,
    location: 'San Francisco, CA',
    tags: ['Feasibility', 'Permitting'],
    images: [
      'https://images.unsplash.com/photo-1574067769351-34440c836935?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$',
    verified: false
  },
  {
    id: 4,
    name: 'Golden State Architects',
    role: 'Architect',
    rating: 4.8,
    reviews: 215,
    location: 'Sacramento, CA',
    tags: ['Luxury', 'Historical'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4ea0d?q=80&w=400&auto=format&fit=crop'
    ],
    price: '$$$$',
    verified: true
  }
];

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative h-56 w-full overflow-hidden group/carousel">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </AnimatePresence>
      
      {images.length > 1 && (
        <>
          <button 
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur text-primary flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white shadow-md z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur text-primary flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white shadow-md z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const DirectoryPage = () => {
  const [role, setRole] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedPro, setSelectedPro] = useState(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen pb-24"
    >
      <Modal 
        isOpen={!!selectedPro} 
        onClose={() => setSelectedPro(null)} 
        professional={selectedPro} 
      />

      {/* Search Header */}
      <div className="bg-primary text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8">Professionals Directory</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
              <input 
                type="text" 
                placeholder="Search by name, location, or keyword..." 
                className="input-field !pl-14 !py-4 text-lg w-full bg-white text-slate-900 border-none shadow-lg focus:ring-4 focus:ring-secondary/30"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative min-w-[200px]">
                <select className="input-field appearance-none !pr-12 !py-4 text-lg bg-white text-slate-900 border-none shadow-lg cursor-pointer">
                  <option>California</option>
                  <option>Washington</option>
                  <option>Oregon</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
              <button className="btn-secondary !bg-white/10 hover:!bg-white/20 !text-white border border-white/20 flex items-center justify-center gap-2 !px-8 !py-4 shadow-lg backdrop-blur-md">
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 text-lg">Professional Role</h4>
                  <div className="space-y-3">
                    {['All', 'Architect', 'General Contractor', 'ADU Consultant', 'Engineer'].map(item => (
                      <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="role" 
                          checked={role === item}
                          onChange={() => setRole(item)}
                          className="w-5 h-5 accent-secondary" 
                        />
                        <span className={`text-sm font-semibold transition-colors ${role === item ? 'text-primary' : 'text-slate-600 group-hover:text-primary'}`}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4 text-lg">ADU Type Specialty</h4>
                  <div className="space-y-3">
                    {['Detached', 'Attached', 'Conversion', 'Junior ADU', 'Multi-family'].map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 accent-secondary rounded" />
                        <span className="text-sm font-semibold text-slate-600 group-hover:text-primary transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4 text-lg">Budget Range</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {['$', '$$', '$$$', '$$$$'].map(b => (
                      <button key={b} className="py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-all">
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="lg:col-span-3">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <p className="text-sm text-slate-500 font-bold">{professionals.length} professionals found</p>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                  Sort by: <span className="font-bold text-primary flex items-center gap-1 cursor-pointer">Most Reviews <ChevronDown className="w-4 h-4" /></span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {loading ? (
                  [1, 2, 3, 4].map(i => <CardSkeleton key={i} />)
                ) : (
                  professionals.map((pro) => (
                    <div key={pro.id} className="bg-white rounded-[24px] border border-slate-200 shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all overflow-hidden group cursor-pointer flex flex-col" onClick={() => setSelectedPro(pro)}>
                      <div className="relative">
                        <ImageCarousel images={pro.images} />
                        
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-md">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          {pro.rating} <span className="text-slate-400 font-medium">({pro.reviews})</span>
                        </div>
                        
                        <div className="absolute top-4 left-4 flex gap-2">
                          {pro.role === 'Architect' && <div className="w-9 h-9 rounded-xl bg-primary/90 backdrop-blur text-white flex items-center justify-center shadow-md"><Palette className="w-4.5 h-4.5" /></div>}
                          {pro.role === 'General Contractor' && <div className="w-9 h-9 rounded-xl bg-primary/90 backdrop-blur text-white flex items-center justify-center shadow-md"><HardHat className="w-4.5 h-4.5" /></div>}
                          {pro.role === 'ADU Consultant' && <div className="w-9 h-9 rounded-xl bg-primary/90 backdrop-blur text-white flex items-center justify-center shadow-md"><Building2 className="w-4.5 h-4.5" /></div>}
                        </div>
                      </div>
                      
                      <div className="p-6 sm:p-8 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <h3 className="text-xl sm:text-2xl font-bold text-primary leading-tight group-hover:text-secondary transition-colors">{pro.name}</h3>
                          <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">{pro.price}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-5">
                          <p className="text-sm font-bold text-secondary">{pro.role}</p>
                          {pro.verified && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              <ShieldCheck className="w-3.5 h-3.5" /> Verified
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
                          <MapPin className="w-4.5 h-4.5 text-slate-400" />
                          {pro.location}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                          {pro.tags.map(tag => (
                            <span key={tag} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <button className="flex-1 btn-primary !py-3 text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                            <MessageCircle className="w-4.5 h-4.5" />
                            Message
                          </button>
                          <button className="w-14 h-[46px] bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-primary transition-all">
                            <ExternalLink className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
             </div>
             
             <div className="mt-16 flex justify-center">
                <button className="btn-secondary !bg-white !text-primary border border-slate-200 hover:!bg-slate-50 shadow-sm !px-10">
                  Load More Professionals
                </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DirectoryPage;
