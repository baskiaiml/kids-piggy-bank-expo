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

1. **Install Android Studio**
2. **Set up Android SDK** and create a virtual device
3. **Enable Developer Options** on your Android device (if using physical device)
4. **Run the app**:
   ```bash
   npm run android
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