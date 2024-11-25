// src/components/Dashboard.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Card, Text, Snackbar } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Para los íconos

interface Animal {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  unidadEdad: string;
  estadoSalud: string;
  genero?: string; // Campo para el género
  adoptanteId: number;
}

const Dashboard = () => {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimales = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Animal[]>('http://192.168.1.43:8080/api/animales'); // Ajusta la URL según tu entorno
        setAnimales(res.data);
      } catch (error) {
        console.error('Error al obtener animales', error);
        setError('Error al obtener animales.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimales();
  }, []);

  // Función para renderizar cada animal
  const renderAnimal = useCallback(
    ({ item }: { item: Animal }) => (
      <Card style={styles.card}>
        <Card.Title
          title={item.nombre}
          subtitle={`Especie: ${item.especie}`}
          left={(props) => (
            <Icon
              name="paw"
              color="#16A34A"
              style={{ marginLeft: 0 }}
              {...props}
            />
          )}
        />
        <Card.Content>
          <View style={styles.infoRow}>
            <Icon name="birthday-cake" size={16} color="#374151" />
            <Text style={styles.infoText}>
              {item.edad} {item.unidadEdad}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="venus-mars" size={16} color="#374151" />
            <Text style={styles.infoText}>{item.genero || 'No especificado'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="heartbeat" size={16} color="#374151" />
            <Text style={styles.infoText}>{item.estadoSalud}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="user" size={16} color="#374151" />
            <Text style={styles.infoText}>Adoptante ID: {item.adoptanteId}</Text>
          </View>
        </Card.Content>
      </Card>
    ),
    []
  );

  // Optimizar el keyExtractor
  const keyExtractor = useCallback((item: Animal) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      {/* Encabezado con Título e Ícono */}
      <View style={styles.header}>
        <Icon name="paw" size={30} color="#16A34A" />
        <Text style={styles.headerText}>Animales en Atención</Text>
      </View>

      {/* Lista de Animales */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#16A34A" />
          <Text style={styles.loadingText}>Cargando animales...</Text>
        </View>
      ) : (
        <FlatList
          data={animales}
          keyExtractor={keyExtractor}
          renderItem={renderAnimal}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.noDataText}>No hay animales registrados.</Text>
            </View>
          }
          contentContainerStyle={animales.length === 0 && styles.flatListContainer}
        />
      )}

      {/* Snackbar para Mensajes de Error */}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={3000}
        action={{ label: 'OK', onPress: () => setError(null) }}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fondo blanco
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', // Fondo blanco para el encabezado
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // Gris claro para la línea divisoria
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151', // Gris oscuro
    marginLeft: 10,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB', // Gris muy claro para las tarjetas
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 }, // Sombra para iOS
    shadowOpacity: 0.1, // Sombra para iOS
    shadowRadius: 4, // Sombra para iOS
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#374151',
  },
  noDataText: {
    fontSize: 18,
    color: '#374151',
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  snackbar: {
    backgroundColor: '#DC2626', // Rojo para errores
  },
});

export default Dashboard;
