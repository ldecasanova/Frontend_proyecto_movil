
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: `http://192.168.1.74:8081/api`, // URL base
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a las solicitudes si es necesario
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token'); // Recuperar el token del almacenamiento
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
