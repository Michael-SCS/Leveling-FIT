import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function ExerciseDetailScreen({ route, navigation }) {
    const { exercise } = route.params;
    const [timerVisible, setTimerVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const startTimer = (duration) => {
        setTimeLeft(duration);
        setIsActive(true);
        setTimerVisible(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Mock instructions based on type (in a real app, this would come from a DB)
    const getInstructions = (name) => {
        return [
            "Start in a comfortable standing or starting position.",
            "Engage your core and maintain proper posture.",
            `Perform the ${name} movement with controlled tempo.`,
            "Breathe rhythmically: exhale on exertion, inhale on release.",
            "Complete the designated reps and rest between sets."
        ];
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#000000', '#1a1a1a']}
                style={styles.background}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.title}>{exercise.name}</Text>
                <Text style={styles.subtitle}>{exercise.type} • {exercise.sets} Sets • {exercise.reps}</Text>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {getInstructions(exercise.name).map((step, index) => (
                        <View key={index} style={styles.stepRow}>
                            <Text style={styles.stepNumber}>{index + 1}</Text>
                            <Text style={styles.stepText}>{step}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Target Muscles</Text>
                    <View style={styles.tagContainer}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{exercise.type}</Text>
                        </View>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>Core</Text>
                        </View>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>Stabilizers</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.timerButton}
                    onPress={() => {
                        if (exercise.reps.includes('sec')) {
                            const sec = parseInt(exercise.reps);
                            startTimer(isNaN(sec) ? 60 : sec);
                        } else {
                            startTimer(60); // Default rest
                        }
                    }}
                >
                    <LinearGradient
                        colors={['#FF4500', '#FF8C00']}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>Start Timer ⏱️</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>

            {/* Timer Modal (Reused) */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={timerVisible}
                onRequestClose={() => setTimerVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.timerTitle}>Timer</Text>
                        <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>

                        <View style={styles.timerControls}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setIsActive(!isActive)}
                            >
                                <Text style={styles.modalButtonText}>{isActive ? 'Pause' : 'Resume'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.closeButton]}
                                onPress={() => {
                                    setIsActive(false);
                                    setTimerVisible(false);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    },
    backButton: {
        marginBottom: 20,
    },
    backText: {
        color: '#FF4500',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        color: '#888',
        marginBottom: 30,
    },
    card: {
        backgroundColor: '#1c1c1e',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 10,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    stepNumber: {
        color: '#FF4500',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 15,
        width: 20,
    },
    stepText: {
        color: '#ccc',
        fontSize: 16,
        flex: 1,
        lineHeight: 24,
    },
    tagContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    tag: {
        backgroundColor: 'rgba(255, 69, 0, 0.1)',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FF4500',
    },
    tagText: {
        color: '#FF4500',
        fontWeight: 'bold',
    },
    timerButton: {
        borderRadius: 30,
        overflow: 'hidden',
        marginTop: 10,
        marginBottom: 40,
    },
    gradientButton: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalContent: {
        backgroundColor: '#1c1c1e',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: '80%',
        borderWidth: 1,
        borderColor: '#FF4500',
    },
    timerTitle: {
        fontSize: 24,
        color: '#aaa',
        marginBottom: 10,
    },
    timerValue: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
    },
    timerControls: {
        flexDirection: 'row',
        gap: 20,
    },
    modalButton: {
        backgroundColor: '#FF4500',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    closeButton: {
        backgroundColor: '#333',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
