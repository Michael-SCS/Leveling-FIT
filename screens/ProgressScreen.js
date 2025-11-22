import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

// Card de estadística
const StatCard = ({ title, value, unit, change, icon, color }) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <Text style={styles.statIcon}>{icon}</Text>
      <View style={[styles.changeBadge, { backgroundColor: change >= 0 ? '#32CD32' : '#FF4500' }]}>
        <Text style={styles.changeText}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </Text>
      </View>
    </View>
    <Text style={styles.statTitle}>{title}</Text>
    <View style={styles.statValueContainer}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
    </View>
  </View>
);

// Card de período
const PeriodCard = ({ period, workouts, time, calories, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.periodCard, isActive && styles.periodCardActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.periodTitle, isActive && styles.periodTitleActive]}>
      {period}
    </Text>
    <View style={styles.periodStats}>
      <View style={styles.periodStat}>
        <Text style={styles.periodValue}>{workouts}</Text>
        <Text style={styles.periodLabel}>Entrenos</Text>
      </View>
      <View style={styles.periodStat}>
        <Text style={styles.periodValue}>{time}</Text>
        <Text style={styles.periodLabel}>Tiempo</Text>
      </View>
      <View style={styles.periodStat}>
        <Text style={styles.periodValue}>{calories}</Text>
        <Text style={styles.periodLabel}>kcal</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Achievement Badge
const AchievementBadge = ({ icon, title, date, unlocked }) => (
  <View style={[styles.achievementBadge, !unlocked && styles.achievementLocked]}>
    <View style={[styles.achievementIcon, !unlocked && styles.achievementIconLocked]}>
      <Text style={styles.achievementEmoji}>{icon}</Text>
    </View>
    <Text style={[styles.achievementTitle, !unlocked && styles.achievementTitleLocked]}>
      {title}
    </Text>
    {unlocked && date && (
      <Text style={styles.achievementDate}>{date}</Text>
    )}
  </View>
);

