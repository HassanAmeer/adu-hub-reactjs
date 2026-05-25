import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Eye, Cookie, Share2, Lock, Settings, RefreshCw, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '../config';

const SectionCard = ({ icon: Icon, number, title, children, accent = 'slate' }) => (
  <section>
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-8 h-8 rounded-xl bg-${accent}-100 flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 text-${accent}-600`} />
      </div>
      <h2 className="text-lg font-bold text-primary">
        <span className="text-secondary mr-2">{number}.</span>{title}
      </h2>
    </div>
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-slate-600 text-sm leading-relaxed">
      {children}
    </div>
  </section>
);

const PrivacyPage = () => {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      accent: 'blue',
      content: (
        <div>
          <p className="mb-3">We may collect:</p>
          <ul className="space-y-2 mb-4">
            {[
              'Basic usage data (e.g., pages viewed, device type)',
              'Information you voluntarily submit (e.g., contact forms, email inquiries)',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-500 italic text-xs">We do not knowingly collect sensitive personal information.</p>
        </div>
      ),
    },
    {
      icon: Settings,
      title: 'How We Use Information',
      accent: 'emerald',
      content: (
        <div>
          <p className="mb-3">Information is used to:</p>
          <ul className="space-y-2">
            {[
              'Operate and improve the Platform',
              'Respond to inquiries',
              'Analyze site usage and performance',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      icon: Cookie,
      title: 'Cookies & Analytics',
      accent: 'amber',
      content: (
        <p>
          ADUNavi may use cookies or similar technologies to improve functionality and understand usage patterns. You
          may disable cookies through your browser settings.
        </p>
      ),
    },
    {
      icon: Share2,
      title: 'Data Sharing',
      accent: 'indigo',
      content: (
        <div>
          <p className="mb-3">We do not sell or rent personal information. Information may be shared only:</p>
          <ul className="space-y-2">
            {[
              'To comply with legal obligations',
              'With service providers supporting platform operations',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      icon: Lock,
      title: 'Data Security',
      accent: 'slate',
      content: (
        <p>
          Reasonable administrative and technical measures are used to protect information. However,{' '}
          <strong>no system is 100% secure.</strong>
        </p>
      ),
    },
    {
      icon: ShieldCheck,
      title: 'Your Choices',
      accent: 'purple',
      content: (
        <p>
          You may request access, correction, or deletion of your information by{' '}
          <Link to={ROUTES.CONTACT} className="text-secondary font-semibold hover:underline">
            contacting us
          </Link>
          .
        </p>
      ),
    },
    {
      icon: RefreshCw,
      title: 'Changes to This Policy',
      accent: 'orange',
      content: (
        <p>
          ADUNavi may update this Privacy Policy at any time. Continued use of the Platform constitutes acceptance of
          any changes.
        </p>
      ),
    },
    {
      icon: Mail,
      title: 'Contact',
      accent: 'emerald',
      content: (
        <p>
          For privacy-related questions, contact:{' '}
          <a href="mailto:contact@adunavi.com" className="text-secondary font-semibold hover:underline">
            contact@adunavi.com
          </a>
        </p>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-28 pb-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-secondary transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex items-center gap-5 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary uppercase tracking-widest mb-1">Legal</p>
            <h1 className="text-4xl font-extrabold text-primary leading-tight">Privacy Policy</h1>
          </div>
        </div>
        <p className="text-sm text-slate-400 mb-12 ml-[76px]">Last Updated: May 25, 2026</p>

        {/* Intro Box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-10 text-sm text-emerald-800 leading-relaxed">
          ADUNavi respects your privacy. This Privacy Policy explains how we collect, use, and protect information
          when you use our Platform.
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((s, idx) => (
            <SectionCard key={idx} icon={s.icon} number={idx + 1} title={s.title} accent={s.accent}>
              {s.content}
            </SectionCard>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400 mb-3">Also see our</p>
          <Link
            to={ROUTES.TERMS}
            className="inline-flex items-center gap-2 text-secondary font-semibold text-sm hover:underline"
          >
            Terms of Service →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPage;
