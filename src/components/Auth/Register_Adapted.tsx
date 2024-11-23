// src/screens/Register.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar, Card, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
// Importación correcta de Dropdown
import Dropdown from 'react-native-paper-dropdown'; // Asegúrate de tener instalada esta biblioteca

// Definición de las rutas del stack
type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  // Añade otras rutas según sea necesario
};

// Tipado de la navegación para Register
type RegisterNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const Register: React.FC = () => {
  const navigation = useNavigation<RegisterNavigationProp>();
  
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados para el manejo de errores y carga
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para manejar la visibilidad de los Dropdown
  const [showDropDownPassword, setShowDropDownPassword] = useState(false);
  
  // Dirección IP específica proporcionada
  const API_BASE_URL = 'http://192.168.1.43:8080/api'; // <--- Utiliza la IP proporcionada
  
  // Función para validar el formato del correo electrónico
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Función para manejar el registro
  const handleRegister = async () => {
    // Validaciones básicas
    if (!nombre || !email || !direccion || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Por favor ingresa un correo válido.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    
    setLoading(true); // Iniciar estado de carga
    
    try {
      // Solicitud POST al backend con nombres de campos alineados
      await axios.post(`${API_BASE_URL}/auth/register`, {
        nombre,
        email,
        direccion,
        password,          // Campo correcto
        confirmPassword,   // Campo agregado
      });
      // Navegar a la pantalla de Login tras el registro exitoso
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al registrar usuario', error);
      
      // Manejo de errores más detallado
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Errores del servidor
          if (error.response.status === 400) {
            setError('El usuario ya existe o los datos son inválidos.');
          } else {
            setError('Error del servidor. Por favor, inténtalo de nuevo más tarde.');
          }
        } else if (error.request) {
          // Errores de red
          setError('No se pudo conectar con el servidor. Verifica tu conexión a Internet.');
        } else {
          // Otros errores
          setError('Ocurrió un error inesperado.');
        }
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setLoading(false); // Finalizar estado de carga
    }
  };
  
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Registro" />
        <Card.Content>
          <TextInput
            label="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
          <TextInput
            label="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            label="Dirección"
            value={direccion}
            onChangeText={setDireccion}
            style={styles.input}
          />
          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            loading={loading}      // Mostrar estado de carga
            disabled={loading}     // Deshabilitar botón durante la carga
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </Card.Content>
      </Card>
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        action={{ label: 'OK', onPress: () => setError(null) }}
        duration={5000}
      >
        {error}
      </Snackbar>
      {loading && (
        <ActivityIndicator
          size="large"
          style={styles.loadingIndicator}
          animating={loading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    padding: 16,
    elevation: 4,          // Sombra en Android
    borderRadius: 8,       // Bordes redondeados
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 16,
  },
  loadingIndicator: {
    marginTop: 16,
  },
});

export default Register;
