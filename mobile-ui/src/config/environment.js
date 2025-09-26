// Environment Configuration for Kids Piggy Bank Mobile App
// Simple configuration: Development (emulator) vs Production (Play Store)

// ========================================
// 🚀 QUICK URL SWITCHING - CHANGE HERE
// ========================================

// For testing in emulator, set this to true
const USE_DEV_SERVER = false;

// Dev server URL (for emulator testing)
const DEV_SERVER_URL = "http://10.0.2.2:8085/api"; // Android emulator
// const DEV_SERVER_URL = "http://localhost:8085/api"; // Web/other platforms

// Production server URL (for Play Store)
const PROD_SERVER_URL = "http://your-alb-dns-name.elb.amazonaws.com:8080/api";

// ========================================
// END OF CONFIGURATION
// ========================================

const environments = {
  development: {
    name: "Development",
    apiBaseUrl: DEV_SERVER_URL,
    enableLogging: true,
    enableDebugMode: true,
  },
  production: {
    name: "Production",
    apiBaseUrl: PROD_SERVER_URL,
    enableLogging: false,
    enableDebugMode: false,
  },
};

// Get current environment based on USE_DEV_SERVER flag
const getCurrentEnvironment = () => {
  return USE_DEV_SERVER ? "development" : "production";
};

// Get environment configuration
const getEnvironmentConfig = () => {
  const currentEnv = getCurrentEnvironment();
  return environments[currentEnv];
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
