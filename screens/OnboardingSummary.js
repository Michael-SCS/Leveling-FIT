import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

export default function OnboardingSummary({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const data = route.params?.data || {};

  // ================================
  // Mostrar formulario final
  // ================================
  const handleComplete = () => {
    setShowEmailForm(true);
  };

  // ================================
  // Crear cuenta y guardar datos
  // ================================
  const handleCreateAccount = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa email y contraseña');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // 1. Crear cuenta en Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Calcular BMI
        const heightM = data.height_cm / 100;
        const bmi = (data.weight_kg / (heightM * heightM)).toFixed(1);

        // 2. Actualizar perfil
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            onboarding_completed: true,
            email: email.trim(),
            gender: data.gender,
            fitness_goal: data.fitness_goal,
            heard_from: data.heard_from,
            motivation: data.motivation,
            target_body_parts: data.target_body_parts,
            fitness_level: data.fitness_level,
            age: data.age,
            height_cm: data.height_cm,
            weight_kg: data.weight_kg,
            target_weight_kg: data.target_weight_kg,
            health_conditions: data.health_conditions,
            equipment: data.equipment,
            training_frequency: data.training_frequency,
            training_days: data.training_days,
            bmi: parseFloat(bmi),
            updated_at: new Date().toISOString(),
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        Alert.alert('¡Éxito!', 'Cuenta creada correctamente', [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            },
          },
        ]);
      }
    } catch (err) {
      console.log(err);

      let msg = 'Error al crear la cuenta';

      if (err.message.includes('User already registered')) {
        msg = 'Este email ya está registrado.';
      }

      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================
  // RENDER PANTALLA
  // ===========================================================
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Resumen</Text>
        <Text style={styles.subtitle}>
          Revisa tus datos antes de continuar
        </Text>

        {/* Aquí iría TU RESUMEN REAL (BMI, datos, lista, etc) */}
        {/* Lo dejé simple, porque no lo pegaste completo */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            Género: {data.gender || 'No definido'}
          </Text>
          <Text style={styles.summaryText}>
            Objetivo: {data.fitness_goal || 'No definido'}
          </Text>
          <Text style={styles.summaryText}>
            Edad: {data.age || 'No definido'}
          </Text>
          <Text style={styles.summaryText}>
            Peso: {data.weight_kg} kg
          </Text>
          <Text style={styles.summaryText}>
            Estatura: {data.height_cm} cm
          </Text>
        </View>
      </ScrollView>

      {/* ======================================================
          FORMULARIO FINAL EMAIL + CONTRASEÑA
      ======================================================= */}
      {showEmailForm && (
        <View style={styles.emailFormOverlay}>
          <View style={styles.emailFormContainer}>
            <Text style={styles.emailFormTitle}>Crea tu cuenta</Text>
            <Text style={styles.emailFormSubtitle}>
              Para guardar tu progreso necesitamos que te registres
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateAccount}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#333', '#333'] : ['#FF4500', '#FF6347']}
                style={styles.createButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.createButtonText}>
                    CREAR CUENTA Y EMPEZAR
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEmailForm(false)}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* BUTTON FINAL ORIGINAL */}
      {!showEmailForm && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            disabled={loading}
          >
            <LinearGradient
              colors={['#FF4500', '#FF6347']}
              style={styles.completeButtonGradient}
            >
              <Text style={styles.completeButtonText}>
                🚀 COMENZAR MI VIAJE
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ==== Layout general ====
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  summaryBox: {
    padding: 20,
    backgroundColor: '#111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  summaryText: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 8,
  },

  // === Email Form ===
  emailFormOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emailFormContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 30,
    borderColor: '#FF4500',
    borderWidth: 2,
  },
  emailFormTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  emailFormSubtitle: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    color: '#aaa',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 15,
    fontSize: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  createButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  createButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  cancelButtonText: {
    color: '#aaa',
    textAlign: 'center',
  },

  // === Footer ===
  footer: {
    padding: 20,
  },
  completeButtonGradient: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
