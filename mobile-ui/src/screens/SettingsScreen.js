import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

const SettingsScreen = ({ navigation }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    charityPercentage: "25",
    spendPercentage: "25",
    savingsPercentage: "25",
    investmentPercentage: "25",
    savingsMonthlyWithdrawalLimit: "2",
    investmentMonthlyWithdrawalLimit: "2",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${getApiBaseUrl()}/settings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        setSettings({
          charityPercentage: data.data.charityPercentage.toString(),
          spendPercentage: data.data.spendPercentage.toString(),
          savingsPercentage: data.data.savingsPercentage.toString(),
          investmentPercentage: data.data.investmentPercentage.toString(),
          savingsMonthlyWithdrawalLimit:
            data.data.savingsMonthlyWithdrawalLimit.toString(),
          investmentMonthlyWithdrawalLimit:
            data.data.investmentMonthlyWithdrawalLimit.toString(),
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      Alert.alert("Error", "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    // Validate percentages sum to 100
    const total =
      parseFloat(settings.charityPercentage) +
      parseFloat(settings.spendPercentage) +
      parseFloat(settings.savingsPercentage) +
      parseFloat(settings.investmentPercentage);

    if (Math.abs(total - 100) > 0.01) {
      Alert.alert("Invalid Settings", "Percentages must sum to exactly 100%");
      return;
    }

    // Validate individual percentages
    const percentages = [
      parseFloat(settings.charityPercentage),
      parseFloat(settings.spendPercentage),
      parseFloat(settings.savingsPercentage),
      parseFloat(settings.investmentPercentage),
    ];

    if (percentages.some((p) => p < 0 || p > 100)) {
      Alert.alert(
        "Invalid Settings",
        "All percentages must be between 0% and 100%"
      );
      return;
    }

    // Validate withdrawal limits
    const savingsLimit = parseInt(settings.savingsMonthlyWithdrawalLimit);
    const investmentLimit = parseInt(settings.investmentMonthlyWithdrawalLimit);

    if (
      savingsLimit < 0 ||
      savingsLimit > 10 ||
      investmentLimit < 0 ||
      investmentLimit > 10
    ) {
      Alert.alert(
        "Invalid Settings",
        "Withdrawal limits must be between 0 and 10"
      );
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${getApiBaseUrl()}/settings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          charityPercentage: parseFloat(settings.charityPercentage),
          spendPercentage: parseFloat(settings.spendPercentage),
          savingsPercentage: parseFloat(settings.savingsPercentage),
          investmentPercentage: parseFloat(settings.investmentPercentage),
          savingsMonthlyWithdrawalLimit: savingsLimit,
          investmentMonthlyWithdrawalLimit: investmentLimit,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Settings saved successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const getApiBaseUrl = () => {
    if (Platform.OS === "web") {
      return "http://localhost:8085/api";
    }
    return "http://10.0.2.2:8085/api";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Configure percentage allocation and withdrawal limits
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Percentage Allocation</Text>
        <Text style={styles.sectionDescription}>
          Configure how deposits are distributed among different components.
          Total must equal 100%.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Charity (%)</Text>
          <TextInput
            style={styles.input}
            value={settings.charityPercentage}
            onChangeText={(text) =>
              setSettings({ ...settings, charityPercentage: text })
            }
            keyboardType="numeric"
            placeholder="25"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Spend (%)</Text>
          <TextInput
            style={styles.input}
            value={settings.spendPercentage}
            onChangeText={(text) =>
              setSettings({ ...settings, spendPercentage: text })
            }
            keyboardType="numeric"
            placeholder="25"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Savings (%)</Text>
          <TextInput
            style={styles.input}
            value={settings.savingsPercentage}
            onChangeText={(text) =>
              setSettings({ ...settings, savingsPercentage: text })
            }
            keyboardType="numeric"
            placeholder="25"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Investment (%)</Text>
          <TextInput
            style={styles.input}
            value={settings.investmentPercentage}
            onChangeText={(text) =>
              setSettings({ ...settings, investmentPercentage: text })
            }
            keyboardType="numeric"
            placeholder="25"
          />
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Total:{" "}
            {(
              parseFloat(settings.charityPercentage || 0) +
              parseFloat(settings.spendPercentage || 0) +
              parseFloat(settings.savingsPercentage || 0) +
              parseFloat(settings.investmentPercentage || 0)
            ).toFixed(2)}
            %
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Withdrawal Limits</Text>
        <Text style={styles.sectionDescription}>
          Set monthly withdrawal limits for Savings and Investment components.
          Charity and Spend have no limits.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Savings Monthly Limit</Text>
          <TextInput
            style={styles.input}
            value={settings.savingsMonthlyWithdrawalLimit}
            onChangeText={(text) =>
              setSettings({ ...settings, savingsMonthlyWithdrawalLimit: text })
            }
            keyboardType="numeric"
            placeholder="2"
          />
          <Text style={styles.helpText}>
            Maximum withdrawals per month from Savings
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Investment Monthly Limit</Text>
          <TextInput
            style={styles.input}
            value={settings.investmentMonthlyWithdrawalLimit}
            onChangeText={(text) =>
              setSettings({
                ...settings,
                investmentMonthlyWithdrawalLimit: text,
              })
            }
            keyboardType="numeric"
            placeholder="2"
          />
          <Text style={styles.helpText}>
            Maximum withdrawals per month from Investment
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={saveSettings}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.saveButtonText}>Save Settings</Text>
        )}
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>
          • When you deposit money for a kid, it's automatically split according
          to these percentages
        </Text>
        <Text style={styles.infoText}>
          • Charity and Spend can be withdrawn multiple times per month
        </Text>
        <Text style={styles.infoText}>
          • Savings and Investment have monthly withdrawal limits to encourage
          long-term saving
        </Text>
        <Text style={styles.infoText}>
          • You can update these settings anytime
        </Text>
      </View>
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
  section: {
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E9ECEF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F8F9FA",
  },
  helpText: {
    fontSize: 12,
    color: "#6C757D",
    marginTop: 4,
    fontStyle: "italic",
  },
  totalContainer: {
    backgroundColor: "#E8F5E8",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28A745",
  },
  saveButton: {
    backgroundColor: "#4ECDC4",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: "#B0BEC5",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoSection: {
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
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default SettingsScreen;
