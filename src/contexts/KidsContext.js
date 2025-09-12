import React, { createContext, useContext, useState, useEffect } from 'react';
import { AsyncStorage } from '../utils/mockAuth';

const KidsContext = createContext();

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

  useEffect(() => {
    loadKids();
  }, []);

  const loadKids = async () => {
    try {
      setIsLoading(true);
      const kidsData = await AsyncStorage.getItem('kidsData');
      if (kidsData) {
        setKids(JSON.parse(kidsData));
      }
    } catch (error) {
      console.error('Error loading kids:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addKid = async (kidData) => {
    try {
      const newKid = {
        id: Date.now().toString(),
        name: kidData.name,
        age: kidData.age,
        createdAt: Date.now(),
        totalSavings: 0,
        totalSpent: 0,
        totalCharity: 0,
        totalInvestment: 0,
      };

      const updatedKids = [...kids, newKid];
      setKids(updatedKids);
      await AsyncStorage.setItem('kidsData', JSON.stringify(updatedKids));
      
      return { success: true, kid: newKid };
    } catch (error) {
      return { success: false, error: 'Failed to add kid' };
    }
  };

  const updateKid = async (kidId, updates) => {
    try {
      const updatedKids = kids.map(kid => 
        kid.id === kidId ? { ...kid, ...updates } : kid
      );
      setKids(updatedKids);
      await AsyncStorage.setItem('kidsData', JSON.stringify(updatedKids));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update kid' };
    }
  };

  const deleteKid = async (kidId) => {
    try {
      const updatedKids = kids.filter(kid => kid.id !== kidId);
      setKids(updatedKids);
      await AsyncStorage.setItem('kidsData', JSON.stringify(updatedKids));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete kid' };
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