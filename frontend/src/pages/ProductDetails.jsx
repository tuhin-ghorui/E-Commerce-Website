import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowLeft, ShieldAlert, Check, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ProductDetailSkeleton } from '../components/SkeletonLoader';

const MOCK_PRODUCTS = [
  { _id: '1', name: 'Astra SoundMax Wireless Headphones', price: 189.99, category: 'Electronics', description: 'Experience pure sonic bliss with the SoundMax. High-fidelity drivers, active noise cancellation, and a luxurious memory foam headband combine for an unmatched auditory journey. Up to 40 hours of battery life on a single charge.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', rating: 4.8, stock: 12, reviews: [{ user: 'Alex M.', rating: 5, comment: 'Phenomenal sound quality and super comfortable!', date: '2026-05-15' }, { user: 'Taylor K.', rating: 4, comment: 'Noise cancellation is good, battery life is outstanding.', date: '2026-05-10' }] },
  { _id: '2', name: 'Exquisite Leather Chronograph Watch', price: 249.50, category: 'Fashion', description: 'A timeless timepiece designed for the discerning individual. Featuring a double-domed sapphire crystal, Japanese quartz movement, and an Italian hand-stitched leather strap, this chronograph is both a tool and a statement.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', rating: 4.7, stock: 8, reviews: [{ user: 'Jordan S.', rating: 5, comment: 'Gorgeous watch, fits perfectly and looks very premium!', date: '2026-05-20' }] },
  { _id: '3', name: 'UltraLite Smart Running Shoes', price: 110.00, category: 'Fitness', description: 'Run faster, recover smarter. Made with a 3D-knit recycled upper and responsive energy-returning midsole, these shoes adapt to your stride. The embedded smart chip syncs metrics directly to your health app.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', rating: 4.6, stock: 3, reviews: [{ user: 'Sarah L.', rating: 4, comment: 'Very lightweight, perfect for daily running.', date: '2026-05-08' }] },
  { _id: '4', name: 'Astra Minimalist Ceramic Vase', price: 45.00, category: 'Home Living', description: 'Individually wheel-thrown and glazed by artisans, this stoneware vase embodies wabi-sabi simplicity. The matte textured surface and neutral cream tones provide the perfect framing for fresh or dried botanicals.', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop&q=80', rating: 4.5, stock: 20, reviews: [] }
];

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewsList, setReviewsList] = useState([]);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setReviewsList(response.data.reviews || []);
      } catch (error) {
        console.warn('API error fetching product details. Trying local mock database:', error);
        const localProd = MOCK_PRODUCTS.find(p => p._id === id);
        if (localProd) {
          setProduct(localProd);
          setReviewsList(localProd.reviews || []);
        } else {
          // If not in standard mocks, create a random mock to prevent 404 block for testing
          const randomMock = {
            _id: id,
            name: `ASTRA Designer Product (${id.slice(0, 4)})`,
            price: 129.99,
            category: 'Electronics',
            description: 'This is a premium designer product from ASTRA. Engineered with details to fulfill your lifestyle expectations, utilizing materials that minimize environmental impact while maximizing utility and elegance.',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
            rating: 4.6,
            stock: 10,
            reviews: []
          };
          setProduct(randomMock);
          setReviewsList([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    setQuantity(1);
  }, [id]);

  const handleQuantityChange = (val) => {
    if (val < 1) return;
    if (val > product.stock) {
      showToast(`Only ${product.stock} items available in stock.`, 'warning');
      return;
    }
    setQuantity(val);
  };

  const handleAddToCartSubmit = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      showToast('Please type a comment for your review.', 'warning');
      return;
    }

    try {
      const response = await api.post(`/products/${id}/reviews`, reviewForm);
      setReviewsList(response.data.reviews || []);
      setProduct(prev => ({ ...prev, rating: response.data.rating }));
      showToast('Review submitted successfully!', 'success');
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      console.warn('API review submission error, adding review locally for preview:', error);
      // Fallback local addition
      const newReview = {
        user: user?.name || 'Guest User',
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
        date: new Date().toISOString().split('T')[0]
      };
      setReviewsList(prev => [newReview, ...prev]);
      showToast('Review posted (locally simulated).', 'success');
      setReviewForm({ rating: 5, comment: '' });
    }
  };

  const renderStars = (ratingVal) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= Math.floor(ratingVal)
              ? 'fill-amber-400 text-amber-400'
              : 'text-slate-300 dark:text-slate-600'
          }`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
        <ShieldAlert className="w-16 h-16 text-rose-500 stroke-1 mb-4" />
        <h2 className="font-display font-extrabold text-2xl mb-2">Product Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The product you are trying to view does not exist or has been removed.</p>
        <Link to="/products" className="px-6 py-2.5 font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-md">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-12">
      {/* Back to Products */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      {/* Main product card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start bg-white/40 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-6 md:p-8 shadow-sm glass">
        {/* Product image */}
        <div className="aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-800/60 overflow-hidden border border-slate-200/20 shadow-inner flex items-center justify-center">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="object-cover w-full h-full hover:scale-102 transition-transform duration-500"
          />
        </div>

        {/* Product info details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
              {product.category}
            </span>
            <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            
            {/* Rating Stars Summary */}
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                {product.rating} ({reviewsList.length} reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-slate-400 font-medium">Price:</span>
            <span className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock Status info */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400 font-medium">Availability:</span>
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 font-bold text-rose-500">
                <AlertCircle className="w-4 h-4" /> Out of stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="inline-flex items-center gap-1 font-bold text-amber-500 animate-pulse">
                <AlertCircle className="w-4 h-4" /> Only {product.stock} left in stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-500">
                <Check className="w-4 h-4" /> In Stock ({product.stock} available)
              </span>
            )}
          </div>

          {/* Actions */}
          {!isOutOfStock && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              {/* Quantity Counter */}
              <div className="flex items-center self-start sm:self-auto border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-white/50 dark:bg-slate-900/50 shadow-sm">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-10 h-10 flex items-center justify-center font-bold text-lg rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 active:scale-90 transition-all"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center font-bold text-lg rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 active:scale-90 transition-all"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCartSubmit}
                className="flex-grow flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 text-white font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Shopping Bag
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Review Form Column */}
        <div className="lg:col-span-1 bg-white/40 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm glass self-start">
          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">Write a Review</h3>
          {isAuthenticated ? (
            <form onSubmit={handleAddReview} className="space-y-4">
              {/* Rating Choice */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 outline-none text-sm font-semibold"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>

              {/* Review Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Comments</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience with this item..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-xl transition-all shadow-sm"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">Please sign in to write a review for this product.</p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Reviews List Column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Customer Feedback</h3>
          
          {reviewsList.length === 0 ? (
            <div className="py-12 bg-white/20 dark:bg-slate-900/5 border border-slate-200/30 dark:border-slate-800/30 rounded-3xl p-6 text-center text-slate-400 dark:text-slate-500">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {reviewsList.map((rev, index) => (
                <div
                  key={index}
                  className="p-5 border border-slate-200/30 dark:border-slate-800/30 bg-white/30 dark:bg-slate-900/30 rounded-2xl space-y-2.5 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{rev.user}</h4>
                      <div className="flex mt-1">{renderStars(rev.rating)}</div>
                    </div>
                    <span className="text-xs text-slate-400">{rev.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
