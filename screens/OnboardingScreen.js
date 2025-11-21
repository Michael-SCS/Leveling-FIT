import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import { setLanguage, t, useLanguage } from '../lib/i18n';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(0); // Start at 0 for Language Selection
  const lang = useLanguage(); // Force re-render on language change

  // Data State
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goal, setGoal] = useState('');

  const totalSteps = 6; // Increased by 1 for Language

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      await finishOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const finishOnboarding = async () => {
    try {
      // Save to AsyncStorage for local use
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userGender', gender);
      await AsyncStorage.setItem('userAge', age);
      await AsyncStorage.setItem('userHeight', height);
      await AsyncStorage.setItem('userWeight', weight);
      await AsyncStorage.setItem('userActivity', activityLevel);
      await AsyncStorage.setItem('userGoal', goal);
      await AsyncStorage.setItem('hasOnboarded', 'true');

      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: name,
            gender: gender,
            age: parseInt(age),
            height: parseFloat(height),
            weight: parseFloat(weight),
            activity_level: activityLevel,
            goal: goal,
            language: lang, // Save language
            updated_at: new Date(),
          })
          .eq('id', user.id);

        if (error) console.error('Supabase Error:', error);
      }

      navigation.replace('Home');
    } catch (e) {
      console.error('Failed to save user data', e);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 0: return true; // Language is always selected (default en) or clicked
      case 1: return name.trim().length > 0;
      case 2: return gender && age.trim().length > 0;
      case 3: return height.trim().length > 0 && weight.trim().length > 0;
      case 4: return activityLevel !== '';
      case 5: return goal !== '';
      default: return false;
    }
  };

  const selectLanguageAndNext = async (selectedLang) => {
    await setLanguage(selectedLang);
    setStep(1);
  };

  const renderStep0 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>{t('selectLanguage')}</Text>
      <Text style={styles.subtitle}>{t('chooseLanguage')}</Text>

      <View style={styles.verticalOptions}>
        <TouchableOpacity
          style={[styles.listOption, lang === 'en' && styles.selectedListOption]}
          onPress={() => selectLanguageAndNext('en')}
        >
          <Text style={styles.flag}>🇺🇸</Text>
          <Text style={[styles.listOptionText, lang === 'en' && styles.selectedListOptionText]}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.listOption, lang === 'es' && styles.selectedListOption]}
          onPress={() => selectLanguageAndNext('es')}
        >
          <Text style={styles.flag}>🇪🇸</Text>
          <Text style={[styles.listOptionText, lang === 'es' && styles.selectedListOptionText]}>Español</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>{t('welcomeWarrior')}</Text>
      <Text style={styles.subtitle}>{t('letsStartName')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('enterName')}
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
        autoCorrect={false}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>{t('basicInfo')}</Text>
      <Text style={styles.subtitle}>{t('tellUsAbout')}</Text>

      <Text style={styles.label}>{t('gender')}</Text>
      <View style={styles.optionRow}>
        {['Male', 'Female', 'Other'].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.optionButton, gender === g && styles.selectedOption]}
            onPress={() => setGender(g)}
          >
            <Text style={[styles.optionText, gender === g && styles.selectedOptionText]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>{t('age')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('years')}
        placeholderTextColor="#666"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>{t('bodyStats')}</Text>
      <Text style={styles.subtitle}>{t('calculateMetrics')}</Text>

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>{t('height')}</Text>
          <TextInput
            style={styles.input}
            placeholder="175"
            placeholderTextColor="#666"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.label}>{t('weight')}</Text>
          <TextInput
            style={styles.input}
            placeholder="70"
            placeholderTextColor="#666"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>{t('activityLevel')}</Text>
      <Text style={styles.subtitle}>{t('howActive')}</Text>

      <View style={styles.verticalOptions}>
        {[
          { id: 'Sedentary', label: 'Sedentary (Office Job)' },
          { id: 'Light', label: 'Lightly Active (1-2 days/week)' },
          { id: 'Moderate', label: 'Moderately Active (3-5 days/week)' },
          { id: 'Very', label: 'Very Active (6-7 days/week)' },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.listOption, activityLevel === opt.id && styles.selectedListOption]}
            onPress={() => setActivityLevel(opt.id)}
          >
            <Text style={[styles.listOptionText, activityLevel === opt.id && styles.selectedListOptionText]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>{t('yourMission')}</Text>
      <Text style={styles.subtitle}>{t('chooseObjective')}</Text>

      <View style={styles.verticalOptions}>
        {[
          { id: 'Lose Weight', label: 'Lose Weight', icon: '🔥' },
          { id: 'Build Muscle', label: 'Build Muscle', icon: '💪' },
          { id: 'Keep Fit', label: 'Keep Fit', icon: '🏃' },
        ].map((g) => (
          <TouchableOpacity
            key={g.id}
            style={[styles.listOption, goal === g.id && styles.selectedListOption]}
            onPress={() => setGoal(g.id)}
          >
            <Text style={styles.goalIcon}>{g.icon}</Text>
            <Text style={[styles.listOptionText, goal === g.id && styles.selectedListOptionText]}>
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.background}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((step + 1) / totalSteps) * 100}%` }]} />
          </View>

          {step === 0 && renderStep0()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}

          <View style={styles.footer}>
            {step > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>{t('back')}</Text>
              </TouchableOpacity>
            )}

            {step > 0 && ( // Hide Next button on Language step as selection auto-advances
              <TouchableOpacity
                style={[styles.button, !isStepValid() && styles.buttonDisabled]}
                onPress={handleNext}
                disabled={!isStepValid()}
              >
                <LinearGradient
                  colors={['#FF4500', '#FF8C00']}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>
                    {step === totalSteps - 1 ? t('startJourneyBtn') : t('next')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 40,
    marginTop: 40,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF4500',
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 30,
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    backgroundColor: '#1c1c1e',
    padding: 20,
    borderRadius: 15,
    fontSize: 18,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedOption: {
    borderColor: '#FF4500',
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
  },
  optionText: {
    color: '#888',
    fontWeight: 'bold',
  },
  selectedOptionText: {
    color: '#FF4500',
  },
  row: {
    flexDirection: 'row',
  },
  verticalOptions: {
    gap: 15,
  },
  listOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedListOption: {
    borderColor: '#FF4500',
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
  },
  listOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedListOptionText: {
    color: '#FF4500',
    fontWeight: 'bold',
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  flag: {
    fontSize: 30,
    marginRight: 15,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    gap: 15,
  },
  backButton: {
    padding: 15,
  },
  backButtonText: {
    color: '#888',
    fontSize: 16,
  },
  button: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});