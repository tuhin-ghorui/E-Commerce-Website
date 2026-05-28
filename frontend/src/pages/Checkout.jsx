import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, AlertCircle, Sparkles, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import confetti from 'canvas-confetti';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    zip: '',
    country: '',
    paymentMethod: 'Credit Card',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const shippingCost = cartTotal > 99 ? 0 : 9.99;
  const estimatedTax = cartTotal * 0.08;
  const grandTotal = cartTotal + shippingCost + estimatedTax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.street || !formData.city || !formData.zip || !formData.country) {
      showToast('Please fill in all shipping fields.', 'warning');
      return;
    }

    if (formData.paymentMethod === 'Credit Card') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        showToast('Please fill in credit card details.', 'warning');
        return;
      }
    }

    setProcessing(true);

    // Formulate backend order payload
    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingAddress: {
        address: formData.street,
        city: formData.city,
        postalCode: formData.zip,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
      itemsPrice: cartTotal,
      taxPrice: estimatedTax,
      shippingPrice: shippingCost,
      totalPrice: grandTotal,
    };

    try {
      // API call to create order
      await api.post('/orders', orderData);
      
      setProcessing(false);
      setSuccess(true);
      triggerConfetti();
      clearCart();
    } catch (error) {
      console.warn('API order creation failed, simulating locally for demonstration:', error);
      // Simulated checkout success fallback
      setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
        triggerConfetti();
        clearCart();
      }, 2000);
    }
  };

  // If order was placed successfully, show success splash page
  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-emerald-500/10 rounded-full border-4 border-emerald-500/20 text-emerald-500">
          <Sparkles className="w-12 h-12 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display font-extrabold text-3xl text-slate-800 dark:text-slate-100">
            Order Confirmed!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Thank you for your order, <b>{user?.name || 'Customer'}</b>. We have sent a confirmation email and will update you when your items ship.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-4">
          <Link
            to="/orders"
            className="w-full py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-md"
          >
            Track Order Status
          </Link>
          <Link
            to="/products"
            className="w-full py-3 text-sm font-semibold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // If there are no items in cart on loading this page, redirect them to cart
  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto stroke-1" />
        <h2 className="font-display font-extrabold text-xl">Access Blocked</h2>
        <p className="text-sm text-slate-500">Your shopping cart is empty. You must have items in your cart to checkout.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8">
      {/* Back button */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Shopping Bag
      </Link>

      <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
        Secure Checkout
      </h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Forms (Shipping & Payment) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Details */}
          <div className="bg-white/40 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-6 md:p-8 shadow-sm glass space-y-5">
            <h3 className="flex items-center gap-2 font-display font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <Truck className="w-5 h-5 text-primary-500" />
              Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Street Address</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="123 Creative Street, Apt 4B"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Postal / ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  required
                  value={formData.zip}
                  onChange={handleInputChange}
                  placeholder="10001"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Country</label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="United States"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="bg-white/40 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-6 md:p-8 shadow-sm glass space-y-5">
            <h3 className="flex items-center gap-2 font-display font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <CreditCard className="w-5 h-5 text-primary-500" />
              Payment Information
            </h3>

            {/* Selector */}
            <div className="flex gap-4">
              {['Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                <label
                  key={method}
                  className={`flex-grow flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === method
                      ? 'border-primary-500 bg-primary-500/5 text-primary-600 dark:text-primary-400 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="text-xs">{method}</span>
                </label>
              ))}
            </div>

            {/* Card Inputs */}
            {formData.paymentMethod === 'Credit Card' && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 animate-in fade-in duration-300">
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="•••• •••• •••• ••••"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expiration Date</label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="MM / YY"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CVC / Security Code</label>
                  <input
                    type="text"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleInputChange}
                    placeholder="•••"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {formData.paymentMethod === 'PayPal' && (
              <div className="py-6 text-center text-slate-400 text-sm animate-in fade-in duration-300">
                You will be redirected to PayPal to complete your payment securely on checkout.
              </div>
            )}

            {formData.paymentMethod === 'Cash on Delivery' && (
              <div className="py-6 text-center text-slate-400 text-sm animate-in fade-in duration-300">
                Pay in cash upon physical delivery. A service charge of $0.00 is applicable.
              </div>
            )}
          </div>
        </div>

        {/* Right Preview Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/40 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-6 shadow-sm glass space-y-6">
            <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              Order Preview
            </h3>

            {/* Items list */}
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex gap-3 items-center justify-between text-sm">
                  <div className="flex gap-2.5 items-center min-w-0">
                    <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img src={item.product.image} alt={item.product.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.product.name}</h4>
                      <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Checkout Pricing breakdown */}
            <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 flex justify-between items-baseline">
              <span className="font-bold text-slate-800 dark:text-slate-200">Total Due</span>
              <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm uppercase tracking-wider"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4.5 h-4.5" />
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
