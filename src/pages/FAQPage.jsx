import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQPage = () => {
  const faqs = [
    {
      q: 'What is the maximum size allowed for a detached ADU?',
      a: 'In most states like California, detached ADUs can be built up to 1,200 square feet, depending on lot size and regional setbacks. Local ordinances cannot restrict ADUs to less than 850 square feet (or 1,000 square feet for units with multiple bedrooms).'
    },
    {
      q: 'Do setback rules apply to garage conversions?',
      a: 'No. Under recent housing laws, conversion of an existing accessory structure (like a detached garage) into an ADU does not require additional setbacks. You can build within the same footprint.'
    },
    {
      q: 'Is parking required for a backyard ADU?',
      a: 'Generally no, if the accessory unit is located within one-half mile walking distance of public transit, or if it is created by converting an existing garage or carport.'
    },
    {
      q: 'How long does the ADU permit approval cycle take?',
      a: 'By law, local municipalities must approve or deny ADU applications within 60 days of a complete submission. However, architectural preparation and planning reviews often take 2-4 months.'
    }
  ];

  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-primary uppercase tracking-tight">Frequently Asked Questions</h1>
          <p className="text-slate-500 font-medium text-lg">Quick answers regarding ADU feasibility, municipal regulations, and permits.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50/50 transition-colors"
              >
                <span className="font-bold text-primary text-sm sm:text-base flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 text-secondary shrink-0" />
                  {faq.q}
                </span>
                {openIdx === idx ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 pt-1 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
