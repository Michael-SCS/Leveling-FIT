import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// --- Section Header ---
export const SectionHeader = ({ title, actionText, onAction }) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {actionText && onAction && (
            <TouchableOpacity onPress={onAction}>
                <Text style={styles.sectionAction}>{actionText}</Text>
            </TouchableOpacity>
        )}
    </View>
);

// --- Wellness Card (Progress/Summary) ---
export const WellnessCard = ({ title, value, subtitle, icon, color, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <LinearGradient colors={color} style={styles.wellnessCard}>
            <View style={styles.wellnessIconContainer}>
                <Text style={styles.wellnessIcon}>{icon}</Text>
            </View>
            <View>
                <Text style={styles.wellnessValue}>{value}</Text>
                <Text style={styles.wellnessTitle}>{title}</Text>
                {subtitle && <Text style={styles.wellnessSubtitle}>{subtitle}</Text>}
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

// --- Quick Access Card (Grid/Featured) ---
export const QuickAccessCard = ({ title, subtitle, icon, colors, onPress, featured }) => (
    <TouchableOpacity
        style={[styles.quickCard, featured && styles.featuredCard]}
        onPress={onPress}
        activeOpacity={0.9}
    >
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickGradient}
        >
            <View style={styles.quickContent}>
                <View>
                    <Text style={[styles.quickTitle, featured && styles.featuredTitle]}>{title}</Text>
                    <Text style={styles.quickSubtitle}>{subtitle}</Text>
                </View>
                <View style={styles.quickIconContainer}>
                    <Text style={styles.quickIcon}>{icon}</Text>
                </View>
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

// --- Habit Card (Interactive) ---
export const HabitCard = ({ label, completed, onPress }) => (
    <TouchableOpacity
        style={[styles.habitCard, completed && styles.habitCardCompleted]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={styles.habitContent}>
            <View style={[styles.habitCheckbox, completed && styles.habitCheckboxChecked]}>
                {completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.habitLabel, completed && styles.habitLabelCompleted]}>{label}</Text>
        </View>
        {completed && <Text style={styles.habitStreak}>🔥</Text>}
    </TouchableOpacity>
);

// --- Recommendation Card (Content/Tips) ---
export const RecommendationCard = ({ title, text, icon, onPress, onDismiss }) => (
    <View style={styles.recommendationCard}>
        <LinearGradient
            colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
            style={styles.recommendationGradient}
        >
            <View style={styles.recommendationHeader}>
                <View style={styles.recommendationTitleRow}>
                    <Text style={styles.recommendationIcon}>{icon}</Text>
                    <Text style={styles.recommendationTitle}>{title}</Text>
                </View>
                {onDismiss && (
                    <TouchableOpacity onPress={onDismiss}>
                        <Text style={styles.dismissIcon}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.recommendationText}>{text}</Text>
            {onPress && (
                <TouchableOpacity onPress={onPress} style={styles.readMoreBtn}>
                    <Text style={styles.readMoreText}>Read More</Text>
                </TouchableOpacity>
            )}
        </LinearGradient>
    </View>
);

const styles = StyleSheet.create({
    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 25,
        paddingHorizontal: 5,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    sectionAction: {
        color: '#FF4500',
        fontSize: 14,
        fontWeight: '600',
    },

    // Wellness Card
    wellnessCard: {
        padding: 16,
        borderRadius: 24,
        marginRight: 12,
        width: 150,
        height: 160,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    wellnessIconContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wellnessIcon: {
        fontSize: 22,
    },
    wellnessValue: {
        fontSize: 26,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 2,
    },
    wellnessTitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
    },
    wellnessSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },

    // Quick Access Card
    quickCard: {
        flex: 1,
        height: 130,
        borderRadius: 24,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    featuredCard: {
        height: 160,
    },
    quickGradient: {
        flex: 1,
        borderRadius: 24,
        padding: 18,
    },
    quickContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    quickTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    featuredTitle: {
        fontSize: 24,
    },
    quickSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '500',
    },
    quickIconContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 18,
        padding: 10,
    },
    quickIcon: {
        fontSize: 24,
    },

    // Habit Card
    habitCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1c1c1e',
        padding: 16,
        borderRadius: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    habitCardCompleted: {
        backgroundColor: 'rgba(50, 205, 50, 0.1)',
        borderColor: '#32CD32',
    },
    habitContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    habitCheckbox: {
        width: 26,
        height: 26,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
    },
    habitCheckboxChecked: {
        backgroundColor: '#32CD32',
        borderColor: '#32CD32',
    },
    checkmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    habitLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    habitLabelCompleted: {
        color: '#aaa',
        textDecorationLine: 'line-through',
    },
    habitStreak: {
        fontSize: 18,
    },

    // Recommendation Card
    recommendationCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    recommendationGradient: {
        padding: 20,
    },
    recommendationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    recommendationTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    recommendationIcon: {
        fontSize: 22,
    },
    recommendationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    dismissIcon: {
        color: '#666',
        fontSize: 16,
        padding: 5,
    },
    recommendationText: {
        color: '#ccc',
        lineHeight: 24,
        fontSize: 15,
        marginBottom: 15,
    },
    readMoreBtn: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    readMoreText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
});
