import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { FilterChip, CategoryHeader, WorkoutCard } from '../components/WorkoutComponents';
import BottomMenu from '../components/BottomMenu';

export default function WorkoutPlanScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Strength', 'Cardio', 'Flexibility', 'HIIT'];

  const workouts = [
    {
      id: 1,
      title: 'Full Body Power',
      duration: '45 min',
      level: 'Intermediate',
      type: 'Strength',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 2,
      title: 'Morning Yoga Flow',
      duration: '20 min',
      level: 'Beginner',
      type: 'Flexibility',
      image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 3,
      title: 'HIIT Cardio Blast',
      duration: '30 min',
      level: 'Advanced',
      type: 'HIIT',
      image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 4,
      title: 'Upper Body Sculpt',
      duration: '40 min',
      level: 'Intermediate',
      type: 'Strength',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || workout.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#000000', '#121212']}
        style={styles.background}
      />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Plan</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search workouts..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              active={activeFilter === filter}
              onPress={() => setActiveFilter(filter)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CategoryHeader title="Recommended for You" onSeeAll={() => { }} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {filteredWorkouts.slice(0, 2).map((workout) => (
            <WorkoutCard
              key={workout.id}
              title={workout.title}
              duration={workout.duration}
              level={workout.level}
              type={workout.type}
              image={workout.image}
              onPress={() => { }}
              onStart={() => { }}
            />
          ))}
        </ScrollView>

        <CategoryHeader title="All Workouts" />
        <View style={styles.grid}>
          {filteredWorkouts.map((workout) => (
            <View key={workout.id} style={styles.gridItem}>
              <WorkoutCard
                title={workout.title}
                duration={workout.duration}
                level={workout.level}
                type={workout.type}
                image={workout.image}
                onPress={() => { }}
                onStart={() => { }}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomMenu navigation={navigation} activeScreen="Workout" />
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#1c1c1e',
    padding: 15,
    borderRadius: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterContainer: {
    paddingLeft: 20,
    marginBottom: 10,
    height: 50,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  horizontalScroll: {
    overflow: 'visible',
    marginBottom: 20,
  },
  grid: {
    gap: 20,
  },
  gridItem: {
    marginBottom: 10,
  },
});