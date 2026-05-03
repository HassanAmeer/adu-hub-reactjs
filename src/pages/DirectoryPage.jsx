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
  Palette
} from 'lucide-react';
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
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
    price: '$$$'
  },
  {
    id: 2,
    name: 'Precision Build ADU',
    role: 'General Contractor',
    rating: 4.7,
    reviews: 89,
    location: 'Los Angeles, CA',
    tags: ['Modular', 'Eco-Friendly'],
    image: 'https://images.unsplash.com/photo-1541913007727-4dd01126ac03?q=80&w=400&auto=format&fit=crop',
    price: '$$'
  },
  {
    id: 3,
    name: 'Urban Dwelling Co.',
    role: 'ADU Consultant',
    rating: 5.0,
    reviews: 42,
    location: 'San Francisco, CA',
    tags: ['Feasibility', 'Permitting'],
    image: 'https://images.unsplash.com/photo-1574067769351-34440c836935?q=80&w=400&auto=format&fit=crop',
    price: '$'
  },
  {
    id: 4,
    name: 'Golden State Architects',
    role: 'Architect',
    rating: 4.8,
    reviews: 215,
    location: 'Sacramento, CA',
    tags: ['Luxury', 'Historical'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop',
    price: '$$$$'
  }
];

const DirectoryPage = () => {
  const [role, setRole] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedPro, setSelectedPro] = useState(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <Modal 
        isOpen={!!selectedPro} 
        onClose={() => setSelectedPro(null)} 
        professional={selectedPro} 
      />

      {/* Search Header */}
      <div className="bg-white border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl text-primary mb-8">Professionals Directory</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by name or keyword..." 
                className="input-field !pl-12"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <select className="input-field appearance-none !pr-12 bg-white">
                  <option>California</option>
                  <option>Washington</option>
                  <option>Oregon</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>
              <button className="btn-outline flex items-center gap-2 !px-6">
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Professional Role</h4>
              <div className="space-y-2">
                {['All', 'Architect', 'General Contractor', 'ADU Consultant', 'Engineer'].map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="role" 
                      checked={role === item}
                      onChange={() => setRole(item)}
                      className="w-5 h-5 accent-secondary" 
                    />
                    <span className={`text-sm font-semibold transition-colors ${role === item ? 'text-primary' : 'text-slate-500 group-hover:text-primary'}`}>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">ADU Type Specialty</h4>
              <div className="space-y-2">
                {['Detached', 'Attached', 'Conversion', 'Junior ADU', 'Multi-family'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 accent-secondary rounded" />
                    <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Budget Range</h4>
              <div className="grid grid-cols-4 gap-2">
                {['$', '$$', '$$$', '$$$$'].map(b => (
                  <button key={b} className="py-2 rounded-lg border border-border text-sm font-bold text-slate-500 hover:border-secondary hover:text-secondary transition-all">
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="lg:col-span-3">
             <div className="flex justify-between items-center mb-8">
                <p className="text-sm text-slate-500 font-semibold">{professionals.length} professionals found</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  Sort by: <span className="font-bold text-primary flex items-center gap-1 cursor-pointer">Most Reviews <ChevronDown className="w-4 h-4" /></span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                  [1, 2, 3, 4].map(i => <CardSkeleton key={i} />)
                ) : (
                  professionals.map((pro) => (
                    <div key={pro.id} className="card p-0 overflow-hidden group cursor-pointer" onClick={() => setSelectedPro(pro)}>
                      <div className="relative h-48">
                        <img src={pro.image} alt={pro.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          {pro.rating}
                        </div>
                        <div className="absolute top-4 left-4 flex gap-2">
                          {pro.role === 'Architect' && <div className="w-8 h-8 rounded-lg bg-primary/80 backdrop-blur text-white flex items-center justify-center"><Palette className="w-4 h-4" /></div>}
                          {pro.role === 'General Contractor' && <div className="w-8 h-8 rounded-lg bg-primary/80 backdrop-blur text-white flex items-center justify-center"><HardHat className="w-4 h-4" /></div>}
                          {pro.role === 'ADU Consultant' && <div className="w-8 h-8 rounded-lg bg-primary/80 backdrop-blur text-white flex items-center justify-center"><Building2 className="w-4 h-4" /></div>}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-primary">{pro.name}</h3>
                          <span className="text-sm font-bold text-slate-400">{pro.price}</span>
                        </div>
                        <p className="text-sm font-semibold text-secondary mb-4">{pro.role}</p>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                          <MapPin className="w-4 h-4" />
                          {pro.location}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8">
                          {pro.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-tight">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <button className="flex-1 btn-primary !py-2.5 !px-4 text-sm flex items-center justify-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Message
                          </button>
                          <button className="w-12 h-10 border border-border rounded-xl flex items-center justify-center text-slate-400 hover:border-secondary hover:text-secondary transition-all">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
             </div>
             
             <div className="mt-12 flex justify-center">
                <button className="btn-outline">Load More Professionals</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
