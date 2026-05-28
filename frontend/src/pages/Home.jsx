import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';

// Mock products for fallback if API is not fully running yet
const MOCK_FEATURED = [
  {
    _id: 'featured-1',
    name: 'Astra SoundMax Wireless Headphones',
    price: 189.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    stock: 12,
  },
  {
    _id: 'featured-2',
    name: 'Exquisite Leather Chronograph Watch',
    price: 249.50,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    stock: 8,
  },
  {
    _id: 'featured-3',
    name: 'UltraLite Smart Running Shoes',
    price: 110.00,
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    stock: 3,
  },
  {
    _id: 'featured-4',
    name: 'Astra Minimalist Ceramic Vase',
    price: 45.00,
    category: 'Home Living',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&auto=format&fit=crop&q=60',
    rating: 4.5,
    stock: 20,
  },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/products');
        // Take top 4 items for featured grid
        const items = response.data.products || response.data || [];
        setFeaturedProducts(items.slice(0, 4));
      } catch (error) {
        console.warn('API error fetching featured products, loading mock fallbacks:', error);
        setFeaturedProducts(MOCK_FEATURED);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const features = [
    {
      icon: <Truck className="w-6 h-6 text-primary-500" />,
      title: 'Free & Fast Delivery',
      desc: 'Free shipping on all orders over $99. Delivered in 2-3 business days.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary-500" />,
      title: 'Secure Checkout',
      desc: 'SSL encryption & modern protocols ensure your payment info is always safe.',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-primary-500" />,
      title: '14-Day Free Returns',
      desc: 'Not satisfied? Return your product within two weeks for an immediate refund.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-primary-500" />,
      title: '24/7 Dedicated Support',
      desc: 'Our customer support team is online 24/7 to solve your inquiries.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-400/20 dark:bg-secondary-600/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-600 dark:text-primary-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Summer Collection 2026</span>
            </div>
            
            <h1 className="font-display font-extrabold text-5xl md:text-6xl text-slate-900 dark:text-white leading-tight tracking-tight">
              Design That Speaks <br />
              <span className="gradient-text">Your Identity</span>
            </h1>
            
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl">
              Immerse yourself in premium craftsmanship. Discover the new arrivals of tech gear, fashion outfits, and design accents curated for modern lifestyles.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="px-8 py-3.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/35 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Shop Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?category=Electronics"
                className="px-8 py-3.5 text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-all"
              >
                Explore Tech
              </Link>
            </div>
          </div>

          {/* Hero Right Showcase */}
          <div className="relative flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-secondary-500/10 rounded-full blur-2xl"></div>
            <div className="relative max-w-md md:max-w-lg w-full aspect-square bg-gradient-to-br from-white/70 to-white/40 dark:from-slate-900/60 dark:to-slate-900/20 border border-white/40 dark:border-slate-800/40 rounded-3xl p-6 shadow-2xl glass animate-float">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
                alt="Featured Product Watch"
                className="object-contain w-full h-full rounded-2xl drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">Shop by Category</h2>
          <p className="text-slate-500 dark:text-slate-400">Find exactly what you need in our curated sections</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              name: 'Electronics',
              desc: 'Premium Sound & Gadgets',
              img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=60',
            },
            {
              name: 'Fashion',
              desc: 'Exquisite Designer Wear',
              img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&auto=format&fit=crop&q=60',
            },
            {
              name: 'Fitness',
              desc: 'Performance Gear',
              img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=60',
            },
            {
              name: 'Home Living',
              desc: 'Architectural Accents',
              img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300&auto=format&fit=crop&q=60',
            },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="group relative overflow-hidden rounded-2xl aspect-video sm:aspect-square md:aspect-[4/3] shadow-sm hover:shadow-lg border border-slate-200/20 hover:border-primary-500/30 transition-all duration-300"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-5 left-5 text-left text-white">
                <h3 className="font-display font-bold text-lg">{cat.name}</h3>
                <p className="text-[11px] text-slate-300 opacity-90">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="text-left space-y-2">
            <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">Featured Additions</h2>
            <p className="text-slate-500 dark:text-slate-400">Discover handpicked items that match our aesthetic ideals</p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600 group transition-colors"
          >
            Browse Catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-y border-slate-200/50 dark:border-slate-800/50 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, index) => (
            <div key={index} className="flex gap-4 items-start text-left">
              <div className="p-3 rounded-2xl bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/10">
                {feat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">{feat.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
