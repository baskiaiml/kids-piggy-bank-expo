#!/usr/bin/env node

// Build script for production Android APK
// This script sets the production environment and builds the app

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Building Kids Piggy Bank for Production...");

// Set production environment
process.env.REACT_NATIVE_ENV = "production";

// Update environment configuration for production
const envConfigPath = path.join(__dirname, "../src/config/environment.js");
let envConfig = fs.readFileSync(envConfigPath, "utf8");

// Replace the production API URL with the actual production URL
const productionApiUrl =
  process.env.PRODUCTION_API_URL || "https://api.yourdomain.com/api";
envConfig = envConfig.replace(
  "apiBaseUrl: 'https://api.yourdomain.com/api'",
  `apiBaseUrl: '${productionApiUrl}'`
);

fs.writeFileSync(envConfigPath, envConfig);

console.log(`✅ Environment configured for production: ${productionApiUrl}`);

try {
  // Clean previous builds
  console.log("🧹 Cleaning previous builds...");
  execSync("npx expo install --fix", { stdio: "inherit" });

  // Build for Android
  console.log("📱 Building Android APK...");
  execSync("eas build --platform android --profile production", {
    stdio: "inherit",
  });

  console.log("✅ Production build completed successfully!");
  console.log("📦 APK will be available in your EAS dashboard");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
} finally {
  // Restore original environment configuration
  envConfig = envConfig.replace(
    `apiBaseUrl: '${productionApiUrl}'`,
    "apiBaseUrl: 'https://api.yourdomain.com/api'"
  );
  fs.writeFileSync(envConfigPath, envConfig);
}
