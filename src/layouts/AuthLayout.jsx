import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShieldCheck, Zap, Globe } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Content/Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-primary p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:30px_30px]"></div>
        </div>

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">A</div>
          <span className="text-2xl font-display font-bold tracking-tight text-white">ADU<span className="text-secondary">Navi</span></span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl text-white mb-8 leading-tight">The most trusted source for ADU data.</h1>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-secondary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-slate-300 font-medium font-sans">Official government-backed datasets.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-secondary">
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-slate-300 font-medium font-sans">Instant property feasibility reports.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-secondary">
                <Globe className="w-6 h-6" />
              </div>
              <p className="text-slate-300 font-medium font-sans">Nationwide coverage updated weekly.</p>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm relative z-10">
          © 2024 ADU Navi Inc. All rights reserved.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex-grow flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="text-3xl text-primary mb-2">{title}</h2>
            <p className="text-slate-500">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
