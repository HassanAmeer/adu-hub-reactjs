import React, { useState } from 'react';
import { 
  Search, 
  MapPin,
  Home as HomeIcon,
  Send,
  FileCheck, 
  Hammer, 
  CheckCircle2,
  Clock,
  AlertOctagon,
  ArrowRight,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    id: 1,
    title: 'Feasibility Check',
    icon: Search,
    time: '1-2 Weeks',
    desc: 'Verify if your property meets local zoning requirements, lot size minimums, and setbacks.',
    tasks: ['Check local zoning code', 'Verify lot coverage limits', 'Determine max allowable size', 'Initial budget planning'],
    rejections: ['Zoning prohibits ADUs', 'Insufficient lot size']
  },
  {
    id: 2,
    title: 'Survey & Site Constraints',
    icon: MapPin,
    time: '2-4 Weeks',
    desc: 'Hire a surveyor to accurately map property lines, topography, and existing structures.',
    tasks: ['Topographic survey', 'Locate existing utilities', 'Identify easements', 'Soil testing (if required)'],
    rejections: ['Building over easements', 'Inaccurate property lines']
  },
  {
    id: 3,
    title: 'Design Options',
    icon: HomeIcon,
    time: '4-8 Weeks',
    desc: 'Choose your ADU type (Garage, Detached, Conversion) and work with an architect on plans.',
    tasks: ['Select ADU type', 'Hire architect/designer', 'Develop floor plans', 'Title 24 energy calcs (CA)'],
    rejections: ['Design exceeds max height', 'Non-compliant fire separation']
  },
  {
    id: 4,
    title: 'Plan Submittal',
    icon: Send,
    time: '1-2 Weeks',
    desc: 'Compile all required documents, engineering calcs, and forms to submit to the city.',
    tasks: ['Complete permit applications', 'Compile structural calcs', 'Submit site plans', 'Pay initial intake fees'],
    rejections: ['Incomplete application packages', 'Missing engineering stamps']
  },
  {
    id: 5,
    title: 'Permit Review',
    icon: FileCheck,
    time: '4-12 Weeks',
    desc: 'The city reviews your plans. You will likely need to make corrections and resubmit.',
    tasks: ['City department routing', 'Receive plan check comments', 'Architect makes corrections', 'Final permit approval'],
    rejections: ['Failing to address city comments', 'Unresolved utility conflicts']
  },
  {
    id: 6,
    title: 'Construction',
    icon: Hammer,
    time: '4-8 Months',
    desc: 'The physical building process, passing rough inspections along the way.',
    tasks: ['Hire licensed general contractor', 'Pour foundation', 'Framing & Roofing', 'Plumbing & Electrical rough-in'],
    rejections: ['Failing rough inspections', 'Deviating from approved plans']
  },
  {
    id: 7,
    title: 'Final Inspection & Occupancy',
    icon: CheckCircle2,
    time: '1-2 Weeks',
    desc: 'Final sign-offs from city inspectors and receiving your Certificate of Occupancy.',
    tasks: ['Schedule final inspection', 'Fire safety sign-off', 'Utility connection approval', 'Receive Certificate of Occupancy'],
    rejections: ['Missing smoke/carbon detectors', 'Incomplete finishes']
  }
];

const HowToBuildPage = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="bg-primary pt-32 pb-48 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">How to Build an ADU</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              A comprehensive step-by-step roadmap to navigating the design, permitting, and construction process without costly mistakes.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-3">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                    activeStep === step.id 
                    ? 'bg-white border-secondary shadow-lg ring-1 ring-secondary/20 scale-105' 
                    : 'bg-white/80 border-slate-200 hover:bg-white hover:border-secondary/30 backdrop-blur-sm'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    activeStep === step.id ? 'bg-secondary text-white shadow-md shadow-secondary/30' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${activeStep === step.id ? 'text-secondary' : 'text-slate-400'}`}>Step 0{step.id}</p>
                    <h3 className={`font-bold text-sm ${activeStep === step.id ? 'text-slate-900' : 'text-slate-600'}`}>{step.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden min-h-[600px]">
              <AnimatePresence mode="wait">
                {steps.filter(s => s.id === activeStep).map((step) => (
                  <motion.div 
                    key={step.id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 sm:p-12"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 pb-12 border-b border-slate-100">
                      <div className="max-w-xl">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">{step.title}</h2>
                        <p className="text-lg text-slate-500 leading-relaxed">{step.desc}</p>
                      </div>
                      <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200 inline-flex items-center gap-4 shadow-sm flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                           <Clock className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Typical Timeline</p>
                          <p className="font-extrabold text-lg text-primary">{step.time}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
                        <h4 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          Step Checklist
                        </h4>
                        <ul className="space-y-4">
                          {step.tasks.map((task, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 shadow-sm shadow-emerald-500/50" />
                              <span className="font-medium">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                        <h4 className="text-xl font-bold mb-6 text-red-900 flex items-center gap-3 relative z-10">
                          <AlertOctagon className="w-6 h-6 text-red-500" />
                          Common Rejection Reasons
                        </h4>
                        <ul className="space-y-4 relative z-10">
                          {step.rejections.map((mistake, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-red-800 font-medium">
                               <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                               {mistake}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <Search className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-sm font-semibold text-slate-500">Need professional help?</p>
                            <button className="text-secondary font-bold hover:underline transition-all text-left">
                              Browse Directory
                            </button>
                         </div>
                      </div>
                      
                      <div className="flex gap-3 w-full sm:w-auto">
                        {activeStep > 1 && (
                          <button 
                            onClick={() => setActiveStep(activeStep - 1)}
                            className="btn-secondary !py-3 flex-1 sm:flex-none flex justify-center items-center gap-2"
                          >
                            Back
                          </button>
                        )}
                        {activeStep < 7 && (
                          <button 
                            onClick={() => setActiveStep(activeStep + 1)}
                            className="btn-primary !py-3 flex-1 sm:flex-none flex justify-center items-center gap-2"
                          >
                            Next Step
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToBuildPage;
