import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
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

const GoalsScreen = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'New Bicycle',
      description: 'Save for a cool new bike',
      targetAmount: 200,
      currentAmount: 75,
      targetDate: '2024-06-01',
      priority: 'high',
      completed: false,
    },
    {
      id: 2,
      title: 'Video Game',
      description: 'Latest gaming console',
      targetAmount: 300,
      currentAmount: 150,
      targetDate: '2024-08-15',
      priority: 'medium',
      completed: false,
    },
    {
      id: 3,
      title: 'School Trip',
      description: 'Money for class field trip',
      targetAmount: 50,
      currentAmount: 50,
      targetDate: '2024-03-20',
      priority: 'high',
      completed: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    priority: 'medium',
  });

  const addGoal = () => {
    if (!newGoal.title.trim() || !newGoal.targetAmount.trim()) {
      Alert.alert('Error', 'Please fill in title and target amount');
      return;
    }

    const targetAmount = parseFloat(newGoal.targetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    const goal = {
      id: Date.now(),
      title: newGoal.title.trim(),
      description: newGoal.description.trim(),
      targetAmount,
      currentAmount: 0,
      targetDate: newGoal.targetDate || new Date().toISOString().split('T')[0],
      priority: newGoal.priority,
      completed: false,
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      targetAmount: '',
      targetDate: '',
      priority: 'medium',
    });
    setShowAddModal(false);
    Alert.alert('Success!', 'New goal added!');
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return theme.error;
      case 'medium':
        return theme.warning;
      case 'low':
        return theme.success;
      default:
        return theme.accent;
    }
  };

  const getDaysRemaining = targetDate => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const completedGoals = goals.filter(goal => goal.completed);
  const activeGoals = goals.filter(goal => !goal.completed);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        style={styles.header}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>My Goals</Text>
          <Text style={styles.goalsCount}>
            {activeGoals.length} Active • {completedGoals.length} Completed
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.addGoalButton}
          onPress={() => setShowAddModal(true)}>
          <Icon name="add-circle" size={24} color={theme.white} />
          <Text style={styles.addGoalText}>Add New Goal</Text>
        </TouchableOpacity>

        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          {activeGoals.length === 0 ? (
            <Text style={styles.noGoalsText}>No active goals. Add one to get started!</Text>
          ) : (
            activeGoals.map(goal => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitleContainer}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <View style={[styles.priorityBadge, {backgroundColor: getPriorityColor(goal.priority)}]}>
                      <Text style={styles.priorityText}>{goal.priority.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressText}>
                      ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </Text>
                    <Text style={styles.progressPercentage}>
                      {getProgressPercentage(goal.currentAmount, goal.targetAmount).toFixed(1)}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${getProgressPercentage(goal.currentAmount, goal.targetAmount)}%`,
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.goalFooter}>
                  <View style={styles.goalDate}>
                    <Icon name="event" size={16} color={theme.text} />
                    <Text style={styles.dateText}>
                      {getDaysRemaining(goal.targetDate)} days left
                    </Text>
                  </View>
                  <View style={styles.goalActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Icon name="add" size={16} color={theme.success} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Icon name="edit" size={16} color={theme.accent} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Icon name="check" size={16} color={theme.success} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {completedGoals.length > 0 && (
          <View style={styles.completedSection}>
            <Text style={styles.sectionTitle}>Completed Goals</Text>
            {completedGoals.map(goal => (
              <View key={goal.id} style={[styles.goalCard, styles.completedCard]}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitleContainer}>
                    <Text style={[styles.goalTitle, styles.completedTitle]}>{goal.title}</Text>
                    <Icon name="check-circle" size={20} color={theme.success} />
                  </View>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
                <View style={styles.completedInfo}>
                  <Text style={styles.completedText}>Goal achieved!</Text>
                  <Text style={styles.completedAmount}>${goal.targetAmount.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Goal</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Goal title"
              placeholderTextColor={theme.text}
              value={newGoal.title}
              onChangeText={text => setNewGoal(prev => ({...prev, title: text}))}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Description (optional)"
              placeholderTextColor={theme.text}
              value={newGoal.description}
              onChangeText={text => setNewGoal(prev => ({...prev, description: text}))}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Target amount"
              placeholderTextColor={theme.text}
              value={newGoal.targetAmount}
              onChangeText={text => setNewGoal(prev => ({...prev, targetAmount: text}))}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Target date (YYYY-MM-DD)"
              placeholderTextColor={theme.text}
              value={newGoal.targetDate}
              onChangeText={text => setNewGoal(prev => ({...prev, targetDate: text}))}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addGoal}>
                <Text style={styles.saveButtonText}>Add Goal</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.white,
    marginBottom: 5,
  },
  goalsCount: {
    fontSize: 16,
    color: theme.white,
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  addGoalButton: {
    backgroundColor: theme.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  addGoalText: {
    color: theme.white,
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 16,
  },
  goalsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 15,
  },
  noGoalsText: {
    textAlign: 'center',
    color: theme.text,
    fontStyle: 'italic',
    padding: 20,
    backgroundColor: theme.white,
    borderRadius: 15,
  },
  goalCard: {
    backgroundColor: theme.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedCard: {
    opacity: 0.8,
    backgroundColor: theme.background,
  },
  goalHeader: {
    marginBottom: 15,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: theme.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  goalDescription: {
    fontSize: 14,
    color: theme.text,
    opacity: 0.7,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.text,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.accent,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.background,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.accent,
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 5,
    fontSize: 12,
    color: theme.text,
    opacity: 0.7,
  },
  goalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedSection: {
    marginTop: 10,
  },
  completedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 14,
    color: theme.success,
    fontWeight: 'bold',
  },
  completedAmount: {
    fontSize: 16,
    color: theme.success,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.white,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 2,
    borderColor: theme.primary,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: theme.background,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: theme.background,
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.text,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: theme.accent,
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.white,
    fontWeight: 'bold',
  },
});

export default GoalsScreen;
