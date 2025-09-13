// Mock implementations for authentication packages
// These will be replaced when the actual packages are installed

// In-memory storage for React Native (since localStorage doesn't exist)
const memoryStorage = {};

export const AsyncStorage = {
  getItem: async (key) => {
    // Mock implementation - in real app, this would use @react-native-async-storage/async-storage
    return memoryStorage[key] || null;
  },
  setItem: async (key, value) => {
    // Mock implementation
    memoryStorage[key] = value;
  },
  removeItem: async (key) => {
    // Mock implementation
    delete memoryStorage[key];
  },
};

export const LocalAuthentication = {
  hasHardwareAsync: async () => {
    // Mock implementation - in real app, this would use expo-local-authentication
    return true; // Assume fingerprint is available
  },
  isEnrolledAsync: async () => {
    // Mock implementation
    return true; // Assume fingerprint is enrolled
  },
  authenticateAsync: async (options) => {
    // Mock implementation - in real app, this would use expo-local-authentication
    // For demo purposes, we'll simulate fingerprint authentication
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate user accepting fingerprint
        resolve({ success: true });
      }, 1000);
    });
  },
};

export const SecureStore = {
  getItemAsync: async (key) => {
    // Mock implementation - in real app, this would use expo-secure-store
    return memoryStorage[key] || null;
  },
  setItemAsync: async (key, value) => {
    // Mock implementation
    memoryStorage[key] = value;
  },
  deleteItemAsync: async (key) => {
    // Mock implementation
    delete memoryStorage[key];
  },
}; 