
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { TextInput, Button, Snackbar, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const Perfil = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await axios.get(`http://localhost:8080/api/usuarios/${userId}`);
        const { nombre, email, direccion, fotoPerfilUrl } = response.data;
        setNombre(nombre);
        setEmail(email);
        setDireccion(direccion);
        setFotoPerfil(fotoPerfilUrl);
      } catch (error) {
        console.error('Error al cargar perfil', error);
        setError('Error al cargar el perfil del usuario.' as string);
      }
    };

    fetchPerfil();
  }, []);

  const handleCambiarPassword = async () => {
    if (!passwordActual || !nuevaPassword) {
      setError('Ambas contraseñas son obligatorias.' as string);
      return;
    }
    try {
      const userId = await AsyncStorage.getItem('userId');
      await axios.put(`http://localhost:8080/api/usuarios/${userId}/cambiar-contrasena`, {
        passwordActual,
        nuevaPassword,
      });
      setPasswordActual('');
      setNuevaPassword('');
    } catch (error) {
      console.error('Error al cambiar contraseña', error);
      setError('Error al cambiar la contraseña. Inténtelo nuevamente.' as string);
    }
  };

  const handleActualizarPerfil = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await axios.put(`http://localhost:8080/api/usuarios/${userId}`, { nombre, email, direccion });
    } catch (error) {
      console.error('Error al actualizar perfil', error);
      setError('Error al actualizar el perfil. Inténtelo nuevamente.' as string);
    }
  };

  const handleSubirFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        setFotoPerfil(result.assets[0].uri);
      }
      // Aquí podrías enviar la imagen al backend
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
          {fotoPerfil && <Image source={{ uri: fotoPerfil }} style={styles.image} />}
        <Card.Content>
          {fotoPerfil && <Image source={{ uri: fotoPerfil }} style={styles.image} />}
          <Button onPress={handleSubirFoto} mode="contained" style={styles.button}>
            Subir Foto de Perfil
          </Button>
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
          />
          <TextInput
            label="Dirección"
            value={direccion}
            onChangeText={setDireccion}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleActualizarPerfil} style={styles.button}>
            Guardar Cambios
          </Button>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="Cambiar Contraseña" />
        <Card.Content>
          <TextInput
            label="Contraseña Actual"
            value={passwordActual}
            onChangeText={setPasswordActual}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            label="Nueva Contraseña"
            value={nuevaPassword}
            onChangeText={setNuevaPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button mode="contained" onPress={handleCambiarPassword} style={styles.button}>
            Cambiar Contraseña
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
});

export default Perfil;
