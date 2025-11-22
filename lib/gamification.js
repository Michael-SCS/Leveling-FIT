import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

// Reglas de XP
export const XP_RULES = {
  HABIT_COMPLETE: 10,
  WORKOUT_COMPLETE: 50,
  DAILY_STREAK: 25,
  ACHIEVEMENT_UNLOCK: 100,
};

const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    level: 1,
    total_xp: 0,
    current_xp: 0,
    xp_to_next_level: 100,
    streak: 0,
  });
  const [xpToast, setXpToast] = useState({ visible: false, amount: 0 });
  const [levelUpModal, setLevelUpModal] = useState({ visible: false, newLevel: 1 });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setUserData({
          level: data.level || 1,
          total_xp: data.total_xp || 0,
          current_xp: data.current_xp || 0,
          xp_to_next_level: data.xp_to_next_level || 100,
          streak: data.streak || 0,
        });
      }
    } catch (error) {
      console.error('Error loading gamification data:', error);
    }
  };

  const addXP = async (amount, reason = 'activity') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mostrar toast de XP
      setXpToast({ visible: true, amount });
      setTimeout(() => setXpToast({ visible: false, amount: 0 }), 2000);

      // Calcular nuevo XP
      let newCurrentXP = userData.current_xp + amount;
      let newTotalXP = userData.total_xp + amount;
      let newLevel = userData.level;
      let newXPToNextLevel = userData.xp_to_next_level;

      // Verificar si sube de nivel
      if (newCurrentXP >= userData.xp_to_next_level) {
        newLevel += 1;
        newCurrentXP = newCurrentXP - userData.xp_to_next_level;
        newXPToNextLevel = Math.floor(userData.xp_to_next_level * 1.5);

        // Mostrar modal de level up
        setLevelUpModal({ visible: true, newLevel });
        setTimeout(() => setLevelUpModal({ visible: false, newLevel: 1 }), 3000);
      }

      // Actualizar estado local
      setUserData({
        level: newLevel,
        total_xp: newTotalXP,
        current_xp: newCurrentXP,
        xp_to_next_level: newXPToNextLevel,
        streak: userData.streak,
      });

      // Actualizar en Supabase
      await supabase
        .from('user_gamification')
        .update({
          level: newLevel,
          total_xp: newTotalXP,
          current_xp: newCurrentXP,
          xp_to_next_level: newXPToNextLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      // Registrar en historial
      await supabase.from('xp_history').insert({
        user_id: user.id,
        amount: amount,
        reason: reason,
      });

      // Verificar logros
      checkAchievements(user.id, newTotalXP);
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  };

  const checkAchievements = async (userId, totalXP) => {
    try {
      // Aquí puedes implementar lógica para desbloquear logros
      // basado en el XP total, workouts completados, etc.
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  return (
    <GamificationContext.Provider
      value={{
        userData,
        addXP,
        xpToast,
        levelUpModal,
        refreshUserData: loadUserData,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};