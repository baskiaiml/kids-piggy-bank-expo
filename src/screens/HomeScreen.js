import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
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

const HomeScreen = () => {
  const [totalSavings, setTotalSavings] = useState(0);
  const [amount, setAmount] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);

  const addMoney = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    const newTotal = totalSavings + value;
    setTotalSavings(newTotal);
    setRecentTransactions(prev => [
      {
        id: Date.now(),
        amount: value,
        type: 'deposit',
        date: new Date().toLocaleDateString(),
      },
      ...prev.slice(0, 4), // Keep only last 5 transactions
    ]);
    setAmount('');
    Alert.alert('Success!', `Added $${value.toFixed(2)} to your piggy bank!`);
  };

  const withdrawMoney = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (value > totalSavings) {
      Alert.alert('Insufficient Funds', 'You don\'t have enough money in your piggy bank');
      return;
    }

    const newTotal = totalSavings - value;
    setTotalSavings(newTotal);
    setRecentTransactions(prev => [
      {
        id: Date.now(),
        amount: value,
        type: 'withdrawal',
        date: new Date().toLocaleDateString(),
      },
      ...prev.slice(0, 4),
    ]);
    setAmount('');
    Alert.alert('Success!', `Withdrew $${value.toFixed(2)} from your piggy bank!`);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        style={styles.header}>
        <View style={styles.piggyBankContainer}>
          <Icon name="account-balance" size={80} color={theme.white} />
          <Text style={styles.piggyBankText}>My Piggy Bank</Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Savings</Text>
          <Text style={styles.balanceAmount}>${totalSavings.toFixed(2)}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Add or Withdraw Money</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="Enter amount"
            placeholderTextColor={theme.text}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={addMoney}>
              <Icon name="add" size={24} color={theme.white} />
              <Text style={styles.buttonText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.withdrawButton} onPress={withdrawMoney}>
              <Icon name="remove" size={24} color={theme.white} />
              <Text style={styles.buttonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTransactions.length === 0 ? (
            <Text style={styles.noTransactionsText}>No transactions yet</Text>
          ) : (
            recentTransactions.map(transaction => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Icon
                    name={transaction.type === 'deposit' ? 'add-circle' : 'remove-circle'}
                    size={24}
                    color={transaction.type === 'deposit' ? theme.success : theme.error}
                  />
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionType}>
                      {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    </Text>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color: transaction.type === 'deposit' ? theme.success : theme.error,
                    },
                  ]}>
                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </Text>
              </View>
            ))
          )}
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
    alignItems: 'center',
  },
  piggyBankContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  piggyBankText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.white,
    marginTop: 10,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: theme.white,
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.white,
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  inputSection: {
    backgroundColor: theme.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 15,
  },
  amountInput: {
    borderWidth: 2,
    borderColor: theme.primary,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: theme.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: theme.success,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    justifyContent: 'center',
  },
  withdrawButton: {
    backgroundColor: theme.error,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.white,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  transactionsSection: {
    backgroundColor: theme.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noTransactionsText: {
    textAlign: 'center',
    color: theme.text,
    fontStyle: 'italic',
    padding: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.background,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionDetails: {
    marginLeft: 10,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  transactionDate: {
    fontSize: 12,
    color: theme.text,
    opacity: 0.7,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
