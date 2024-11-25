// src/components/Perfil.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Accelerometer } from 'expo-sensors';

// Definición de la interfaz para los datos del usuario
interface UsuarioResponseDto {
  nombre: string;
  email: string;
  direccion: string;
  fotoPerfilUrl?: string;
  // Añade otras propiedades si es necesario
}

const Perfil = () => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad'>('perfil');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');

  // Estados para manejar la foto de perfil
  const [fotoPerfil, setFotoPerfil] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string>('');

  // Estados para manejar la carga y errores
  const [loading, setLoading] = useState<boolean>(true);

  // ID de usuario predeterminado
  const userId = '1'; // Usamos una cadena para facilitar el uso en URLs

  // Estados para manejar la aceleración
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    // Suscribirse al acelerómetro
    _subscribe();

    // Cargar los datos del perfil al montar el componente
    fetchPerfil();

    return () => {
      // Cancelar la suscripción al desmontar el componente
      _unsubscribe();
    };
  }, []);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        const { x, y, z } = accelerometerData;
        const totalAcceleration = Math.sqrt(x * x + y * y + z * z);

        if (totalAcceleration > 3.00) {
          // Dispositivo agitado
          handleDeviceShake();
        }
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const handleDeviceShake = () => {
    Alert.alert('Dispositivo agitado', 'Has agitado el dispositivo.');
    // Puedes realizar cualquier acción aquí, como resetear la foto de perfil o mostrar un mensaje
  };

  const fetchPerfil = async () => {
    try {
      // Intentar cargar desde el caché primero
      const cachedNombre = await AsyncStorage.getItem('nombre');
      const cachedEmail = await AsyncStorage.getItem('email');
      const cachedDireccion = await AsyncStorage.getItem('direccion');
      const cachedFotoPerfilUrl = await AsyncStorage.getItem('fotoPerfilUrl');

      if (cachedNombre && cachedEmail && cachedDireccion) {
        setNombre(cachedNombre);
        setEmail(cachedEmail);
        setDireccion(cachedDireccion);
        setFotoPerfilUrl(cachedFotoPerfilUrl || '');
        setLoading(false);
      } else {
        // Si no hay datos en caché, obtenerlos del servidor
        const res = await axios.get<UsuarioResponseDto>(
          `http://192.168.1.43:8080/api/usuarios/${userId}`
        );
        const data = res.data;

        setNombre(data.nombre);
        setEmail(data.email);
        setDireccion(data.direccion);
        setFotoPerfilUrl(data.fotoPerfilUrl || '');

        // Guardar datos en AsyncStorage para usar en el caché
        await AsyncStorage.setItem('nombre', data.nombre);
        await AsyncStorage.setItem('email', data.email);
        await AsyncStorage.setItem('direccion', data.direccion);
        await AsyncStorage.setItem('fotoPerfilUrl', data.fotoPerfilUrl || '');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Error al cargar los datos del perfil:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Error al cargar los datos del perfil.',
      });
      setLoading(false);
    }
  };

  // Función para manejar la selección de imagen desde la galería
  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permiso denegado', 'Se requiere permiso para acceder a la galería.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Reemplazado según advertencia
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!pickerResult.canceled) {
      const asset = pickerResult.assets[0];
      setFotoPerfilUrl(asset.uri);
      setFotoPerfil(asset);
    }
  };

  // Función para tomar una foto con la cámara
  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permiso denegado', 'Se requiere permiso para acceder a la cámara.');
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Reemplazado según advertencia
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!pickerResult.canceled) {
      const asset = pickerResult.assets[0];
      setFotoPerfilUrl(asset.uri);
      setFotoPerfil(asset);
    }
  };

  // Actualizar perfil
  const handleActualizarPerfil = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', userId); // Enviar el userId predeterminado
      formData.append('nombre', nombre);
      formData.append('email', email);
      formData.append('direccion', direccion);

      if (fotoPerfil) {
        const uriParts = fotoPerfil.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('fotoPerfil', {
          uri: fotoPerfil.uri,
          name: `fotoPerfil.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      await axios.put(`http://192.168.1.43:8080/api/usuarios/perfil?userId=${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Actualizar el caché en AsyncStorage
      await AsyncStorage.setItem('nombre', nombre);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('direccion', direccion);
      await AsyncStorage.setItem('fotoPerfilUrl', fotoPerfilUrl);

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Perfil actualizado correctamente.',
      });
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Error al actualizar el perfil.',
      });
    }
  };

  // Cambiar contraseña
  const handleCambiarContrasena = async () => {
    try {
      // Validar que las contraseñas no estén vacías
      if (!passwordActual || !nuevaPassword) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Por favor, completa todos los campos de contraseña.',
        });
        return;
      }

      // Validar que la nueva contraseña cumpla con los requisitos (opcional)
      if (nuevaPassword.length < 6) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'La nueva contraseña debe tener al menos 6 caracteres.',
        });
        return;
      }

      // Realizar solicitud al backend para cambiar la contraseña
      await axios.put(
        `http://192.168.1.43:8080/api/usuarios/perfil/cambiar-contrasena?userId=${userId}`,
        {
          contrasenaActual: passwordActual,
          nuevaContrasena: nuevaPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Contraseña cambiada correctamente.',
      });

      // Limpiar los campos de contraseña
      setPasswordActual('');
      setNuevaPassword('');
    } catch (error: any) {
      console.error('Error al cambiar la contraseña:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Error al cambiar la contraseña.',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {/* Barra de navegación para las secciones */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'perfil' && styles.activeNavButton]}
          onPress={() => setActiveTab('perfil')}
        >
          <FontAwesome
            name="user"
            size={20}
            color={activeTab === 'perfil' ? '#4CAF50' : '#555'}
          />
          <Text
            style={[
              styles.navButtonText,
              activeTab === 'perfil' && styles.activeNavButtonText,
            ]}
          >
            Información del Perfil
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'seguridad' && styles.activeNavButton]}
          onPress={() => setActiveTab('seguridad')}
        >
          <FontAwesome
            name="lock"
            size={20}
            color={activeTab === 'seguridad' ? '#4CAF50' : '#555'}
          />
          <Text
            style={[
              styles.navButtonText,
              activeTab === 'seguridad' && styles.activeNavButtonText,
            ]}
          >
            Seguridad y Contraseña
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido dinámico basado en la tab activa */}
      {activeTab === 'perfil' && (
        <View>
          <Text style={styles.sectionTitle}>Foto de Perfil</Text>
          {fotoPerfilUrl ? (
            <Image source={{ uri: fotoPerfilUrl }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <FontAwesome name="user" size={50} color="#aaa" />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
              <Text style={styles.buttonText}>Seleccionar de Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
              <Text style={styles.buttonText}>Tomar Foto</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Información Actual</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Nombre:</Text> {nombre}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Email:</Text> {email}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Dirección:</Text> {direccion}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Actualizar Perfil</Text>
          <TextInput
            placeholder="Nuevo Nombre"
            value={nombre}
            style={styles.input}
            onChangeText={setNombre}
          />
          <TextInput
            placeholder="Nuevo Email"
            value={email}
            style={styles.input}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Nueva Dirección"
            value={direccion}
            style={styles.input}
            onChangeText={setDireccion}
          />
          <TouchableOpacity style={styles.button} onPress={handleActualizarPerfil}>
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'seguridad' && (
        <View>
          <Text style={styles.sectionTitle}>Seguridad y Contraseña</Text>
          <TextInput
            placeholder="Contraseña Actual"
            style={styles.input}
            value={passwordActual}
            onChangeText={setPasswordActual}
            secureTextEntry
          />
          <TextInput
            placeholder="Nueva Contraseña"
            style={styles.input}
            value={nuevaPassword}
            onChangeText={setNuevaPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleCambiarContrasena}>
            <Text style={styles.buttonText}>Cambiar Contraseña</Text>
          </TouchableOpacity>
        </View>
      )}

      <Toast />
    </ScrollView>
  );
};

export default Perfil;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 18,
    color: '#555',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#4CAF50',
  },
  navBar: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  activeNavButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  activeNavButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignSelf: 'center',
    marginBottom: 16,
  },
  placeholderImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    flex: 0.48,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 }, // Sombra para iOS
    shadowOpacity: 0.1, // Sombra para iOS
    shadowRadius: 4, // Sombra para iOS
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
