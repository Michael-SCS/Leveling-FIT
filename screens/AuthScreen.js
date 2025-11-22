// ============================================
// 3. AuthScreen.js - Login/Register (FIXED)
// ============================================
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        // Login correcto → App.js decide la navegación

      } else {
        // REGISTRO
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        if (data?.user) {
          Alert.alert(
            '¡Bienvenido!',
            'Ahora completa tu perfil de guerrero',
            [
              {
                text: 'OK',
                onPress: () => {
                  // ⬅ Asegura que navigation exista
                  if (navigation?.replace) {
                    navigation.replace('OnboardingFlow');
                  } else {
                    console.log('navigation undefined, no se pudo navegar');
                  }
                },
              },
            ],
          );
        }
      }
    } catch (error) {
      console.error('Auth error:', error);

      // Evita crash si error.message viene undefined
      const msg = String(error?.message || '');

      let errorMessage = 'Ocurrió un error';

      if (msg.includes('Invalid login credentials')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (msg.includes('User already registered')) {
        errorMessage = 'Este email ya está registrado';
      } else if (msg.length > 1) {
        errorMessage = msg;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.background}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>⚔️</Text>
            <Text style={styles.title}>WARRIOR FITNESS</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta de guerrero'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Botón */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleAuth}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading ? ['#333', '#333'] : ['#FF4500', '#FF6347']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Cambio login/registro */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsLogin(!isLogin)}
                disabled={loading}
              >
                <Text style={styles.toggleLink}>
                  {isLogin ? 'Regístrate' : 'Inicia sesión'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  keyboardView: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 50 },
  logo: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', letterSpacing: 2, marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#999' },
  form: { width: '100%' },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, color: '#999', marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, fontSize: 16, color: '#fff', borderWidth: 1, borderColor: '#333' },
  button: { borderRadius: 12, overflow: 'hidden', marginTop: 10, elevation: 5 },
  buttonGradient: { paddingVertical: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 25, gap: 5 },
  toggleText: { color: '#999', fontSize: 14 },
  toggleLink: { color: '#FF4500', fontSize: 14, fontWeight: 'bold' },
});
