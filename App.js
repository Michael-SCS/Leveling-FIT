import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';

// Gamification Provider
import { GamificationProvider } from './lib/gamification';

// Screens
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

  useEffect(() => {
    AsyncStorage.getItem('hasSeenIntroSlides').then(value => {
      setHasSeenIntro(value === 'true');
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        if (session) fetchProfile(session.user.id);
        else setProfile(null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    setProfile(data);
  };

  if (loading || hasSeenIntro === null) return null;

  const getInitialScreen = () => {
    if (!hasSeenIntro) return 'IntroSlides';
    if (!session) return 'Auth';
    if (session && profile && !profile.onboarding_completed) return 'OnboardingFlow';
    if (session && profile && profile.onboarding_completed) return 'Home';

    return 'Auth'; // fallback seguro
  };

  const initialRoute = getInitialScreen();

  return (
    <GamificationProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="IntroSlides" component={IntroSlides} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="OnboardingFlow" component={OnboardingFlow} />
          <Stack.Screen name="OnboardingSummary" component={OnboardingSummary} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Workout" component={WorkoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GamificationProvider>
  );
}
