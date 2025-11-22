import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from './lib/supabase';

// Importaciones de Onboarding
import OnboardingWelcome from './screens/OnboardingWelcome';
import {
  OnboardingGender,
  OnboardingGoal,
  OnboardingHeardFrom,
  OnboardingMotivation,
  OnboardingBodyParts,
  OnboardingLevel,
  OnboardingAge,
  OnboardingHeight,
  OnboardingWeight,
  OnboardingTargetWeight,
  OnboardingHealthConditions,
  OnboardingEquipment,
  OnboardingFrequency,
  OnboardingDays,
} from './screens/OnboardingFlow';
import OnboardingSummary from './screens/OnboardingSummary';

// Importa tus pantallas principales
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
// import WorkoutScreen from './screens/WorkoutScreen';
// import ProfileScreen from './screens/ProfileScreen';
// ... otras pantallas

const Stack = createNativeStackNavigator();

// Pantalla de carga
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FF4500" />
    </View>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndOnboarding();

    // Escuchar cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        if (event === 'SIGNED_IN') {
          await checkOnboardingStatus(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setInitialRoute('Login');
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkAuthAndOnboarding = async () => {
    try {
      // 1. Verificar si hay sesión activa
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // No hay sesión, ir a Login
        setInitialRoute('Login');
        setLoading(false);
        return;
      }

      // 2. Hay sesión, verificar si completó onboarding
      await checkOnboardingStatus(session.user.id);

    } catch (error) {
      console.error('Error checking auth:', error);
      setInitialRoute('Login');
    } finally {
      setLoading(false);
    }
  };

  const checkOnboardingStatus = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      // Si no existe el perfil, crearlo
      if (error && error.code === 'PGRST116') {
        console.log('Profile not found, creating...');

        const { data: { user } } = await supabase.auth.getUser();

        const { error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              email: user?.email,
              onboarding_completed: false,
              created_at: new Date().toISOString(),
            }
          ]);

        if (createError) {
          console.error('Error creating profile:', createError);
        }

        setInitialRoute('OnboardingWelcome');
        return;
      }

      if (error) {
        console.error('Error fetching profile:', error);
        setInitialRoute('OnboardingWelcome');
        return;
      }

      if (profile?.onboarding_completed) {
        // Ya completó onboarding, ir a Home
        setInitialRoute('Home');
      } else {
        // No ha completado onboarding
        setInitialRoute('OnboardingWelcome');
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setInitialRoute('OnboardingWelcome');
    }
  };

  if (loading || !initialRoute) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >

        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        {/* Onboarding Screens */}
        <Stack.Screen
          name="OnboardingWelcome"
          component={OnboardingWelcome}
        />
        <Stack.Screen
          name="OnboardingGender"
          component={OnboardingGender}
        />
        <Stack.Screen
          name="OnboardingGoal"
          component={OnboardingGoal}
        />
        <Stack.Screen
          name="OnboardingHeardFrom"
          component={OnboardingHeardFrom}
        />
        <Stack.Screen
          name="OnboardingMotivation"
          component={OnboardingMotivation}
        />
        <Stack.Screen
          name="OnboardingBodyParts"
          component={OnboardingBodyParts}
        />
        <Stack.Screen
          name="OnboardingLevel"
          component={OnboardingLevel}
        />
        <Stack.Screen
          name="OnboardingAge"
          component={OnboardingAge}
        />
        <Stack.Screen
          name="OnboardingHeight"
          component={OnboardingHeight}
        />
        <Stack.Screen
          name="OnboardingWeight"
          component={OnboardingWeight}
        />
        <Stack.Screen
          name="OnboardingTargetWeight"
          component={OnboardingTargetWeight}
        />
        <Stack.Screen
          name="OnboardingHealthConditions"
          component={OnboardingHealthConditions}
        />
        <Stack.Screen
          name="OnboardingEquipment"
          component={OnboardingEquipment}
        />
        <Stack.Screen
          name="OnboardingFrequency"
          component={OnboardingFrequency}
        />
        <Stack.Screen
          name="OnboardingDays"
          component={OnboardingDays}
        />
        <Stack.Screen
          name="OnboardingSummary"
          component={OnboardingSummary}
        />

        {/* Main App Screens */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        {/* Agrega aquí tus otras pantallas */}
        {/*
        <Stack.Screen name="Workout" component={WorkoutScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});