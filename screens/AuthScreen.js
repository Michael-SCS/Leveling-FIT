import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';

export default function AuthScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true); // Default to Login

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                // Login Logic
                const { error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) {
                    Alert.alert('Login Failed', error.message);
                } else {
                    // Navigate to Home on successful login
                    navigation.replace('Home');
                }
            } else {
                // Register Logic
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });

                if (error) {
                    Alert.alert('Registration Failed', error.message);
                } else {
                    if (data.session) {
                        // Navigate to Onboarding on successful registration
                        navigation.replace('Onboarding');
                    } else {
                        Alert.alert('Check your email', 'Please check your email for the confirmation link.');
                    }
                }
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#000000', '#1a1a1a']}
                style={styles.background}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
                    <Text style={styles.subtitle}>
                        {isLogin ? 'Sign in to continue your journey.' : 'Start your fitness journey today.'}
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="hello@example.com"
                            placeholderTextColor="#666"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            placeholderTextColor="#666"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
                        <LinearGradient
                            colors={['#FF4500', '#FF8C00']}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => setIsLogin(!isLogin)}
                    >
                        <Text style={styles.toggleText}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <Text style={styles.toggleTextBold}>
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        flex: 1,
        justifyContent: 'center',
        padding: 30,
    },
    headerContainer: {
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        marginBottom: 5,
    },
    label: {
        color: '#aaa',
        marginBottom: 8,
        fontSize: 14,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#1c1c1e',
        color: '#fff',
        padding: 15,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    button: {
        borderRadius: 30,
        overflow: 'hidden',
        marginTop: 10,
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
    toggleButton: {
        alignItems: 'center',
        padding: 10,
    },
    toggleText: {
        color: '#888',
        fontSize: 14,
    },
    toggleTextBold: {
        color: '#FF4500',
        fontWeight: 'bold',
    },
});
