import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';

// Complete mock product database for local testing and error fallbacks
const MOCK_PRODUCTS = [
  { _id: '1', name: 'Astra SoundMax Wireless Headphones', price: 189.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60', rating: 4.8, stock: 12 },
  { _id: '2', name: 'Exquisite Leather Chronograph Watch', price: 249.50, category: 'Fashion', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60', rating: 4.7, stock: 8 },
  { _id: '3', name: 'UltraLite Smart Running Shoes', price: 110.00, category: 'Fitness', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60', rating: 4.6, stock: 3 },
  { _id: '4', name: 'Astra Minimalist Ceramic Vase', price: 45.00, category: 'Home Living', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&auto=format&fit=crop&q=60', rating: 4.5, stock: 20 },
  { _id: '5', name: 'Smart Fitness Tracker Pro', price: 79.99, category: 'Fitness', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=60', rating: 4.4, stock: 15 },
  { _id: '6', name: 'Premium Leather Travel Backpack', price: 159.00, category: 'Fashion', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60', rating: 4.9, stock: 6 },
  { _id: '7', name: 'Astra RGB Mechanical Keyboard', price: 129.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60', rating: 4.7, stock: 10 },
  { _id: '8', name: 'Ergonomic Mesh Office Chair', price: 299.99, category: 'Home Living', image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=500&auto=format&fit=crop&q=60', rating: 4.6, stock: 4 },
  { _id: '9', name: 'Premium Bluetooth Speaker', price: 89.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60', rating: 4.3, stock: 14 },
  { _id: '10', name: 'Premium Denim Jacket', price: 95.00, category: 'Fashion', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60', rating: 4.5, stock: 7 },
  { _id: '11', name: 'Eco-Friendly Yoga Mat', price: 39.99, category: 'Fitness', image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop&q=60', rating: 4.7, stock: 25 },
  { _id: '12', name: 'Architectural Table Lamp', price: 69.99, category: 'Home Living', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60', rating: 4.8, stock: 9 }
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Fitness', 'Home Living'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;

  // Sync state from query parameters on navigation
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const s = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearchTerm(s);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedCategory !== 'All') query.append('category', selectedCategory);
        if (searchTerm) query.append('search', searchTerm);
        query.append('sort', sortOption);
        query.append('page', currentPage);
        query.append('limit', productsPerPage);

        const response = await api.get(`/products?${query.toString()}`);
        
        // Handle paginated responses from DB or fallback
        if (response.data.products) {
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages || 1);
        } else if (Array.isArray(response.data)) {
          // Standard array response
          setProducts(response.data);
          setTotalPages(Math.ceil(response.data.length / productsPerPage) || 1);
        } else {
          throw new Error('Unrecognized API schema');
        }
      } catch (error) {
        console.warn('API error fetching products. Filtering mock data locally:', error);
        // Local Filter & Sort Implementation
        let filtered = [...MOCK_PRODUCTS];

        if (selectedCategory !== 'All') {
          filtered = filtered.filter(p => p.category === selectedCategory);
        }
        if (searchTerm) {
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Sorting
        if (sortOption === 'price-asc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-desc') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'rating') {
          filtered.sort((a, b) => b.rating - a.rating);
        }

        setTotalPages(Math.ceil(filtered.length / productsPerPage) || 1);
        const startIndex = (currentPage - 1) * productsPerPage;
        setProducts(filtered.slice(startIndex, startIndex + productsPerPage));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, sortOption, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ category: selectedCategory, search: searchTerm });
    setCurrentPage(1);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSearchParams({ category: cat, search: searchTerm });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSearchParams({});
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar Filter (Desktop) */}
        <aside className="hidden md:block w-64 flex-shrink-0 text-left space-y-6">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">Filters</h2>
            {(selectedCategory !== 'All' || searchTerm) && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Category</h3>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-left px-3 py-2 text-sm rounded-xl transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Product Grid Area */}
        <main className="flex-grow space-y-6">
          
          {/* Top Bar (Search & Sort) */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-sm shadow-sm"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSearchParams({ category: selectedCategory });
                  }}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="flex gap-3 w-full sm:w-auto items-center justify-end">
              {/* Sort Selector */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none text-sm shadow-sm font-medium"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFiltersMobile(true)}
                className="md:hidden flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Catalog Listing */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-slate-900/10 rounded-3xl border border-dashed border-slate-200/50 dark:border-slate-800/50 p-8">
              <SlidersHorizontal className="w-12 h-12 text-slate-400 mb-4 stroke-1 animate-pulse" />
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">No products found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6">
                We couldn't find any products matching your current category selection or search query.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-md shadow-primary-500/10"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                    currentPage === index + 1
                      ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-md'
                      : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Drawer Overlay for Mobile Filters */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" onClick={() => setShowFiltersMobile(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 animate-in slide-in-from-right duration-300">
            <div className="w-screen max-w-xs bg-white dark:bg-slate-950 p-6 flex flex-col h-full shadow-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="font-display font-bold text-lg">Filters</h2>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow py-6 space-y-6 overflow-y-auto">
                {/* Categories Mobile */}
                <div className="space-y-3 text-left">
                  <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Category</h3>
                  <div className="flex flex-col gap-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          handleCategorySelect(cat);
                          setShowFiltersMobile(false);
                        }}
                        className={`text-left px-3 py-2 text-sm rounded-xl transition-all ${
                          selectedCategory === cat
                            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(selectedCategory !== 'All' || searchTerm) && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      clearFilters();
                      setShowFiltersMobile(false);
                    }}
                    className="w-full py-2.5 text-sm font-semibold border border-rose-500 text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
