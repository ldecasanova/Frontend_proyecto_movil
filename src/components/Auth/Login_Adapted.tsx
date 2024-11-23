// src/screens/Login.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, CommonActions } from '@react-navigation/native';

// Definición de las rutas del stack
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AppTabs: undefined; // Cambiamos 'App' por 'AppTabs'
};

// Tipado de la navegación para Login
type LoginNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface AutenticacionResponseDto {
  userId: number;
  // Otros campos si es necesario
}

const Login: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    // Validaciones básicas
    if (!username || !email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido.');
      return;
    }

    try {
      // Solicitud POST al backend
      const res = await axios.post<AutenticacionResponseDto>(
        'http://192.168.1.43:8080/api/usuarios/autenticar',
        {
          nombre: username,
          email,
          contrasena: password,
        }
      );

      const { userId } = res.data;

      if (!userId) {
        throw new Error('ID de usuario no recibido.');
      }

      // Guardar el ID del usuario en AsyncStorage
      await AsyncStorage.setItem('userId', userId.toString());

      // Mostrar mensaje de éxito
      Alert.alert('Éxito', 'Inicio de sesión exitoso.');

      // Navegar al AppTabs
      navigation.replace('AppTabs'); // Cambiamos 'App' por 'AppTabs'

      // O puedes usar navigation.dispatch con CommonActions.reset para evitar que el usuario pueda regresar a la pantalla de login:
      /*
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AppTabs' }],
        })
      );
      */
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          Alert.alert(
            'Error',
            error.response.data.message || 'Error al iniciar sesión.'
          );
        } else if (error.request) {
          Alert.alert(
            'Error',
            'No se pudo conectar con el servidor. Verifica tu conexión a Internet.'
          );
        } else {
          Alert.alert('Error', 'Ocurrió un error inesperado.');
        }
      } else {
        Alert.alert('Error', 'Ocurrió un error inesperado.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        {/* Campo de nombre de usuario */}
        <TextInput
          label="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          mode="outlined"
        />
        {/* Campo de correo */}
        <TextInput
          label="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
        />
        {/* Campo de contraseña */}
        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />
        {/* Botón para iniciar sesión */}
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Iniciar Sesión
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>
            ¿No tienes una cuenta? Regístrate aquí
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Tus estilos existentes
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  registerText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#1e90ff',
  },
});

export default Login;
