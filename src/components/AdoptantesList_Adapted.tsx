// src/components/AdoptantesList.tsx

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {
  Card,
  Snackbar,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Para los íconos

type RootStackParamList = {
  AdoptantesList: undefined;
  // Agrega otras rutas aquí si es necesario
};

interface Adoptante {
  id: number;
  nombre: string;
  email: string;
  direccion: string;
  telefono: string;
}

const AdoptantesList = () => {
  const [adoptantes, setAdoptantes] = useState<Adoptante[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reemplaza '192.168.x.x' con la dirección IP real de tu máquina de desarrollo
  const API_BASE_URL = 'http://192.168.1.43:8080/api'; // <--- Actualiza esta línea

  useEffect(() => {
    fetchAdoptantes();
  }, []);

  // Función para obtener la lista de adoptantes
  const fetchAdoptantes = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Adoptante[]>(`${API_BASE_URL}/adoptantes`);
      setAdoptantes(res.data);
    } catch (error) {
      console.error('Error al obtener adoptantes', error);
      setError('Error al cargar la lista de adoptantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado con Título e Ícono */}
      <View style={styles.header}>
        <Icon name="users" size={30} color={colors.primary} />
        <Text style={styles.headerText}>Lista de Adoptantes</Text>
      </View>

      {/* Lista de Adoptantes */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
      ) : adoptantes.length > 0 ? (
        adoptantes.map((adoptante) => (
          <Card key={adoptante.id} style={styles.card}>
            <Card.Title
              title={adoptante.nombre}
              subtitle={`Correo: ${adoptante.email}`}
              left={(props) => <Icon name="user" color={colors.primary} {...props} />}
            />
            <Card.Content>
              <Text style={styles.infoText}>Dirección: {adoptante.direccion}</Text>
              <Text style={styles.infoText}>Teléfono: {adoptante.telefono}</Text>
            </Card.Content>
          </Card>
        ))
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No hay adoptantes registrados.</Text>
        </View>
      )}

      {/* Snackbar para Mensajes de Error */}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={3000}
        action={{ label: 'OK', onPress: () => setError(null) }}
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
};

// Definir una paleta de colores para mantener consistencia
const colors = {
  primary: '#2563EB', // Azul
  secondary: '#16A34A', // Verde
  danger: '#DC2626', // Rojo
  warning: '#F59E0B', // Amarillo
  neutral: '#F3F4F6', // Gris claro
  textDark: '#374151', // Gris oscuro
  textLight: '#FFFFFF', // Blanco
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: colors.neutral,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 8,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 4,
  },
  loading: {
    marginTop: 32,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  noDataText: {
    fontSize: 18,
    color: '#555555',
  },
});

export default AdoptantesList;
