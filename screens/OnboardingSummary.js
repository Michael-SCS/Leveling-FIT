import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingSummary = ({ navigation, route }) => {
  const [saving, setSaving] = useState(false);
  const data = route.params?.data || {};

  const saveOnboardingData = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'No se pudo obtener el usuario');
        return;
      }

      // Calcular BMI
      let bmi = null;
      if (data.height_cm && data.weight_kg) {
        const heightInMeters = data.height_cm / 100;
        bmi = (data.weight_kg / (heightInMeters * heightInMeters)).toFixed(1);
      }

      // Preparar datos para profiles
      const profileData = {
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        email: user.email,
        goal: data.fitness_goal || null,
        age: data.age || null,
        weight: data.weight_kg || null,
        height: data.height_cm || null,
        gender: data.gender || null,
        fitness_level: data.fitness_level || null,
        avatar_url: null,
        // Campos adicionales del onboarding
        fitness_goal: data.fitness_goal || null,
        heard_from: data.heard_from || null,
        motivation: data.motivation || null,
        target_body_parts: data.target_body_parts?.join(',') || null,
        weight_kg: data.weight_kg || null,
        height_cm: data.height_cm || null,
        target_weight_kg: data.target_weight_kg || null,
        health_conditions: data.health_conditions?.join(',') || null,
        equipment: data.equipment?.join(',') || null,
        training_frequency: data.training_frequency || null,
        training_days: data.training_days?.join(',') || null,
        bmi: bmi ? parseFloat(bmi) : null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      };

      // Actualizar perfil en Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      // Guardar en AsyncStorage para acceso rápido
      await AsyncStorage.setItem('userName', profileData.full_name || 'Usuario');
      await AsyncStorage.setItem('userGoal', data.fitness_goal || 'Wellness');
      await AsyncStorage.setItem('onboardingCompleted', 'true');

      // Inicializar gamificación si no existe
      const { data: gamData } = await supabase
        .from('user_gamification')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!gamData) {
        await supabase.from('user_gamification').insert({
          user_id: user.id,
          level: 1,
          total_xp: 0,
          current_xp: 0,
          xp_to_next_level: 100,
          streak: 0,
        });
      }

      setSaving(false);
      
      // Navegar al Home
      Alert.alert(
        '¡Bienvenido! 🎉',
        'Tu perfil ha sido configurado exitosamente',
        [
          {
            text: '¡Empecemos!',
            onPress: () => {
              // Reemplazar toda la pila de navegación
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            },
          },
        ]
      );
    } catch (error) {
      setSaving(false);
      console.error('Error saving onboarding:', error);
      Alert.alert(
        'Error',
        'No se pudo guardar tu información. Por favor intenta de nuevo.',
        [
          { text: 'Reintentar', onPress: saveOnboardingData },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    }
  };

  const getSummaryData = () => {
    const summary = [];
    
    if (data.gender) {
      const genderLabels = {
        male: 'Hombre',
        female: 'Mujer',
        non_binary: 'No binario',
        prefer_not_to_say: 'Prefiero no decir',
      };
      summary.push({ label: 'Género', value: genderLabels[data.gender] || data.gender });
    }
    
    if (data.fitness_goal) {
      const goalLabels = {
        build_muscle: 'Construir Músculo',
        lose_weight: 'Perder Peso',
        maintain_weight: 'Mantener Peso',
        improve_endurance: 'Aumentar Resistencia',
        general_wellness: 'Bienestar General',
      };
      summary.push({ label: 'Objetivo', value: goalLabels[data.fitness_goal] || data.fitness_goal });
    }
    
    if (data.fitness_level) {
      const levelLabels = {
        beginner: 'Principiante',
        intermediate: 'Intermedio',
        advanced: 'Avanzado',
      };
      summary.push({ label: 'Nivel', value: levelLabels[data.fitness_level] || data.fitness_level });
    }
    
    if (data.age) {
      summary.push({ label: 'Edad', value: `${data.age} años` });
    }
    
    if (data.height_cm) {
      summary.push({ label: 'Altura', value: `${data.height_cm} cm` });
    }
    
    if (data.weight_kg) {
      summary.push({ label: 'Peso Actual', value: `${data.weight_kg} kg` });
    }
    
    if (data.target_weight_kg) {
      summary.push({ label: 'Peso Objetivo', value: `${data.target_weight_kg} kg` });
    }
    
    if (data.training_frequency) {
      const freqLabels = {
        '3_days': '3 días/semana',
        '4_days': '4 días/semana',
        '5_days': '5 días/semana',
        '6_days': '6 días/semana',
        '7_days': 'Todos los días',
      };
      summary.push({ label: 'Frecuencia', value: freqLabels[data.training_frequency] || data.training_frequency });
    }
    
    if (data.equipment && data.equipment.length > 0) {
      summary.push({ label: 'Equipo', value: `${data.equipment.length} tipos` });
    }
    
    return summary;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#000000', '#0a0a0a']} style={styles.background} />

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '100%' }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>¡Todo listo! 🎉</Text>
        <Text style={styles.subtitle}>Revisa tu información antes de empezar</Text>

        <View style={styles.summaryContainer}>
          {getSummaryData().map((item, index) => (
            <View key={index} style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Podrás editar esta información en cualquier momento desde tu perfil
          </Text>
        </View>
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.finishButton}
          onPress={saveOnboardingData}
          disabled={saving}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#32CD32', '#228B22']}
            style={styles.finishButtonGradient}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.finishButtonText}>Finalizar y Empezar 🚀</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingSummary;

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
  progressBar: {
    height: 4,
    backgroundColor: '#222',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF4500',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 30,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    gap: 15,
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#999',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 0, 0.3)',
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#FF4500',
    lineHeight: 20,
  },
  navigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#222',
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#32CD32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  finishButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});