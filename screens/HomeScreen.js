import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle } from 'react-native-svg';
import BottomMenu from '../components/BottomMenu';
import { supabase } from '../lib/supabase';
import { t, useLanguage } from '../lib/i18n';
import { useGamification, XP_RULES } from '../lib/gamification';
import { XPToast, LevelUpModal } from '../components/GamificationComponents';

// Anillo de Progreso con SVG
const ProgressRing = ({ progress, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          stroke="#2a2a2a"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#FF4500"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ position: 'absolute' }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{progress}%</Text>
        <Text style={{ color: '#999', fontSize: 12, textAlign: 'center' }}>Complete</Text>
      </View>
    </View>
  );
};

// Stat Card con datos reales
const StatCard = ({ icon, value, label, color = '#FF4500', loading }) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    {loading ? (
      <ActivityIndicator size="small" color={color} />
    ) : (
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    )}
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Habit Button con imagen de fondo
const QuickHabitButton = ({ image, label, completed, onPress }) => (
  <TouchableOpacity 
    style={styles.quickHabit} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <ImageBackground
      source={{ uri: image }}
      style={styles.habitImageBg}
      imageStyle={{ borderRadius: 16 }}
    >
      <LinearGradient
        colors={completed ? ['rgba(50,205,50,0.7)', 'rgba(34,139,34,0.9)'] : ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
        style={styles.habitOverlay}
      >
        <Text style={styles.quickHabitLabel}>{label}</Text>
        {completed && (
          <View style={styles.checkMark}>
            <Text style={styles.checkMarkText}>✓</Text>
          </View>
        )}
      </LinearGradient>
    </ImageBackground>
  </TouchableOpacity>
);

// Workout Card con imagen real
const WorkoutCard = ({ title, duration, difficulty, calories, image, onPress }) => (
  <TouchableOpacity style={styles.workoutCard} onPress={onPress} activeOpacity={0.8}>
    <ImageBackground
      source={{ uri: image }}
      style={styles.workoutImageBg}
      imageStyle={{ borderRadius: 20 }}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        style={styles.workoutGradient}
      >
        <View style={styles.workoutContent}>
          <View style={styles.workoutLeft}>
            <Text style={styles.workoutBadge}>HOY</Text>
            <Text style={styles.workoutTitle}>{title}</Text>
            <View style={styles.workoutMeta}>
              <Text style={styles.workoutMetaText}>⏱️ {duration}</Text>
              <Text style={styles.workoutMetaText}>• {difficulty}</Text>
              <Text style={styles.workoutMetaText}>• {calories} kcal</Text>
            </View>
          </View>
          <View style={styles.workoutRight}>
            <LinearGradient
              colors={['#FF4500', '#FF6347']}
              style={styles.playButton}
            >
              <Text style={styles.playIcon}>▶</Text>
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('Warrior');
  const [userGoal, setUserGoal] = useState('Wellness');
  const [habits, setHabits] = useState({
    meditation: false,
    stretching: false,
    workout: false,
    water: false,
  });

  // Estados para datos reales
  const [stats, setStats] = useState({
    streak: 0,
    xpToday: 0,
    totalAchievements: 0,
    loading: true
  });

  const [weeklyStats, setWeeklyStats] = useState({
    workoutsCompleted: 0,
    totalMinutes: 0,
    totalCalories: 0,
    loading: true
  });

  const lang = useLanguage();
  const { addXP, userData } = useGamification();

  // Calcular progreso diario
  const dailyProgress = Math.round(
    (Object.values(habits).filter(Boolean).length / Object.values(habits).length) * 100
  );

  // Mensaje dinámico según hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️ Buenos días';
    if (hour < 18) return '🌤️ Buenas tardes';
    return '🌙 Buenas noches';
  };

  // Cargar datos del usuario y estadísticas
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar datos básicos
        const name = await AsyncStorage.getItem('userName');
        const goal = await AsyncStorage.getItem('userGoal');

        if (name) setUserName(name);
        if (goal) setUserGoal(goal);

        // Obtener usuario de Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Cargar perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, goal')
            .eq('id', user.id)
            .single();

          if (profile) {
            setUserName(profile.full_name || name);
            setUserGoal(profile.goal || goal);
          }

          // Cargar estadísticas reales de gamificación
          const { data: gamificationData } = await supabase
            .from('user_gamification')
            .select('streak, total_xp, level')
            .eq('user_id', user.id)
            .single();

          // Cargar logros totales
          const { data: achievements } = await supabase
            .from('user_achievements')
            .select('id')
            .eq('user_id', user.id);

          // Cargar XP de hoy
          const today = new Date().toISOString().split('T')[0];
          const { data: todayXP } = await supabase
            .from('xp_history')
            .select('amount')
            .eq('user_id', user.id)
            .gte('created_at', today);

          const xpToday = todayXP?.reduce((sum, record) => sum + record.amount, 0) || 0;

          setStats({
            streak: gamificationData?.streak || 0,
            xpToday: xpToday,
            totalAchievements: achievements?.length || 0,
            loading: false
          });

          // Cargar estadísticas de la semana
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          const weekAgoStr = weekAgo.toISOString();

          const { data: weekWorkouts } = await supabase
            .from('workout_sessions')
            .select('duration, calories_burned, completed_at')
            .eq('user_id', user.id)
            .gte('completed_at', weekAgoStr)
            .eq('completed', true);

          if (weekWorkouts) {
            const totalMinutes = weekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
            const totalCalories = weekWorkouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0);

            setWeeklyStats({
              workoutsCompleted: weekWorkouts.length,
              totalMinutes: totalMinutes,
              totalCalories: totalCalories,
              loading: false
            });
          } else {
            setWeeklyStats({ ...weeklyStats, loading: false });
          }

          // Cargar hábitos del día
          const { data: todayHabits } = await supabase
            .from('daily_habits')
            .select('habit_type, completed')
            .eq('user_id', user.id)
            .gte('created_at', today);

          if (todayHabits) {
            const habitsMap = {};
            todayHabits.forEach(h => {
              habitsMap[h.habit_type] = h.completed;
            });
            setHabits({ ...habits, ...habitsMap });
          }
        }
      } catch (e) {
        console.error('Error loading data:', e);
        setStats({ ...stats, loading: false });
        setWeeklyStats({ ...weeklyStats, loading: false });
      }
    };

    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const toggleHabit = async (habit) => {
    const isCompleting = !habits[habit];
    setHabits(prev => ({ ...prev, [habit]: isCompleting }));

    if (isCompleting) {
      addXP(XP_RULES.HABIT_COMPLETE);

      // Guardar en Supabase
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('daily_habits').upsert({
            user_id: user.id,
            habit_type: habit,
            completed: true,
            completed_at: new Date().toISOString()
          });
        }
      } catch (e) {
        console.error('Error saving habit:', e);
      }
    }
  };

  // Formatear tiempo
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#000000', '#0a0a0a', '#121212']} style={styles.background} />

      <XPToast />
      <LevelUpModal />

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Header */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
<Text style={styles.userName}>{userName?.split(' ')[0] || 'Warrior'} 💪</Text>            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View style={styles.avatar}>
  <Text style={styles.avatarText}>{userName?.charAt(0) || 'W'}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Daily Progress Circle */}
          <View style={styles.progressSection}>
            <ProgressRing progress={dailyProgress} />
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Tu progreso hoy</Text>
              <Text style={styles.progressSubtitle}>
                {Object.values(habits).filter(Boolean).length} de {Object.values(habits).length} completadas
              </Text>
              <Text style={styles.motivationalText}>
                {dailyProgress === 100 
                  ? "🎉 ¡Increíble! Día perfecto" 
                  : dailyProgress >= 75 
                  ? "🔥 ¡Vas muy bien!" 
                  : dailyProgress >= 50 
                  ? "💪 Sigue así" 
                  : "🚀 ¡Tú puedes lograrlo!"}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats - DATOS REALES */}
        <View style={styles.statsContainer}>
          <StatCard 
            icon="🔥" 
            value={stats.loading ? "..." : stats.streak.toString()} 
            label="Racha" 
            color="#FF4500" 
            loading={stats.loading}
          />
          <StatCard 
            icon="⚡" 
            value={stats.loading ? "..." : stats.xpToday.toString()} 
            label="XP Hoy" 
            color="#FFD700" 
            loading={stats.loading}
          />
          <StatCard 
            icon="🏆" 
            value={stats.loading ? "..." : stats.totalAchievements.toString()} 
            label="Logros" 
            color="#32CD32" 
            loading={stats.loading}
          />
        </View>

        {/* Today's Workout - CON IMAGEN REAL */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Entreno del Día</Text>
          </View>
          <WorkoutCard
            title="Full Body HIIT"
            duration="30 min"
            difficulty="Intermedio"
            calories="320"
            image="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
            onPress={() => navigation.navigate('Workout')}
          />
        </View>

        {/* Quick Habits - CON IMÁGENES REALES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hábitos Rápidos</Text>
            <Text style={styles.sectionSubtitle}>Completa para ganar XP</Text>
          </View>
          <View style={styles.quickHabitsGrid}>
            <QuickHabitButton
              image="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80"
              label="Meditar"
              completed={habits.meditation}
              onPress={() => toggleHabit('meditation')}
            />
            <QuickHabitButton
              image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80"
              label="Estirar"
              completed={habits.stretching}
              onPress={() => toggleHabit('stretching')}
            />
            <QuickHabitButton
              image="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80"
              label="Ejercicio"
              completed={habits.workout}
              onPress={() => toggleHabit('workout')}
            />
            <QuickHabitButton
              image="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80"
              label="Hidratación"
              completed={habits.water}
              onPress={() => toggleHabit('water')}
            />
          </View>
        </View>

        {/* Weekly Overview - DATOS REALES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Esta Semana</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Progress')}>
              <Text style={styles.sectionAction}>Ver más →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyRow}>
              <Text style={styles.weeklyLabel}>🏃 Entrenamientos</Text>
              {weeklyStats.loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.weeklyValue}>{weeklyStats.workoutsCompleted} / 5</Text>
              )}
            </View>
            <View style={styles.weeklyRow}>
              <Text style={styles.weeklyLabel}>⏱️ Tiempo total</Text>
              {weeklyStats.loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.weeklyValue}>{formatTime(weeklyStats.totalMinutes)}</Text>
              )}
            </View>
            <View style={styles.weeklyRow}>
              <Text style={styles.weeklyLabel}>🔥 Calorías</Text>
              {weeklyStats.loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.weeklyValue}>{weeklyStats.totalCalories.toLocaleString()}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteIcon}>💡</Text>
          <Text style={styles.quoteText}>
            "La consistencia no es perfección. Es simplemente no rendirse. Sigue apareciendo por ti mismo cada día."
          </Text>
        </View>

      </ScrollView>

      <BottomMenu navigation={navigation} activeScreen="Home" />
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
    paddingBottom: 100,
  },
  
  // Hero Section
  hero: {
    marginBottom: 25,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  greeting: {
    fontSize: 16,
    color: '#999',
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF4500',
  },
  avatarText: {
    color: '#FF4500',
    fontSize: 22,
    fontWeight: 'bold',
  },
  
  // Progress Section
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    gap: 20,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  motivationalText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF4500',
  },
  
  // Stats Container
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  
  // Section
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  sectionAction: {
    fontSize: 14,
    color: '#FF4500',
    fontWeight: '600',
  },
  
  // Workout Card
  workoutCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    height: 180,
  },
  workoutImageBg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  workoutGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  workoutContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  workoutLeft: {
    flex: 1,
  },
  workoutBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#FF4500',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  workoutMetaText: {
    fontSize: 13,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  workoutRight: {
    marginLeft: 15,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 4,
  },
  
  // Quick Habits
  quickHabitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickHabit: {
    width: '48%',
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
  },
  habitImageBg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  habitOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    position: 'relative',
  },
  quickHabitLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  checkMark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#32CD32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Weekly Card
  weeklyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyLabel: {
    fontSize: 15,
    color: '#ccc',
  },
  weeklyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  // Quote Card
  quoteCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  quoteIcon: {
    fontSize: 32,
  },
  quoteText: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});