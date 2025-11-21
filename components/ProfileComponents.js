import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { t } from '../lib/i18n';

// --- Profile Header ---
export const ProfileHeader = ({ name, memberSince, avatarChar, onEdit }) => {
    return (
        <View style={styles.header}>
            <View style={styles.avatarContainer}>
                <LinearGradient
                    colors={['#FF4500', '#FF8C00']}
                    style={styles.avatarGradient}
                >
                    <Text style={styles.avatarText}>{avatarChar}</Text>
                </LinearGradient>
                <TouchableOpacity style={styles.editBadge} onPress={onEdit}>
                    <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.memberSince}>{memberSince}</Text>
        </View>
    );
};

// --- Stat Grid ---
export const StatGrid = ({ streak, minutes, workouts }) => {
    return (
        <View style={styles.statGrid}>
            <View style={styles.statItem}>
                <Text style={styles.statValue}>{streak} 🔥</Text>
                <Text style={styles.statLabel}>{t('streak')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statValue}>{minutes}m ⏱️</Text>
                <Text style={styles.statLabel}>{t('minutes')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statValue}>{workouts} 💪</Text>
                <Text style={styles.statLabel}>{t('workouts')}</Text>
            </View>
        </View>
    );
};

// --- History Item ---
export const HistoryItem = ({ icon, title, date, xp }) => {
    return (
        <View style={styles.historyItem}>
            <View style={styles.historyIconBox}>
                <Text style={styles.historyIcon}>{icon}</Text>
            </View>
            <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>{title}</Text>
                <Text style={styles.historyDate}>{date}</Text>
            </View>
            <View style={styles.historyXp}>
                <Text style={styles.xpValue}>+{xp} XP</Text>
            </View>
        </View>
    );
};

// --- Pro Teaser Card ---
export const ProTeaserCard = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.teaserContainer}>
            <LinearGradient
                colors={['#FFD700', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.teaserGradient}
            >
                <View style={styles.teaserContent}>
                    <View style={styles.teaserText}>
                        <View style={styles.proBadge}>
                            <Text style={styles.proBadgeText}>PRO</Text>
                        </View>
                        <Text style={styles.teaserTitle}>{t('unlockAICoach')}</Text>
                        <Text style={styles.teaserSubtitle}>{t('getPersonalizedPlan')}</Text>
                    </View>
                    <Text style={styles.teaserIcon}>🤖</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

// --- Goal Card ---
export const GoalCard = ({ goal }) => {
    return (
        <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{t('currentFocus')}</Text>
                <Text style={styles.goalIcon}>🎯</Text>
            </View>
            <Text style={styles.goalText}>{goal}</Text>
        </View>
    );
};

// --- Setting Row ---
export const SettingRow = ({ icon, title, onPress, isDestructive }) => {
    return (
        <TouchableOpacity style={styles.settingRow} onPress={onPress}>
            <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>{icon}</Text>
                <Text style={[styles.settingTitle, isDestructive && styles.destructiveText]}>{title}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // Header
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        marginBottom: 15,
        position: 'relative',
    },
    avatarGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1c1c1e',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#333',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    editIcon: {
        fontSize: 14,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    memberSince: {
        fontSize: 14,
        color: '#888',
    },

    // Stat Grid
    statGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#333',
        height: '80%',
        alignSelf: 'center',
    },

    // History Item
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1c1c1e',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#2c2c2e',
    },
    historyIconBox: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    historyIcon: {
        fontSize: 20,
    },
    historyContent: {
        flex: 1,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    historyDate: {
        fontSize: 12,
        color: '#888',
    },
    historyXp: {
        backgroundColor: 'rgba(255, 69, 0, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    xpValue: {
        color: '#FF4500',
        fontWeight: 'bold',
        fontSize: 12,
    },

    // Pro Teaser
    teaserContainer: {
        marginBottom: 25,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    teaserGradient: {
        padding: 20,
    },
    teaserContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    teaserText: {
        flex: 1,
    },
    proBadge: {
        backgroundColor: '#000',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 8,
    },
    proBadgeText: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 10,
    },
    teaserTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#000',
        marginBottom: 4,
    },
    teaserSubtitle: {
        fontSize: 14,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    teaserIcon: {
        fontSize: 40,
    },

    // Goal Card
    goalCard: {
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    goalTitle: {
        fontSize: 14,
        color: '#888',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    goalIcon: {
        fontSize: 16,
    },
    goalText: {
        fontSize: 18,
        color: '#fff',
        fontStyle: 'italic',
    },

    // Setting Row
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        fontSize: 20,
        marginRight: 15,
        width: 25,
        textAlign: 'center',
    },
    settingTitle: {
        fontSize: 16,
        color: '#fff',
    },
    destructiveText: {
        color: '#FF4500',
    },
    chevron: {
        fontSize: 20,
        color: '#666',
    },
});
