import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const KidsContext = createContext();

// API Configuration - Updated to match server port
const API_BASE_URL = 'http://localhost:8085/api';

export const useKids = () => {
  const context = useContext(KidsContext);
  if (!context) {
    throw new Error('useKids must be used within a KidsProvider');
  }
  return context;
};

export const KidsProvider = ({ children }) => {
  const [kids, setKids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      loadKids();
    } else {
      setKids([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const loadKids = async () => {
    try {
      setIsLoading(true);
      
      if (!token) {
        console.warn('No authentication token available');
        setKids([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/kids`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setKids(data.kids || []);
        } else {
          console.error('Failed to load kids:', data.message);
          setKids([]);
        }
      } else {
        console.error('Failed to load kids:', response.status, response.statusText);
        setKids([]);
      }
    } catch (error) {
      console.error('Error loading kids:', error);
      setKids([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addKid = async (kidData) => {
    try {
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }

      const response = await fetch(`${API_BASE_URL}/kids`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: kidData.name,
          age: kidData.age,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Reload kids from server to get the latest data
        await loadKids();
        return { success: true, kid: data.kid };
      } else {
        return { success: false, error: data.message || 'Failed to add kid' };
      }
    } catch (error) {
      console.error('Error adding kid:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  const updateKid = async (kidId, updates) => {
    try {
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }

      const response = await fetch(`${API_BASE_URL}/kids/${kidId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Reload kids from server to get the latest data
        await loadKids();
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Failed to update kid' };
      }
    } catch (error) {
      console.error('Error updating kid:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  const deleteKid = async (kidId) => {
    try {
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }

      const response = await fetch(`${API_BASE_URL}/kids/${kidId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Reload kids from server to get the latest data
        await loadKids();
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Failed to delete kid' };
      }
    } catch (error) {
      console.error('Error deleting kid:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  const getKidById = (kidId) => {
    return kids.find(kid => kid.id === kidId);
  };

  const value = {
    kids,
    isLoading,
    addKid,
    updateKid,
    deleteKid,
    getKidById,
    loadKids,
  };

  return (
    <KidsContext.Provider value={value}>
      {children}
    </KidsContext.Provider>
  );
};