// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthScreen from "./screens/AuthScreen";
import OnBoardingScreen from "./screens/OnBoardingScreen";
import HomeScreen from "./screens/HomeScreen";
import WorkoutPlanScreen from "./screens/WorkoutPlanScreen";
import DietPlanScreen from "./screens/DietPlanScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PremiumScreen from "./screens/PremiumScreen";
import ExerciseDetailScreen from "./screens/ExerciseDetailScreen";
import { GamificationProvider } from "./lib/gamification";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GamificationProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 300,
            contentStyle: { backgroundColor: '#0a0a0a' }
          }}
        >
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />
          <Stack.Screen name="DietPlan" component={DietPlanScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Premium" component={PremiumScreen} />
          <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GamificationProvider>
  );
}