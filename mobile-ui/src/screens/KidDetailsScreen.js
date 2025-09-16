import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Platform } from "react-native";

const KidDetailsScreen = ({ route, navigation }) => {
  const { kid } = route.params;
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [kidDetails, setKidDetails] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawComponent, setWithdrawComponent] = useState("CHARITY");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadKidDetails();
  }, []);

  const loadKidDetails = async () => {
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
        setKidDetails(data.data);
      } else {
        Alert.alert("Error", data.message || "Failed to load kid details");
      }
    } catch (error) {
      console.error("Error loading kid details:", error);
      Alert.alert("Error", "Failed to load kid details");
    } finally {
      setLoading(false);
    }
  };

  const processDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid deposit amount");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`${getApiBaseUrl()}/transactions/deposit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kidId: kid.id,
          transactionType: "DEPOSIT",
          amount: parseFloat(depositAmount),
          description: depositDescription || "Deposit",
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Deposit processed successfully!");
        setShowDepositModal(false);
        setDepositAmount("");
        setDepositDescription("");
        loadKidDetails(); // Refresh data
      } else {
        Alert.alert("Error", data.message || "Failed to process deposit");
      }
    } catch (error) {
      console.error("Error processing deposit:", error);
      Alert.alert("Error", "Failed to process deposit");
    } finally {
      setProcessing(false);
    }
  };

  const processWithdrawal = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid withdrawal amount");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`${getApiBaseUrl()}/transactions/withdraw`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kidId: kid.id,
          transactionType: "WITHDRAWAL",
          amount: parseFloat(withdrawAmount),
          withdrawalComponent: withdrawComponent,
          description: withdrawDescription || "Withdrawal",
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Withdrawal processed successfully!");
        setShowWithdrawModal(false);
        setWithdrawAmount("");
        setWithdrawDescription("");
        loadKidDetails(); // Refresh data
      } else {
        Alert.alert("Error", data.message || "Failed to process withdrawal");
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      Alert.alert("Error", "Failed to process withdrawal");
    } finally {
      setProcessing(false);
    }
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
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Loading kid details...</Text>
      </View>
    );
  }

  if (!kidDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load kid details</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadKidDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{kidDetails.kidName}</Text>
        <Text style={styles.subtitle}>Age: {kidDetails.kidAge} years</Text>
      </View>

      <View style={styles.balanceSection}>
        <Text style={styles.balanceTitle}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(kidDetails.totalBalance)}
        </Text>
      </View>

      <View style={styles.componentsSection}>
        <Text style={styles.sectionTitle}>Component Balances</Text>

        <View style={styles.componentRow}>
          <View style={[styles.componentCard, { backgroundColor: "#FF6B6B" }]}>
            <Text style={styles.componentTitle}>Charity</Text>
            <Text style={styles.componentAmount}>
              {formatCurrency(kidDetails.totalCharityAmount)}
            </Text>
          </View>

          <View style={[styles.componentCard, { backgroundColor: "#4ECDC4" }]}>
            <Text style={styles.componentTitle}>Spend</Text>
            <Text style={styles.componentAmount}>
              {formatCurrency(kidDetails.totalSpendAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.componentRow}>
          <View style={[styles.componentCard, { backgroundColor: "#45B7D1" }]}>
            <Text style={styles.componentTitle}>Savings</Text>
            <Text style={styles.componentAmount}>
              {formatCurrency(kidDetails.totalSavingsAmount)}
            </Text>
          </View>

          <View style={[styles.componentCard, { backgroundColor: "#96CEB4" }]}>
            <Text style={styles.componentTitle}>Investment</Text>
            <Text style={styles.componentAmount}>
              {formatCurrency(kidDetails.totalInvestmentAmount)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#28A745" }]}
          onPress={() => setShowDepositModal(true)}
        >
          <Text style={styles.actionButtonText}>Deposit Money</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#DC3545" }]}
          onPress={() => setShowWithdrawModal(true)}
        >
          <Text style={styles.actionButtonText}>Withdraw Money</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {kidDetails.recentTransactions &&
        kidDetails.recentTransactions.length > 0 ? (
          kidDetails.recentTransactions.map((transaction, index) => (
            <View key={index} style={styles.transactionItem}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionType}>
                  {transaction.transactionType}
                </Text>
                <Text style={styles.transactionAmount}>
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
              <Text style={styles.transactionComponent}>
                Component: {transaction.component}
              </Text>
              <Text style={styles.transactionDescription}>
                {transaction.description}
              </Text>
              <Text style={styles.transactionDate}>
                {formatDate(transaction.transactionDate)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noTransactionsText}>No transactions yet</Text>
        )}
      </View>

      {/* Deposit Modal */}
      <Modal
        visible={showDepositModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDepositModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deposit Money</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Enter amount"
              value={depositAmount}
              onChangeText={setDepositAmount}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Description (optional)"
              value={depositDescription}
              onChangeText={setDepositDescription}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDepositModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={processDeposit}
                disabled={processing}
              >
                {processing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.confirmButtonText}>Deposit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Withdrawal Modal */}
      <Modal
        visible={showWithdrawModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdraw Money</Text>

            <Text style={styles.modalLabel}>Select Component:</Text>
            <View style={styles.componentSelector}>
              {["CHARITY", "SPEND", "SAVINGS", "INVESTMENT"].map(
                (component) => (
                  <TouchableOpacity
                    key={component}
                    style={[
                      styles.componentOption,
                      withdrawComponent === component &&
                        styles.componentOptionSelected,
                    ]}
                    onPress={() => setWithdrawComponent(component)}
                  >
                    <Text
                      style={[
                        styles.componentOptionText,
                        withdrawComponent === component &&
                          styles.componentOptionTextSelected,
                      ]}
                    >
                      {component}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Enter amount"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Description (optional)"
              value={withdrawDescription}
              onChangeText={setWithdrawDescription}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowWithdrawModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={processWithdrawal}
                disabled={processing}
              >
                {processing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.confirmButtonText}>Withdraw</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#DC3545",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    backgroundColor: "#4ECDC4",
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  balanceSection: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceTitle: {
    fontSize: 18,
    color: "#6C757D",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  componentsSection: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
  },
  componentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  componentCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  componentTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  componentAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  actionsSection: {
    flexDirection: "row",
    margin: 16,
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionsSection: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
    paddingVertical: 12,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
  },
  transactionComponent: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: "#2C3E50",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#6C757D",
  },
  noTransactionsText: {
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
    fontStyle: "italic",
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  componentSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  componentOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    marginRight: 8,
    marginBottom: 8,
  },
  componentOptionSelected: {
    backgroundColor: "#4ECDC4",
    borderColor: "#4ECDC4",
  },
  componentOptionText: {
    fontSize: 14,
    color: "#6C757D",
  },
  componentOptionTextSelected: {
    color: "white",
    fontWeight: "bold",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E9ECEF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#F8F9FA",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#6C757D",
  },
  confirmButton: {
    backgroundColor: "#4ECDC4",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default KidDetailsScreen;
