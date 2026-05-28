import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { showToast } = useToast();

  // Load cart from local storage on startup
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart data:', e);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product._id === product._id);
      
      if (existingItem) {
        // Check stock limit
        const newQty = existingItem.quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Cannot add more items. Only ${product.stock} available in stock.`, 'warning');
          return prevItems;
        }
        showToast(`Updated ${product.name} quantity in cart!`, 'success');
        return prevItems.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > product.stock) {
          showToast(`Cannot add items. Only ${product.stock} available in stock.`, 'warning');
          return prevItems;
        }
        showToast(`${product.name} added to cart!`, 'success');
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId, productName = 'Item') => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
    showToast(`${productName} removed from cart.`, 'info');
  };

  const updateQuantity = (productId, quantity, maxStock) => {
    if (quantity <= 0) {
      setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
      return;
    }
    if (quantity > maxStock) {
      showToast(`Only ${maxStock} items available in stock.`, 'warning');
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
