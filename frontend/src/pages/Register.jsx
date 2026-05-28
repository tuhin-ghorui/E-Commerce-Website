import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logo from '../assets/logo.svg';

const Register = () => {
  const { register, isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [localLoading, setLocalLoading] = useState(false);

  // If already logged in, redirect away to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill in all registration fields.', 'warning');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    setLocalLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    setLocalLoading(false);

    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

      {/* Main card */}
      <div className="max-w-md w-full space-y-8 bg-white/40 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-8 shadow-xl glass animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img src={logo} alt="ASTRA Logo" className="w-12 h-12 animate-float" />
          </div>
          <h2 className="font-display font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white">
            Create an Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Join ASTRA to start purchasing and reviewing designs
          </p>
        </div>

        {/* Register Account Form */}
        <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
          {/* Name input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-sm text-sm"
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jane@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-sm text-sm"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Min. 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-sm text-sm"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={localLoading || loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 text-white font-semibold shadow-lg shadow-primary-500/10 hover:shadow-primary-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
          >
            {localLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Register Account
              </>
            )}
          </button>
        </form>

        {/* Footer Redirect link */}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-500 hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
