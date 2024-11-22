
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface LoginProps {
  navigation: any;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username || !email || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    try {
      const res = await axios.post('http://localhost:8080/api/usuarios/autenticar', {
        nombre: username,
        email,
        contrasena: password,
      });

      const { userId } = res.data;

      if (!userId) {
        throw new Error('ID de usuario no recibido.');
      }

      await AsyncStorage.setItem('userId', userId.toString());
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      setError('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Iniciar Sesión" />
        <Card.Content>
          <TextInput
            label="Nombre de Usuario"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            label="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Iniciar Sesión
          </Button>
        </Card.Content>
      </Card>
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        action={{ label: 'OK', onPress: () => setError(null) }}
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
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default Login;
