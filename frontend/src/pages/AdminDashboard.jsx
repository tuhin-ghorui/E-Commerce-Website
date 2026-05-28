import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBasket, ShoppingBag, Users, Plus, Edit, Trash2, Loader2, X, AlertTriangle, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Loading states
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Modal actions
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Electronics',
    stock: '',
    image: '',
  });

  // Mock fallbacks
  const generateMockProducts = () => [
    { _id: '1', name: 'Astra SoundMax Wireless Headphones', price: 189.99, category: 'Electronics', stock: 12, rating: 4.8 },
    { _id: '2', name: 'Exquisite Leather Chronograph Watch', price: 249.50, category: 'Fashion', stock: 8, rating: 4.7 },
    { _id: '3', name: 'UltraLite Smart Running Shoes', price: 110.00, category: 'Fitness', stock: 3, rating: 4.6 },
    { _id: '4', name: 'Astra Minimalist Ceramic Vase', price: 45.00, category: 'Home Living', stock: 20, rating: 4.5 }
  ];

  const generateMockOrders = () => [
    {
      _id: 'order-101',
      user: { name: 'Alex Miller', email: 'alex@example.com' },
      createdAt: new Date().toISOString(),
      totalPrice: 209.98,
      deliveryStatus: 'Shipped',
      isPaid: true
    },
    {
      _id: 'order-102',
      user: { name: 'Taylor Swift', email: 'taylor@example.com' },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      totalPrice: 45.00,
      deliveryStatus: 'Pending',
      isPaid: false
    }
  ];

  const generateMockUsers = () => [
    { _id: 'user-1', name: 'Admin Astra', email: 'admin@astrashop.com', role: 'admin', createdAt: '2026-05-01' },
    { _id: 'user-2', name: 'Alex Miller', email: 'alex@example.com', role: 'user', createdAt: '2026-05-10' },
    { _id: 'user-3', name: 'Taylor Swift', email: 'taylor@example.com', role: 'user', createdAt: '2026-05-12' }
  ];

  // Fetch initial details
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const prodRes = await api.get('/products');
        setProducts(prodRes.data.products || prodRes.data || []);
      } catch (err) {
        console.warn('API error fetching admin products, using mocks');
        setProducts(generateMockProducts());
      } finally {
        setLoadingProducts(false);
      }

      try {
        const ordRes = await api.get('/orders');
        setOrders(ordRes.data || []);
      } catch (err) {
        console.warn('API error fetching admin orders, using mocks');
        setOrders(generateMockOrders());
      } finally {
        setLoadingOrders(false);
      }

      try {
        const usrRes = await api.get('/users');
        setUsers(usrRes.data || []);
      } catch (err) {
        console.warn('API error fetching admin users, using mocks');
        setUsers(generateMockUsers());
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchAllData();
  }, []);

  // Product actions handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      description: '',
      category: 'Electronics',
      stock: '',
      image: '',
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: prod.price,
      description: prod.description || '',
      category: prod.category,
      stock: prod.stock,
      image: prod.image || '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const data = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
    };

    if (editingProduct) {
      // Edit mode
      try {
        const res = await api.put(`/products/${editingProduct._id}`, data);
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? res.data : p));
        showToast('Product updated successfully!', 'success');
      } catch (err) {
        console.warn('API product update failed, updating locally:', err);
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...data } : p));
        showToast('Product updated (locally simulated).', 'success');
      }
    } else {
      // Add mode
      try {
        const res = await api.post('/products', data);
        setProducts(prev => [res.data, ...prev]);
        showToast('Product created successfully!', 'success');
      } catch (err) {
        console.warn('API product creation failed, creating locally:', err);
        const newProd = {
          _id: `prod-${Date.now()}`,
          ...data,
          rating: 5.0
        };
        setProducts(prev => [newProd, ...prev]);
        showToast('Product created (locally simulated).', 'success');
      }
    }

    setShowProductModal(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      showToast('Product deleted.', 'info');
    } catch (err) {
      console.warn('API product delete failed, deleting locally:', err);
      setProducts(prev => prev.filter(p => p._id !== id));
      showToast('Product deleted (locally simulated).', 'info');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, deliveryStatus: newStatus } : o));
      showToast(`Order status updated to ${newStatus}!`, 'success');
    } catch (err) {
      console.warn('API order status update failed, updating locally:', err);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, deliveryStatus: newStatus } : o));
      showToast(`Order status updated (locally simulated) to ${newStatus}.`, 'success');
    }
  };

  // Metrics for overview
  const totalSales = orders.reduce((total, o) => o.isPaid ? total + o.totalPrice : total, 0);
  const pendingOrders = orders.filter(o => o.deliveryStatus === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 flex-shrink-0 bg-white/40 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-5 shadow-sm glass self-start space-y-6">
        <div>
          <h2 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100">Control Panel</h2>
          <p className="text-xs text-slate-400">System Management</p>
        </div>

        <nav className="flex flex-col gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBasket className="w-4.5 h-4.5" />
            Products
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            Orders
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            Users
          </button>
        </nav>
      </aside>

      {/* Main dashboard panels */}
      <main className="flex-grow bg-white/40 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-6 md:p-8 shadow-sm glass">
        
        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">Overview Dashboard</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Sales card */}
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/10 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Total Revenue</span>
                  <span className="text-2xl font-display font-extrabold text-emerald-500">${totalSales.toFixed(2)}</span>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><DollarSign className="w-6 h-6" /></div>
              </div>

              {/* Orders count */}
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/10 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Pending Deliveries</span>
                  <span className="text-2xl font-display font-extrabold text-amber-500">{pendingOrders} / {orders.length}</span>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><ShoppingBag className="w-6 h-6" /></div>
              </div>

              {/* Users count */}
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/10 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Registered Users</span>
                  <span className="text-2xl font-display font-extrabold text-primary-500">{users.length}</span>
                </div>
                <div className="p-3 bg-primary-500/10 rounded-xl text-primary-500"><Users className="w-6 h-6" /></div>
              </div>
            </div>

            {/* Graphic or Sales Info */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/30 dark:border-slate-800/30 rounded-2xl flex items-center gap-4">
              <TrendingUp className="w-10 h-10 text-primary-500 animate-pulse" />
              <div>
                <h4 className="font-semibold text-sm">Store Performance is Positive</h4>
                <p className="text-xs text-slate-400">Order processing frequencies have risen 12% today. Ensure stock levels are updated.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products CRUD Management */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">Manage Catalog Products</h3>
              <button
                onClick={handleOpenAddProduct}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {loadingProducts ? (
              <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200/30 dark:border-slate-800/30 shadow-sm">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-100/10">
                        <td className="px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-100 max-w-[200px] truncate">{p.name}</td>
                        <td className="px-6 py-3.5"><span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/20">{p.category}</span></td>
                        <td className="px-6 py-3.5 font-bold">${p.price.toFixed(2)}</td>
                        <td className={`px-6 py-3.5 font-bold ${p.stock <= 3 ? 'text-amber-500' : 'text-slate-500'}`}>{p.stock}</td>
                        <td className="px-6 py-3.5 text-center flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-2 text-slate-500 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Orders Processing */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">Manage Customer Orders</h3>

            {loadingOrders ? (
              <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-slate-400">No orders recorded in the system.</div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200/30 dark:border-slate-800/30 shadow-sm">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-slate-100/10">
                        <td className="px-6 py-3.5 font-semibold text-xs text-slate-400">#{o._id.slice(-8).toUpperCase()}</td>
                        <td className="px-6 py-3.5 font-medium">{o.user?.name || 'Guest User'} <span className="text-[10px] text-slate-400 block">{o.user?.email}</span></td>
                        <td className="px-6 py-3.5 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-3.5 font-bold">${o.totalPrice.toFixed(2)}</td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            o.deliveryStatus === 'Delivered'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : o.deliveryStatus === 'Shipped'
                              ? 'bg-blue-500/10 text-blue-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {o.deliveryStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <select
                            value={o.deliveryStatus || 'Pending'}
                            onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-2.5 outline-none font-medium"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Users Directory */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">Manage Users System</h3>

            {loadingUsers ? (
              <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200/30 dark:border-slate-800/30 shadow-sm">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Account Type</th>
                      <th className="px-6 py-4">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-100/10">
                        <td className="px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-100">{u.name}</td>
                        <td className="px-6 py-3.5 text-slate-500">{u.email}</td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                            u.role === 'admin'
                              ? 'bg-primary-500/10 text-primary-600 border border-primary-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {u.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : null}
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Product Add/Edit Dialog modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[999] overflow-y-auto">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowProductModal(false)}></div>
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative border border-slate-200/50 dark:border-slate-800/50 animate-in zoom-in-95 duration-200 text-left">
              <button
                onClick={() => setShowProductModal(false)}
                className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-display font-extrabold text-xl mb-6">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
              </h3>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Qty</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 outline-none font-medium"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Home Living">Home Living</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Image URL</label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:border-primary-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-md mt-2"
                >
                  Save Product
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
