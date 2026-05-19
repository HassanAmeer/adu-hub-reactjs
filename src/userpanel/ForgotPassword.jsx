import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { Mail, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { COLLECTIONS, ROUTES } from '../config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const ref = doc(db, COLLECTIONS.USERS, cleanEmail);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        // Simulated email reset
        setSuccess(true);
      } else {
        setError('No account found with this email address.');
      }
    } catch (err) {
      setError('Failed to process request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive password recovery instructions."
    >
      {success ? (
        <div className="space-y-6 text-center">
          <div className="mx-auto w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Check your inbox</h3>
            <p className="text-sm text-slate-500 mt-2">
              We've simulated sending a recovery link to <strong>{email}</strong>. Please follow the instructions in the email.
            </p>
          </div>
          <Link to={ROUTES.USER_LOGIN} className="btn-primary w-full block text-center !py-3 text-sm">
            Back to Login
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

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

          <button
            type="submit"
            className="btn-primary w-full !py-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing request...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="text-center pt-4">
            <Link to={ROUTES.USER_LOGIN} className="inline-flex items-center gap-2 text-sm text-secondary font-bold hover:underline">
              <ArrowLeft className="w-4 h-4" /> Return to login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
