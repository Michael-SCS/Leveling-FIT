import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import BottomMenu from '../components/BottomMenu';

// Card de información
const InfoCard = ({ icon, label, value, onPress }) => (
  <TouchableOpacity style={styles.infoCard} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'No definido'}</Text>
    </View>
    <Text style={styles.infoArrow}>›</Text>
  </TouchableOpacity>
);

// Card de estadística
const StatCard = ({ icon, value, label, color }) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    goal: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    fitness_level: '',
  });
  const [gamification, setGamification] = useState({
    level: 1,
    total_xp: 0,
    streak: 0,
    total_workouts_completed: 0,
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigation.replace('Auth');
        return;
      }

      // Cargar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || '',
          email: profileData.email || user.email,
          goal: profileData.goal || '',
          age: profileData.age?.toString() || '',
          weight: profileData.weight?.toString() || '',
          height: profileData.height?.toString() || '',
          gender: profileData.gender || '',
          fitness_level: profileData.fitness_level || '',
        });
      }

      // Cargar datos de gamificación
      const { data: gamData, error: gamError } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (gamData) {
        setGamification({
          level: gamData.level || 1,
          total_xp: gamData.total_xp || 0,
          streak: gamData.streak || 0,
          total_workouts_completed: gamData.total_workouts_completed || 0,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'No se pudo cargar el perfil');
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          goal: profile.goal,
          age: profile.age ? parseInt(profile.age) : null,
          weight: profile.weight ? parseFloat(profile.weight) : null,
          height: profile.height ? parseFloat(profile.height) : null,
          gender: profile.gender,
          fitness_level: profile.fitness_level,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Guardar en AsyncStorage también
      await AsyncStorage.setItem('userName', profile.full_name);
      await AsyncStorage.setItem('userGoal', profile.goal);

      Alert.alert('¡Éxito!', 'Perfil actualizado correctamente');
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'No se pudo guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas salir?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí, salir',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) {
                Alert.alert('Error', 'No se pudo cerrar sesión');
                console.error('Logout error:', error);
              }
              // La navegación se manejará automáticamente por el listener en App.js
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'Ocurrió un error al cerrar sesión');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={['#000000', '#121212']} style={styles.background} />
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#000000', '#0a0a0a', '#121212']} style={styles.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity onPress={() => setEditMode(!editMode)} style={styles.editButton}>
          <Text style={styles.editIcon}>{editMode ? '✕' : '✎'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar y nombre */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.full_name?.charAt(0) || 'U'}</Text>
          </View>
          {editMode ? (
            <TextInput
              style={styles.nameInput}
              value={profile.full_name}
              onChangeText={(text) => setProfile({ ...profile, full_name: text })}
              placeholder="Tu nombre"
              placeholderTextColor="#666"
            />
          ) : (
            <Text style={styles.profileName}>{profile.full_name || 'Usuario'}</Text>
          )}
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>

        {/* Stats de gamificación */}
        <View style={styles.statsContainer}>
          <StatCard icon="⭐" value={gamification.level} label="Nivel" color="#FFD700" />
          <StatCard icon="⚡" value={gamification.total_xp} label="XP Total" color="#FF4500" />
          <StatCard icon="🔥" value={gamification.streak} label="Racha" color="#FF6347" />
        </View>

        {/* Información personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          {editMode ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Objetivo</Text>
                <TextInput
                  style={styles.input}
                  value={profile.goal}
                  onChangeText={(text) => setProfile({ ...profile, goal: text })}
                  placeholder="Ej: Perder peso, Ganar músculo"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Edad</Text>
                  <TextInput
                    style={styles.input}
                    value={profile.age}
                    onChangeText={(text) => setProfile({ ...profile, age: text })}
                    placeholder="25"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Género</Text>
                  <TextInput
                    style={styles.input}
                    value={profile.gender}
                    onChangeText={(text) => setProfile({ ...profile, gender: text })}
                    placeholder="M/F/Otro"
                    placeholderTextColor="#666"
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Peso (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={profile.weight}
                    onChangeText={(text) => setProfile({ ...profile, weight: text })}
                    placeholder="70"
                    placeholderTextColor="#666"
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Altura (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={profile.height}
                    onChangeText={(text) => setProfile({ ...profile, height: text })}
                    placeholder="175"
                    placeholderTextColor="#666"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nivel de Fitness</Text>
                <TextInput
                  style={styles.input}
                  value={profile.fitness_level}
                  onChangeText={(text) => setProfile({ ...profile, fitness_level: text })}
                  placeholder="Principiante, Intermedio, Avanzado"
                  placeholderTextColor="#666"
                />
              </View>
            </>
          ) : (
            <>
              <InfoCard icon="🎯" label="Objetivo" value={profile.goal} />
              <InfoCard icon="👤" label="Edad" value={profile.age ? `${profile.age} años` : null} />
              <InfoCard icon="⚖️" label="Peso" value={profile.weight ? `${profile.weight} kg` : null} />
              <InfoCard icon="📏" label="Altura" value={profile.height ? `${profile.height} cm` : null} />
              <InfoCard icon="💪" label="Nivel" value={profile.fitness_level} />
            </>
          )}
        </View>

        {/* Botones de acción */}
        {editMode && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveProfile}
            disabled={saving}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#32CD32', '#228B22']}
              style={styles.saveGradient}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>💾 Guardar Cambios</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Botón de logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF4500', '#FF6347']}
            style={styles.logoutGradient}
          >
            <Text style={styles.logoutText}>🚪 Cerrar Sesión</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.version}>Versión 1.0.0</Text>
      </ScrollView>

      <BottomMenu navigation={navigation} activeScreen="Profile" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 20,
    color: '#FF4500',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF4500',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  nameInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 5,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#FF4500',
  },
  profileEmail: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 28,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoArrow: {
    fontSize: 24,
    color: '#666',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupHalf: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  saveButton: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#32CD32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoutGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 10,
  },
});