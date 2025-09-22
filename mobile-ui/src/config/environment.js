// Environment Configuration for Kids Piggy Bank Mobile App
// This file manages different server URLs for development, staging, and production

const environments = {
  development: {
    name: "Development",
    apiBaseUrl: "http://localhost:8085/api",
    enableLogging: true,
    enableDebugMode: true,
  },
  staging: {
    name: "Staging",
    apiBaseUrl: "https://staging-api.yourdomain.com/api",
    enableLogging: true,
    enableDebugMode: true,
  },
  production: {
    name: "Production",
    apiBaseUrl: "https://api.yourdomain.com/api",
    enableLogging: false,
    enableDebugMode: false,
  },
};

// Get current environment from build configuration
const getCurrentEnvironment = () => {
  // In React Native, you can use __DEV__ to detect development mode
  if (__DEV__) {
    return "development";
  }

  // For production builds, you can set this via environment variables
  // or build scripts
  return process.env.REACT_NATIVE_ENV || "production";
};

// Get environment configuration
const getEnvironmentConfig = () => {
  const currentEnv = getCurrentEnvironment();
  return environments[currentEnv] || environments.production;
};

// Platform-specific API URL configuration
const getApiBaseUrl = () => {
  const config = getEnvironmentConfig();

  // For web platform
  if (typeof window !== "undefined") {
    return config.apiBaseUrl;
  }

  // For mobile platforms, use the same URL as web in production
  // In development, use localhost for web and 10.0.2.2 for Android emulator
  if (config.name === "development") {
    // This will be handled by Platform.OS in the actual components
    return config.apiBaseUrl;
  }

  return config.apiBaseUrl;
};

// Export configuration
export const environmentConfig = {
  ...getEnvironmentConfig(),
  apiBaseUrl: getApiBaseUrl(),
  currentEnvironment: getCurrentEnvironment(),
};

// Helper functions
export const isDevelopment = () => getCurrentEnvironment() === "development";
export const isProduction = () => getCurrentEnvironment() === "production";
export const isStaging = () => getCurrentEnvironment() === "staging";

// Logging helper
export const log = (message, data = null) => {
  if (environmentConfig.enableLogging) {
    console.log(`[${environmentConfig.name}] ${message}`, data);
  }
};

// Debug helper
export const debug = (message, data = null) => {
  if (environmentConfig.enableDebugMode) {
    console.debug(`[${environmentConfig.name}] DEBUG: ${message}`, data);
  }
};

export default environmentConfig;