export default function ProgressScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalTime: 0,
    totalCalories: 0,
    avgWorkoutTime: 0,
    weekChange: 0,
    currentStreak: 0,
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [0] }],
  });
  const [achievements, setAchievements] = useState([]);
  const [periodData, setPeriodData] = useState({
    week: { workouts: 0, time: '0h', calories: 0 },
    month: { workouts: 0, time: '0h', calories: 0 },
    year: { workouts: 0, time: '0h', calories: 0 },
  });

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Cargar workouts de diferentes períodos
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

      // Datos de la semana
      const { data: weekWorkouts } = await supabase
        .from('workout_sessions')
        .select('duration, calories_burned, completed_at')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('completed_at', weekAgo.toISOString());

      // Datos del mes
      const { data: monthWorkouts } = await supabase
        .from('workout_sessions')
        .select('duration, calories_burned, completed_at')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('completed_at', monthAgo.toISOString());

      // Datos del año
      const { data: yearWorkouts } = await supabase
        .from('workout_sessions')
        .select('duration, calories_burned')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('completed_at', yearAgo.toISOString());

      // Calcular estadísticas
      const calculateStats = (workouts) => {
        if (!workouts || workouts.length === 0) {
          return { count: 0, time: 0, calories: 0 };
        }
        return {
          count: workouts.length,
          time: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
          calories: workouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0),
        };
      };

      const weekStats = calculateStats(weekWorkouts);
      const monthStats = calculateStats(monthWorkouts);
      const yearStats = calculateStats(yearWorkouts);

      const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      };

      setPeriodData({
        week: {
          workouts: weekStats.count,
          time: formatTime(weekStats.time),
          calories: weekStats.calories,
        },
        month: {
          workouts: monthStats.count,
          time: formatTime(monthStats.time),
          calories: monthStats.calories,
        },
        year: {
          workouts: yearStats.count,
          time: formatTime(yearStats.time),
          calories: yearStats.calories,
        },
      });

      // Calcular estadísticas generales
      const avgTime = monthStats.count > 0 ? Math.round(monthStats.time / monthStats.count) : 0;

      setStats({
        totalWorkouts: monthStats.count,
        totalTime: monthStats.time,
        totalCalories: monthStats.calories,
        avgWorkoutTime: avgTime,
        weekChange: 12, // Puedes calcular el cambio real comparando con la semana anterior
        currentStreak: 5, // Obtener del sistema de gamificación
      });

      // Preparar datos para el gráfico (últimos 7 días)
      const last7Days = [];
      const labels = [];
      const dataPoints = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        last7Days.push(dateStr);

        const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()];
        labels.push(dayName);

        const dayWorkouts = weekWorkouts?.filter(w =>
          w.completed_at.startsWith(dateStr)
        ) || [];

        const dayCalories = dayWorkouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0);
        dataPoints.push(dayCalories);
      }

      setChartData({
        labels,
        datasets: [{ data: dataPoints.length > 0 ? dataPoints : [0] }],
      });

      // Cargar logros
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at, achievements(name, description, icon)')
        .eq('user_id', user.id);

      if (userAchievements) {
        setAchievements(userAchievements.map(a => ({
          icon: a.achievements?.icon || '🏆',
          title: a.achievements?.name || 'Logro',
          date: new Date(a.unlocked_at).toLocaleDateString(),
          unlocked: true,
        })));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading progress:', error);
      setLoading(false);
    }
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
        <Text style={styles.headerTitle}>Tu Progreso</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Entrenamientos"
            value={stats.totalWorkouts}
            unit="total"
            change={stats.weekChange}
            icon="💪"
            color="#FF4500"
          />
          <StatCard
            title="Tiempo Total"
            value={Math.floor(stats.totalTime / 60)}
            unit="horas"
            change={8}
            icon="⏱️"
            color="#FFD700"
          />
          <StatCard
            title="Calorías"
            value={(stats.totalCalories / 1000).toFixed(1)}
            unit="k"
            change={15}
            icon="🔥"
            color="#FF6347"
          />
          <StatCard
            title="Promedio"
            value={stats.avgWorkoutTime}
            unit="min"
            change={5}
            icon="📊"
            color="#32CD32"
          />
        </View>

        {/* Period Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen por Período</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodsScroll}>
            <PeriodCard
              period="Esta Semana"
              workouts={periodData.week.workouts}
              time={periodData.week.time}
              calories={periodData.week.calories}
              isActive={selectedPeriod === 'week'}
              onPress={() => setSelectedPeriod('week')}
            />
            <PeriodCard
              period="Este Mes"
              workouts={periodData.month.workouts}
              time={periodData.month.time}
              calories={periodData.month.calories}
              isActive={selectedPeriod === 'month'}
              onPress={() => setSelectedPeriod('month')}
            />
            <PeriodCard
              period="Este Año"
              workouts={periodData.year.workouts}
              time={periodData.year.time}
              calories={periodData.year.calories}
              isActive={selectedPeriod === 'year'}
              onPress={() => setSelectedPeriod('year')}
            />
          </ScrollView>
        </View>

        {/* Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calorías Quemadas (7 días)</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#1a1a1a',
                backgroundGradientFrom: '#1a1a1a',
                backgroundGradientTo: '#1a1a1a',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#FF4500',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logros Recientes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <AchievementBadge key={index} {...achievement} />
              ))
            ) : (
              <>
                <AchievementBadge icon="🏆" title="Primera Victoria" unlocked={false} />
                <AchievementBadge icon="🔥" title="Semana Perfecta" unlocked={false} />
                <AchievementBadge icon="💪" title="Fuerza Total" unlocked={false} />
              </>
            )}
          </ScrollView>
        </View>

        {/* Personal Records */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Récords Personales</Text>
          <View style={styles.recordsContainer}>
            <View style={styles.recordCard}>
              <Text style={styles.recordIcon}>🏃</Text>
              <Text style={styles.recordTitle}>Mayor Racha</Text>
              <Text style={styles.recordValue}>{stats.currentStreak} días</Text>
            </View>
            <View style={styles.recordCard}>
              <Text style={styles.recordIcon}>⚡</Text>
              <Text style={styles.recordTitle}>Más Calorías</Text>
              <Text style={styles.recordValue}>520 kcal</Text>
            </View>
          </View>
        </View>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 25,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statUnit: {
    fontSize: 14,
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
  periodsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  periodCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 160,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  periodCardActive: {
    borderColor: '#FF4500',
    backgroundColor: '#2a1a1a',
  },
  periodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
  },
  periodTitleActive: {
    color: '#FF4500',
  },
  periodStats: {
    gap: 8,
  },
  periodStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  periodLabel: {
    fontSize: 12,
    color: '#999',
  },
  chartContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  achievementsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  achievementBadge: {
    alignItems: 'center',
    marginRight: 20,
    width: 100,
  },
  achievementLocked: {
    opacity: 0.4,
  },
  achievementIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementIconLocked: {
    backgroundColor: '#2a2a2a',
  },
  achievementEmoji: {
    fontSize: 40,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#666',
  },
  achievementDate: {
    fontSize: 10,
    color: '#999',
  },
  recordsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  recordCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  recordIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  recordTitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  recordValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4500',
  },
});