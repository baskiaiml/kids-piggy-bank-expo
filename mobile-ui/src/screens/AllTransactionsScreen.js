import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const AllTransactionsScreen = ({ route, navigation }) => {
  const { kid } = route.params;
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL, DEPOSIT, WITHDRAWAL

  useEffect(() => {
    loadAllTransactions();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [allTransactions, filter]);

  const loadAllTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${getApiBaseUrl()}/transactions/kid/${kid.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setAllTransactions(data.data.recentTransactions || []);
      } else {
        Alert.alert("Error", data.message || "Failed to load transactions");
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      Alert.alert("Error", "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = allTransactions;
    
    if (filter === "DEPOSIT") {
      filtered = allTransactions.filter(t => t.transactionType === "DEPOSIT");
    } else if (filter === "WITHDRAWAL") {
      filtered = allTransactions.filter(t => t.transactionType === "WITHDRAWAL");
    }
    
    setFilteredTransactions(filtered);
  };

  const getApiBaseUrl = () => {
    if (Platform.OS === "web") {
      return "http://localhost:8085/api";
    }
    return "http://10.0.2.2:8085/api";
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderTransactionDetails = (transaction) => {
    const isDeposit = transaction.transactionType === "DEPOSIT";
    
    if (isDeposit) {
      // Show component allocation for deposits
      return (
        <View style={styles.transactionDetails}>
          <Text style={styles.detailLabel}>Component Allocation:</Text>
          <View style={styles.componentAllocation}>
            {transaction.charityAmount > 0 && (
              <View style={styles.componentItem}>
                <Text style={styles.componentLabel}>Charity:</Text>
                <Text style={styles.componentValue}>{formatCurrency(transaction.charityAmount)}</Text>
              </View>
            )}
            {transaction.spendAmount > 0 && (
              <View style={styles.componentItem}>
                <Text style={styles.componentLabel}>Spend:</Text>
                <Text style={styles.componentValue}>{formatCurrency(transaction.spendAmount)}</Text>
              </View>
            )}
            {transaction.savingsAmount > 0 && (
              <View style={styles.componentItem}>
                <Text style={styles.componentLabel}>Savings:</Text>
                <Text style={styles.componentValue}>{formatCurrency(transaction.savingsAmount)}</Text>
              </View>
            )}
            {transaction.investmentAmount > 0 && (
              <View style={styles.componentItem}>
                <Text style={styles.componentLabel}>Investment:</Text>
                <Text style={styles.componentValue}>{formatCurrency(transaction.investmentAmount)}</Text>
              </View>
            )}
          </View>
        </View>
      );
    } else {
      // Show withdrawal component for withdrawals
      return (
        <View style={styles.transactionDetails}>
          <Text style={styles.detailLabel}>Withdrawn from:</Text>
          <Text style={styles.withdrawalComponent}>{transaction.withdrawalComponent}</Text>
        </View>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>All Transactions</Text>
          <Text style={styles.subtitle}>{kid.name}</Text>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "ALL" && styles.activeFilter]}
          onPress={() => setFilter("ALL")}
        >
          <Text style={[styles.filterText, filter === "ALL" && styles.activeFilterText]}>
            All ({allTransactions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "DEPOSIT" && styles.activeFilter]}
          onPress={() => setFilter("DEPOSIT")}
        >
          <Text style={[styles.filterText, filter === "DEPOSIT" && styles.activeFilterText]}>
            Deposits ({allTransactions.filter(t => t.transactionType === "DEPOSIT").length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "WITHDRAWAL" && styles.activeFilter]}
          onPress={() => setFilter("WITHDRAWAL")}
        >
          <Text style={[styles.filterText, filter === "WITHDRAWAL" && styles.activeFilterText]}>
            Withdrawals ({allTransactions.filter(t => t.transactionType === "WITHDRAWAL").length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.transactionsContainer}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => {
            const isDeposit = transaction.transactionType === "DEPOSIT";
            const transactionStyle = isDeposit ? styles.depositTransaction : styles.withdrawalTransaction;
            const typeStyle = isDeposit ? styles.depositType : styles.withdrawalType;
            const amountStyle = isDeposit ? styles.depositAmount : styles.withdrawalAmount;
            
            return (
              <View key={index} style={[styles.transactionItem, transactionStyle]}>
                <View style={styles.transactionHeader}>
                  <Text style={typeStyle}>
                    {transaction.transactionType}
                  </Text>
                  <Text style={amountStyle}>
                    {isDeposit ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Text>
                </View>
                
                {renderTransactionDetails(transaction)}
                
                {transaction.description && (
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                )}
                
                <Text style={styles.transactionDate}>
                  {formatDate(transaction.transactionDate)}
                </Text>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Icon name="receipt" size={60} color="#6C757D" />
            <Text style={styles.emptyTitle}>No transactions found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === "ALL" 
                ? "No transactions yet for this kid"
                : `No ${filter.toLowerCase()} transactions found`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6C757D",
  },
  header: {
    backgroundColor: "#4ECDC4",
    padding: 24,
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#4ECDC4",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6C757D",
  },
  activeFilterText: {
    color: "white",
  },
  transactionsContainer: {
    flex: 1,
    padding: 16,
  },
  transactionItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  depositTransaction: {
    borderLeftWidth: 4,
    borderLeftColor: "#28A745",
  },
  withdrawalTransaction: {
    borderLeftWidth: 4,
    borderLeftColor: "#DC3545",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  depositType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28A745",
  },
  withdrawalType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DC3545",
  },
  depositAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28A745",
  },
  withdrawalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DC3545",
  },
  transactionDetails: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6C757D",
    marginBottom: 8,
  },
  componentAllocation: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
  },
  componentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  componentLabel: {
    fontSize: 14,
    color: "#6C757D",
  },
  componentValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
  },
  withdrawalComponent: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC3545",
    backgroundColor: "#FFF8F8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  transactionDescription: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 8,
    fontStyle: "italic",
  },
  transactionDate: {
    fontSize: 12,
    color: "#6C757D",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6C757D",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
  },
});

export default AllTransactionsScreen;
