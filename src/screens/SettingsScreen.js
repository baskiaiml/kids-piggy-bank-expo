import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'expo-vector-icons';
import { useAuth } from '../contexts/AuthContext';

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
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={[theme.background, theme.secondary]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Icon name="settings" size={60} color={theme.accent} />
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color={theme.accent} />
              <Text style={styles.infoLabel}>Phone Number:</Text>
              <Text style={styles.infoValue}>{user?.phoneNumber || 'N/A'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="calendar-today" size={20} color={theme.accent} />
              <Text style={styles.infoLabel}>Member Since:</Text>
              <Text style={styles.infoValue}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <Icon name="logout" size={24} color={theme.error} />
              <Text style={[styles.settingText, { color: theme.error }]}>Logout</Text>
            </View>
            <Icon name="chevron-right" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              Kids Piggy Bank v1.0.0
            </Text>
            <Text style={styles.aboutSubtext}>
              A fun way for kids to learn about saving money!
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: theme.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: theme.text,
    marginLeft: 10,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.accent,
  },
  settingItem: {
    backgroundColor: theme.white,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
  },
  aboutCard: {
    backgroundColor: theme.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aboutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.accent,
    marginBottom: 5,
  },
  aboutSubtext: {
    fontSize: 14,
    color: theme.text,
    textAlign: 'center',
  },
});

export default SettingsScreen;
