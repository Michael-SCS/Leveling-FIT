import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function BottomMenu({ navigation, activeScreen }) {
    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                {/* Home Button */}
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={[styles.icon, activeScreen === 'Home' && styles.activeIcon]}>🏠</Text>
                    <Text style={[styles.label, activeScreen === 'Home' && styles.activeLabel]}>Home</Text>
                </TouchableOpacity>

                {/* Spacer for Center Button */}
                <View style={{ width: 60 }} />

                {/* Profile Button */}
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Text style={[styles.icon, activeScreen === 'Profile' && styles.activeIcon]}>👤</Text>
                    <Text style={[styles.label, activeScreen === 'Profile' && styles.activeLabel]}>Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Protruding Workout Button */}
            <TouchableOpacity
                style={styles.centerButtonContainer}
                onPress={() => navigation.navigate('WorkoutPlan')}
            >
                <LinearGradient
                    colors={['#FF4500', '#FF8C00']}
                    style={styles.centerButton}
                >
                    <Text style={styles.centerIcon}>💪</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        justifyContent: 'flex-end',
    },
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1c1c1e',
        height: 60,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingBottom: 10,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    icon: {
        fontSize: 24,
        color: '#666',
        marginBottom: 2,
    },
    activeIcon: {
        color: '#FF4500',
    },
    label: {
        fontSize: 10,
        color: '#666',
    },
    activeLabel: {
        color: '#FF4500',
        fontWeight: 'bold',
    },
    centerButtonContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        shadowColor: '#FF4500',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
    },
    centerButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#000',
    },
    centerIcon: {
        fontSize: 30,
    },
});
