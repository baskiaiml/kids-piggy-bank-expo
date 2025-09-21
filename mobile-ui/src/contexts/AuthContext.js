import React, { createContext, useContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

// API Configuration - Smart configuration for web and mobile
const getApiBaseUrl = () => {
  // Check if running on web
  if (Platform.OS === "web") {
    return "http://localhost:8085/api";
  }

  // For mobile devices/emulators, use the Android emulator's host IP
  // Android emulator maps 10.0.2.2 to the host machine's localhost
  return "http://10.0.2.2:8085/api";
};

const API_BASE_URL = getApiBaseUrl();

// Storage helper that works for both web and mobile
const storage = {
  async getItem(key) {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },

  async setItem(key, value) {
    if (Platform.OS === "web") {
      await storage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },

  async removeItem(key) {
    if (Platform.OS === "web") {
      await storage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
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
      const storedToken = await storage.getItem("authToken");
      const storedUser = await storage.getItem("userData");

      if (storedToken && storedUser) {
        console.log("🔍 CHECKING AUTH STATUS:", {
          url: `${API_BASE_URL}/auth/validate`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        // Validate token with server
        const response = await fetch(`${API_BASE_URL}/auth/validate`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log("📡 AUTH VALIDATION RESPONSE:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("📄 AUTH VALIDATION DATA:", data);

          if (data.success) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
            console.log("✅ Auth validation successful");
          } else {
            // Token is invalid, clear storage
            console.log("❌ Token validation failed, clearing storage");
            await storage.removeItem("authToken");
            await storage.removeItem("userData");
          }
        } else {
          // Token validation failed, clear storage
          console.log("❌ Auth validation response not OK, clearing storage");
          await storage.removeItem("authToken");
          await storage.removeItem("userData");
        }
      } else {
        console.log("ℹ️ No stored token found, user needs to login");
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      // Don't clear storage on network errors - just log the error
      // This prevents the "Network error" dialog from appearing
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber, pin) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        await storage.setItem("authToken", data.token);
        await storage.setItem(
          "userData",
          JSON.stringify({
            id: data.userId,
            phoneNumber: data.phoneNumber,
          })
        );

        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  };

  const signup = async (phoneNumber, name, pin) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          name,
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
          name: data.name,
        });
        setIsAuthenticated(true);

        // Store in localStorage
        await storage.setItem("authToken", data.token);
        await storage.setItem(
          "userData",
          JSON.stringify({
            id: data.userId,
            phoneNumber: data.phoneNumber,
            name: data.name,
          })
        );

        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    await storage.removeItem("authToken");
    await storage.removeItem("userData");
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
