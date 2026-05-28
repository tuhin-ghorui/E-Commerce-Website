import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load user profile on startup if token exists
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/users/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Initial auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/users/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      showToast(`Welcome back, ${userData.name}!`, 'success');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/users/register', { name, email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      showToast(`Welcome aboard, ${userData.name}!`, 'success');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const updateProfile = async (data) => {
    try {
      setLoading(true);
      const response = await api.put('/users/profile', data);
      setUser(response.data);
      showToast('Profile updated successfully!', 'success');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Profile update failed.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token: localStorage.getItem('token'),
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
