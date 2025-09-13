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
  Modal,
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
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  const { addKid } = useKids();

  const ageOptions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];

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

  const handleAgeSelect = (selectedAge) => {
    setAge(selectedAge.toString());
    setShowAgeDropdown(false);
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
              <TouchableOpacity
                style={styles.dropdownContainer}
                onPress={() => setShowAgeDropdown(true)}
              >
                <Icon name="cake" size={20} color={theme.accent} style={styles.inputIcon} />
                <Text style={[styles.dropdownText, !age && styles.placeholderText]}>
                  {age ? `${age}` : 'Select age'}
                </Text>
                <Icon name="keyboard-arrow-down" size={24} color={theme.accent} />
              </TouchableOpacity>
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

      {/* Age Dropdown Modal */}
      <Modal
        visible={showAgeDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAgeDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAgeDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Select Age</Text>
              <TouchableOpacity onPress={() => setShowAgeDropdown(false)}>
                <Icon name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.ageList}>
              {ageOptions.map((ageOption) => (
                <TouchableOpacity
                  key={ageOption}
                  style={[
                    styles.ageItem,
                    age === ageOption.toString() && styles.ageItemSelected
                  ]}
                  onPress={() => handleAgeSelect(ageOption)}
                >
                  <Text
                    style={[
                      styles.ageItemText,
                      age === ageOption.toString() && styles.ageItemTextSelected
                    ]}
                  >
                    {ageOption} years old
                  </Text>
                  {age === ageOption.toString() && (
                    <Icon name="check" size={20} color={theme.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: theme.background,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
  },
  placeholderText: {
    color: theme.text,
    opacity: 0.5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: theme.white,
    borderRadius: 20,
    width: '80%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.background,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  ageList: {
    maxHeight: 300,
  },
  ageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.background,
  },
  ageItemSelected: {
    backgroundColor: theme.background,
  },
  ageItemText: {
    fontSize: 16,
    color: theme.text,
  },
  ageItemTextSelected: {
    color: theme.accent,
    fontWeight: '600',
  },
});

export default AddKidScreen;
