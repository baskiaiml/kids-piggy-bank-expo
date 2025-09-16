# 🔍 Network Traffic Capture Guide

This guide shows you how to capture and debug network traffic from your Kids Piggy Bank mobile application.

## 📱 Method 1: Console Logging (Already Added)

I've added detailed console logging to your mobile app. You can now see all network requests and responses in the browser console.

### How to View Logs

#### Web Browser (Chrome/Edge)

1. **Open Developer Tools**: Press `F12` or `Ctrl+Shift+I`
2. **Go to Console tab**
3. **Run your app**: `npm start` then `npm run web`
4. **Perform actions** (signup, login, etc.)
5. **View logs** with emojis: 🚀 (requests), 📡 (responses), 📄 (data)

#### React Native Debugger

1. **Install React Native Debugger**: [Download here](https://github.com/jhen0409/react-native-debugger)
2. **Start your app**: `npm start`
3. **Open React Native Debugger**
4. **Connect to your app**
5. **View Network tab** for detailed request/response info

## 🌐 Method 2: Charles Proxy (Recommended)

Charles Proxy is the most powerful tool for capturing mobile app traffic.

### Setup Charles Proxy

#### 1. Download and Install

- **Download**: [Charles Proxy](https://www.charlesproxy.com/)
- **Install** and start Charles

#### 2. Configure Charles

1. **Start Charles**
2. **Go to**: Proxy → Proxy Settings
3. **Set Port**: 8888 (default)
4. **Enable**: "Enable transparent HTTP proxying"

#### 3. Configure Mobile App

Update your mobile app to use Charles proxy:

```javascript
// In mobile-ui/src/contexts/AuthContext.js
const API_BASE_URL = "http://10.0.2.2:8085/api"; // For Android emulator
// OR
const API_BASE_URL = "http://localhost:8085/api"; // For web
```

#### 4. Configure Device/Emulator

**For Android Emulator:**

1. **Start Android emulator**
2. **Go to**: Settings → WiFi → Long press connected network
3. **Modify network** → Advanced options
4. **Set Proxy**: Manual
5. **Proxy hostname**: 10.0.2.2
6. **Proxy port**: 8888

**For Physical Device:**

1. **Connect to same WiFi** as your computer
2. **Find your computer's IP**: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. **Set device proxy** to your computer's IP:8888

#### 5. Install Charles Certificate

1. **In Charles**: Help → SSL Proxying → Install Charles Root Certificate
2. **On device**: Go to Settings → Security → Install from storage
3. **Select the certificate** file

#### 6. Enable SSL Proxying

1. **In Charles**: Proxy → SSL Proxying Settings
2. **Add location**: `*:443` (for HTTPS)
3. **Add location**: `*:8085` (for your API)

### Using Charles

- **All requests** will appear in Charles
- **Click on requests** to see headers, body, response
- **Right-click** to copy as cURL command
- **Filter** by your API domain

## 🔧 Method 3: Flipper (Advanced)

Flipper is Facebook's debugging platform for React Native.

### Setup Flipper

#### 1. Install Flipper Desktop

- **Download**: [Flipper Desktop](https://fbflipper.com/)
- **Install** and start Flipper

#### 2. Install Flipper Plugin

```bash
cd mobile-ui
npm install --save-dev react-native-flipper
```

#### 3. Configure Flipper

Add to your `metro.config.js`:

```javascript
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add Flipper plugin
config.resolver.platforms = ["ios", "android", "native", "web"];

module.exports = config;
```

#### 4. Use Flipper

1. **Start Flipper Desktop**
2. **Start your app**: `npm start`
3. **Connect device/emulator**
4. **View Network tab** in Flipper

## 📊 Method 4: Browser Network Tab

For web development, use browser developer tools.

### Chrome/Edge DevTools

1. **Open DevTools**: F12
2. **Go to Network tab**
3. **Start your app**: `npm run web`
4. **Perform actions**
5. **View requests** in real-time
6. **Click requests** to see details

### Firefox DevTools

1. **Open DevTools**: F12
2. **Go to Network tab**
3. **Same process** as Chrome

## 🛠️ Method 5: Custom Network Interceptor

I've added a custom network interceptor to your app. You can enhance it:

```javascript
// Add to mobile-ui/src/utils/networkLogger.js
class NetworkLogger {
  static logRequest(url, options, body) {
    console.group("🚀 REQUEST");
    console.log("URL:", url);
    console.log("Method:", options.method);
    console.log("Headers:", options.headers);
    console.log("Body:", body);
    console.groupEnd();
  }

  static logResponse(url, response, data) {
    console.group("📡 RESPONSE");
    console.log("URL:", url);
    console.log("Status:", response.status);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));
    console.log("Data:", data);
    console.groupEnd();
  }
}

export default NetworkLogger;
```

## 🔍 Method 6: Server-Side Logging

Your Spring Boot server already has detailed logging. Check:

```bash
# View server logs
tail -f server/logs/kids-piggy-bank.log

# Or in Windows
Get-Content server/logs/kids-piggy-bank.log -Wait
```

## 📱 Method 7: React Native Debugger

### Install React Native Debugger

```bash
npm install -g react-native-debugger
```

### Use React Native Debugger

1. **Start your app**: `npm start`
2. **Open React Native Debugger**
3. **Connect to your app**
4. **View Network tab** for detailed traffic

## 🎯 Quick Start (Recommended)

### For Immediate Debugging:

1. **Use Console Logging** (already added)
2. **Open browser DevTools** (F12)
3. **Run your app**: `npm run web`
4. **Perform signup/login**
5. **Check console** for detailed logs

### For Advanced Debugging:

1. **Install Charles Proxy**
2. **Configure proxy** on your device/emulator
3. **Capture all traffic** with full request/response details

## 🚨 Common Issues

### CORS Issues

If you see CORS errors, check your server configuration:

```properties
# In server/src/main/resources/application.properties
cors.allowed-origins=http://localhost:8081,http://localhost:3000
```

### Proxy Issues

- **Android emulator**: Use `10.0.2.2` instead of `localhost`
- **Physical device**: Use your computer's IP address
- **Certificate issues**: Install Charles certificate on device

### Network Timeout

- **Check server**: Ensure backend is running on port 8085
- **Check firewall**: Allow connections on port 8085
- **Check proxy**: If using proxy, ensure it's configured correctly

## 📋 What You'll See

With the logging I've added, you'll see:

```
🚀 SIGNUP REQUEST: {
  url: "http://localhost:8085/api/auth/signup",
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: { phoneNumber: "+1234567890", pin: "1234", confirmPin: "1234" }
}

📡 SIGNUP RESPONSE: {
  status: 400,
  statusText: "Bad Request",
  headers: { "content-type": "application/json", ... }
}

📄 SIGNUP RESPONSE DATA: {
  success: false,
  message: "User with this phone number already exists"
}
```

## 🎉 Next Steps

1. **Start with console logging** (already set up)
2. **Try Charles Proxy** for advanced debugging
3. **Use browser DevTools** for web development
4. **Check server logs** for backend issues

Happy debugging! 🐛🔍
