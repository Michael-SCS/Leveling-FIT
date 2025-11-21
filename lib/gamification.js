import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase';

// --- Constants ---
const XP_RULES = {
    WORKOUT_COMPLETE: 50,
    HABIT_COMPLETE: 10,
    DAILY_LOGIN: 5,
};

const LEVELS = [
    { level: 1, name: 'Novice', threshold: 0 },
    { level: 2, name: 'Apprentice', threshold: 100 },
    { level: 3, name: 'Habit Builder', threshold: 300 },
    { level: 4, name: 'Consistent', threshold: 600 },
    { level: 5, name: 'Achiever', threshold: 1000 },
    { level: 6, name: 'Wellness Warrior', threshold: 1500 },
    { level: 7, name: 'Master', threshold: 2200 },
    { level: 8, name: 'Grandmaster', threshold: 3000 },
    { level: 9, name: 'Legend', threshold: 4000 },
    { level: 10, name: 'Zenith', threshold: 5500 },
];

// --- Logic ---

export const getLevelData = (xp) => {
    let currentLevel = LEVELS[0];
    let nextLevel = LEVELS[1];

    for (let i = 0; i < LEVELS.length; i++) {
        if (xp >= LEVELS[i].threshold) {
            currentLevel = LEVELS[i];
            nextLevel = LEVELS[i + 1] || { ...LEVELS[i], threshold: xp * 1.5 }; // Fallback for max level
        } else {
            break;
        }
    }

    const xpInLevel = xp - currentLevel.threshold;
    const xpRequired = nextLevel.threshold - currentLevel.threshold;
    const progress = Math.min(Math.max(xpInLevel / xpRequired, 0), 1);

    return {
        level: currentLevel.level,
        title: currentLevel.name,
        currentXP: xp,
        nextLevelXP: nextLevel.threshold,
        progress,
        xpInLevel,
        xpRequired,
    };
};

// --- Context ---
const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
    const [xp, setXp] = useState(0);
    const [levelData, setLevelData] = useState(getLevelData(0));
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [earnedXP, setEarnedXP] = useState(0); // For toast

    useEffect(() => {
        loadGamificationData();
    }, []);

    const loadGamificationData = async () => {
        try {
            // Try local first
            const localXP = await AsyncStorage.getItem('userXP');
            if (localXP) {
                const parsedXP = parseInt(localXP);
                setXp(parsedXP);
                setLevelData(getLevelData(parsedXP));
            }

            // Sync with Supabase
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('xp')
                    .eq('id', user.id)
                    .single();

                if (data && data.xp > (parseInt(localXP) || 0)) {
                    setXp(data.xp);
                    setLevelData(getLevelData(data.xp));
                    await AsyncStorage.setItem('userXP', data.xp.toString());
                }
            }
        } catch (e) {
            console.error('Failed to load gamification data', e);
        }
    };

    const addXP = async (amount) => {
        const newXP = xp + amount;
        const oldLevel = getLevelData(xp).level;
        const newLevelData = getLevelData(newXP);

        setXp(newXP);
        setLevelData(newLevelData);
        setEarnedXP(amount); // Trigger toast

        // Save Local
        await AsyncStorage.setItem('userXP', newXP.toString());

        // Check Level Up
        if (newLevelData.level > oldLevel) {
            setShowLevelUp(true);
        }

        // Save Cloud
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('profiles')
                    .update({ xp: newXP, level: newLevelData.level })
                    .eq('id', user.id);
            }
        } catch (e) {
            console.error('Failed to sync XP', e);
        }

        // Reset toast after delay
        setTimeout(() => setEarnedXP(0), 2000);
    };

    return (
        <GamificationContext.Provider value={{
            xp,
            levelData,
            addXP,
            showLevelUp,
            setShowLevelUp,
            earnedXP
        }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => useContext(GamificationContext);
export { XP_RULES };
