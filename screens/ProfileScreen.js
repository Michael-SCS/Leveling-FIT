import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import BottomMenu from '../components/BottomMenu';
import { ProfileHeader, SettingRow } from '../components/ProfileComponents'; // Keep existing header/settings
import { StatGrid, HistoryItem, ProTeaserCard, GoalCard } from '../components/ProfileComponents'; // Import new components
import { SectionHeader } from '../components/HomeComponents';
import { supabase } from '../lib/supabase';
import { t, useLanguage } from '../lib/i18n';
import { LevelProgress, XPToast, LevelUpModal } from '../components/GamificationComponents';

export default function ProfileScreen({ navigation }) {
    const [name, setName] = useState('Warrior');
    const [joinDate, setJoinDate] = useState('Nov 2023');
    const [stats, setStats] = useState({ streak: 3, minutes: 120, workouts: 12 });
    const [goal, setGoal] = useState('Build a consistent habit of 3 workouts per week.');
    const lang = useLanguage();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const storedName = await AsyncStorage.getItem('userName');
                if (storedName) setName(storedName);

                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                    if (data) {
                        setName(data.full_name);
                        // Format date
                        const date = new Date(data.updated_at || new Date());
                        setJoinDate(date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'short', year: 'numeric' }));

                        // Load stats if available, else keep defaults/mock
                        if (data.streak) setStats(prev => ({ ...prev, streak: data.streak }));
                        if (data.total_minutes) setStats(prev => ({ ...prev, minutes: data.total_minutes }));
                        if (data.workouts_completed) setStats(prev => ({ ...prev, workouts: data.workouts_completed }));
                        if (data.goal) setGoal(data.goal);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadProfile();
    }, [lang]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        await AsyncStorage.clear();
        navigation.replace('Auth');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#000000', '#1a1a1a']}
                style={styles.background}
            />

            <XPToast />
            <LevelUpModal />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Header & Level */}
                <ProfileHeader
                    name={name}
                    memberSince={`${t('memberSince')} ${joinDate}`}
                    avatarChar={name.charAt(0)}
                    onEdit={() => Alert.alert('Coming Soon', 'Edit Profile feature is coming soon!')}
                />
                <LevelProgress />

                {/* Stats Grid */}
                <StatGrid
                    streak={stats.streak}
                    minutes={stats.minutes}
                    workouts={stats.workouts}
                />

                {/* Premium Teaser */}
                <ProTeaserCard onPress={() => navigation.navigate('Premium')} />

                {/* Goal */}
                <GoalCard goal={goal} />

                {/* Recent Activity (History) */}
                <SectionHeader title={t('recentActivity')} />
                <View style={styles.historyList}>
                    <HistoryItem icon="🧘" title="Morning Meditation" date="Today, 8:00 AM" xp={10} />
                    <HistoryItem icon="🏋️‍♂️" title="Full Body Power" date="Yesterday, 6:30 PM" xp={50} />
                    <HistoryItem icon="💧" title="Hydration Goal" date="Yesterday, 9:00 PM" xp={10} />
                </View>

                {/* Settings */}
                <SectionHeader title={t('settings')} />
                <View style={styles.settingsContainer}>
                    <SettingRow icon="👤" title={t('editProfile')} onPress={() => Alert.alert('Coming Soon', 'Edit Profile feature is under development.')} />
                    <SettingRow icon="🔔" title={t('notifications')} onPress={() => Alert.alert('Notifications', 'Notification settings are coming soon.')} />
                    <SettingRow icon="🔒" title={t('privacySecurity')} onPress={() => Alert.alert('Privacy', 'Privacy settings are coming soon.')} />
                    <SettingRow icon="❓" title={t('helpSupport')} onPress={() => Alert.alert('Help', 'Support center is coming soon.')} />
                    <SettingRow icon="🚪" title={t('logOut')} onPress={handleLogout} isDestructive />
                </View>
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
    content: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 100,
    },
    historyList: {
        marginBottom: 20,
    },
    settingsContainer: {
        backgroundColor: '#1c1c1e',
        borderRadius: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
});
