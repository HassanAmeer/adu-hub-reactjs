import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { Mail, Lock, Globe } from 'lucide-react';

const LoginPage = () => {
  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your credentials to access your ADU dashboard."
    >
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="email" 
              placeholder="name@company.com" 
              className="input-field !pl-12"
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-bold text-slate-700">Password</label>
            <a href="#" className="text-xs font-bold text-secondary hover:underline">Forgot password?</a>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="password" 
              placeholder="••••••••" 
              className="input-field !pl-12"
            />
          </div>
        </div>

        <button className="btn-primary w-full !py-4">Log In</button>
        
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-50 px-4 text-slate-500 font-bold">Or continue with</span>
          </div>
        </div>

        <button className="btn-outline w-full !py-4 flex items-center justify-center gap-3">
          <Globe className="w-5 h-5" />
          Google Account
        </button>

        <p className="text-center text-sm text-slate-500 mt-8">
          Don't have an account? <Link to="/signup" className="text-secondary font-bold hover:underline">Sign up for free</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
