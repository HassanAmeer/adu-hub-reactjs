import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-primary uppercase tracking-tight">Privacy Policy</h1>
          <p className="text-slate-500 font-medium text-lg">Last updated: May 19, 2026</p>
        </div>

        <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed">
          <h3 className="text-lg font-bold text-primary border-b border-slate-100 pb-2 uppercase tracking-wide">1. Information We Collect</h3>
          <p>
            We collect personal information that you voluntarily provide to us when registering, such as your name, email address, phone number, and zoning inquiry parameters.
          </p>

          <h3 className="text-lg font-bold text-primary border-b border-slate-100 pb-2 uppercase tracking-wide">2. How We Use Your Information</h3>
          <p>
            We process your information for purposes based on legitimate business interests, including sending zoning alert updates, matching you with licensed building professionals, and optimizing calculator templates.
          </p>

          <h3 className="text-lg font-bold text-primary border-b border-slate-100 pb-2 uppercase tracking-wide">3. Information Sharing</h3>
          <p>
            We only share information with your consent to connect you with building contractors or professionals in our directory. We do not sell user data to third-party advertisers.
          </p>

          <h3 className="text-lg font-bold text-primary border-b border-slate-100 pb-2 uppercase tracking-wide">4. Contact Us</h3>
          <p>
            If you have questions or comments about this policy, you may email us at <strong>privacy@adunavi.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
