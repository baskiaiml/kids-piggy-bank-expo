import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useKids } from "../contexts/KidsContext";
import { useAuth } from "../contexts/AuthContext";

const theme = {
  primary: "#87CEEB",
  secondary: "#B0E0E6",
  accent: "#4682B4",
  background: "#F0F8FF",
  text: "#2F4F4F",
  white: "#FFFFFF",
  success: "#32CD32",
  warning: "#FFD700",
  error: "#FF6347",
  cardBackground: "#FFFFFF",
};

const DashboardScreen = ({ navigation }) => {
  const { kids, isLoading } = useKids();
  const { user, logout, token } = useAuth();
  const [kidsWithBalances, setKidsWithBalances] = useState([]);
  const [totalBalances, setTotalBalances] = useState({
    charity: 0,
    spend: 0,
    savings: 0,
    investment: 0,
    total: 0,
  });
  const [loadingBalances, setLoadingBalances] = useState(false);

  useEffect(() => {
    if (kids.length > 0) {
      loadBalances();
    }
  }, [kids]);

  const loadBalances = async () => {
    try {
      setLoadingBalances(true);
      console.log("Loading balances for kids:", kids.length);

      // Load total balances
      const totalsResponse = await fetch(`${getApiBaseUrl()}/balances/totals`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const totalsData = await totalsResponse.json();
      console.log("Totals response:", totalsData);
      if (totalsData.success) {
        const newTotals = {
          charity: totalsData.data.charityBalance || 0,
          spend: totalsData.data.spendBalance || 0,
          savings: totalsData.data.savingsBalance || 0,
          investment: totalsData.data.investmentBalance || 0,
          total: totalsData.data.totalBalance || 0,
        };
        console.log("Setting total balances:", newTotals);
        setTotalBalances(newTotals);
      } else {
        console.error("Failed to get totals:", totalsData.message);
      }

      // Load individual kid balances
      const kidsResponse = await fetch(`${getApiBaseUrl()}/balances/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const kidsData = await kidsResponse.json();
      console.log("Kids balances response:", kidsData);
      if (kidsData.success) {
        setKidsWithBalances(kidsData.data);
        console.log("Set kids with balances:", kidsData.data);
        console.log(
          "Total kids:",
          kids.length,
          "Kids with balances:",
          kidsData.data.length
        );
      }
    } catch (error) {
      console.error("Error loading balances:", error);
    } finally {
      setLoadingBalances(false);
    }
  };

  const getApiBaseUrl = () => {
    if (Platform.OS === "web") {
      return "http://localhost:8085/api";
    }
    return "http://10.0.2.2:8085/api";
  };

  const handleAddKid = () => {
    navigation.navigate("AddKid");
  };

  const handleKidPress = (kid) => {
    // Ensure the kid object has the correct structure for KidDetailsScreen
    const kidForDetails = {
      id: kid.kidId || kid.id, // Use kidId if available (from balance data), otherwise use id
      name: kid.kidName || kid.name,
      age: kid.kidAge || kid.age,
      // Include any other properties that might be needed
      ...kid,
    };
    console.log("Navigating to KidDetails with kid:", kidForDetails);
    navigation.navigate("KidDetails", { kid: kidForDetails });
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  if (isLoading || loadingBalances) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
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
              <Text style={styles.userText}>
                {user?.name || user?.phoneNumber}
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={loadBalances}
                style={styles.refreshButton}
              >
                <Icon name="refresh" size={24} color={theme.accent} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
              >
                <Icon name="logout" size={24} color={theme.error} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.title}>Kids Financial Dashboard</Text>
        </View>

        {/* Total Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Total Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon
                name="account-balance-wallet"
                size={24}
                color={theme.success}
              />
              <Text style={styles.statValue}>
                {formatCurrency(totalBalances.savings)}
              </Text>
              <Text style={styles.statLabel}>Savings</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="shopping-cart" size={24} color={theme.warning} />
              <Text style={styles.statValue}>
                {formatCurrency(totalBalances.spend)}
              </Text>
              <Text style={styles.statLabel}>Spend</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="favorite" size={24} color={theme.error} />
              <Text style={styles.statValue}>
                {formatCurrency(totalBalances.charity)}
              </Text>
              <Text style={styles.statLabel}>Charity</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="trending-up" size={24} color={theme.accent} />
              <Text style={styles.statValue}>
                {formatCurrency(totalBalances.investment)}
              </Text>
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
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={handleAddKid}
              >
                <Text style={styles.emptyAddButtonText}>
                  Add Your First Kid
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.kidsGrid}>
              {kids.map((kid) => {
                // Find balance data for this kid if it exists
                const kidBalance = kidsWithBalances.find(
                  (k) => k.kidId === kid.id
                );
                const displayData = kidBalance || kid;

                return (
                  <TouchableOpacity
                    key={displayData.kidId || displayData.id}
                    style={styles.kidCard}
                    onPress={() => handleKidPress(displayData)}
                  >
                    <View style={styles.kidCardHeader}>
                      <View style={styles.kidAvatar}>
                        <Icon
                          name="child-care"
                          size={30}
                          color={theme.accent}
                        />
                      </View>
                      <View style={styles.kidInfo}>
                        <Text style={styles.kidName}>
                          {displayData.kidName || displayData.name}
                        </Text>
                        <Text style={styles.kidAge}>
                          {displayData.kidAge || displayData.age} years old
                        </Text>
                      </View>
                    </View>

                    {kidBalance ? (
                      <>
                        <View style={styles.kidTotalBalance}>
                          <Text style={styles.kidTotalLabel}>
                            Total Balance
                          </Text>
                          <Text style={styles.kidTotalValue}>
                            {formatCurrency(displayData.totalBalance || 0)}
                          </Text>
                        </View>

                        <View style={styles.kidComponents}>
                          <View style={styles.kidComponentRow}>
                            <View
                              style={[
                                styles.kidComponentItem,
                                { backgroundColor: "#FF6B6B" },
                              ]}
                            >
                              <Text style={styles.kidComponentLabel}>
                                Charity
                              </Text>
                              <Text style={styles.kidComponentValue}>
                                {formatCurrency(
                                  displayData.charityBalance || 0
                                )}
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.kidComponentItem,
                                { backgroundColor: "#4ECDC4" },
                              ]}
                            >
                              <Text style={styles.kidComponentLabel}>
                                Spend
                              </Text>
                              <Text style={styles.kidComponentValue}>
                                {formatCurrency(displayData.spendBalance || 0)}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.kidComponentRow}>
                            <View
                              style={[
                                styles.kidComponentItem,
                                { backgroundColor: "#45B7D1" },
                              ]}
                            >
                              <Text style={styles.kidComponentLabel}>
                                Savings
                              </Text>
                              <Text style={styles.kidComponentValue}>
                                {formatCurrency(
                                  displayData.savingsBalance || 0
                                )}
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.kidComponentItem,
                                { backgroundColor: "#96CEB4" },
                              ]}
                            >
                              <Text style={styles.kidComponentLabel}>
                                Investment
                              </Text>
                              <Text style={styles.kidComponentValue}>
                                {formatCurrency(
                                  displayData.investmentBalance || 0
                                )}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </>
                    ) : (
                      <View style={styles.kidStats}>
                        <View style={styles.kidStatItem}>
                          <Text style={styles.kidStatValue}>₹0.00</Text>
                          <Text style={styles.kidStatLabel}>Total Balance</Text>
                        </View>
                        <View style={styles.kidStatItem}>
                          <Text style={styles.kidStatValue}>Loading...</Text>
                          <Text style={styles.kidStatLabel}>Balances</Text>
                        </View>
                      </View>
                    )}

                    <View style={styles.kidCardFooter}>
                      <Icon
                        name="chevron-right"
                        size={20}
                        color={theme.accent}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: theme.text,
    opacity: 0.8,
  },
  userText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  refreshButton: {
    padding: 8,
    marginRight: 8,
  },
  logoutButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.text,
  },
  statsCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 15,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    alignItems: "center",
    padding: 15,
    backgroundColor: theme.background,
    borderRadius: 15,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.text,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.accent,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: theme.white,
    fontWeight: "600",
    marginLeft: 5,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: theme.cardBackground,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.text,
    opacity: 0.7,
    textAlign: "center",
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
    fontWeight: "bold",
  },
  kidsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  kidCard: {
    width: "48%",
    backgroundColor: theme.cardBackground,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kidCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  kidAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  kidInfo: {
    flex: 1,
  },
  kidName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
  },
  kidAge: {
    fontSize: 12,
    color: theme.text,
    opacity: 0.7,
  },
  kidTotalBalance: {
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 8,
    backgroundColor: theme.background,
    borderRadius: 8,
  },
  kidTotalLabel: {
    fontSize: 12,
    color: theme.text,
    opacity: 0.7,
  },
  kidTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.accent,
  },
  kidComponents: {
    marginBottom: 10,
  },
  kidComponentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  kidComponentItem: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    marginHorizontal: 2,
    alignItems: "center",
  },
  kidComponentLabel: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
  kidComponentValue: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
    marginTop: 2,
  },
  kidCardFooter: {
    alignItems: "flex-end",
  },
  kidStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  kidStatItem: {
    alignItems: "center",
  },
  kidStatValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.accent,
  },
  kidStatLabel: {
    fontSize: 10,
    color: theme.text,
    opacity: 0.7,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.text,
  },
});

export default DashboardScreen;
