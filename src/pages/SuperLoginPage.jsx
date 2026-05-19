import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { Mail, Lock, ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SuperLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'superAdmin')) {
      navigate('/super/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your administrator credentials.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin' || user.role === 'superAdmin') {
        navigate('/super/dashboard');
      } else {
        // Sign out non-admins immediately
        await logout();
        setError('Access Denied. Homeowner and Professional accounts must use the standard login at /login.');
      }
    } catch (err) {
      setError('Invalid administrator credentials. Please check and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">A</div>
          <span className="text-xl font-bold tracking-tight text-white">ADU<span className="text-emerald-500">Navi</span></span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-black tracking-tight text-white uppercase">
          Admin Gateway
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
          Secured Administrator Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-900/55 backdrop-blur-md py-8 px-6 border border-slate-800 shadow-2xl rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-2xl text-xs font-semibold flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="email"
                  placeholder="admin@adunavi.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-semibold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Passkey / Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-semibold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary !bg-emerald-600 hover:!bg-emerald-500 text-white font-bold !py-3.5 rounded-2xl flex items-center justify-center gap-2 border-0 shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                'Access Control Center'
              )}
            </button>

            <div className="pt-2 text-center">
              <a
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 font-bold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Home Page
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperLoginPage;
