import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// Importa los iconos que quieras usar
import { Ionicons, MaterialIcons, Feather, AntDesign } from '@expo/vector-icons';

export default function BottomMenu({ navigation, activeScreen }) {
    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                {/* Home Button */}
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Ionicons 
                        name="home-outline" 
                        size={24} 
                        color={activeScreen === 'Home' ? '#4CAF50' : '#666'} 
                    />
                    <Text style={[styles.label, activeScreen === 'Home' && styles.activeLabel]}>
                        Home
                    </Text>
                </TouchableOpacity>

                {/* Spacer for Center Button */}
                <View style={{ width: 60 }} />

                {/* Profile Button */}
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Ionicons 
                        name="person-outline" 
                        size={24} 
                        color={activeScreen === 'Profile' ? '#4CAF50' : '#666'} 
                    />
                    <Text style={[styles.label, activeScreen === 'Profile' && styles.activeLabel]}>
                        Profile
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Protruding Workout Button */}
            <TouchableOpacity
                style={styles.centerButtonContainer}
                onPress={() => navigation.navigate('WorkoutPlan')}
            >
                <LinearGradient
                    colors={['#4CAF50', '#45a049']}
                    style={styles.centerButton}
                >
                    <MaterialIcons name="fitness-center" size={32} color="#fff" />
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
    label: {
        fontSize: 10,
        color: '#666',
        fontWeight: '400',
        marginTop: 4,
    },
    activeLabel: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    centerButtonContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        shadowColor: '#4CAF50',
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
});