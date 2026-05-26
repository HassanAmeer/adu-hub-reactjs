import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { Mail, Lock, User, Globe, Loader2 } from 'lucide-react';
import { useAuth } from './hooks/useUserAuth';
import { ROUTES } from '../config';
import { dbService } from '../services/dbService';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('homeowner');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const settings = dbService.getSettings();
  const signupAllowed = settings.signupAllowed !== false;

  if (!signupAllowed) {
    return (
      <AuthLayout
        title="Sign-ups Disabled"
        subtitle="Registrations are temporarily closed."
      >
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-xl text-sm font-medium text-center space-y-3">
          <p className="font-bold">The administrator has temporarily suspended new user registrations.</p>
          <p className="text-xs text-slate-500">Please check back later or contact support if you require immediate access.</p>
        </div>
        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account? <Link to={ROUTES.USER_LOGIN} className="text-secondary font-bold hover:underline">Log in</Link>
        </p>
      </AuthLayout>
    );
  }

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try logging in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.';
      default:
        return 'Failed to create account. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName) {
      setError('Please enter your first and last name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms of Service to create an account.');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, `${firstName} ${lastName}`.trim(), role);
      navigate(ROUTES.USER_DASHBOARD);
    } catch (err) {
      setError(getErrorMessage(err.code));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join 50,000+ homeowners and pros today."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2">
            <span className="mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
            <input
              type="text"
              placeholder="John"
              className="input-field"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={loading}
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
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">I am a...</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'homeowner', label: '🏠 Homeowner' },
              { value: 'professional', label: '🔨 Professional' },
              { value: 'investor', label: '💼 Investor' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={`p-3 rounded-xl border-2 text-sm font-bold transition-all text-center ${
                  role === opt.value
                    ? 'border-secondary bg-secondary/10 text-secondary'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
                disabled={loading}
              >
                {opt.label}
              </button>
            ))}
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
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              placeholder="••••••••"
              className="input-field !pl-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Must be at least 6 characters.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              placeholder="••••••••"
              className="input-field !pl-12"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 w-4 h-4 accent-secondary"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
            I agree to the <Link to={ROUTES.TERMS} className="text-secondary font-bold hover:underline">Terms of Service</Link> and <Link to={ROUTES.PRIVACY} className="text-secondary font-bold hover:underline">Privacy Policy</Link>.
          </label>
        </div>

        <button
          type="submit"
          className="btn-primary w-full !py-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-50 px-4 text-slate-500 font-bold">Or sign up with</span>
          </div>
        </div>

        <button type="button" className="btn-outline w-full !py-4 flex items-center justify-center gap-3 opacity-50 cursor-not-allowed" disabled>
          <Globe className="w-5 h-5" />
          Google Account (Coming Soon)
        </button>

        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account? <Link to={ROUTES.USER_LOGIN} className="text-secondary font-bold hover:underline">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
