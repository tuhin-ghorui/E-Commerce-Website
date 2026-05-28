import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, Shield, Sparkles, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const [updating, setUpdating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      showToast('Name and email fields cannot be empty.', 'warning');
      return;
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        showToast('New password must be at least 6 characters.', 'warning');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast('Passwords do not match.', 'warning');
        return;
      }
    }

    setUpdating(true);
    
    const updatePayload = {
      name: formData.name,
      email: formData.email,
    };
    if (formData.password) {
      updatePayload.password = formData.password;
    }

    const result = await updateProfile(updatePayload);
    setUpdating(false);

    if (result.success) {
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

      <div className="space-y-2">
        <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
          My Account
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your personal information and update account security
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Card: Account Stats Summary */}
        <div className="md:col-span-4 bg-white/40 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm glass text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-400 flex items-center justify-center text-white font-display font-bold text-3xl mx-auto shadow-md">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 text-lg leading-snug">
              {user?.name}
            </h3>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>

          <div className="flex justify-center items-center gap-1.5 py-1 px-3 rounded-full bg-slate-100 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border border-slate-200/20 self-center inline-flex">
            {user?.role === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-primary-500" />
                Administrator
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-500" />
                Verified Customer
              </>
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 flex justify-around text-xs text-slate-400 font-medium">
            <div>
              <p className="text-slate-800 dark:text-slate-100 font-bold text-sm">Joined</p>
              <p>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Right Card: Settings Form */}
        <div className="md:col-span-8 bg-white/40 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-6 md:p-8 shadow-sm glass">
          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-200/50 dark:border-slate-800/50 pb-3 mb-6">
            Personal Details & Security
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none transition-all shadow-sm"
                  />
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none transition-all shadow-sm"
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 sm:col-span-2">
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2">Change Password (optional)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none transition-all"
                  />
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none transition-all"
                  />
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2.5 font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 self-start mt-2"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
