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
        navigation.navigate('Login');
        return;
      }

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
      'Log Out',
      '¿Estás seguro que deseas cerrar sesión?',
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
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#000000', '#0a0a0a']} style={styles.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setEditMode(!editMode)} style={styles.editButton}>
          <Text style={styles.editText}>{editMode ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.full_name?.charAt(0) || 'U'}</Text>
            </View>
            <View style={styles.cameraButton}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </View>
          
          <Text style={styles.profileName}>{profile.full_name || 'Usuario'}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>

        {/* Pro Member Card */}
        <View style={styles.proMemberCard}>
          <LinearGradient
            colors={['#4CAF50', '#45a049']}
            style={styles.proGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.proContent}>
              <View style={styles.proLeft}>
                <Text style={styles.proTitle}>Pro Member 👑</Text>
                <Text style={styles.proSubtitle}>All features unlocked!</Text>
                <TouchableOpacity style={styles.upgradeButton}>
                  <Text style={styles.upgradeText}>Upgrade</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.proRight}>
                <Text style={styles.giftIcon}>🎁</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          {editMode ? (
            <View style={styles.editContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={profile.email}
                  editable={false}
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date of Birth</Text>
                <TextInput
                  style={styles.input}
                  value={profile.age}
                  onChangeText={(text) => setProfile({ ...profile, age: text })}
                  placeholder="Edad"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Gender</Text>
                <TextInput
                  style={styles.input}
                  value={profile.gender}
                  onChangeText={(text) => setProfile({ ...profile, gender: text })}
                  placeholder="Male/Female/Other"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={profile.weight}
                  onChangeText={(text) => setProfile({ ...profile, weight: text })}
                  placeholder="+00-000-000-0000"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuIcon}>📦</Text>
                <Text style={styles.menuText}>Orders</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuIcon}>↩️</Text>
                <Text style={styles.menuText}>Returns</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuIcon}>🔖</Text>
                <Text style={styles.menuText}>Wishlist</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuIcon}>📍</Text>
                <Text style={styles.menuText}>Address</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuIcon}>💳</Text>
                <Text style={styles.menuText}>Payment</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Personalization Section (only when not editing) */}
        {!editMode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personalization</Text>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🔔</Text>
              <Text style={styles.menuText}>Notification</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuText}>Preferences</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🌙</Text>
              <Text style={styles.menuText}>Dark Mode</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Save Button */}
        {editMode && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveProfile}
            disabled={saving}
          >
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.saveGradient}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save Changes</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Help & Support Section (only when not editing) */}
        {!editMode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help & Support</Text>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🛟</Text>
              <Text style={styles.menuText}>Get Help</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>❓</Text>
              <Text style={styles.menuText}>FAQ</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={[styles.menuText, { color: '#FF5252' }]}>Log Out</Text>
              <Text style={styles.menuArrow}></Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
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
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 28,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  cameraIcon: {
    fontSize: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#999',
  },
  proMemberCard: {
    marginBottom: 25,
    borderRadius: 16,
    overflow: 'hidden',
  },
  proGradient: {
    padding: 20,
  },
  proContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proLeft: {
    flex: 1,
  },
  proTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  proSubtitle: {
    fontSize: 14,
    color: '#e8f5e9',
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  upgradeText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
  proRight: {
    marginLeft: 16,
  },
  giftIcon: {
    fontSize: 48,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 14,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 20,
    color: '#666',
  },
  editContainer: {
    gap: 12,
  },
  inputGroup: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    paddingLeft: 4,
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
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
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
});