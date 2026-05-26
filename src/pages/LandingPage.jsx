import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, Home, Hammer, TrendingUp, PenTool, Briefcase, Building, ChevronRight, X, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../config';

// ─── Floating ADU Shape SVGs ─────────────────────────────────────────────────
const FloatingShape = ({ style, delay = 0, type = 'house' }) => {
  const shapes = {
    house: (
      <svg viewBox="0 0 60 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M30 4L56 22V52H40V38H20V52H4V22L30 4Z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        <rect x="25" y="36" width="10" height="16" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="10" y="28" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="40" y="28" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    cottage: (
      <svg viewBox="0 0 60 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M8 52V28L30 10L52 28V52H8Z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        <path d="M4 30L30 8L56 30" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="22" y="36" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M22 44h16" stroke="currentColor" strokeWidth="1.5" />
        <path d="M30 36v16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    garage: (
      <svg viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="4" y="18" width="52" height="30" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M4 18L30 4L56 18" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="12" y="26" width="36" height="22" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M12 31h36M12 36h36M12 41h36" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    studio: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="8" y="14" width="44" height="42" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M8 22h44" stroke="currentColor" strokeWidth="2" />
        <path d="M8 14L30 4L52 14" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="16" y="30" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="34" y="30" width="12" height="26" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  };
  return (
    <motion.div
      className="absolute pointer-events-none text-white/10"
      style={style}
      animate={{
        y: [0, -18, 0],
        rotate: [0, 8, -5, 0],
        scale: [1, 1.04, 1],
      }}
      transition={{
        duration: 7 + delay * 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {shapes[type]}
    </motion.div>
  );
};

// ─── Audience Roles ───────────────────────────────────────────────────────────
const roles = [
  {
    id: 'homeowner',
    label: 'Homeowner',
    icon: Home,
    desc: "Want to build or rent an ADU on your property",
    followUps: [
      {
        question: "What's your primary goal?",
        options: [
          { label: 'Rental income', route: ROUTES.COSTS, icon: TrendingUp },
          { label: 'Family housing', route: ROUTES.HOW_TO_BUILD, icon: Home },
          { label: 'Check if it\'s allowed', route: ROUTES.PROPERTY_CHECKER, icon: Search },
        ],
      },
    ],
  },
  {
    id: 'builder',
    label: 'Builder / Contractor',
    icon: Hammer,
    desc: "Looking for ADU requirements and local leads",
    followUps: [
      {
        question: "What do you need most?",
        options: [
          { label: 'Local requirements', route: ROUTES.STATES, icon: Building },
          { label: 'Find clients', route: ROUTES.DIRECTORY, icon: Briefcase },
          { label: 'Cost benchmarks', route: ROUTES.COSTS, icon: TrendingUp },
        ],
      },
    ],
  },
  {
    id: 'investor',
    label: 'Investor',
    icon: TrendingUp,
    desc: "Evaluating properties for ADU development ROI",
    followUps: [
      {
        question: "Where are you in the process?",
        options: [
          { label: 'Researching markets', route: ROUTES.STATES, icon: Building },
          { label: 'Checking a property', route: ROUTES.PROPERTY_CHECKER, icon: Search },
          { label: 'Estimating costs', route: ROUTES.COSTS, icon: TrendingUp },
        ],
      },
    ],
  },
  {
    id: 'architect',
    label: 'Architect / Designer',
    icon: PenTool,
    desc: "Stay updated on zoning, design rules and code changes",
    followUps: [
      {
        question: "What are you working on?",
        options: [
          { label: 'Zoning research', route: ROUTES.STATES, icon: Scale },
          { label: 'State laws', route: ROUTES.STATES, icon: Building },
          { label: 'Property check', route: ROUTES.PROPERTY_CHECKER, icon: Search },
        ],
      },
    ],
  },
  {
    id: 'realtor',
    label: 'Realtor / Agent',
    icon: Briefcase,
    desc: "Help clients understand property ADU potential",
    followUps: [
      {
        question: "What does your client need?",
        options: [
          { label: 'ADU feasibility check', route: ROUTES.PROPERTY_CHECKER, icon: Search },
          { label: 'Legal overview', route: ROUTES.STATES, icon: Scale },
          { label: 'Cost estimates', route: ROUTES.COSTS, icon: TrendingUp },
        ],
      },
    ],
  },
];

// Quick-pick suggestion chips for the search bar
const SUGGESTIONS = [
  'Can I build an ADU in Los Angeles?',
  'ADU rules in San Diego',
  'How much does an ADU cost?',
  'Detached ADU setback requirements',
  'California ADU law 2024',
];

// ─── Main Page ────────────────────────────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [followUpAnswer, setFollowUpAnswer] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`${ROUTES.HOME}?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate(ROUTES.HOME);
    }
  };

  const handleSuggestion = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFollowUpAnswer(null);
  };

  const handleFollowUpSelect = (option) => {
    setFollowUpAnswer(option);
    setTimeout(() => {
      navigate(option.route);
    }, 400);
  };

  const clearRole = () => {
    setSelectedRole(null);
    setFollowUpAnswer(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-primary">

      {/* ── Floating ADU Shape Decorations ────────────────────────── */}
      <FloatingShape type="house" delay={0} style={{ width: 90, height: 90, top: '8%', left: '6%' }} />
      <FloatingShape type="cottage" delay={1.2} style={{ width: 70, height: 70, top: '20%', right: '9%' }} />
      <FloatingShape type="studio" delay={0.5} style={{ width: 110, height: 110, bottom: '18%', left: '5%' }} />
      <FloatingShape type="garage" delay={2.1} style={{ width: 80, height: 80, bottom: '25%', right: '7%' }} />
      <FloatingShape type="house" delay={3} style={{ width: 55, height: 55, top: '55%', left: '16%' }} />
      <FloatingShape type="cottage" delay={1.8} style={{ width: 65, height: 65, top: '12%', left: '38%' }} />
      <FloatingShape type="studio" delay={2.5} style={{ width: 50, height: 50, bottom: '10%', right: '22%' }} />

      {/* ── Glow blobs ──────────────────────────────────────────────── */}
      <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-secondary/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-1/3 h-1/3 bg-accent/15 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 text-center py-16">

        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-secondary/40">
            A
          </div>
          <span className="text-2xl font-extrabold text-white">
            ADU<span className="text-secondary">Navi</span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight"
        >
          Ask anything about{' '}
          <span className="text-secondary">ADUs</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-300 text-lg mb-10 leading-relaxed"
        >
          Get instant answers on zoning, costs, permits, and local laws — powered by the most comprehensive ADU database.
        </motion.p>

        {/* ── Search Bar ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative mb-4"
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-white/95 backdrop-blur-xl border-2 border-white/30 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden focus-within:border-secondary transition-colors duration-200">
              <Search className="w-5 h-5 text-slate-400 ml-5 flex-shrink-0" />
              <input
                ref={inputRef}
                id="landing-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Ask anything related to ADUs…"
                className="flex-1 px-4 py-5 text-slate-800 text-lg bg-transparent outline-none placeholder-slate-400 font-medium"
                autoComplete="off"
              />
              <button
                type="submit"
                className="m-2 bg-secondary hover:bg-emerald-500 text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-secondary/30 hover:shadow-secondary/50 active:scale-95"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Suggestion Dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
              >
                <div className="p-2">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider px-3 py-2">Try asking…</p>
                  {SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      onMouseDown={() => handleSuggestion(s)}
                      className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-slate-700 text-sm transition-colors"
                    >
                      <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Go to Homepage link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mb-12"
        >
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
          >
            Go to Homepage
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* ── I Am A… Role Selector ──────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {!selectedRole ? (
            <motion.div
              key="role-selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-5">
                I am a…
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-secondary/50 text-white rounded-2xl text-sm font-semibold backdrop-blur-sm transition-all duration-200 shadow-lg"
                  >
                    <role.icon className="w-4 h-4 text-secondary" />
                    {role.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="follow-up"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* Role badge */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center gap-2 bg-secondary/20 border border-secondary/30 text-secondary px-4 py-2 rounded-full text-sm font-semibold">
                  <selectedRole.icon className="w-4 h-4" />
                  {selectedRole.label}
                </div>
                <button
                  onClick={clearRole}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Follow-up question */}
              {selectedRole.followUps.map((followUp, idx) => (
                <div key={idx}>
                  <p className="text-white text-lg font-bold mb-5">{followUp.question}</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {followUp.options.map((option, optIdx) => (
                      <motion.button
                        key={optIdx}
                        onClick={() => handleFollowUpSelect(option)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center gap-2.5 px-6 py-3.5 border text-white rounded-2xl text-sm font-semibold backdrop-blur-sm transition-all duration-200 shadow-lg ${followUpAnswer?.label === option.label
                          ? 'bg-secondary border-secondary shadow-secondary/40'
                          : 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-secondary/50'
                          }`}
                      >
                        {option.icon && <option.icon className="w-4 h-4" />}
                        {option.label}
                        <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingPage;
