import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';

import { GamificationProvider } from './lib/gamification';

import IntroSlides from './screens/IntroSlides';
import AuthScreen from './screens/AuthScreen';
import OnboardingFlow from './screens/OnboardingFlow';
import OnboardingSummary from './screens/OnboardingSummary';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import WorkoutScreen from './screens/WorkoutPlanScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  // cargar intro una vez
  useEffect(() => {
    AsyncStorage.getItem("hasSeenIntroSlides").then((v) => {
      setHasSeenIntro(v === "true");
    });
  }, []);

  // manejar sesión
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AUTH EVENT:", event);

        setSession(session);

        if (session?.user?.id) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    setProfile(data);
  };

  if (loading || hasSeenIntro === null) return null;

  // 🔥 AQUÍ CAMBIAREMOS ENTRE NAVEGADORES SEGÚN EL ESTADO
  const renderNavigator = () => {
    // 1️⃣ No ha visto los slides
    if (!hasSeenIntro) {
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="IntroSlides" component={IntroSlides} />
        </Stack.Navigator>
      );
    }

    // 2️⃣ No está logueado
    if (!session) {
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      );
    }

    // 3️⃣ Está logueado pero no ha completado onboarding
    if (profile && !profile.onboarding_completed) {
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="OnboardingFlow" component={OnboardingFlow} />
          <Stack.Screen name="OnboardingSummary" component={OnboardingSummary} />
        </Stack.Navigator>
      );
    }

    // 4️⃣ Todo listo → Home
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Workout" component={WorkoutScreen} />
      </Stack.Navigator>
    );
  };

  return (
    <GamificationProvider>
      <NavigationContainer>
        {renderNavigator()}
      </NavigationContainer>
    </GamificationProvider>
  );
}
