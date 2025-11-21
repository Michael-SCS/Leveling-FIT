import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// --- Filter Chip ---
export const FilterChip = ({ label, active, onPress }) => (
    <TouchableOpacity
        style={[styles.filterChip, active && styles.activeFilterChip]}
        onPress={onPress}
    >
        <Text style={[styles.filterText, active && styles.activeFilterText]}>{label}</Text>
    </TouchableOpacity>
);

// --- Category Header ---
export const CategoryHeader = ({ title, onSeeAll }) => (
    <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{title}</Text>
        {onSeeAll && (
            <TouchableOpacity onPress={onSeeAll}>
                <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
        )}
    </View>
);

// --- Workout Card ---
export const WorkoutCard = ({ title, duration, level, type, image, onPress, onStart }) => (
    <TouchableOpacity style={styles.workoutCard} onPress={onPress} activeOpacity={0.9}>
        <ImageBackground
            source={{ uri: image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
            style={styles.cardImage}
            imageStyle={{ borderRadius: 20 }}
        >
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.cardGradient}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{level}</Text>
                    </View>
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <View style={styles.cardMeta}>
                        <Text style={styles.metaText}>⏱️ {duration}</Text>
                        <Text style={styles.metaText}>🔥 {type}</Text>
                    </View>

                    <TouchableOpacity style={styles.startButton} onPress={onStart}>
                        <Text style={styles.startButtonText}>Start</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </ImageBackground>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    // Filter Chip
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#1c1c1e',
        borderWidth: 1,
        borderColor: '#333',
        marginRight: 10,
    },
    activeFilterChip: {
        backgroundColor: '#FF4500',
        borderColor: '#FF4500',
    },
    filterText: {
        color: '#888',
        fontWeight: '600',
    },
    activeFilterText: {
        color: '#fff',
    },

    // Category Header
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 25,
        paddingHorizontal: 5,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    seeAllText: {
        color: '#FF4500',
        fontSize: 14,
        fontWeight: '600',
    },

    // Workout Card
    workoutCard: {
        width: 280,
        height: 320,
        marginRight: 15,
        borderRadius: 20,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    cardImage: {
        flex: 1,
        borderRadius: 20,
    },
    cardGradient: {
        flex: 1,
        borderRadius: 20,
        justifyContent: 'space-between',
        padding: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    levelBadge: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    levelText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardContent: {
        gap: 8,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardMeta: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 10,
    },
    metaText: {
        color: '#ccc',
        fontSize: 14,
    },
    startButton: {
        backgroundColor: '#FF4500',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 14,
    },
});
