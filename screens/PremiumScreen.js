import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { BackButton, ProBadge } from '../components/CommonComponents';
import { t } from '../lib/i18n';

export default function PremiumScreen({ navigation }) {
    const benefits = [
        { icon: '🤖', title: t('aiCoach'), desc: t('aiCoachDesc') || 'Smart recommendations based on your habits.' },
        { icon: '🧠', title: t('smartRoutines'), desc: t('smartRoutinesDesc') || 'Workouts that adapt to your energy levels.' },
        { icon: '📊', title: t('advancedReports'), desc: t('advancedReportsDesc') || 'Deep dive into your wellness trends.' },
        { icon: '🏆', title: t('proChallenges'), desc: t('proChallengesDesc') || 'Exclusive badges and monthly challenges.' },
        { icon: '📚', title: t('premiumContent'), desc: t('premiumContentDesc') || 'Access to masterclasses and guides.' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#000000', '#1a1a1a']}
                style={styles.background}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerRow}>
                    <BackButton onPress={() => navigation.goBack()} />
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.header}>
                    <Text style={styles.title}>{t('goPremium')}</Text>
                    <Text style={styles.subtitle}>{t('unlockPotential')}</Text>
                </View>

                <View style={styles.card}>
                    <LinearGradient
                        colors={['#FFD700', '#FFA500']}
                        style={styles.cardGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.badgeContainer}>
                            <ProBadge size="small" />
                        </View>
                        <Text style={styles.cardTitle}>{t('fullAccess')}</Text>
                        <Text style={styles.price}>$9.99<Text style={styles.period}>/mo</Text></Text>
                        <Text style={styles.trialText}>{t('startTrial')}</Text>
                    </LinearGradient>
                </View>

                <View style={styles.benefitsList}>
                    {benefits.map((b, index) => (
                        <View key={index} style={styles.benefitItem}>
                            <View style={styles.iconBox}>
                                <Text style={styles.icon}>{b.icon}</Text>
                            </View>
                            <View style={styles.benefitText}>
                                <View style={styles.benefitHeader}>
                                    <Text style={styles.benefitTitle}>{b.title}</Text>
                                    <View style={styles.miniBadge}>
                                        <Text style={styles.miniBadgeText}>PRO</Text>
                                    </View>
                                </View>
                                <Text style={styles.benefitDesc}>{b.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.subscribeButton}>
                    <LinearGradient
                        colors={['#FF4500', '#FF8C00']}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>{t('startTrial')}</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.dismissButton}>
                    <Text style={styles.dismissText}>{t('maybeLater')}</Text>
                </TouchableOpacity>
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
    content: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
    },
    card: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 30,
        elevation: 5,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    cardGradient: {
        padding: 30,
        alignItems: 'center',
    },
    badgeContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 8,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#000',
        letterSpacing: 2,
        marginBottom: 10,
        marginTop: 10,
    },
    price: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#000',
    },
    period: {
        fontSize: 18,
        fontWeight: 'normal',
    },
    trialText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        opacity: 0.7,
    },
    benefitsList: {
        gap: 15,
        marginBottom: 30,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1c1c1e',
        padding: 15,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    iconBox: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    icon: {
        fontSize: 24,
    },
    benefitText: {
        flex: 1,
    },
    benefitHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    benefitTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    miniBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 3,
    },
    miniBadgeText: {
        color: '#000',
        fontSize: 8,
        fontWeight: 'bold',
    },
    benefitDesc: {
        fontSize: 14,
        color: '#888',
        lineHeight: 20,
    },
    subscribeButton: {
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 15,
    },
    buttonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    dismissButton: {
        alignItems: 'center',
        padding: 10,
    },
    dismissText: {
        color: '#666',
        fontSize: 14,
    },
});
