import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGamification } from '../lib/gamification';

// Toast de XP ganado
export const XPToast = () => {
  const { xpToast } = useGamification();

  if (!xpToast.visible) return null;

  return (
    <View style={styles.toastContainer}>
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        style={styles.toast}
      >
        <Text style={styles.toastText}>+{xpToast.amount} XP</Text>
      </LinearGradient>
    </View>
  );
};

// Modal de subida de nivel
export const LevelUpModal = () => {
  const { levelUpModal } = useGamification();

  return (
    <Modal
      visible={levelUpModal.visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#FF4500', '#FF6347']}
            style={styles.modalGradient}
          >
            <Text style={styles.levelUpEmoji}>🎉</Text>
            <Text style={styles.levelUpTitle}>¡Nivel Superior!</Text>
            <Text style={styles.levelUpText}>
              Has alcanzado el nivel {levelUpModal.newLevel}
            </Text>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Toast styles
  toastContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  toastText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 40,
    alignItems: 'center',
  },
  levelUpEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  levelUpTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  levelUpText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});