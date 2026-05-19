import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogPage = () => {
  const posts = [
    {
      title: 'New California Legislation Relaxes Setback Regulations for Attached ADUs',
      desc: 'Learn about the latest housing senate bill that minimizes setback requirements to just 4 feet across all residential zoning spaces.',
      date: 'May 18, 2026',
      author: 'Sarah Jenkins',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: 'Top 5 Prefab ADU Builders in the Pacific Northwest for 2026',
      desc: 'An in-depth review of pre-fabricated builders specializing in modular accessory units, construction cost efficiency, and speed.',
      date: 'May 12, 2026',
      author: 'Marcus Vance',
      img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: 'How to Finance Your ADU Build: HELOCs vs Construction Loans',
      desc: 'Our comprehensive breakdown of the best financing mechanisms, interest rates, and loan structures for accessory dwelling unit builds.',
      date: 'April 28, 2026',
      author: 'David Goldstein',
      img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop'
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-black text-primary uppercase tracking-tight">ADU Insights & News</h1>
          <p className="text-slate-500 font-medium text-lg">Stay updated with regional zoning amendments, design templates, and contractor profiles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((p, idx) => (
            <div key={idx} className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="h-48 overflow-hidden bg-slate-100">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {p.date}</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {p.author}</span>
                  </div>
                  <h3 className="font-bold text-primary text-base line-clamp-2 group-hover:text-secondary transition-colors">{p.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">{p.desc}</p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button className="inline-flex items-center gap-1 text-xs font-bold text-secondary group-hover:underline">
                  Read Article <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
