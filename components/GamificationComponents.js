import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGamification } from '../lib/gamification';

// --- Level Progress Bar ---
export const LevelProgress = () => {
    const { levelData } = useGamification();

    return (
        <View style={styles.progressContainer}>
            <View style={styles.levelInfo}>
                <Text style={styles.levelText}>Lvl {levelData.level}</Text>
                <Text style={styles.xpText}>{Math.floor(levelData.xpInLevel)} / {levelData.xpRequired} XP</Text>
            </View>
            <View style={styles.progressBarBg}>
                <LinearGradient
                    colors={['#FF4500', '#FF8C00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressBarFill, { width: `${levelData.progress * 100}%` }]}
                />
            </View>
            <Text style={styles.levelTitle}>{levelData.title}</Text>
        </View>
    );
};

// --- XP Toast ---
export const XPToast = () => {
    const { earnedXP } = useGamification();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        if (earnedXP > 0) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => slideAnim.setValue(20));
        }
    }, [earnedXP]);

    if (earnedXP === 0) return null;

    return (
        <Animated.View style={[styles.toastContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.toastGradient}
            >
                <Text style={styles.toastText}>+{earnedXP} XP</Text>
            </LinearGradient>
        </Animated.View>
    );
};

// --- Level Up Modal ---
export const LevelUpModal = () => {
    const { showLevelUp, setShowLevelUp, levelData } = useGamification();
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        if (showLevelUp) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0.5);
        }
    }, [showLevelUp]);

    return (
        <Modal
            visible={showLevelUp}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.modalOverlay}>
                <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
                    <LinearGradient
                        colors={['#1a1a1a', '#000']}
                        style={styles.modalGradient}
                    >
                        <Text style={styles.congratsText}>LEVEL UP!</Text>
                        <Text style={styles.levelBig}>{levelData.level}</Text>
                        <Text style={styles.newTitle}>You are now a {levelData.title}</Text>

                        <TouchableOpacity style={styles.claimButton} onPress={() => setShowLevelUp(false)}>
                            <LinearGradient
                                colors={['#FF4500', '#FF8C00']}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>Awesome!</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // Progress Bar
    progressContainer: {
        width: '100%',
        marginBottom: 20,
    },
    levelInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    levelText: {
        color: '#FF4500',
        fontWeight: 'bold',
        fontSize: 16,
    },
    xpText: {
        color: '#888',
        fontSize: 14,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: '#333',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 5,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    levelTitle: {
        color: '#aaa',
        fontSize: 12,
        textAlign: 'right',
        fontStyle: 'italic',
    },

    // Toast
    toastContainer: {
        position: 'absolute',
        top: 100, // Adjust based on header height
        alignSelf: 'center',
        zIndex: 100,
    },
    toastGradient: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        elevation: 5,
    },
    toastText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '90%',
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 10,
        borderWidth: 1,
        borderColor: '#FF4500',
    },
    modalGradient: {
        padding: 40,
        alignItems: 'center',
    },
    congratsText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 10,
        letterSpacing: 2,
    },
    levelBig: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#FF4500',
        marginBottom: 10,
        textShadowColor: 'rgba(255, 69, 0, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    newTitle: {
        fontSize: 18,
        color: '#ccc',
        marginBottom: 40,
        textAlign: 'center',
    },
    claimButton: {
        width: '100%',
        borderRadius: 25,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});
