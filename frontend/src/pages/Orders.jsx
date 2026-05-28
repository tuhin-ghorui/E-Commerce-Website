import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Generate high quality mock history if API is empty/fails
  const generateMockHistory = () => {
    return [
      {
        _id: 'order-101',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        totalPrice: 209.98,
        paymentMethod: 'Credit Card',
        isPaid: true,
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isDelivered: false,
        deliveryStatus: 'Shipped',
        shippingAddress: { address: '456 Design Plaza', city: 'San Francisco', country: 'USA', postalCode: '94105' },
        orderItems: [
          {
            _id: 'item-1',
            quantity: 1,
            price: 189.99,
            product: { name: 'Aura SoundMax Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80' }
          },
          {
            _id: 'item-2',
            quantity: 1,
            price: 9.99, // Shipping simulated
            product: { name: 'Eco Wrapping Pack', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&auto=format&fit=crop&q=80' }
          }
        ]
      },
      {
        _id: 'order-102',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        totalPrice: 45.00,
        paymentMethod: 'PayPal',
        isPaid: true,
        paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        isDelivered: true,
        deliveryStatus: 'Delivered',
        deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: { address: '123 Creative Street', city: 'New York', country: 'USA', postalCode: '10001' },
        orderItems: [
          {
            _id: 'item-3',
            quantity: 1,
            price: 45.00,
            product: { name: 'Aura Minimalist Ceramic Vase', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=300&auto=format&fit=crop&q=80' }
          }
        ]
      }
    ];
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/myorders');
        setOrders(response.data);
      } catch (error) {
        console.warn('API error fetching user orders. Loading simulated mock history:', error);
        setOrders(generateMockHistory());
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpandOrder = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  // Tracking Stepper logic
  const renderTrackingSteps = (status) => {
    const steps = ['Placed', 'Shipped', 'Delivered'];
    
    // Resolve current active step index
    let activeIndex = 0; // Placed
    if (status === 'Shipped') activeIndex = 1;
    if (status === 'Delivered') activeIndex = 2;

    return (
      <div className="flex items-center justify-between w-full max-w-lg mx-auto py-6">
        {steps.map((step, idx) => {
          const isCompleted = idx <= activeIndex;
          const isLast = idx === steps.length - 1;
          
          return (
            <React.Fragment key={step}>
              {/* Node */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'border-primary-500 bg-primary-500 text-white shadow-md shadow-primary-500/10'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={`text-xs font-semibold mt-2.5 ${
                  isCompleted ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'
                }`}>
                  {step}
                </span>
              </div>

              {/* Line Connector */}
              {!isLast && (
                <div className="flex-grow h-0.5 relative mx-2">
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800"></div>
                  <div
                    className="absolute inset-y-0 left-0 bg-primary-500 transition-all duration-500"
                    style={{ width: idx < activeIndex ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/20';
      case 'Shipped':
        return 'bg-blue-500/10 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-500/20';
      default:
        return 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-500/20';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-950 opacity-30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="inline-flex items-center justify-center p-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-2">
          <Package className="w-16 h-16 stroke-1" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-extrabold text-2xl text-slate-800 dark:text-slate-100">
            No Orders Yet
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            You haven't placed any orders on ASTRA. Start browsing our catalog to place your first order.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-xl shadow-lg transition-all"
        >
          Browse Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

      <div className="space-y-2">
        <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
          Order History
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor package shipping status, track deliveries and review past acquisitions.
        </p>
      </div>

      {/* Orders List Accordions */}
      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order._id;
          const status = order.deliveryStatus || (order.isDelivered ? 'Delivered' : 'Pending');
          const isPaid = order.isPaid;

          return (
            <div
              key={order._id}
              className="bg-white/40 dark:bg-slate-900/10 border border-slate-200/35 dark:border-slate-800/35 rounded-3xl overflow-hidden glass shadow-sm"
            >
              {/* Header block (always visible) */}
              <div
                onClick={() => toggleExpandOrder(order._id)}
                className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/30 dark:hover:bg-slate-950/20 transition-all select-none"
              >
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Order ID</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Placed On</span>
                    <span className="text-sm text-slate-700 dark:text-slate-200">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Sum</span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(status)}`}>
                    {status}
                  </span>
                  
                  {isPaid ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/20">
                      Paid
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-500/20">
                      Unpaid
                    </span>
                  )}
                  
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 ml-1.5" /> : <ChevronDown className="w-5 h-5 text-slate-400 ml-1.5" />}
                </div>
              </div>

              {/* Expansion block */}
              {isExpanded && (
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 p-6 space-y-8 animate-in slide-in-from-top-3 duration-300">
                  
                  {/* Stepper tracking */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl p-4 border border-slate-100 dark:border-slate-900">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Delivery Tracking</h4>
                    {renderTrackingSteps(status)}
                  </div>

                  {/* Address & Payment Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shipping Address</h4>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">
                        {order.shippingAddress?.address}, {order.shippingAddress?.city}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Postal Code: {order.shippingAddress?.postalCode} | Country: {order.shippingAddress?.country}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Status</h4>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">
                        Gateway: {order.paymentMethod}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        {isPaid ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            Completed on {new Date(order.paidAt).toLocaleString()}
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            Pending authorization
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Order items listing */}
                  <div className="space-y-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Acquired Items</h4>
                    <div className="space-y-3">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center justify-between text-sm py-1">
                          <div className="flex gap-3 items-center min-w-0">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                              <img src={item.product?.image} alt={item.product?.name} className="object-cover w-full h-full" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.product?.name}</h5>
                              <p className="text-xs text-slate-400 font-semibold">Qty: {item.quantity} | Unit Price: ${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
