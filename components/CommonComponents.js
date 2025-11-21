import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// --- Back Button ---
export const BackButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
    </TouchableOpacity>
);

// --- Pro Badge ---
export const ProBadge = ({ size = 'normal' }) => (
    <LinearGradient
        colors={['#FFD700', '#FFA500']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.proBadge, size === 'small' && styles.proBadgeSmall]}
    >
        <Text style={[styles.proText, size === 'small' && styles.proTextSmall]}>PRO</Text>
    </LinearGradient>
);

// --- Premium Header ---
export const PremiumHeader = ({ title, subtitle, onBack }) => (
    <View style={styles.headerContainer}>
        <View style={styles.topRow}>
            <BackButton onPress={onBack} />
            <ProBadge size="small" />
        </View>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
    </View>
);

const styles = StyleSheet.create({
    // Back Button
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#1c1c1e',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: -2,
    },

    // Pro Badge
    proBadge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    proBadgeSmall: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    proText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 1,
    },
    proTextSmall: {
        fontSize: 10,
    },

    // Premium Header
    headerContainer: {
        marginBottom: 30,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#aaa',
    },
});
