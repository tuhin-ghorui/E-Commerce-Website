import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const shippingCost = cartTotal > 99 ? 0 : 9.99;
  const estimatedTax = cartTotal * 0.08; // 8% sales tax simulation
  const grandTotal = cartTotal + shippingCost + estimatedTax;

  const handleCheckoutClick = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="inline-flex items-center justify-center p-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-2">
          <ShoppingBag className="w-16 h-16 stroke-1" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-extrabold text-2xl text-slate-800 dark:text-slate-100">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our shop and find something special.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-xl shadow-lg shadow-primary-500/10 hover:shadow-primary-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          Explore Catalog
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8">
      <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
        Shopping Bag
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <span className="text-sm font-semibold text-slate-400">{cartItems.length} items</span>
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-500 hover:underline"
            >
              Clear shopping bag
            </button>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => {
              const { product, quantity } = item;
              return (
                <div
                  key={product._id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-800/30 bg-white/40 dark:bg-slate-900/15 glass shadow-sm"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80'}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow min-w-0 space-y-1 sm:space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link to={`/products/${product._id}`} className="hover:text-primary-500 transition-colors">
                          <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 truncate text-sm sm:text-base">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">{product.category}</p>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(product._id, product.name)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all flex-shrink-0"
                        title="Remove product"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-1">
                      {/* Price info */}
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                        ${product.price.toFixed(2)}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-white/50 dark:bg-slate-900/50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product._id, quantity - 1, product.stock)}
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product._id, quantity + 1, product.stock)}
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart Order Summary Card */}
        <div className="bg-white/40 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm glass space-y-6">
          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3.5 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Shipping cost</span>
              {shippingCost === 0 ? (
                <span className="font-semibold text-emerald-500 uppercase text-xs">Free shipping</span>
              ) : (
                <span className="font-semibold text-slate-800 dark:text-slate-200">${shippingCost.toFixed(2)}</span>
              )}
            </div>

            <div className="flex justify-between">
              <span>Estimated Sales Tax</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">${estimatedTax.toFixed(2)}</span>
            </div>

            {shippingCost > 0 && (
              <p className="text-[10px] text-slate-400 leading-normal pt-1">
                Tip: Add another <b>${(100 - cartTotal).toFixed(2)}</b> worth of products to qualify for Free Shipping!
              </p>
            )}
          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 flex justify-between items-baseline">
            <span className="font-bold text-slate-800 dark:text-slate-200">Total Price</span>
            <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
              ${grandTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckoutClick}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 text-white font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
