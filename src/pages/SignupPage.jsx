import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { Mail, Lock, User, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!email || !password || !firstName || !lastName) {
        setError('Please fill in all fields.');
        return;
      }
      await signup(email, password, `${firstName} ${lastName}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create an account.');
      console.error(err);
    }
  };

  return (
    <AuthLayout 
      title="Create account" 
      subtitle="Join 50,000+ homeowners and pros today."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-2 rounded-xl text-sm">{error}</div>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
            <input 
              type="text" 
              placeholder="John" 
              className="input-field" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
            <input 
              type="text" 
              placeholder="Doe" 
              className="input-field" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="email" 
              placeholder="name@company.com" 
              className="input-field !pl-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Create Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="password" 
              placeholder="••••••••" 
              className="input-field !pl-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Must be at least 8 characters with 1 number.</p>
        </div>

        <div className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 w-4 h-4 accent-secondary" />
          <p className="text-xs text-slate-500 leading-relaxed">
            I agree to the <a href="#" className="text-secondary font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-secondary font-bold hover:underline">Privacy Policy</a>.
          </p>
        </div>

        <button className="btn-primary w-full !py-4">Create Account</button>
        
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-50 px-4 text-slate-500 font-bold">Or sign up with</span>
          </div>
        </div>

        <button type="button" className="btn-outline w-full !py-4 flex items-center justify-center gap-3">
          <Globe className="w-5 h-5" />
          Google Account
        </button>

        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account? <Link to="/login" className="text-secondary font-bold hover:underline">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
