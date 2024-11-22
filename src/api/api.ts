// src/api/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';

// Obtener la URL de la API desde las variables de entorno
const { API_URL } = Constants.manifest.extra;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autorización si existe
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Errores de red
      Toast.show({
        type: 'error',
        text1: 'Error de Red',
        text2: 'No se pudo conectar con el servidor. Verifica tu conexión a Internet.',
        position: 'top',
      });
    }
    return Promise.reject(error);
  }
);

export default api;
