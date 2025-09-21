import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar, View, ActivityIndicator, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { KidsProvider } from "./src/contexts/KidsContext";
import HomeScreen from "./src/screens/HomeScreen";
import SavingsScreen from "./src/screens/SavingsScreen";
import GoalsScreen from "./src/screens/GoalsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import AddKidScreen from "./src/screens/AddKidScreen";
import KidDetailsScreen from "./src/screens/KidDetailsScreen";
import AllTransactionsScreen from "./src/screens/AllTransactionsScreen";

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
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Dashboard") {
            iconName = "dashboard";
          } else if (route.name === "Savings") {
            iconName = "account-balance-wallet";
          } else if (route.name === "Goals") {
            iconName = "flag";
          } else if (route.name === "Settings") {
            iconName = "settings";
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.white,
          borderTopColor: theme.primary,
          borderTopWidth: 2,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: theme.primary,
          borderBottomColor: theme.accent,
          borderBottomWidth: 2,
        },
        headerTintColor: theme.white,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen
        name="Savings"
        component={SavingsScreen}
        options={{ title: "Savings" }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{ title: "Goals" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Tab.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="AddKid" component={AddKidScreen} />
      <Stack.Screen name="KidDetails" component={KidDetailsScreen} />
      <Stack.Screen name="AllTransactions" component={AllTransactionsScreen} />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <KidsProvider>
        <AppNavigator />
      </KidsProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
  },
});

export default App;
