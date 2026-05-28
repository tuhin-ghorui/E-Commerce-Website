import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo.svg';

const Facebook = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Twitter = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Github = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="ASTRA Logo" className="w-7 h-7" />
              <span className="font-display font-bold text-xl tracking-wider gradient-text">ASTRA</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Elevate your lifestyle with ASTRA. Discover curated products that combine premium quality and exquisite design.
            </p>
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
              <a href="#" className="hover:text-primary-500 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>


          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider text-slate-800 dark:text-slate-100 uppercase mb-4">
              Shop Directory
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/products?category=Electronics" className="hover:text-primary-500 transition-colors">Tech & Gadgets</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-primary-500 transition-colors">Apparel & Fashion</Link></li>
              <li><Link to="/products?category=Fitness" className="hover:text-primary-500 transition-colors">Sports & Fitness</Link></li>
              <li><Link to="/products?category=Home Living" className="hover:text-primary-500 transition-colors">Home & Decor</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider text-slate-800 dark:text-slate-100 uppercase mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/profile" className="hover:text-primary-500 transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-primary-500 transition-colors">Order Tracking</Link></li>
              <li><Link to="/cart" className="hover:text-primary-500 transition-colors">Shopping Cart</Link></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Privacy & Terms</a></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-sm tracking-wider text-slate-800 dark:text-slate-100 uppercase mb-4">
              Contact & Updates
            </h4>
            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" /> <span>123 Design Blvd, Creative City</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-500 flex-shrink-0" /> <span>+1 (800) ASTRA-SHOP</span></div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-500 flex-shrink-0" /> <span>hello@astrashop.com</span></div>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5 mt-4">
              <input
                type="email"
                placeholder="Enter email..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 rounded-xl transition-colors shadow-sm"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ASTRA Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
