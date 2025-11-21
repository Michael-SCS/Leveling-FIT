import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PremiumHeader, ProBadge } from '../components/CommonComponents';
import { t, useLanguage } from '../lib/i18n';
import { generatePlan } from '../lib/ai_logic';

export default function DietPlanScreen({ navigation }) {
  const [isPremium, setIsPremium] = useState(false);
  const [userGoal, setUserGoal] = useState('');
  const [aiDiet, setAiDiet] = useState(null);
  const [loadingAI, setLoadingAI] = useState(true);
  const lang = useLanguage();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedGoal = await AsyncStorage.getItem('userGoal') || 'General Wellness';
      setUserGoal(savedGoal);

      // Generate AI Plan
      setLoadingAI(true);
      const plan = await generatePlan(savedGoal);
      setAiDiet(plan.diet);
      setLoadingAI(false);
    } catch (e) {
      console.error('Failed to load user data', e);
      setLoadingAI(false);
    }
  };

  const togglePremium = () => {
    setIsPremium(!isPremium);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <PremiumHeader
          title={t('premiumDietPlan')}
          subtitle={`${t('fuelYourBody')} ${userGoal || 'Success'}`}
          onBack={() => navigation.goBack()}
        />

        {!isPremium ? (
          <View style={styles.lockedContainer}>
            <View style={styles.lockIconContainer}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
            <Text style={styles.lockedText}>{t('unlockPotential')}</Text>
            <Text style={styles.lockedSubText}>{t('getPersonalized')}</Text>

            <TouchableOpacity style={styles.upgradeButton} onPress={togglePremium}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>{t('unlockPremium')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.planContainer}>
            <View style={styles.unlockedHeader}>
              <ProBadge />
              <Text style={styles.unlockedText}>{t('planActive')}</Text>
            </View>

            {loadingAI ? (
              <Text style={{ color: '#888', textAlign: 'center', marginVertical: 20 }}>🤖 AI is preparing your menu...</Text>
            ) : aiDiet ? (
              <>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Daily Targets</Text>
                  <Text style={styles.summaryText}>{aiDiet.calories} kcal • {aiDiet.macros.protein} Protein</Text>
                </View>
                {aiDiet.meals.map((item, index) => (
                  <View key={index} style={styles.mealCard}>
                    <View style={styles.mealHeader}>
                      <Text style={styles.mealTime}>{item.name}</Text>
                      <Text style={styles.mealCal}>Meal {index + 1}</Text>
                    </View>
                    <Text style={styles.mealName}>{item.desc}</Text>
                  </View>
                ))}
              </>
            ) : null}

            <TouchableOpacity style={styles.downgradeButton} onPress={togglePremium}>
              <Text style={styles.downgradeText}>Dev Mode: Lock Premium</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  lockedContainer: {
    backgroundColor: '#1c1c1e',
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    marginTop: 20,
  },
  lockIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  lockIcon: {
    fontSize: 30,
  },
  lockedText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  lockedSubText: {
    fontSize: 15,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  upgradeButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  planContainer: {
    width: '100%',
  },
  unlockedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 25,
  },
  unlockedText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  mealCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4500',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mealTime: {
    color: '#FF4500',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  mealCal: {
    color: '#888',
    fontSize: 14,
  },
  mealName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  downgradeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  downgradeText: {
    color: '#333',
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: '#1c1c1e',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  summaryTitle: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryText: {
    color: '#fff',
    fontSize: 16,
  },
});
