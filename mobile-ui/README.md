# 🐷 Kids Piggy Bank App

A fun and educational React Native app built with Expo that helps kids learn about saving money through an interactive piggy bank experience.

## 📱 Features

- **🏠 Home Screen**: Interactive piggy bank with add/withdraw money functionality
- **💰 Savings Screen**: Track savings history and transactions
- **🎯 Goals Screen**: Set and manage savings goals
- **⚙️ Settings Screen**: Customize app preferences
- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **🎨 Beautiful UI**: Kid-friendly design with colorful gradients and icons

## 🛠️ Tech Stack

- **React Native** with Expo
- **React Navigation** for navigation
- **Expo Vector Icons** for icons
- **Expo Linear Gradient** for beautiful gradients
- **React Native Web** for web support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** - Install globally with: `npm install -g @expo/cli`
- **Git** - [Download here](https://git-scm.com/)

### For Mobile Development:
- **iOS**: Xcode (macOS only) - [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **Android**: Android Studio - [Download here](https://developer.android.com/studio)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd kids-piggy-bank-expo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

## 📱 Running the App

### Web Browser
```bash
npm run web
# or
yarn web
```
- Opens automatically in your default browser at `http://localhost:8081`
- Hot reloading enabled for instant updates

### iOS Simulator (macOS only)
```bash
npm run ios
# or
yarn ios
```
- Requires Xcode to be installed
- Opens iOS Simulator automatically

### Android Emulator
```bash
npm run android
# or
yarn android
```
- Requires Android Studio and an Android emulator to be set up
- Opens Android emulator automatically

### Physical Devices

#### Using Expo Go App (Recommended for development)

1. **Install Expo Go** on your device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server**:
   ```bash
   npm start
   # or
   yarn start
   ```

3. **Connect your device**:
   - **iOS**: Open Camera app and scan the QR code
   - **Android**: Open Expo Go app and scan the QR code
   - **Alternative**: Enter the URL manually in Expo Go

#### Using Development Build (Advanced)

For production-like testing with custom native code:

```bash
# Create a development build
npx expo run:ios
# or
npx expo run:android
```

## 📱 Platform-Specific Instructions

### iOS Development

1. **Install Xcode** from the Mac App Store
2. **Install iOS Simulator** (included with Xcode)
3. **Run the app**:
   ```bash
   npm run ios
   ```

### Android Development

#### Option 1: Using Expo Go (Recommended for Development)

1. **Install Expo Go** on your Android device from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. **Start the development server**:
   ```bash
   npm start
   ```
3. **Scan the QR code** with Expo Go app
4. **No additional setup required** - this is the easiest way to test your app!

#### Option 2: Using Android Studio (For Advanced Development)

##### Step 1: Extract and Install Android Studio
1. **Extract the zip file** to a location like `C:\Android\android-studio`
2. **Navigate to the extracted folder** and run `bin\studio64.exe` (or `studio.exe` for 32-bit)
3. **Follow the setup wizard**:
   - Choose "Standard" installation type
   - Make sure **Android SDK** is selected
   - Choose installation location (default is usually fine)
   - Accept all license agreements

##### Step 2: Install Android SDK Components
1. **Open Android Studio** after installation
2. **Go to**: File → Settings → Appearance & Behavior → System Settings → Android SDK
3. **In the SDK Platforms tab**, install:
   - Android 13 (API 33) - Recommended
   - Android 12 (API 31) - Alternative
4. **In the SDK Tools tab**, make sure these are installed:
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Platform-Tools
   - ✅ Android SDK Tools
   - ✅ Android Emulator
   - ✅ Intel x86 Emulator Accelerator (HAXM installer)

##### Step 3: Set Environment Variables (Windows)
1. **Open System Properties**:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Or: Right-click "This PC" → Properties → Advanced System Settings

2. **Click "Environment Variables"**

3. **Add System Variables**:
   - Click "New" under System Variables
   - **Variable name**: `ANDROID_HOME`
   - **Variable value**: `C:\Users\YourUsername\AppData\Local\Android\Sdk` (or your SDK path)
   
   - Click "New" again
   - **Variable name**: `ANDROID_SDK_ROOT`
   - **Variable value**: Same as above

4. **Edit PATH variable**:
   - Find "Path" in System Variables, click "Edit"
   - Click "New" and add these entries:
     ```
     %ANDROID_HOME%\platform-tools
     %ANDROID_HOME%\tools
     %ANDROID_HOME%\tools\bin
     ```

##### Step 4: Create Android Virtual Device (AVD)
1. **In Android Studio**, go to: Tools → AVD Manager
2. **Click "Create Virtual Device"**
3. **Choose a device**: Select "Pixel 4" or "Pixel 5" (recommended)
4. **Select System Image**:
   - Choose "API 33" (Android 13) or "API 31" (Android 12)
   - If not downloaded, click "Download" next to the system image
5. **Configure AVD**:
   - Give it a name (e.g., "Pixel_4_API_33")
   - Click "Finish"

##### Step 5: Test the Setup
1. **Close all command prompts/terminals** (important!)
2. **Open a new PowerShell/Command Prompt**
3. **Test the installation**:
   ```bash
   adb version
   ```
   You should see ADB version information

4. **Start your AVD**:
   - In Android Studio AVD Manager, click the "Play" button next to your virtual device
   - Wait for the emulator to boot up

##### Step 6: Run Your App
1. **Make sure your AVD is running**
2. **In your project directory**, run:
   ```bash
   npm run android
   ```

##### Finding Your SDK Path
If you're unsure where Android SDK is installed:
1. **In Android Studio**: File → Settings → Appearance & Behavior → System Settings → Android SDK
2. **Look at "Android SDK Location"** - this is your `ANDROID_HOME` path

#### Troubleshooting Android Issues

**If you get "ANDROID_HOME not found" error:**
- Ensure Android Studio is installed
- Check that environment variables are set correctly
- Restart your terminal/command prompt after setting variables
- **Find your SDK path**: In Android Studio → File → Settings → Android SDK

**If you get "adb not recognized" error:**
- Add `%ANDROID_HOME%\platform-tools` to your PATH
- Restart your terminal
- Make sure you're using the correct SDK path

**If emulator doesn't start:**
- Ensure AVD is created and started
- Check that virtualization is enabled in BIOS
- Try creating a new AVD with different settings
- Try using Expo Go instead for easier development

**If environment variables don't work:**
- Restart your computer after setting them
- Make sure you're using the correct SDK path
- Close and reopen all terminals

**If you get SSL certificate error (PKIX path building failed):**
This error occurs when Gradle can't download due to SSL certificate issues.

## 🔧 Solutions for SSL Certificate Error

### Solution 1: Use Expo Go (Easiest)
Instead of dealing with the SSL issue, use Expo Go on your physical device:

1. **Install Expo Go** on your Android device from Google Play Store
2. **Start the development server**:
   ```bash
   npm start
   ```
3. **Scan the QR code** with Expo Go app

### Solution 2: Fix SSL Certificate Issue

#### Option A: Download Gradle Manually
1. **Download Gradle manually**:
   - Go to https://gradle.org/releases/
   - Download Gradle 8.13 (or latest version)
   - Extract it to a folder like `C:\gradle\gradle-8.13`

2. **Set GRADLE_HOME environment variable**:
   - Add `GRADLE_HOME = C:\gradle\gradle-8.13`
   - Add `%GRADLE_HOME%\bin` to your PATH

3. **Try running again**:
   ```bash
   npm run android
   ```

#### Option B: Configure Gradle to Use HTTP (Less Secure)
1. **Open the gradle wrapper properties**:
   - Navigate to `android/gradle/wrapper/gradle-wrapper.properties`
   - Change the URL from `https://` to `http://`:
   ```
   distributionUrl=http\://services.gradle.org/distributions/gradle-8.13-bin.zip
   ```

#### Option C: Configure Java SSL Settings
1. **Set Java system properties**:
   ```bash
   set JAVA_OPTS=-Dtrust_all_cert=true
   npm run android
   ```

#### Option D: Use Corporate Network Settings
If you're on a corporate network, you might need to configure proxy settings:

1. **Create a gradle.properties file** in the `android` folder:
   ```properties
   systemProp.http.proxyHost=your-proxy-host
   systemProp.http.proxyPort=your-proxy-port
   systemProp.https.proxyHost=your-proxy-host
   systemProp.https.proxyPort=your-proxy-port
   ```

### Solution 3: Clear Gradle Cache
```bash
# Navigate to your project directory
cd android
# Clear gradle cache
gradlew clean
# Go back to project root
cd ..
# Try again
npm run android
```

### Solution 4: Use Different Gradle Version
1. **Edit `android/gradle/wrapper/gradle-wrapper.properties`**:
   ```
   distributionUrl=https\://services.gradle.org/distributions/gradle-8.10-bin.zip
   ```

## 🚀 Quick Test
Try this first - it's the simplest solution:

```bash
# Use Expo Go instead
npm start
# Then scan QR code with Expo Go app on your phone
```

**Alternative Solutions:**

1. **Download Gradle manually:**
   - Go to https://gradle.org/releases/
   - Download Gradle 8.13 and extract to `C:\gradle\gradle-8.13`
   - Set `GRADLE_HOME = C:\gradle\gradle-8.13`
   - Add `%GRADLE_HOME%\bin` to PATH

2. **Change Gradle URL to HTTP:**
   - Edit `android/gradle/wrapper/gradle-wrapper.properties`
   - Change `https://` to `http://` in the distributionUrl

3. **Configure Java SSL settings:**
   ```bash
   set JAVA_OPTS=-Dtrust_all_cert=true
   npm run android
   ```

4. **Clear Gradle cache:**
   ```bash
   cd android
   gradlew clean
   cd ..
   npm run android
   ```

5. **Use different Gradle version:**
   - Edit `android/gradle/wrapper/gradle-wrapper.properties`
   - Try `gradle-8.10-bin.zip` instead of `gradle-8.13-bin.zip`

**If you're on a corporate network:**
- Create `android/gradle.properties` with proxy settings:
  ```properties
  systemProp.http.proxyHost=your-proxy-host
  systemProp.http.proxyPort=your-proxy-port
  systemProp.https.proxyHost=your-proxy-host
  systemProp.https.proxyPort=your-proxy-port
  ```

### Web Development

1. **No additional setup required**
2. **Run the app**:
   ```bash
   npm run web
   ```
3. **Access at**: `http://localhost:8081`

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run web` | Run on web browser |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run build` | Build for production |

## 📁 Project Structure

```
kids-piggy-bank-expo/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js      # Main piggy bank interface
│   │   ├── SavingsScreen.js   # Savings history
│   │   ├── GoalsScreen.js     # Savings goals
│   │   └── SettingsScreen.js  # App settings
│   └── App.js                 # Main app component
├── assets/                    # Images and icons
├── App.js                     # Root app component
├── app.json                   # Expo configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

##  Customization

### Theme Colors
The app uses a consistent color theme defined in each screen. You can customize colors by modifying the `theme` object:

```javascript
const theme = {
  primary: "#87CEEB",    // Sky blue
  secondary: "#B0E0E6",  // Powder blue
  accent: "#4682B4",     // Steel blue
  background: "#F0F8FF", // Alice blue
  text: "#2F4F4F",       // Dark slate gray
  white: "#FFFFFF",      // White
  success: "#32CD32",    // Lime green
  warning: "#FFD700",    // Gold
  error: "#FF6347",      // Tomato
};
```

### Icons
The app uses Material Icons from Expo Vector Icons. You can change icons by modifying the `iconName` values in the navigation and screen components.

## 🚀 Building for Production

### Web Build
```bash
npx expo build:web
```

### Mobile App Builds
```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npx expo start --clear
   ```

2. **Node modules issues**:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **iOS Simulator not opening**:
   - Ensure Xcode is installed and updated
   - Check if iOS Simulator is available in Xcode

4. **Android emulator issues**:
   - Ensure Android Studio is installed
   - Create and start an Android Virtual Device (AVD)
   - Check if `ANDROID_HOME` environment variable is set

5. **Web build issues**:
   - Clear browser cache
   - Check if port 8081 is available

### Getting Help

- Check the [Expo Documentation](https://docs.expo.dev/)
- Visit the [React Native Documentation](https://reactnative.dev/docs/getting-started)
- Join the [Expo Discord Community](https://chat.expo.dev/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions, please:
- Open an issue on GitHub
- Check the troubleshooting section above
- Refer to the Expo and React Native documentation

---

**Happy Saving! 🐷💰** 