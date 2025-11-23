import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WorkoutPlanScreen({ navigation }) {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  const workoutDetails = {
    "Fuerza Upper Body": {
      exercises: [
        { name: "Press banca plano", sets: "4x10", rest: "90seg", description: "Acuéstate en el banco, agarra la barra y baja hasta el pecho, luego empuja hacia arriba." },
        { name: "Press inclinado con mancuernas", sets: "3x12", rest: "60seg", description: "En banco inclinado, sube las mancuernas desde los hombros hasta arriba." },
        { name: "Aperturas con mancuernas", sets: "3x12", rest: "60seg", description: "Abre los brazos con mancuernas en forma de abrazo controlado." },
        { name: "Fondos en paralelas", sets: "3x10", rest: "60seg", description: "Baja tu cuerpo flexionando los codos y sube de nuevo." },
        { name: "Press francés", sets: "3x12", rest: "45seg", description: "Acostado, baja la barra hacia la frente flexionando solo los codos." },
        { name: "Extensiones en polea", sets: "3x15", rest: "45seg", description: "Empuja la cuerda hacia abajo hasta extender completamente los brazos." },
        { name: "Patada de tríceps", sets: "3x12", rest: "45seg", description: "Inclínate y extiende el brazo hacia atrás con mancuerna." },
        { name: "Flexiones diamante", sets: "3xMAX", rest: "60seg", description: "Flexiones con las manos juntas formando un diamante." },
      ],
      warmup: "5-10 minutos de cardio ligero + rotaciones articulares",
      cooldown: "Estiramientos de pecho, hombros y tríceps durante 5-10 minutos",
    },
    "HIIT Cardio Intenso": {
      exercises: [
        { name: "Burpees", sets: "4x20seg", rest: "40seg", description: "Desde de pie, baja a plancha, haz flexión, salta hacia arriba." },
        { name: "Mountain climbers", sets: "4x30seg", rest: "30seg", description: "En plancha, lleva las rodillas al pecho alternadamente rápido." },
        { name: "Jump squats", sets: "4x15", rest: "45seg", description: "Sentadilla explosiva con salto al subir." },
        { name: "High knees", sets: "4x30seg", rest: "30seg", description: "Corre en el sitio elevando las rodillas al máximo." },
        { name: "Box jumps", sets: "3x12", rest: "60seg", description: "Salta sobre un cajón con ambos pies." },
        { name: "Sprint en el sitio", sets: "4x20seg", rest: "40seg", description: "Corre lo más rápido posible sin moverte del sitio." },
      ],
      warmup: "Calentamiento dinámico de 5 minutos",
      cooldown: "Caminata ligera + estiramientos 5 minutos",
    },
    "Core & Abdomen": {
      exercises: [
        { name: "Plancha frontal", sets: "3x60seg", rest: "45seg", description: "Mantén posición de plancha con el core contraído." },
        { name: "Crunches", sets: "4x20", rest: "30seg", description: "Acostado, eleva el torso hacia las rodillas." },
        { name: "Plancha lateral", sets: "3x45seg", rest: "30seg", description: "De lado, mantén el cuerpo recto apoyado en un antebrazo." },
        { name: "Bicicleta", sets: "4x20", rest: "30seg", description: "Acostado, lleva codo a rodilla opuesta alternadamente." },
        { name: "Elevación de piernas", sets: "3x15", rest: "45seg", description: "Acostado, eleva las piernas juntas sin doblar rodillas." },
        { name: "Russian twists", sets: "4x20", rest: "30seg", description: "Sentado, rota el torso de lado a lado." },
        { name: "Dead bug", sets: "3x12", rest: "30seg", description: "Acostado, mueve brazos y piernas opuestos alternadamente." },
        { name: "Hollow hold", sets: "3x30seg", rest: "45seg", description: "Acostado, eleva piernas y hombros del suelo." },
        { name: "Mountain climbers", sets: "3x30seg", rest: "30seg", description: "Plancha llevando rodillas al pecho alternadamente." },
        { name: "Plancha con toque de hombro", sets: "3x20", rest: "30seg", description: "En plancha, toca hombros alternados manteniendo estabilidad." },
      ],
      warmup: "Activación de core 5 minutos",
      cooldown: "Estiramientos de abdomen y espalda baja",
    },
    "Introducción al Gimnasio": {
      exercises: [
        { name: "Sentadilla con peso corporal", sets: "3x12", rest: "60seg", description: "Baja como si te sentaras en una silla." },
        { name: "Press de pecho en máquina", sets: "3x10", rest: "60seg", description: "Empuja los agarres hacia adelante." },
        { name: "Remo en máquina", sets: "3x10", rest: "60seg", description: "Tira los agarres hacia tu pecho." },
        { name: "Press de hombros con mancuernas", sets: "3x10", rest: "60seg", description: "Sube las mancuernas desde los hombros." },
        { name: "Curl de bíceps", sets: "3x12", rest: "45seg", description: "Flexiona los codos subiendo las mancuernas." },
        { name: "Plancha", sets: "3x30seg", rest: "45seg", description: "Mantén posición de plancha." },
      ],
      warmup: "10 minutos de caminata o bici estática",
      cooldown: "Estiramientos generales 10 minutos",
    },
    "Fuerza de Piernas": {
      exercises: [
        { name: "Sentadilla goblet", sets: "4x12", rest: "60seg", description: "Sostén mancuerna al pecho y haz sentadilla." },
        { name: "Peso muerto rumano", sets: "3x10", rest: "90seg", description: "Baja la barra deslizándola por las piernas." },
        { name: "Zancadas alternas", sets: "3x10/pierna", rest: "60seg", description: "Da un paso largo y baja la rodilla trasera." },
        { name: "Extensión de cuádriceps", sets: "3x15", rest: "45seg", description: "Extiende las piernas en la máquina." },
        { name: "Curl femoral", sets: "3x15", rest: "45seg", description: "Flexiona las piernas llevando talones hacia glúteos." },
        { name: "Elevación de gemelos", sets: "4x20", rest: "45seg", description: "Elévate sobre las puntas de los pies." },
      ],
      warmup: "Movilidad de cadera y rodillas 5 minutos",
      cooldown: "Estiramientos de piernas completos",
    },
    // Agrega más detalles para cada rutina aquí...
  };

  const recommendedWorkouts = [
    {
      id: 1,
      title: "Fuerza Upper Body",
      level: "Intermedio",
      duration: "45 min",
      exercises: 8,
      bg: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    },
    {
      id: 2,
      title: "HIIT Cardio Intenso",
      level: "Avanzado",
      duration: "30 min",
      exercises: 6,
      bg: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    },
    {
      id: 3,
      title: "Core & Abdomen",
      level: "Intermedio",
      duration: "25 min",
      exercises: 10,
      bg: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    },
  ];

  const allWorkouts = [
    {
      id: 4,
      title: "Introducción al Gimnasio",
      level: "Principiante",
      duration: "30 min",
      category: "Full Body",
      bg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    },
    {
      id: 5,
      title: "Fuerza de Piernas",
      level: "Principiante",
      duration: "35 min",
      category: "Lower Body",
      bg: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80",
    },
    {
      id: 6,
      title: "Cardio Para Empezar",
      level: "Principiante",
      duration: "20 min",
      category: "Cardio",
      bg: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
    },
    {
      id: 7,
      title: "Movilidad y Flexibilidad",
      level: "Principiante",
      duration: "25 min",
      category: "Recuperación",
      bg: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    },
    {
      id: 8,
      title: "Pecho y Tríceps Completo",
      level: "Intermedio",
      duration: "50 min",
      category: "Upper Body",
      bg: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&q=80",
    },
    {
      id: 9,
      title: "Espalda y Bíceps",
      level: "Intermedio",
      duration: "55 min",
      category: "Upper Body",
      bg: "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800&q=80",
    },
    {
      id: 10,
      title: "Piernas Hipertrofia",
      level: "Intermedio",
      duration: "60 min",
      category: "Lower Body",
      bg: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&q=80",
    },
    {
      id: 11,
      title: "Hombros y Core",
      level: "Intermedio",
      duration: "45 min",
      category: "Upper Body",
      bg: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    },
    {
      id: 12,
      title: "HIIT Avanzado",
      level: "Intermedio",
      duration: "35 min",
      category: "Cardio",
      bg: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80",
    },
    {
      id: 13,
      title: "Funcional Crossfit",
      level: "Intermedio",
      duration: "50 min",
      category: "Full Body",
      bg: "https://images.unsplash.com/photo-1623874228601-f4193c7b1818?w=800&q=80",
    },
    {
      id: 14,
      title: "Powerlifting Básico",
      level: "Avanzado",
      duration: "75 min",
      category: "Fuerza",
      bg: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    },
    {
      id: 15,
      title: "Volumen Extremo Pecho",
      level: "Avanzado",
      duration: "70 min",
      category: "Upper Body",
      bg: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    },
    {
      id: 16,
      title: "Espalda Máxima Masa",
      level: "Avanzado",
      duration: "65 min",
      category: "Upper Body",
      bg: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
    },
    {
      id: 17,
      title: "Piernas de Acero",
      level: "Avanzado",
      duration: "80 min",
      category: "Lower Body",
      bg: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80",
    },
    {
      id: 18,
      title: "Atlético Funcional",
      level: "Avanzado",
      duration: "60 min",
      category: "Full Body",
      bg: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
    },
    {
      id: 19,
      title: "Resistencia Extrema",
      level: "Avanzado",
      duration: "55 min",
      category: "Cardio",
      bg: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80",
    },
    {
      id: 20,
      title: "Brazos Completo",
      level: "Avanzado",
      duration: "50 min",
      category: "Upper Body",
      bg: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=800&q=80",
    },
    {
      id: 21,
      title: "Hombros 3D",
      level: "Avanzado",
      duration: "55 min",
      category: "Upper Body",
      bg: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    },
  ];

  const handleWorkoutPress = (workout) => {
    setSelectedWorkout(workout);
    setShowModal(true);
    setIsWorkoutStarted(false);
    setCurrentExerciseIndex(0);
  };

  const handleStartWorkout = () => {
    setIsWorkoutStarted(true);
    setCurrentExerciseIndex(0);
  };

  const handleNextExercise = () => {
    const details = workoutDetails[selectedWorkout.title];
    if (details && currentExerciseIndex < details.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Workout completado
      setIsWorkoutStarted(false);
      alert('¡Entrenamiento completado! 🎉');
      setShowModal(false);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const renderWorkoutDetails = () => {
    if (!selectedWorkout) return null;
    
    const details = workoutDetails[selectedWorkout.title];
    
    if (!details) {
      return (
        <View style={styles.noDetailsContainer}>
          <TouchableOpacity 
            style={styles.backButtonTop}
            onPress={() => setShowModal(false)}
          >
            <Text style={styles.backButtonTopText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.noDetailsText}>Detalles no disponibles para esta rutina</Text>
        </View>
      );
    }

    if (!isWorkoutStarted) {
      // Vista previa del entrenamiento
      return (
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <ImageBackground 
            source={{ uri: selectedWorkout.bg }}
            style={styles.modalHeader}
            imageStyle={styles.modalHeaderImage}
          >
            <View style={styles.modalHeaderOverlay} />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.modalHeaderContent}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{selectedWorkout.level}</Text>
              </View>
              <Text style={styles.modalTitle}>{selectedWorkout.title}</Text>
              <View style={styles.modalMetaRow}>
                <Text style={styles.modalMetaText}>⏱️ {selectedWorkout.duration}</Text>
                <Text style={styles.modalMetaDot}>•</Text>
                <Text style={styles.modalMetaText}>💪 {details.exercises.length} ejercicios</Text>
              </View>
            </View>
          </ImageBackground>

          <View style={styles.detailsSection}>
            <View style={styles.warmupSection}>
              <Text style={styles.sectionLabel}>🔥 CALENTAMIENTO</Text>
              <Text style={styles.sectionText}>{details.warmup}</Text>
            </View>

            <View style={styles.exercisesSection}>
              <Text style={styles.sectionLabel}>📋 EJERCICIOS</Text>
              {details.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <View style={styles.exerciseNumber}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseSets}>{exercise.sets} • Descanso: {exercise.rest}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.warmupSection}>
              <Text style={styles.sectionLabel}>🧘 ENFRIAMIENTO</Text>
              <Text style={styles.sectionText}>{details.cooldown}</Text>
            </View>

            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStartWorkout}
            >
              <Text style={styles.startButtonText}>INICIAR ENTRENAMIENTO</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    // Vista durante el entrenamiento
    const currentExercise = details.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex + 1) / details.exercises.length) * 100;

    return (
      <View style={styles.workoutActiveContainer}>
        <View style={styles.workoutHeader}>
          <TouchableOpacity 
            style={styles.backButtonTopWorkout}
            onPress={() => {
              if (confirm('¿Estás seguro que quieres salir del entrenamiento?')) {
                setShowModal(false);
                setIsWorkoutStarted(false);
              }
            }}
          >
            <Text style={styles.backButtonTopText}>← Salir</Text>
          </TouchableOpacity>
          <Text style={styles.workoutProgress}>
            {currentExerciseIndex + 1} / {details.exercises.length}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <ScrollView style={styles.exerciseCardContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseCardNumber}>Ejercicio {currentExerciseIndex + 1}</Text>
            <Text style={styles.exerciseCardName}>{currentExercise.name}</Text>
            
            <View style={styles.exerciseCardMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaItemLabel}>Series y Reps</Text>
                <Text style={styles.metaItemValue}>{currentExercise.sets}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaItemLabel}>Descanso</Text>
                <Text style={styles.metaItemValue}>{currentExercise.rest}</Text>
              </View>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>📝 CÓMO HACERLO</Text>
              <Text style={styles.descriptionText}>{currentExercise.description}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.navButton, currentExerciseIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePreviousExercise}
            disabled={currentExerciseIndex === 0}
          >
            <Text style={styles.navButtonText}>← Anterior</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButtonPrimary}
            onPress={handleNextExercise}
          >
            <Text style={styles.navButtonPrimaryText}>
              {currentExerciseIndex < details.exercises.length - 1 ? 'Siguiente →' : 'Finalizar ✓'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón de pausa/menú flotante */}
        <TouchableOpacity 
          style={styles.pauseButton}
          onPress={() => setIsWorkoutStarted(false)}
        >
          <Text style={styles.pauseButtonText}>⏸</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.homeButtonText}>← Inicio</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Planes de Entrenamiento</Text>
          <Text style={styles.headerSubtitle}>Elige tu rutina ideal</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendado para ti</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {recommendedWorkouts.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0.9}
                style={styles.recommendedCard}
                onPress={() => handleWorkoutPress(item)}
              >
                <ImageBackground 
                  source={{ uri: item.bg }}
                  style={styles.recommendedImage}
                  imageStyle={styles.imageRadius}
                >
                  <View style={styles.overlay} />
                  <View style={styles.recommendedContent}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.level}</Text>
                    </View>
                    <View style={styles.recommendedInfo}>
                      <Text style={styles.recommendedTitle}>{item.title}</Text>
                      <View style={styles.metaRow}>
                        <Text style={styles.metaText}>{item.duration}</Text>
                        <Text style={styles.metaDot}>•</Text>
                        <Text style={styles.metaText}>{item.exercises} ejercicios</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Principiantes</Text>
          <View style={styles.grid}>
            {allWorkouts.filter(w => w.level === "Principiante").map((item, index) => (
              <TouchableOpacity 
                key={index}
                activeOpacity={0.9}
                style={styles.gridCard}
                onPress={() => handleWorkoutPress(item)}
              >
                <ImageBackground 
                  source={{ uri: item.bg }}
                  style={styles.gridImage}
                  imageStyle={styles.imageRadius}
                >
                  <View style={styles.overlay} />
                  <View style={styles.gridContent}>
                    <View style={styles.gridTop}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                      </View>
                    </View>
                    <View style={styles.gridBottom}>
                      <Text style={styles.gridTitle}>{item.title}</Text>
                      <Text style={styles.gridDuration}>{item.duration}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intermedios</Text>
          <View style={styles.grid}>
            {allWorkouts.filter(w => w.level === "Intermedio").map((item, index) => (
              <TouchableOpacity 
                key={index}
                activeOpacity={0.9}
                style={styles.gridCard}
                onPress={() => handleWorkoutPress(item)}
              >
                <ImageBackground 
                  source={{ uri: item.bg }}
                  style={styles.gridImage}
                  imageStyle={styles.imageRadius}
                >
                  <View style={styles.overlay} />
                  <View style={styles.gridContent}>
                    <View style={styles.gridTop}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                      </View>
                    </View>
                    <View style={styles.gridBottom}>
                      <Text style={styles.gridTitle}>{item.title}</Text>
                      <Text style={styles.gridDuration}>{item.duration}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avanzados</Text>
          <View style={styles.grid}>
            {allWorkouts.filter(w => w.level === "Avanzado").map((item, index) => (
              <TouchableOpacity 
                key={index}
                activeOpacity={0.9}
                style={styles.gridCard}
                onPress={() => handleWorkoutPress(item)}
              >
                <ImageBackground 
                  source={{ uri: item.bg }}
                  style={styles.gridImage}
                  imageStyle={styles.imageRadius}
                >
                  <View style={styles.overlay} />
                  <View style={styles.gridContent}>
                    <View style={styles.gridTop}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                      </View>
                    </View>
                    <View style={styles.gridBottom}>
                      <Text style={styles.gridTitle}>{item.title}</Text>
                      <Text style={styles.gridDuration}>{item.duration}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de detalle del entrenamiento */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          {renderWorkoutDetails()}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  homeButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#888",
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  recommendedCard: {
    width: width * 0.75,
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
  },
  imageRadius: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  recommendedContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  recommendedInfo: {
    gap: 8,
  },
  recommendedTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  metaDot: {
    color: 'rgba(255,255,255,0.6)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  gridCard: {
    width: (width - 36) / 2,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  gridTop: {
    alignItems: 'flex-start',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  gridBottom: {
    gap: 4,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  gridDuration: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    height: 280,
    justifyContent: 'flex-end',
  },
  modalHeaderImage: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  modalHeaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
  modalHeaderContent: {
    padding: 24,
    gap: 12,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalMetaText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
  },
  modalMetaDot: {
    color: 'rgba(255,255,255,0.7)',
  },
  detailsSection: {
    padding: 20,
    gap: 24,
  },
  warmupSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  sectionText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  exercisesSection: {
    gap: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  exerciseInfo: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  exerciseSets: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  startButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  startButtonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  noDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDetailsText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  backButtonTop: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonTopText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backButtonTopWorkout: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  // Workout active styles
  workoutActiveContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  workoutProgress: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  exerciseCardContainer: {
    flex: 1,
    padding: 20,
  },
  exerciseCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 24,
    gap: 20,
  },
  exerciseCardNumber: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    letterSpacing: 1,
  },
  exerciseCardName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 34,
  },
  exerciseCardMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    borderRadius: 12,
    gap: 6,
  },
  metaItemLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  metaItemValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  descriptionContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  descriptionLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  descriptionText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  navButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  navButtonPrimary: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  navButtonPrimaryText: {
    color: '#0a0a0a',
    fontSize: 15,
    fontWeight: '800',
  },
  pauseButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pauseButtonText: {
    fontSize: 24,
  },
});