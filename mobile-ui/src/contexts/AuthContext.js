import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// API Configuration - Updated to match server port
const API_BASE_URL = 'http://localhost:8085/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if token exists in storage
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');
      
      if (storedToken && storedUser) {
        // Validate token with server
        const response = await fetch(`${API_BASE_URL}/auth/validate`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        } else {
          // Token validation failed, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber, pin) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          pin,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setUser({
          id: data.userId,
          phoneNumber: data.phoneNumber,
        });
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify({
          id: data.userId,
          phoneNumber: data.phoneNumber,
        }));
        
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  const signup = async (phoneNumber, pin) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          pin,
          confirmPin: pin, // For now, we'll use the same PIN
        }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setUser({
          id: data.userId,
          phoneNumber: data.phoneNumber,
        });
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify({
          id: data.userId,
          phoneNumber: data.phoneNumber,
        }));
        
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    token,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};