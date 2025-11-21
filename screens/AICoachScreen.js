import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { BackButton, ProBadge } from '../components/CommonComponents';
import { generatePlan } from '../lib/ai_logic';
import { t } from '../lib/i18n';

// --- Components ---

const TypewriterText = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedText(text.substring(0, i + 1));
            i++;
            if (i > text.length) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, 30); // Speed of typing
        return () => clearInterval(timer);
    }, [text]);

    return <Text style={styles.aiText}>{displayedText}</Text>;
};

const PlanCard = ({ title, data, type }) => {
    return (
        <View style={styles.planCard}>
            <LinearGradient
                colors={['#1c1c1e', '#2c2c2e']}
                style={styles.planGradient}
            >
                <View style={styles.planHeader}>
                    <Text style={styles.planTitle}>{title}</Text>
                    <Text style={styles.planIcon}>{type === 'workout' ? '🏋️‍♂️' : '🥗'}</Text>
                </View>

                {type === 'workout' ? (
                    <>
                        <Text style={styles.subDetail}>{data.title} • {data.duration}</Text>
                        <View style={styles.divider} />
                        {data.exercises.map((ex, i) => (
                            <View key={i} style={styles.row}>
                                <Text style={styles.rowText}>• {ex.name}</Text>
                                <Text style={styles.rowValue}>{ex.sets} x {ex.reps}</Text>
                            </View>
                        ))}
                    </>
                ) : (
                    <>
                        <Text style={styles.subDetail}>{data.calories} kcal • {data.macros.protein} Protein</Text>
                        <View style={styles.divider} />
                        {data.meals.map((meal, i) => (
                            <View key={i} style={styles.mealRow}>
                                <Text style={styles.mealName}>{meal.name}</Text>
                                <Text style={styles.mealDesc}>{meal.desc}</Text>
                            </View>
                        ))}
                    </>
                )}
            </LinearGradient>
        </View>
    );
};

export default function AICoachScreen({ navigation, route }) {
    const [step, setStep] = useState('input'); // input, generating, result
    const [goal, setGoal] = useState('Lose Weight');
    const [plan, setPlan] = useState(null);
    const [loadingText, setLoadingText] = useState('Analyzing your profile...');

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handleGenerate = async () => {
        setStep('generating');

        // Simulate stages
        setTimeout(() => setLoadingText('Calculating metabolic rate...'), 1000);
        setTimeout(() => setLoadingText('Designing workout routine...'), 2500);
        setTimeout(() => setLoadingText('Optimizing nutrition plan...'), 4000);

        const generatedPlan = await generatePlan(goal);
        setPlan(generatedPlan);
        setStep('result');

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#000000', '#0f0f1a']}
                style={styles.background}
            />

            <View style={styles.headerRow}>
                <BackButton onPress={() => navigation.goBack()} />
                <ProBadge />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* STEP 1: INPUT */}
                {step === 'input' && (
                    <View style={styles.centerContent}>
                        <View style={styles.aiAvatar}>
                            <Text style={{ fontSize: 40 }}>🤖</Text>
                        </View>
                        <Text style={styles.title}>{t('aiCoach')}</Text>
                        <Text style={styles.subtitle}>{t('aiCoachIntro') || "I will design the perfect plan for you. What is your main goal?"}</Text>

                        <View style={styles.optionsContainer}>
                            {['Lose Weight', 'Build Muscle', 'Improve Endurance', 'General Wellness'].map((g) => (
                                <TouchableOpacity
                                    key={g}
                                    style={[styles.optionButton, goal === g && styles.selectedOption]}
                                    onPress={() => setGoal(g)}
                                >
                                    <Text style={[styles.optionText, goal === g && styles.selectedOptionText]}>{g}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
                            <LinearGradient
                                colors={['#FFD700', '#FFA500']}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>{t('generatePlan') || "GENERATE PLAN"}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}

                {/* STEP 2: GENERATING */}
                {step === 'generating' && (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color="#FFD700" style={{ marginBottom: 20 }} />
                        <TypewriterText text={loadingText} />
                    </View>
                )}

                {/* STEP 3: RESULT */}
                {step === 'result' && plan && (
                    <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
                        <View style={styles.resultHeader}>
                            <Text style={styles.resultTitle}>Your Personalized Plan</Text>
                            <Text style={styles.resultSubtitle}>Goal: {goal}</Text>
                        </View>

                        <PlanCard title="Daily Workout" data={plan.workout} type="workout" />
                        <PlanCard title="Nutrition Plan" data={plan.diet} type="diet" />

                        <View style={styles.tipsContainer}>
                            <Text style={styles.tipsTitle}>💡 AI Tips</Text>
                            {plan.tips.map((tip, i) => (
                                <Text key={i} style={styles.tipText}>• {tip}</Text>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.saveButtonText}>Save & Start</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}

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
        paddingTop: 20,
        paddingBottom: 40,
        minHeight: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        marginBottom: 20,
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    aiAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1c1c1e',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    optionsContainer: {
        width: '100%',
        gap: 15,
        marginBottom: 40,
    },
    optionButton: {
        padding: 20,
        backgroundColor: '#1c1c1e',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
    },
    selectedOption: {
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    optionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    selectedOptionText: {
        color: '#FFD700',
    },
    generateButton: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    aiText: {
        color: '#FFD700',
        fontSize: 18,
        fontFamily: 'monospace',
        textAlign: 'center',
    },

    // Result Styles
    resultHeader: {
        marginBottom: 20,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    resultSubtitle: {
        fontSize: 16,
        color: '#FFD700',
        marginTop: 5,
    },
    planCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    planGradient: {
        padding: 20,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    planTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    planIcon: {
        fontSize: 20,
    },
    subDetail: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#444',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    rowText: {
        color: '#fff',
        fontSize: 15,
    },
    rowValue: {
        color: '#FFD700',
        fontWeight: 'bold',
    },
    mealRow: {
        marginBottom: 12,
    },
    mealName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    mealDesc: {
        color: '#888',
        fontSize: 14,
    },
    tipsContainer: {
        backgroundColor: '#1c1c1e',
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
    },
    tipsTitle: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tipText: {
        color: '#ccc',
        marginBottom: 5,
        lineHeight: 20,
    },
    saveButton: {
        backgroundColor: '#333',
        padding: 18,
        borderRadius: 30,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
