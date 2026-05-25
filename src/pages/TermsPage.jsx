import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Mail, ShieldCheck, Scale, Users, Lock, Globe, AlertTriangle, XCircle, BookOpen } from 'lucide-react';
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

const TermsPage = () => {
  const sections = [
    {
      icon: BookOpen,
      title: 'Purpose of the Platform',
      accent: 'blue',
      content: (
        <p>
          ADUNavi provides general, informational content related to Accessory Dwelling Units (ADUs), including laws,
          regulations, guidance, and related resources. <strong>ADUNavi does not provide legal, architectural,
          engineering, zoning, construction, or financial advice.</strong>
        </p>
      ),
    },
    {
      icon: Users,
      title: 'No Professional Relationship',
      accent: 'purple',
      content: (
        <p>
          Use of ADUNavi does not create a professional, advisory, fiduciary, or client relationship of any kind.
          Users are solely responsible for verifying information with local authorities and licensed professionals.
        </p>
      ),
    },
    {
      icon: ShieldCheck,
      title: 'User Responsibilities',
      accent: 'emerald',
      content: (
        <div>
          <p className="mb-3">You agree to:</p>
          <ul className="space-y-2">
            {[
              'Use the Platform only for lawful purposes',
              'Not misuse, scrape, reverse-engineer, or disrupt the Platform',
              'Not rely on ADUNavi as a substitute for professional advice',
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
      title: 'Intellectual Property',
      accent: 'amber',
      content: (
        <p>
          All content, design, data, and software on ADUNavi are owned by or licensed to ADUNavi and are protected
          by applicable intellectual property laws. You may not copy, reproduce, distribute, or exploit any content
          without prior written permission.
        </p>
      ),
    },
    {
      icon: Globe,
      title: 'Third-Party Links & Services',
      accent: 'indigo',
      content: (
        <p>
          ADUNavi may reference third-party services or professionals for convenience. ADUNavi does not endorse,
          control, or guarantee any third-party services and is not responsible for their actions or content.
        </p>
      ),
    },
    {
      icon: AlertTriangle,
      title: 'Disclaimers',
      accent: 'orange',
      content: (
        <p>
          The Platform is provided <strong>"as is"</strong> and <strong>"as available."</strong> ADUNavi makes no
          warranties, express or implied, regarding accuracy, completeness, reliability, or suitability of the
          information provided.
        </p>
      ),
    },
    {
      icon: Scale,
      title: 'Limitation of Liability',
      accent: 'red',
      content: (
        <p>
          To the maximum extent permitted by law, ADUNavi shall not be liable for any direct, indirect, incidental,
          consequential, or special damages arising from use of or reliance on the Platform.
        </p>
      ),
    },
    {
      icon: XCircle,
      title: 'Termination',
      accent: 'slate',
      content: (
        <p>
          ADUNavi reserves the right to suspend or terminate access to the Platform at any time, with or without
          notice, for any reason.
        </p>
      ),
    },
    {
      icon: FileText,
      title: 'Governing Law',
      accent: 'slate',
      content: (
        <p>
          These Terms shall be governed by the laws of the State of California, without regard to conflict-of-law
          principles.
        </p>
      ),
    },
    {
      icon: Mail,
      title: 'Contact',
      accent: 'emerald',
      content: (
        <p>
          For questions regarding these Terms, contact:{' '}
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
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary uppercase tracking-widest mb-1">Legal</p>
            <h1 className="text-4xl font-extrabold text-primary leading-tight">Terms of Service</h1>
          </div>
        </div>
        <p className="text-sm text-slate-400 mb-12 ml-[76px]">Last Updated: May 25, 2026</p>

        {/* Intro Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-10 text-sm text-blue-800 leading-relaxed">
          Welcome to ADUNavi. By accessing or using this website or application (the <strong>"Platform"</strong>), you
          agree to be bound by these Terms of Service (<strong>"Terms"</strong>). If you do not agree, do not use the
          Platform.
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
            to={ROUTES.PRIVACY}
            className="inline-flex items-center gap-2 text-secondary font-semibold text-sm hover:underline"
          >
            Privacy Policy →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsPage;
