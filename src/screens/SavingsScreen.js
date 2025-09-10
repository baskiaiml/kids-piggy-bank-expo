import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
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

const SavingsScreen = () => {
  const [savingsCategories, setSavingsCategories] = useState([
    {id: 1, name: 'Toys', amount: 25.50, goal: 100, color: '#FF6B6B'},
    {id: 2, name: 'Books', amount: 15.75, goal: 50, color: '#4ECDC4'},
    {id: 3, name: 'Games', amount: 40.00, goal: 80, color: '#45B7D1'},
    {id: 4, name: 'Clothes', amount: 30.25, goal: 60, color: '#96CEB4'},
  ]);

  const [newCategory, setNewCategory] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const addCategory = () => {
    if (!newCategory.trim() || !newGoal.trim()) {
      Alert.alert('Error', 'Please fill in both category name and goal amount');
      return;
    }

    const goalAmount = parseFloat(newGoal);
    if (isNaN(goalAmount) || goalAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid goal amount');
      return;
    }

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
    const newCat = {
      id: Date.now(),
      name: newCategory.trim(),
      amount: 0,
      goal: goalAmount,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    setSavingsCategories(prev => [...prev, newCat]);
    setNewCategory('');
    setNewGoal('');
    Alert.alert('Success!', 'New savings category added!');
  };

  const getProgressPercentage = (amount, goal) => {
    return Math.min((amount / goal) * 100, 100);
  };

  const getTotalSavings = () => {
    return savingsCategories.reduce((total, category) => total + category.amount, 0);
  };

  const getTotalGoal = () => {
    return savingsCategories.reduce((total, category) => total + category.goal, 0);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        style={styles.header}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Savings Overview</Text>
          <Text style={styles.totalAmount}>${getTotalSavings().toFixed(2)}</Text>
          <Text style={styles.goalText}>
            Goal: ${getTotalGoal().toFixed(2)} ({getProgressPercentage(getTotalSavings(), getTotalGoal()).toFixed(1)}%)
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.addCategorySection}>
          <Text style={styles.sectionTitle}>Add New Category</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Category name (e.g., Toys, Books)"
              placeholderTextColor={theme.text}
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <TextInput
              style={styles.input}
              placeholder="Goal amount"
              placeholderTextColor={theme.text}
              value={newGoal}
              onChangeText={setNewGoal}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.addButton} onPress={addCategory}>
              <Icon name="add" size={20} color={theme.white} />
              <Text style={styles.addButtonText}>Add Category</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Savings Categories</Text>
          {savingsCategories.map(category => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, {backgroundColor: category.color}]}>
                  <Icon name="folder" size={24} color={theme.white} />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryAmount}>
                    ${category.amount.toFixed(2)} / ${category.goal.toFixed(2)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${getProgressPercentage(category.amount, category.goal)}%`,
                        backgroundColor: category.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {getProgressPercentage(category.amount, category.goal).toFixed(1)}%
                </Text>
              </View>

              <View style={styles.categoryActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="add" size={16} color={theme.success} />
                  <Text style={[styles.actionText, {color: theme.success}]}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="remove" size={16} color={theme.error} />
                  <Text style={[styles.actionText, {color: theme.error}]}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="edit" size={16} color={theme.accent} />
                  <Text style={[styles.actionText, {color: theme.accent}]}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  summaryContainer: {
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    color: theme.white,
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.white,
    marginBottom: 5,
  },
  goalText: {
    fontSize: 14,
    color: theme.white,
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  addCategorySection: {
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
  inputContainer: {
    gap: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: theme.primary,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: theme.background,
  },
  addButton: {
    backgroundColor: theme.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: theme.white,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  categoriesSection: {
    gap: 15,
  },
  categoryCard: {
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
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 5,
  },
  categoryAmount: {
    fontSize: 14,
    color: theme.text,
    opacity: 0.7,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.background,
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.text,
    minWidth: 40,
    textAlign: 'right',
  },
  categoryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.background,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SavingsScreen;
