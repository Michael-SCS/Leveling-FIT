// Elimina el toggle de Sign Up y deja solo el login
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      // La navegación se maneja automáticamente en App.js
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... JSX del login
    <View>
      {/* Solo mostrar el formulario de login */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
      </TouchableOpacity>

      {/* Botón para ir al onboarding si no tiene cuenta */}
      <TouchableOpacity
        style={styles.signupLink}
        onPress={() => navigation.navigate('OnboardingWelcome')}
      >
        <Text style={styles.signupText}>
          ¿No tienes cuenta? <Text style={styles.signupBold}>Regístrate aquí</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}