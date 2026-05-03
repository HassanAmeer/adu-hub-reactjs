import React, { useState } from 'react';
import { 
  Search, 
  PenTool, 
  FileCheck, 
  Hammer, 
  Home as HomeIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Feasibility & Budget',
    icon: Search,
    time: '2-4 Weeks',
    desc: 'Verify if your property meets local zoning requirements and determine your project budget.',
    tasks: ['Check lot coverage', 'Review utility connections', 'Get initial cost estimate', 'Secure financing'],
    mistakes: ['Underestimating permit fees', 'Ignoring utility upgrades']
  },
  {
    id: 2,
    title: 'Design & Engineering',
    icon: PenTool,
    time: '1-3 Months',
    desc: 'Hire an architect to create site plans, floor plans, and structural calculations.',
    tasks: ['Hire designer/architect', 'Soil report (if needed)', 'Structural engineering', 'Energy calculations (Title 24)'],
    mistakes: ['Designing over budget', 'Not matching primary house style']
  },
  {
    id: 3,
    title: 'Permitting',
    icon: FileCheck,
    time: '2-6 Months',
    desc: 'Submit plans to the city and address any corrections requested by the building department.',
    tasks: ['Submit to city/county', 'Address plan check comments', 'Pay impact fees', 'Receive permit'],
    mistakes: ['Submitting incomplete plans', 'Ignoring neighborhood HOAs']
  },
  {
    id: 4,
    title: 'Construction',
    icon: Hammer,
    time: '4-8 Months',
    desc: 'The physical building process, from foundation to roof and interior finishes.',
    tasks: ['Hire licensed contractor', 'Foundation & Framing', 'Plumbing & Electrical', 'Roofing & Siding'],
    mistakes: ['Not having a detailed contract', 'Paying too much upfront']
  },
  {
    id: 5,
    title: 'Final Inspection',
    icon: HomeIcon,
    time: '1-2 Weeks',
    desc: 'Final sign-offs from city inspectors and receiving your Certificate of Occupancy.',
    tasks: ['Final building inspection', 'Fire safety check', 'Utility sign-off', 'Move-in ready'],
    mistakes: ['Moving in before final sign-off']
  }
];

const HowToBuildPage = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="bg-primary pt-24 pb-48 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl mb-6">How to Build an ADU</h1>
            <p className="text-xl text-slate-300">
              A comprehensive step-by-step guide to navigating the design, permitting, and construction process.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-1 right-0 w-full h-24 bg-slate-50 rounded-t-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                    activeStep === step.id 
                    ? 'bg-white border-secondary shadow-soft ring-1 ring-secondary/20' 
                    : 'bg-white/50 border-border hover:bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    activeStep === step.id ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase ${activeStep === step.id ? 'text-secondary' : 'text-slate-400'}`}>Step 0{step.id}</p>
                    <h3 className={`font-bold text-sm ${activeStep === step.id ? 'text-primary' : 'text-slate-600'}`}>{step.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-border shadow-soft p-8 sm:p-12">
              {steps.filter(s => s.id === activeStep).map((step) => (
                <div key={step.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12 pb-12 border-b border-border">
                    <div className="max-w-xl">
                      <h2 className="text-3xl text-primary mb-4">{step.title}</h2>
                      <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                    <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-border inline-flex items-center gap-3">
                      <Clock className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Estimated Time</p>
                        <p className="font-bold text-primary">{step.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        Step Checklist
                      </h4>
                      <ul className="space-y-4">
                        {step.tasks.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-600">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-danger/5 border border-danger/10 rounded-2xl p-8">
                      <h4 className="text-lg font-bold mb-6 text-danger flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Common Mistakes
                      </h4>
                      <ul className="space-y-4">
                        {step.mistakes.map((mistake, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium">
                             <XCircle className="w-4 h-4 text-danger mt-1 flex-shrink-0" />
                             {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-16 flex justify-between items-center pt-8 border-t border-border">
                    <div className="flex items-center gap-4">
                       <p className="text-sm font-semibold text-slate-500">Need professional help for this step?</p>
                       <button className="text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                         Find {step.id === 2 ? 'Architects' : 'Contractors'} <ArrowRight className="w-4 h-4" />
                       </button>
                    </div>
                    {activeStep < 5 && (
                       <button 
                        onClick={() => setActiveStep(activeStep + 1)}
                        className="btn-primary !py-2.5 !px-6 text-sm"
                       >
                         Next Step
                       </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToBuildPage;
