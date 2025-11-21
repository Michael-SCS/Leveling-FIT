// lib/ai_logic.js

export const generatePlan = async (goal, level = 'Intermediate') => {
    // Simulate AI "thinking" delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    const plans = {
        'Lose Weight': {
            workout: {
                title: 'Fat Burner HIIT',
                duration: '35 min',
                intensity: 'High',
                exercises: [
                    { name: 'Jumping Jacks', sets: '3', reps: '45s' },
                    { name: 'Mountain Climbers', sets: '3', reps: '30s' },
                    { name: 'Burpees', sets: '3', reps: '15' },
                    { name: 'High Knees', sets: '3', reps: '45s' },
                ]
            },
            diet: {
                calories: 1800,
                macros: { protein: '140g', carbs: '150g', fats: '60g' },
                meals: [
                    { name: 'Breakfast', desc: 'Oatmeal with berries & protein scoop' },
                    { name: 'Lunch', desc: 'Grilled chicken salad with avocado' },
                    { name: 'Dinner', desc: 'Baked salmon with asparagus' },
                ]
            },
            tips: [
                'Drink 500ml water before each meal.',
                'Aim for 8 hours of sleep to recover.',
                'Walk 10k steps daily.'
            ]
        },
        'Build Muscle': {
            workout: {
                title: 'Hypertrophy Push',
                duration: '50 min',
                intensity: 'High',
                exercises: [
                    { name: 'Bench Press', sets: '4', reps: '8-10' },
                    { name: 'Overhead Press', sets: '3', reps: '10-12' },
                    { name: 'Incline Dumbbell Press', sets: '3', reps: '12' },
                    { name: 'Tricep Dips', sets: '3', reps: '15' },
                ]
            },
            diet: {
                calories: 2800,
                macros: { protein: '200g', carbs: '300g', fats: '80g' },
                meals: [
                    { name: 'Breakfast', desc: '4 Eggs, Toast & Avocado' },
                    { name: 'Lunch', desc: 'Steak, Rice & Broccoli' },
                    { name: 'Dinner', desc: 'Chicken Pasta with Pesto' },
                ]
            },
            tips: [
                'Focus on progressive overload.',
                'Eat protein every 3-4 hours.',
                'Creatine supplementation recommended.'
            ]
        },
        'Improve Endurance': {
            workout: {
                title: 'Steady State Cardio',
                duration: '45 min',
                intensity: 'Moderate',
                exercises: [
                    { name: 'Jogging', sets: '1', reps: '20 min' },
                    { name: 'Jump Rope', sets: '3', reps: '3 min' },
                    { name: 'Cycling', sets: '1', reps: '15 min' },
                ]
            },
            diet: {
                calories: 2400,
                macros: { protein: '120g', carbs: '300g', fats: '70g' },
                meals: [
                    { name: 'Breakfast', desc: 'Banana & Peanut Butter Toast' },
                    { name: 'Lunch', desc: 'Turkey Sandwich on Whole Wheat' },
                    { name: 'Dinner', desc: 'Quinoa Bowl with Chickpeas' },
                ]
            },
            tips: [
                'Stay hydrated during workouts.',
                'Incorporate carb-loading before long runs.',
                'Stretch dynamic before, static after.'
            ]
        },
        'General Wellness': {
            workout: {
                title: 'Full Body Flow',
                duration: '30 min',
                intensity: 'Low',
                exercises: [
                    { name: 'Sun Salutations', sets: '3', reps: '5' },
                    { name: 'Bodyweight Squats', sets: '3', reps: '15' },
                    { name: 'Plank', sets: '3', reps: '45s' },
                    { name: 'Child Pose', sets: '1', reps: '2 min' },
                ]
            },
            diet: {
                calories: 2000,
                macros: { protein: '100g', carbs: '200g', fats: '65g' },
                meals: [
                    { name: 'Breakfast', desc: 'Greek Yogurt with Honey' },
                    { name: 'Lunch', desc: 'Lentil Soup & Side Salad' },
                    { name: 'Dinner', desc: 'Stir-fry Tofu & Veggies' },
                ]
            },
            tips: [
                'Practice mindfulness daily.',
                'Take breaks from screens.',
                'Eat a rainbow of vegetables.'
            ]
        }
    };

    // Default fallback
    return plans[goal] || plans['General Wellness'];
};
