import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-16 px-4 text-center relative overflow-hidden">
      {/* Background decoration blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="max-w-md w-full space-y-6 bg-white/40 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-8 shadow-xl glass animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex justify-center text-primary-500 animate-bounce">
          <HelpCircle className="w-16 h-16 stroke-1" />
        </div>

        <h1 className="font-display font-extrabold text-7xl tracking-tighter gradient-text">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">
            Page Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-xl shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
