import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const translations = {
    en: {
        // Auth
        welcomeBack: "Welcome Back",
        createAccount: "Create Account",
        signInContinue: "Sign in to continue your journey.",
        startJourney: "Start your fitness journey today.",
        email: "Email",
        password: "Password",
        logIn: "Log In",
        signUp: "Sign Up",
        alreadyHaveAccount: "Already have an account? ",
        dontHaveAccount: "Don't have an account? ",

        // Onboarding
        selectLanguage: "Select Language",
        chooseLanguage: "Choose your preferred language.",
        welcomeWarrior: "Welcome, Warrior",
        letsStartName: "Let's start with your name.",
        enterName: "Enter your name",
        basicInfo: "Basic Info",
        tellUsAbout: "Tell us about yourself.",
        gender: "Gender",
        age: "Age",
        years: "Years",
        bodyStats: "Body Stats",
        calculateMetrics: "To calculate your metrics.",
        height: "Height (cm)",
        weight: "Weight (kg)",
        activityLevel: "Activity Level",
        howActive: "How active are you currently?",
        yourMission: "Your Mission",
        chooseObjective: "Choose your primary objective.",
        next: "Next",
        back: "Back",
        startJourneyBtn: "Start Journey",

        // Home
        dailyFocus: "Daily Focus",
        actionCenter: "Action Center",
        forYou: "For You",
        habitTracker: "Habit Tracker",
        hydration: "Hydration",
        sleep: "Sleep",
        mood: "Mood",
        workout: "Workout",
        timer: "Timer",
        dietPlan: "Diet Plan",
        relax: "Relax",
        journal: "Journal",
        dailyWisdom: "Daily Wisdom",
        manage: "Manage",
        glasses: "Glasses",
        lastNight: "Last Night",
        feelingGood: "Feeling Good",
        startTraining: "Start Training",
        focusMode: "Focus Mode",
        healthyEats: "Healthy Eats",
        meditation: "Meditation",
        dailyNotes: "Daily Notes",

        // Profile
        memberSince: "Member since",
        currentStreak: "Current Streak",
        workouts: "Workouts",
        achievements: "Achievements",
        viewAll: "View All",
        settings: "Settings",
        editProfile: "Edit Profile",
        notifications: "Notifications",
        privacySecurity: "Privacy & Security",
        helpSupport: "Help & Support",
        logOut: "Log Out",

        // Workout
        moveYourBody: "Move Your Body",
        searchWorkouts: "Search workouts...",
        recommendedForYou: "Recommended for You",
        allWorkouts: "All Workouts",
        start: "Start",
        completeWorkout: "Complete Workout",
        todaysWorkout: "Today's Workout",
        focus: "Focus",

        // Diet
        premiumDietPlan: "Premium Diet Plan",
        fuelYourBody: "Fuel your body for",
        unlockPremium: "Unlock Premium",
        premiumUnlocked: "PREMIUM UNLOCKED",
        planActive: "PLAN ACTIVE",
        thisFeaturePremium: "This feature is for Premium Members only.",
        getPersonalized: "Get personalized meal plans to reach your goal faster.",

        // Premium
        goPremium: "Go Premium",
        unlockPotential: "Unlock your full potential",
        proAccess: "PRO ACCESS",
        fullAccess: "FULL ACCESS",
        startTrial: "Start 7-Day Free Trial",
        customDietPlans: "Custom Diet Plans",
        advancedAnalytics: "Advanced Analytics",
        adFree: "Ad-Free Experience",
        prioritySupport: "Priority Support",

        // Common
        loading: "Loading...",
        error: "Error",
        success: "Success",
    },
    es: {
        // Auth
        welcomeBack: "Bienvenido de nuevo",
        createAccount: "Crear Cuenta",
        signInContinue: "Inicia sesión para continuar.",
        startJourney: "Comienza tu viaje fitness hoy.",
        email: "Correo",
        password: "Contraseña",
        logIn: "Entrar",
        signUp: "Registrarse",
        alreadyHaveAccount: "¿Ya tienes cuenta? ",
        dontHaveAccount: "¿No tienes cuenta? ",

        // Onboarding
        selectLanguage: "Selecciona Idioma",
        chooseLanguage: "Elige tu idioma preferido.",
        welcomeWarrior: "Bienvenido, Guerrero",
        letsStartName: "Empecemos con tu nombre.",
        enterName: "Ingresa tu nombre",
        basicInfo: "Info Básica",
        tellUsAbout: "Cuéntanos sobre ti.",
        gender: "Género",
        age: "Edad",
        years: "Años",
        bodyStats: "Estadísticas",
        calculateMetrics: "Para calcular tus métricas.",
        height: "Altura (cm)",
        weight: "Peso (kg)",
        activityLevel: "Nivel de Actividad",
        howActive: "¿Qué tan activo eres?",
        yourMission: "Tu Misión",
        chooseObjective: "Elige tu objetivo principal.",
        next: "Siguiente",
        back: "Atrás",
        startJourneyBtn: "Comenzar Viaje",

        // Home
        dailyFocus: "Enfoque Diario",
        actionCenter: "Centro de Acción",
        forYou: "Para Ti",
        habitTracker: "Hábitos",
        hydration: "Hidratación",
        sleep: "Sueño",
        mood: "Ánimo",
        workout: "Entrenar",
        timer: "Timer",
        dietPlan: "Dieta",
        relax: "Relax",
        journal: "Diario",
        dailyWisdom: "Sabiduría Diaria",
        manage: "Gestionar",
        glasses: "Vasos",
        lastNight: "Anoche",
        feelingGood: "Sintiéndose Bien",
        startTraining: "Empezar",
        focusMode: "Modo Enfoque",
        healthyEats: "Comida Sana",
        meditation: "Meditación",
        dailyNotes: "Notas Diarias",

        // Profile
        memberSince: "Miembro desde",
        currentStreak: "Racha Actual",
        workouts: "Entrenamientos",
        achievements: "Logros",
        viewAll: "Ver Todo",
        settings: "Ajustes",
        editProfile: "Editar Perfil",
        notifications: "Notificaciones",
        privacySecurity: "Privacidad y Seguridad",
        helpSupport: "Ayuda y Soporte",
        logOut: "Cerrar Sesión",

        // Workout
        moveYourBody: "Mueve tu Cuerpo",
        searchWorkouts: "Buscar rutinas...",
        recommendedForYou: "Recomendado para ti",
        allWorkouts: "Todos los Entrenamientos",
        start: "Iniciar",
        completeWorkout: "Terminar Rutina",
        todaysWorkout: "Rutina de Hoy",
        focus: "Enfoque",

        // Diet
        premiumDietPlan: "Plan de Dieta Premium",
        fuelYourBody: "Alimenta tu cuerpo para",
        unlockPremium: "Desbloquear Premium",
        premiumUnlocked: "PREMIUM DESBLOQUEADO",
        planActive: "PLAN ACTIVO",
        thisFeaturePremium: "Esta función es solo para Miembros Premium.",
        getPersonalized: "Obtén planes de comida personalizados para alcanzar tu meta.",

        // Premium
        goPremium: "Hazte Premium",
        unlockPotential: "Desbloquea tu potencial",
        proAccess: "ACCESO PRO",
        fullAccess: "ACCESO TOTAL",
        startTrial: "Prueba Gratis 7 Días",
        customDietPlans: "Planes de Dieta",
        advancedAnalytics: "Analíticas Avanzadas",
        adFree: "Sin Anuncios",
        prioritySupport: "Soporte Prioritario",

        // Common
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
    }
};

let currentLanguage = 'en';
let listeners = [];

export const setLanguage = async (lang) => {
    currentLanguage = lang;
    try {
        await AsyncStorage.setItem('userLanguage', lang);
        listeners.forEach(listener => listener(lang));
    } catch (e) {
        console.error('Failed to save language', e);
    }
};

export const getLanguage = async () => {
    try {
        const lang = await AsyncStorage.getItem('userLanguage');
        if (lang) {
            currentLanguage = lang;
        }
        return currentLanguage;
    } catch (e) {
        return 'en';
    }
};

export const t = (key) => {
    return translations[currentLanguage][key] || key;
};

export const useLanguage = () => {
    const [lang, setLang] = useState(currentLanguage);

    useEffect(() => {
        const listener = (newLang) => setLang(newLang);
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    return lang;
};
