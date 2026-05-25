import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, AlertTriangle, Info, Scale, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '../config';

const DisclaimerPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50"
    >
      {/* Header Banner */}
      <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-center">
        <p className="text-sm text-amber-700 font-medium flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          This page contains important legal information. Please read carefully before using ADUNavi.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Link */}
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-secondary transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="flex items-center gap-5 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary uppercase tracking-widest mb-1">Legal</p>
            <h1 className="text-4xl font-extrabold text-primary leading-tight">Legal Disclaimer</h1>
          </div>
        </div>

        <div className="prose prose-slate max-w-none space-y-10">

          {/* Intro Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              The information provided on <strong>ADUNavi</strong> is for general informational purposes only and is{' '}
              <strong>not intended to constitute legal, architectural, engineering, zoning, financial, or construction advice.</strong>
            </p>
          </div>

          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <Scale className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-primary">Accuracy & Completeness</h2>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                While ADUNavi strives to provide accurate, current, and reliable information regarding Accessory Dwelling
                Units (ADUs), laws, regulations, codes, and requirements vary by jurisdiction and are subject to change
                without notice. <strong>ADUNavi does not guarantee the accuracy, completeness, or applicability</strong> of
                any information presented on this platform to any specific property, project, or location.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-primary">User Responsibility</h2>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                Users are <strong>solely responsible</strong> for verifying all information with the appropriate local
                authorities, licensed professionals, and governing agencies before making any decisions or taking any
                actions based on content provided by ADUNavi.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-primary">No Professional Services</h2>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <p className="text-slate-600 leading-relaxed">
                ADUNavi does not act as a permitting authority, legal advisor, architect, engineer, contractor, or real
                estate professional. Any references to professionals, services, cost estimates, feasibility guidance, or
                third-party providers are provided for convenience only and do{' '}
                <strong>not constitute endorsements, guarantees, or recommendations.</strong>
              </p>
            </div>
          </section>

          {/* Section 4 – Liability */}
          <section>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-red-800 mb-3">Limitation of Liability</h2>
              <p className="text-sm text-red-700 leading-relaxed">
                Under no circumstances shall <strong>ADUNavi, its owners, affiliates, partners, developers, or
                  contributors</strong> be liable for any direct, indirect, incidental, consequential, or special damages
                arising out of or in connection with the use of, or reliance upon, any information provided through this
                platform.
              </p>
            </div>
          </section>

          {/* Section 5 – User Agreement */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-4">By Using This Platform, You Acknowledge:</h2>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              {[
                'ADUNavi is an informational platform only.',
                'You assume full responsibility for your use of the information.',
                'You understand that regulations and requirements may differ based on local conditions and interpretations.',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Non-agreement notice */}
          <div className="bg-slate-800 text-white rounded-2xl p-6 text-center">
            <p className="text-sm leading-relaxed text-slate-300">
              <strong className="text-white">If you do not agree with this disclaimer,</strong> you should not use this
              website or application.
            </p>
          </div>

          {/* Footer CTA */}
          <div className="text-center pt-4">
            <p className="text-sm text-slate-400 mb-4">Have questions about our policies?</p>
            <Link
              to={ROUTES.CONTACT}
              className="inline-flex items-center gap-2 bg-secondary text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DisclaimerPage;
