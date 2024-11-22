// src/screens/Register.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar, Card } from 'react-native-paper';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';

interface RegisterProps {
  navigation: StackNavigationProp<any>;
}

const Register: React.FC<RegisterProps> = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Opcional: para manejar estado de carga

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async () => {
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

    setLoading(true); // Opcional: iniciar estado de carga

    try {
      await axios.post(`http://172.20.10.3:8080/Auth/register`, {
        nombre,
        email,
        direccion,
        contrasena: password,
      });
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al registrar usuario', error);
      // Manejo de errores más detallado (opcional)
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Errores del servidor
          if (error.response.status === 400) {
            setError('El usuario ya existe.');
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
      setLoading(false); // Opcional: finalizar estado de carga
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
            loading={loading} // Opcional: mostrar estado de carga
            disabled={loading} // Opcional: deshabilitar botón durante la carga
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
    elevation: 4, // Opcional: agregar sombra en Android
    borderRadius: 8, // Opcional: redondear bordes
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 16,
  },
});

export default Register;
