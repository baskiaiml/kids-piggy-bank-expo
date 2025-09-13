import React, { createContext, useContext, useState, useEffect } from 'react';
import { AsyncStorage, LocalAuthentication, SecureStore } from '../utils/mockAuth';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Session duration: 15 days in milliseconds
  const SESSION_DURATION = 15 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is registered
      const userData = await AsyncStorage.getItem('userData');
      const lastLoginTime = await AsyncStorage.getItem('lastLoginTime');
      
      if (userData && lastLoginTime) {
        const timeSinceLastLogin = Date.now() - parseInt(lastLoginTime);
        
        // If within 15 days, check if fingerprint is available
        if (timeSinceLastLogin < SESSION_DURATION) {
          const hasFingerprint = await LocalAuthentication.hasHardwareAsync();
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          
          if (hasFingerprint && isEnrolled) {
            // Try fingerprint authentication
            const result = await LocalAuthentication.authenticateAsync({
              promptMessage: 'Use your fingerprint to access your piggy bank',
              fallbackLabel: 'Use PIN instead',
            });
            
            if (result.success) {
              setUser(JSON.parse(userData));
              setIsAuthenticated(true);
              await updateLastLoginTime();
            }
          }
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLastLoginTime = async () => {
    await AsyncStorage.setItem('lastLoginTime', Date.now().toString());
  };

  const login = async (phoneNumber, pin) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      
      if (userData) {
        const user = JSON.parse(userData);
        if (user.phoneNumber === phoneNumber && user.pin === pin) {
          setUser(user);
          setIsAuthenticated(true);
          await updateLastLoginTime();
          return { success: true };
        } else {
          return { success: false, error: 'Invalid phone number or PIN' };
        }
      } else {
        return { success: false, error: 'User not registered' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (phoneNumber, pin) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      
      if (userData) {
        const existingUser = JSON.parse(userData);
        // If user already exists with same phone number, just log them in
        if (existingUser.phoneNumber === phoneNumber) {
          setUser(existingUser);
          setIsAuthenticated(true);
          await updateLastLoginTime();
          return { success: true, message: 'Welcome back! Logged in successfully.' };
        } else {
          return { success: false, error: 'A different user is already registered on this device' };
        }
      }
      
      const newUser = {
        phoneNumber,
        pin,
        createdAt: Date.now(),
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
      await updateLastLoginTime();
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      await AsyncStorage.removeItem('lastLoginTime');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 