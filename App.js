import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';

// Screens
import IntroSlides from './screens/IntroSlides';
import AuthScreen from './screens/AuthScreen';
import OnboardingFlow from './screens/OnboardingFlow';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  // 1️⃣ Revisar si ya vio los slides
  useEffect(() => {
    const loadIntro = async () => {
      const seen = await AsyncStorage.getItem('hasSeenIntroSlides');
      setHasSeenIntro(seen === 'true');
    };
    loadIntro();
  }, []);

  // 2️⃣ Escuchar sesión (SOLO UNA VEZ)
  useEffect(() => {
    // Cargar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      if (session) fetchProfile(session.user.id);
      setLoading(false);
    });

    // Listener cambios sesión
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
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

  // 🔥 Lógica correcta de navegación
  const getInitialScreen = () => {
    if (!hasSeenIntro) return 'IntroSlides';
    if (!session) return 'Auth';
    if (session && profile && !profile.onboarding_completed) return 'OnboardingFlow';
    return 'Home';
  };

  const initialRoute = getInitialScreen();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="IntroSlides" component={IntroSlides} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="OnboardingFlow" component={OnboardingFlow} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
