import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useKids } from '../contexts/KidsContext';
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
  cardBackground: '#FFFFFF',
};

const DashboardScreen = ({ navigation }) => {
  const { kids, isLoading } = useKids();
  const { user, logout } = useAuth();

  const handleAddKid = () => {
    navigation.navigate('AddKid');
  };

  const handleKidPress = (kid) => {
    navigation.navigate('KidDetails', { kid });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const getTotalStats = () => {
    return kids.reduce((totals, kid) => ({
      savings: totals.savings + kid.totalSavings,
      spent: totals.spent + kid.totalSpent,
      charity: totals.charity + kid.totalCharity,
      investment: totals.investment + kid.totalInvestment,
    }), { savings: 0, spent: 0, charity: 0, investment: 0 });
  };

  const totalStats = getTotalStats();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[theme.background, theme.secondary]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.userText}>{user?.phoneNumber}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Icon name="logout" size={24} color={theme.error} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Kids Financial Dashboard</Text>
        </View>

        {/* Total Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Total Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="account-balance-wallet" size={24} color={theme.success} />
              <Text style={styles.statValue}>${totalStats.savings}</Text>
              <Text style={styles.statLabel}>Savings</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="shopping-cart" size={24} color={theme.warning} />
              <Text style={styles.statValue}>${totalStats.spent}</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="favorite" size={24} color={theme.error} />
              <Text style={styles.statValue}>${totalStats.charity}</Text>
              <Text style={styles.statLabel}>Charity</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="trending-up" size={24} color={theme.accent} />
              <Text style={styles.statValue}>${totalStats.investment}</Text>
              <Text style={styles.statLabel}>Investment</Text>
            </View>
          </View>
        </View>

        {/* Kids Section */}
        <View style={styles.kidsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Kids ({kids.length})</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddKid}>
              <Icon name="add" size={20} color={theme.white} />
              <Text style={styles.addButtonText}>Add Kid</Text>
            </TouchableOpacity>
          </View>

          {kids.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="child-care" size={60} color={theme.accent} />
              <Text style={styles.emptyTitle}>No kids added yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your first child to start managing their finances
              </Text>
              <TouchableOpacity style={styles.emptyAddButton} onPress={handleAddKid}>
                <Text style={styles.emptyAddButtonText}>Add Your First Kid</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.kidsGrid}>
              {kids.map((kid) => (
                <TouchableOpacity
                  key={kid.id}
                  style={styles.kidCard}
                  onPress={() => handleKidPress(kid)}
                >
                  <View style={styles.kidCardHeader}>
                    <View style={styles.kidAvatar}>
                      <Icon name="child-care" size={30} color={theme.accent} />
                    </View>
                    <View style={styles.kidInfo}>
                      <Text style={styles.kidName}>{kid.name}</Text>
                      <Text style={styles.kidAge}>{kid.age} years old</Text>
                    </View>
                  </View>
                  
                  <View style={styles.kidStats}>
                    <View style={styles.kidStatItem}>
                      <Text style={styles.kidStatValue}>${kid.totalSavings}</Text>
                      <Text style={styles.kidStatLabel}>Saved</Text>
                    </View>
                    <View style={styles.kidStatItem}>
                      <Text style={styles.kidStatValue}>${kid.totalSpent}</Text>
                      <Text style={styles.kidStatLabel}>Spent</Text>
                    </View>
                  </View>
                  
                  <View style={styles.kidCardFooter}>
                    <Icon name="chevron-right" size={20} color={theme.accent} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: theme.text,
    opacity: 0.8,
  },
  userText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  logoutButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
  },
  statsCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.background,
    borderRadius: 15,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: theme.text,
    opacity: 0.7,
    marginTop: 2,
  },
  kidsSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.accent,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: theme.white,
    fontWeight: '600',
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: theme.cardBackground,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.text,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyAddButton: {
    backgroundColor: theme.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyAddButtonText: {
    color: theme.white,
    fontWeight: 'bold',
  },
  kidsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  kidCard: {
    width: '48%',
    backgroundColor: theme.cardBackground,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kidCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  kidAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  kidInfo: {
    flex: 1,
  },
  kidName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  kidAge: {
    fontSize: 12,
    color: theme.text,
    opacity: 0.7,
  },
  kidStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  kidStatItem: {
    alignItems: 'center',
  },
  kidStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.accent,
  },
  kidStatLabel: {
    fontSize: 10,
    color: theme.text,
    opacity: 0.7,
  },
  kidCardFooter: {
    alignItems: 'flex-end',
  },
});

export default DashboardScreen; 