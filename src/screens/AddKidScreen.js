import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useKids } from '../contexts/KidsContext';

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

const AddKidScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addKid } = useKids();

  const ageOptions = Array.from({ length: 21 }, (_, i) => i + 1);

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter kid\'s name');
      return;
    }

    if (!age) {
      Alert.alert('Error', 'Please select kid\'s age');
      return;
    }

    setIsLoading(true);
    const result = await addKid({
      name: name.trim(),
      age: parseInt(age),
    });
    setIsLoading(false);

    if (result.success) {
      Alert.alert('Success', `${name} has been added successfully!`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleClear = () => {
    setName('');
    setAge('');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={[theme.background, theme.secondary]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Add New Kid</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Icon name="child-care" size={40} color={theme.accent} />
              <Text style={styles.formTitle}>Kid Information</Text>
              <Text style={styles.formSubtitle}>
                Add your child's details to start managing their finances
              </Text>
            </View>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kid's Name</Text>
              <View style={styles.inputContainer}>
                <Icon name="person" size={20} color={theme.accent} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter kid's name"
                  placeholderTextColor={theme.text}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Age Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age</Text>
              <View style={styles.inputContainer}>
                <Icon name="cake" size={20} color={theme.accent} style={styles.inputIcon} />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.ageScrollView}
                >
                  {ageOptions.map((ageOption) => (
                    <TouchableOpacity
                      key={ageOption}
                      style={[
                        styles.ageOption,
                        age === ageOption.toString() && styles.ageOptionSelected
                      ]}
                      onPress={() => setAge(ageOption.toString())}
                    >
                      <Text
                        style={[
                          styles.ageOptionText,
                          age === ageOption.toString() && styles.ageOptionTextSelected
                        ]}
                      >
                        {ageOption}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.clearButton, isLoading && styles.disabledButton]}
                onPress={handleClear}
                disabled={isLoading}
              >
                <Icon name="clear" size={20} color={theme.error} />
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addButton, isLoading && styles.disabledButton]}
                onPress={handleAdd}
                disabled={isLoading}
              >
                <Icon name="add" size={20} color={theme.white} />
                <Text style={styles.addButtonText}>
                  {isLoading ? 'Adding...' : 'Add Kid'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  placeholder: {
    width: 40,
  },
  formCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 15,
    marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 14,
    color: theme.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
  },
  ageScrollView: {
    flex: 1,
  },
  ageOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: theme.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.background,
  },
  ageOptionSelected: {
    backgroundColor: theme.accent,
    borderColor: theme.accent,
  },
  ageOptionText: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '500',
  },
  ageOptionTextSelected: {
    color: theme.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.error,
    flex: 0.45,
    justifyContent: 'center',
  },
  clearButtonText: {
    color: theme.error,
    fontWeight: '600',
    marginLeft: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 0.45,
    justifyContent: 'center',
  },
  addButtonText: {
    color: theme.white,
    fontWeight: '600',
    marginLeft: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default AddKidScreen; 
