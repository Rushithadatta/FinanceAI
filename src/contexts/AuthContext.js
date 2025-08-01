import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedToken = localStorage.getItem('authToken');
    const mobile = localStorage.getItem('currentUserMobile');
    const name = localStorage.getItem('currentUserName');

    if (storedToken && mobile && name) {
      setToken(storedToken);
      setUser({ mobile, name });
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      // Store auth data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUserMobile', response.user.mobile);
      localStorage.setItem('currentUserName', response.user.name);
      
      setToken(response.token);
      setUser({
        mobile: response.user.mobile,
        name: response.user.name
      });
      setIsAuthenticated(true);
      
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      // Store auth data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUserMobile', response.user.mobile);
      localStorage.setItem('currentUserName', response.user.name);
      
      setToken(response.token);
      setUser({
        mobile: response.user.mobile,
        name: response.user.name
      });
      setIsAuthenticated(true);
      
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUserMobile');
    localStorage.removeItem('currentUserName');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
