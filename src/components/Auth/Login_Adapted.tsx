// src/screens/Login.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, Snackbar, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

interface LoginProps {
  navigation: StackNavigationProp<any>;
}

const Login: React.FC<LoginProps> = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);

    try {
      // Reemplaza 'localhost' con la dirección IP de tu servidor si estás usando un dispositivo físico
      const response = await axios.post('http://192.168.1.74:8081/api/auth/login', {
        email,
        password,
      });

      const { userId, token } = response.data;

      if (!userId || !token) {
        throw new Error('Respuesta del servidor inválida.');
      }

      // Almacenar el token y el userId en AsyncStorage
      await AsyncStorage.setItem('userId', userId.toString());
      await AsyncStorage.setItem('token', token);

      // Navegar a la aplicación principal
      navigation.replace('App');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);

      // Manejo de errores basado en la respuesta del servidor
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Errores del servidor
          if (err.response.status === 400) {
            setError('El usuario ya existe.');
          } else if (err.response.status === 401) {
            setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
          } else {
            setError('Error del servidor. Por favor, inténtalo de nuevo más tarde.');
          }
        } else if (err.request) {
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
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Iniciar Sesión" />
        <Card.Content>
          <TextInput
            label="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>¿No tienes una cuenta? Regístrate</Text>
          </TouchableOpacity>
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
    elevation: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 16,
  },
  registerText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#1e90ff',
  },
});

export default Login;
