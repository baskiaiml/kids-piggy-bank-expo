import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const theme = {
  primary: '#87CEEB',
  secondary: '#B0E0E6',
  accent: '#4682B4',
  background: '#F0F8FF',
  text: '#2F4F4F',
  white: '#FFFFFF',
  success: '#32CD32',
  warning: '#FFD700',
  error: '#FF6347',
};

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your savings data will be exported to a CSV file. Continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Export', onPress: () => Alert.alert('Success', 'Data exported successfully!')},
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Select a CSV file to import your savings data.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Import', onPress: () => Alert.alert('Success', 'Data imported successfully!')},
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your savings data. This action cannot be undone. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'All data has been reset!'),
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you would like to contact support:',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Email', onPress: () => Linking.openURL('mailto:support@kidspiggybank.com')},
        {text: 'Phone', onPress: () => Linking.openURL('tel:+1234567890')},
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate App',
      'Would you like to rate this app in the store?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Rate', onPress: () => Alert.alert('Thank you!', 'Thank you for your feedback!')},
      ]
    );
  };

  const SettingItem = ({icon, title, subtitle, onPress, rightComponent, danger = false}) => (
    <TouchableOpacity
      style={[styles.settingItem, danger && styles.dangerItem]}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, danger && styles.dangerIcon]}>
          <Icon name={icon} size={24} color={danger ? theme.error : theme.accent} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Icon name="chevron-right" size={24} color={theme.text} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="settings" size={40} color={theme.white} />
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your piggy bank experience</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="notifications"
              title="Notifications"
              subtitle="Get reminders about your savings goals"
              rightComponent={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{false: theme.background, true: theme.primary}}
                  thumbColor={notifications ? theme.white : theme.text}
                />
              }
            />
            <SettingItem
              icon="volume-up"
              title="Sound Effects"
              subtitle="Play sounds for transactions"
              rightComponent={
                <Switch
                  value={soundEffects}
                  onValueChange={setSoundEffects}
                  trackColor={{false: theme.background, true: theme.primary}}
                  thumbColor={soundEffects ? theme.white : theme.text}
                />
              }
            />
            <SettingItem
              icon="dark-mode"
              title="Dark Mode"
              subtitle="Switch to dark theme"
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{false: theme.background, true: theme.primary}}
                  thumbColor={darkMode ? theme.white : theme.text}
                />
              }
            />
            <SettingItem
              icon="fingerprint"
              title="Biometric Lock"
              subtitle="Use fingerprint or face ID"
              rightComponent={
                <Switch
                  value={biometric}
                  onValueChange={setBiometric}
                  trackColor={{false: theme.background, true: theme.primary}}
                  thumbColor={biometric ? theme.white : theme.text}
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="file-download"
              title="Export Data"
              subtitle="Download your savings data"
              onPress={handleExportData}
            />
            <SettingItem
              icon="file-upload"
              title="Import Data"
              subtitle="Restore from backup file"
              onPress={handleImportData}
            />
            <SettingItem
              icon="refresh"
              title="Reset All Data"
              subtitle="Clear all savings and goals"
              onPress={handleResetData}
              danger={true}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="info"
              title="App Version"
              subtitle="1.0.0"
              onPress={null}
            />
            <SettingItem
              icon="help"
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={handleContactSupport}
            />
            <SettingItem
              icon="star"
              title="Rate App"
              subtitle="Rate us on the app store"
              onPress={handleRateApp}
            />
            <SettingItem
              icon="privacy-tip"
              title="Privacy Policy"
              subtitle="Read our privacy policy"
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content here')}
            />
            <SettingItem
              icon="description"
              title="Terms of Service"
              subtitle="Read our terms of service"
              onPress={() => Alert.alert('Terms of Service', 'Terms of service content here')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="person"
              title="Profile"
              subtitle="Manage your profile information"
              onPress={() => Alert.alert('Profile', 'Profile management coming soon!')}
            />
            <SettingItem
              icon="security"
              title="Security"
              subtitle="Password and security settings"
              onPress={() => Alert.alert('Security', 'Security settings coming soon!')}
            />
            <SettingItem
              icon="logout"
              title="Sign Out"
              subtitle="Sign out of your account"
              onPress={() => Alert.alert('Sign Out', 'Sign out functionality coming soon!')}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Kids Piggy Bank v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for kids</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.white,
    marginTop: 10,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 15,
    marginLeft: 5,
  },
  sectionContent: {
    backgroundColor: theme.white,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.background,
  },
  dangerItem: {
    backgroundColor: '#FFF5F5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  dangerIcon: {
    backgroundColor: '#FFE5E5',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 2,
  },
  dangerText: {
    color: theme.error,
  },
  settingSubtitle: {
    fontSize: 14,
    color: theme.text,
    opacity: 0.7,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },
  footerText: {
    fontSize: 14,
    color: theme.text,
    opacity: 0.7,
    marginBottom: 5,
  },
});

export default SettingsScreen;
