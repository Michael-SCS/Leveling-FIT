import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// ------------------------------
// COMPONENTES REUTILIZABLES
// ------------------------------

const SelectableOption = ({ label, icon, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.option, selected && styles.optionSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {icon && <Text style={styles.optionIcon}>{icon}</Text>}
    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
      {label}
    </Text>
    {selected && (
      <View style={styles.checkmark}>
        <Text style={styles.checkmarkText}>✓</Text>
      </View>
    )}
  </TouchableOpacity>
);

const MultiSelectOption = ({ label, icon, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.multiOption, selected && styles.multiOptionSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {icon && <Text style={styles.optionIcon}>{icon}</Text>}
    <Text style={[styles.multiOptionText, selected && styles.multiOptionTextSelected]}>
      {label}
    </Text>
    {selected && (
      <View style={styles.checkmarkSmall}>
        <Text style={styles.checkmarkText}>✓</Text>
      </View>
    )}
  </TouchableOpacity>
);

// ------------------------------
// LAYOUT BASE
// ------------------------------

const OnboardingLayout = ({ children, progress, onBack, onNext, canContinue = true }) => (
  <View style={styles.container}>
    <StatusBar style="light" />
    <LinearGradient colors={['#000000', '#0a0a0a']} style={styles.background} />

    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${progress}%` }]} />
    </View>

    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>

    <View style={styles.navigation}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.nextButton, !canContinue && styles.nextButtonDisabled]}
        onPress={onNext}
        disabled={!canContinue}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={canContinue ? ['#FF4500', '#FF6347'] : ['#333', '#333']}
          style={styles.nextButtonGradient}
        >
          <Text style={styles.nextButtonText}>Continuar →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
);

// ------------------------------
// PANTALLAS
// ------------------------------

const OnboardingGender = ({ navigation, route }) => {
  const [gender, setGender] = useState(route.params?.data?.gender || null);

  return (
    <OnboardingLayout
      progress={8}
      onNext={() => navigation.navigate('OnboardingGoal', {
        data: { ...route.params?.data, gender },
      })}
      canContinue={!!gender}
    >
      <Text style={styles.title}>¿Cuál es tu género?</Text>
      <Text style={styles.subtitle}>Esto nos ayuda a personalizar tu experiencia</Text>

      <View style={styles.optionsContainer}>
        <SelectableOption label="Hombre" icon="👨" selected={gender === 'male'} onPress={() => setGender('male')} />
        <SelectableOption label="Mujer" icon="👩" selected={gender === 'female'} onPress={() => setGender('female')} />
        <SelectableOption label="No binario" icon="🧑" selected={gender === 'non_binary'} onPress={() => setGender('non_binary')} />
        <SelectableOption label="Prefiero no decirlo" icon="🤐" selected={gender === 'prefer_not_to_say'} onPress={() => setGender('prefer_not_to_say')} />
      </View>
    </OnboardingLayout>
  );
};

const OnboardingGoal = ({ navigation, route }) => {
  const [goal, setGoal] = useState(route.params?.data?.fitness_goal || null);

  return (
    <OnboardingLayout
      progress={16}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('OnboardingHeardFrom', {
        data: { ...route.params?.data, fitness_goal: goal },
      })}
      canContinue={!!goal}
    >
      <Text style={styles.title}>¿Cuál es tu meta principal?</Text>
      <Text style={styles.subtitle}>Selecciona tu objetivo de fitness</Text>

      <View style={styles.optionsContainer}>
        <SelectableOption label="Construir Músculo" icon="💪" selected={goal === 'build_muscle'} onPress={() => setGoal('build_muscle')} />
        <SelectableOption label="Perder Peso" icon="🔥" selected={goal === 'lose_weight'} onPress={() => setGoal('lose_weight')} />
        <SelectableOption label="Mantener Peso" icon="⚖️" selected={goal === 'maintain_weight'} onPress={() => setGoal('maintain_weight')} />
        <SelectableOption label="Aumentar Resistencia" icon="🏃" selected={goal === 'improve_endurance'} onPress={() => setGoal('improve_endurance')} />
        <SelectableOption label="Bienestar General" icon="🧘" selected={goal === 'general_wellness'} onPress={() => setGoal('general_wellness')} />
      </View>
    </OnboardingLayout>
  );
};

const OnboardingHeardFrom = ({ navigation, route }) => {
  const [source, setSource] = useState(route.params?.data?.heard_from || null);

  return (
    <OnboardingLayout
      progress={24}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('OnboardingMotivation', { 
        data: { ...route.params?.data, heard_from: source } 
      })}
      canContinue={!!source}
    >
      <Text style={styles.title}>¿Dónde escuchaste de nosotros?</Text>
      <Text style={styles.subtitle}>Nos ayuda a mejorar</Text>

      <View style={styles.optionsContainer}>
        <SelectableOption label="Instagram" icon="📸" selected={source === 'instagram'} onPress={() => setSource('instagram')} />
        <SelectableOption label="Facebook" icon="👥" selected={source === 'facebook'} onPress={() => setSource('facebook')} />
        <SelectableOption label="TikTok" icon="🎵" selected={source === 'tiktok'} onPress={() => setSource('tiktok')} />
        <SelectableOption label="YouTube" icon="📺" selected={source === 'youtube'} onPress={() => setSource('youtube')} />
        <SelectableOption label="Google / Búsqueda" icon="🔍" selected={source === 'google'} onPress={() => setSource('google')} />
        <SelectableOption label="Recomendación de un amigo" icon="🤝" selected={source === 'friend'} onPress={() => setSource('friend')} />
        <SelectableOption label="Otro" icon="💡" selected={source === 'other'} onPress={() => setSource('other')} />
      </View>
    </OnboardingLayout>
  );
};

const OnboardingMotivation = ({ navigation, route }) => {
  const [motivation, setMotivation] = useState(route.params?.data?.motivation || null);

  return (
    <OnboardingLayout
      progress={32}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('OnboardingBodyParts', { 
        data: { ...route.params?.data, motivation } 
      })}
      canContinue={!!motivation}
    >
      <Text style={styles.title}>¿Qué te motiva a entrenar?</Text>
      <Text style={styles.subtitle}>Comparte tu motivación principal</Text>

      <View style={styles.optionsContainer}>
        <SelectableOption label="Mejorar mi salud" icon="❤️" selected={motivation === 'health'} onPress={() => setMotivation('health')} />
        <SelectableOption label="Sentirme más fuerte" icon="💪" selected={motivation === 'strength'} onPress={() => setMotivation('strength')} />
        <SelectableOption label="Verme mejor" icon="😍" selected={motivation === 'appearance'} onPress={() => setMotivation('appearance')} />
        <SelectableOption label="Reducir estrés" icon="🧘" selected={motivation === 'stress'} onPress={() => setMotivation('stress')} />
        <SelectableOption label="Competir/Deportes" icon="🏆" selected={motivation === 'competition'} onPress={() => setMotivation('competition')} />
        <SelectableOption label="Socializar" icon="👥" selected={motivation === 'social'} onPress={() => setMotivation('social')} />
      </View>
    </OnboardingLayout>
  );
};

const OnboardingBodyParts = ({ navigation, route }) => {
  const [bodyParts, setBodyParts] = useState(route.params?.data?.target_body_parts || []);

  const toggleBodyPart = (part) => {
    if (bodyParts.includes(part)) {
      setBodyParts(bodyParts.filter(p => p !== part));
    } else {
      setBodyParts([...bodyParts, part]);
    }
  };

  return (
    <OnboardingLayout
      progress={40}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('OnboardingLevel', { 
        data: { ...route.params?.data, target_body_parts: bodyParts } 
      })}
      canContinue={bodyParts.length > 0}
    >
      <Text style={styles.title}>¿Qué partes quieres trabajar?</Text>
      <Text style={styles.subtitle}>Selecciona todas las que apliquen</Text>

      <View style={styles.multiOptionsContainer}>
        <MultiSelectOption label="Cuerpo Completo" icon="🧍" selected={bodyParts.includes('full_body')} onPress={() => toggleBodyPart('full_body')} />
        <MultiSelectOption label="Pecho" icon="💪" selected={bodyParts.includes('chest')} onPress={() => toggleBodyPart('chest')} />
        <MultiSelectOption label="Espalda" icon="🦾" selected={bodyParts.includes('back')} onPress={() => toggleBodyPart('back')} />
        <MultiSelectOption label="Brazos" icon="💪" selected={bodyParts.includes('arms')} onPress={() => toggleBodyPart('arms')} />
        <MultiSelectOption label="Hombros" icon="🤸" selected={bodyParts.includes('shoulders')} onPress={() => toggleBodyPart('shoulders')} />
        <MultiSelectOption label="Abdominales" icon="🔥" selected={bodyParts.includes('abs')} onPress={() => toggleBodyPart('abs')} />
        <MultiSelectOption label="Piernas" icon="🦵" selected={bodyParts.includes('legs')} onPress={() => toggleBodyPart('legs')} />
        <MultiSelectOption label="Glúteos" icon="🍑" selected={bodyParts.includes('glutes')} onPress={() => toggleBodyPart('glutes')} />
      </View>
    </OnboardingLayout>
  );
};

const OnboardingLevel = ({ navigation, route }) => {
  const [level, setLevel] = useState(route.params?.data?.fitness_level || null);

  return (
    <OnboardingLayout
      progress={48}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('OnboardingAge', { 
        data: { ...route.params?.data, fitness_level: level } 
      })}
      canContinue={!!level}
    >
      <Text style={styles.title}>¿Cuál es tu nivel actual?</Text>
      <Text style={styles.subtitle}>Sé honesto para mejores resultados</Text>

      <View style={styles.optionsContainer}>
        <SelectableOption label="Principiante" icon="🌱" selected={level === 'beginner'} onPress={() => setLevel('beginner')} />
        <View style={styles.levelDescription}>
          <Text style={styles.levelDescText}>Poco o ningún ejercicio regular</Text>
        </View>

        <SelectableOption label="Intermedio" icon="🔥" selected={level === 'intermediate'} onPress={() => setLevel('intermediate')} />
        <View style={styles.levelDescription}>
          <Text style={styles.levelDescText}>Hago ejercicio 2-4 veces por semana</Text>
        </View>

        <SelectableOption label="Avanzado" icon="⚡" selected={level === 'advanced'} onPress={() => setLevel('advanced')} />
        <View style={styles.levelDescription}>
          <Text style={styles.levelDescText}>Entreno regularmente, 5+ veces por semana</Text>
        </View>
      </View>
    </OnboardingLayout>
  );
};

const OnboardingAge = ({ navigation, route }) => {
  const [age, setAge] = useState(route.params?.data?.age?.toString() || '');

  return (
    <OnboardingLayout
      progress={56}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('OnboardingHeight', { 
        data: { ...route.params?.data, age: parseInt(age) } 
      })}
      canContinue={age && parseInt(age) >= 13 && parseInt(age) <= 100}
    >
      <Text style={styles.title}>¿Cuántos años tienes?</Text>
      <Text style={styles.subtitle}>Necesitamos tu edad para personalizar</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: 25"
          placeholderTextColor="#666"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          maxLength={3}
        />
        <Text style={styles.inputLabel}>años</Text>
      </View>
    </OnboardingLayout>
  );
};

const OnboardingHeight = ({ navigation, route }) => {
  const [height, setHeight] = useState(route.params?.data?.height_cm?.toString() || '');

  return (
    <OnboardingLayout
      progress={64}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('OnboardingWeight', { 
        data: { ...route.params?.data, height_cm: parseFloat(height) } 
      })}
      canContinue={height && parseFloat(height) >= 100 && parseFloat(height) <= 250}
    >
      <Text style={styles.title}>¿Cuál es tu altura?</Text>
      <Text style={styles.subtitle}>En centímetros</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: 175"
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
          value={height}
          onChangeText={setHeight}
          maxLength={5}
        />
        <Text style={styles.inputLabel}>cm</Text>
      </View>
    </OnboardingLayout>
  );
};

const OnboardingWeight = ({ navigation, route }) => {
  const [weight, setWeight] = useState(route.params?.data?.weight_kg?.toString() || '');

  return (
    <OnboardingLayout
      progress={72}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('OnboardingTargetWeight', { 
        data: { ...route.params?.data, weight_kg: parseFloat(weight) } 
      })}
      canContinue={weight && parseFloat(weight) >= 30 && parseFloat(weight) <= 300}
    >
      <Text style={styles.title}>¿Cuál es tu peso actual?</Text>
      <Text style={styles.subtitle}>En kilogramos</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: 70"
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
          maxLength={5}
        />
        <Text style={styles.inputLabel}>kg</Text>
      </View>
    </OnboardingLayout>
  );
};

const OnboardingTargetWeight = ({ navigation, route }) => {
  const [targetWeight, setTargetWeight] = useState(route.params?.data?.target_weight_kg?.toString() || '');

  return (
    <OnboardingLayout
      progress={76}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('OnboardingHealthConditions', { 
        data: { ...route.params?.data, target_weight_kg: parseFloat(targetWeight) } 
      })}
      canContinue={targetWeight && parseFloat(targetWeight) >= 30 && parseFloat(targetWeight) <= 300}
    >
      <Text style={styles.title}>¿Cuál es tu peso objetivo?</Text>
      <Text style={styles.subtitle}>Tu meta a alcanzar</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: 65"
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
          value={targetWeight}
          onChangeText={setTargetWeight}
          maxLength={5}
        />
        <Text style={styles.inputLabel}>kg</Text>
      </View>

      {route.params?.data?.weight_kg && targetWeight && (
        <View style={styles.weightDifference}>
          <Text style={styles.weightDiffText}>
            {parseFloat(targetWeight) > route.params.data.weight_kg
              ? `+${(parseFloat(targetWeight) - route.params.data.weight_kg).toFixed(1)} kg a ganar`
              : `${(parseFloat(targetWeight) - route.params.data.weight_kg).toFixed(1)} kg a perder`}
          </Text>
        </View>
      )}
    </OnboardingLayout>
  );
};

const OnboardingHealthConditions = ({ navigation, route }) => {
  const [conditions, setConditions] = useState(route.params?.data?.health_conditions || []);

  const toggleCondition = (condition) => {
    if (conditions.includes(condition)) {
      setConditions(conditions.filter(c => c !== condition));
    } else {
      setConditions([...conditions, condition]);
    }
  };

  return (
    <OnboardingLayout
      progress={80}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('OnboardingEquipment', { 
        data: { ...route.params?.data, health_conditions: conditions } 
      })}
      canContinue={true}
    >
      <Text style={styles.title}>¿Tienes alguna condición de salud?</Text>
      <Text style={styles.subtitle}>Selecciona todas las que apliquen (opcional)</Text>

      <View style={styles.multiOptionsContainer}>
        <MultiSelectOption
          label="Ninguna"
          icon="✅"
          selected={conditions.includes('none')}
          onPress={() => {
            if (conditions.includes('none')) {
              setConditions([]);
            } else {
              setConditions(['none']);
            }
          }}
        />
        <MultiSelectOption label="Asma" icon="🫁" selected={conditions.includes('asthma')} onPress={() => toggleCondition('asthma')} />
        <MultiSelectOption label="Problemas cardiacos" icon="❤️" selected={conditions.includes('heart')} onPress={() => toggleCondition('heart')} />
        <MultiSelectOption label="Problemas de rodillas" icon="🦵" selected={conditions.includes('knee')} onPress={() => toggleCondition('knee')} />
        <MultiSelectOption label="Problemas de espalda" icon="🦴" selected={conditions.includes('back')} onPress={() => toggleCondition('back')} />
        <MultiSelectOption label="Diabetes" icon="🩸" selected={conditions.includes('diabetes')} onPress={() => toggleCondition('diabetes')} />
        <MultiSelectOption label="Hipertensión" icon="💉" selected={conditions.includes('hypertension')} onPress={() => toggleCondition('hypertension')} />
      </View>
    </OnboardingLayout>
  );
};

const OnboardingEquipment = ({ navigation, route }) => {
  const [equipment, setEquipment] = useState(route.params?.data?.equipment || []);

  const toggleEquipment = (item) => {
    if (equipment.includes(item)) {
      setEquipment(equipment.filter(e => e !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  return (
    <OnboardingLayout
      progress={84}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('OnboardingFrequency', { 
        data: { ...route.params?.data, equipment } 
      })}
      canContinue={equipment.length > 0}
    >
      <Text style={styles.title}>¿Qué equipamiento tienes?</Text>
      <Text style={styles.subtitle}>Selecciona todo lo disponible</Text>

      <View style={styles.multiOptionsContainer}>
        <MultiSelectOption label="Sin equipo / Peso corporal" icon="🤸" selected={equipment.includes('bodyweight')} onPress={() => toggleEquipment('bodyweight')} />
        <MultiSelectOption label="Mancuernas" icon="🏋️" selected={equipment.includes('dumbbells')} onPress={() => toggleEquipment('dumbbells')} />
        <MultiSelectOption label="Barra y discos" icon="⚖️" selected={equipment.includes('barbell')} onPress={() => toggleEquipment('barbell')} />
        <MultiSelectOption label="Banda elástica" icon="🎗️" selected={equipment.includes('resistance_bands')} onPress={() => toggleEquipment('resistance_bands')} />
        <MultiSelectOption label="Máquinas de gimnasio" icon="🏢" selected={equipment.includes('gym_machines')} onPress={() => toggleEquipment('gym_machines')} />
        <MultiSelectOption label="Kettlebell" icon="🔔" selected={equipment.includes('kettlebell')} onPress={() => toggleEquipment('kettlebell')} />
        <MultiSelectOption label="Banco de ejercicios" icon="🛋️" selected={equipment.includes('bench')} onPress={() => toggleEquipment('bench')} />
      </View>
    </OnboardingLayout>
  );
};

const OnboardingFrequency = ({ navigation, route }) => {
  const [frequency, setFrequency] = useState(route.params?.data?.training_frequency || null);

  return (
    <OnboardingLayout
      progress={88}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('OnboardingDays', { 
        data: { ...route.params?.data, training_frequency: frequency } 
      })}
      canContinue={!!frequency}
    >
      <Text style={styles.title}>¿Con qué frecuencia quieres entrenar?</Text>
      <Text style={styles.subtitle}>Días por semana</Text>

      <View style={styles.optionsContainer}>
        <SelectableOption label="3 días por semana" icon="🔥" selected={frequency === '3_days'} onPress={() => setFrequency('3_days')} />
        <SelectableOption label="4 días por semana" icon="💪" selected={frequency === '4_days'} onPress={() => setFrequency('4_days')} />
        <SelectableOption label="5 días por semana" icon="⚡" selected={frequency === '5_days'} onPress={() => setFrequency('5_days')} />
        <SelectableOption label="6 días por semana" icon="🏆" selected={frequency === '6_days'} onPress={() => setFrequency('6_days')} />
        <SelectableOption label="Todos los días" icon="🚀" selected={frequency === '7_days'} onPress={() => setFrequency('7_days')} />
      </View>
    </OnboardingLayout>
  );
};

const OnboardingDays = ({ navigation, route }) => {
  const [days, setDays] = useState(route.params?.data?.training_days || []);

  const daysOptions = [
    { id: 'monday', label: 'Lunes', icon: '1️⃣' },
    { id: 'tuesday', label: 'Martes', icon: '2️⃣' },
    { id: 'wednesday', label: 'Miércoles', icon: '3️⃣' },
    { id: 'thursday', label: 'Jueves', icon: '4️⃣' },
    { id: 'friday', label: 'Viernes', icon: '5️⃣' },
    { id: 'saturday', label: 'Sábado', icon: '6️⃣' },
    { id: 'sunday', label: 'Domingo', icon: '7️⃣' },
  ];

  const toggleDay = (day) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleNext = () => {
    const finalData = { ...route.params?.data, training_days: days };
    navigation.navigate('OnboardingSummary', { data: finalData });
  };

  return (
    <OnboardingLayout
      progress={92}
      onBack={() => navigation.goBack()}
      onNext={handleNext}
      canContinue={days.length >= 3}
    >
      <Text style={styles.title}>¿Qué días prefieres entrenar?</Text>
      <Text style={styles.subtitle}>Selecciona al menos 3 días</Text>

      <View style={styles.multiOptionsContainer}>
        {daysOptions.map(day => (
          <MultiSelectOption
            key={day.id}
            label={day.label}
            icon={day.icon}
            selected={days.includes(day.id)}
            onPress={() => toggleDay(day.id)}
          />
        ))}
      </View>

      <View style={styles.daysCounter}>
        <Text style={styles.daysCounterText}>
          {days.length} días seleccionados
        </Text>
      </View>
    </OnboardingLayout>
  );
};

// ------------------------------
// NAVEGADOR PRINCIPAL
// ------------------------------

export default function OnboardingFlow() {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName="OnboardingGender"
    >
      <Stack.Screen 
        name="OnboardingGender" 
        component={OnboardingGender}
        initialParams={{ data: {} }}
      />
      <Stack.Screen name="OnboardingGoal" component={OnboardingGoal} />
      <Stack.Screen name="OnboardingHeardFrom" component={OnboardingHeardFrom} />
      <Stack.Screen name="OnboardingMotivation" component={OnboardingMotivation} />
      <Stack.Screen name="OnboardingBodyParts" component={OnboardingBodyParts} />
      <Stack.Screen name="OnboardingLevel" component={OnboardingLevel} />
      <Stack.Screen name="OnboardingAge" component={OnboardingAge} />
      <Stack.Screen name="OnboardingHeight" component={OnboardingHeight} />
      <Stack.Screen name="OnboardingWeight" component={OnboardingWeight} />
      <Stack.Screen name="OnboardingTargetWeight" component={OnboardingTargetWeight} />
      <Stack.Screen name="OnboardingHealthConditions" component={OnboardingHealthConditions} />
      <Stack.Screen name="OnboardingEquipment" component={OnboardingEquipment} />
      <Stack.Screen name="OnboardingFrequency" component={OnboardingFrequency} />
      <Stack.Screen name="OnboardingDays" component={OnboardingDays} />
    </Stack.Navigator>
  );
}

// ------------------------------
// ESTILOS
// ------------------------------

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
  progressBar: {
    height: 4,
    backgroundColor: '#222',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF4500',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#222',
  },
  optionSelected: {
    borderColor: '#FF4500',
    backgroundColor: '#2a1a1a',
  },
  optionIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#ccc',
    flex: 1,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#fff',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  multiOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  multiOption: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#222',
    minWidth: '48%',
    flex: 1,
  },
  multiOptionSelected: {
    borderColor: '#FF4500',
    backgroundColor: '#2a1a1a',
  },
  multiOptionText: {
    fontSize: 14,
    color: '#ccc',
    flex: 1,
    fontWeight: '600',
  },
  multiOptionTextSelected: {
    color: '#fff',
  },
  checkmarkSmall: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  levelDescription: {
    marginBottom: 15,
    marginLeft: 15,
  },
  levelDescText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    minWidth: 150,
    borderWidth: 2,
    borderColor: '#333',
  },
  inputLabel: {
    fontSize: 24,
    color: '#999',
    marginLeft: 15,
    fontWeight: '600',
  },
  weightDifference: {
    marginTop: 20,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  weightDiffText: {
    fontSize: 16,
    color: '#FF4500',
    fontWeight: '600',
  },
  daysCounter: {
    marginTop: 20,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  daysCounterText: {
    fontSize: 16,
    color: '#FF4500',
    fontWeight: '600',
  },
  navigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#222',
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});