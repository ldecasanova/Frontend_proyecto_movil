// src/components/DetalleCitas.tsx

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Platform,
} from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../api/axios_Adapted'; // Asegúrate de que la ruta es correcta
import Toast from 'react-native-toast-message';

type RootStackParamList = {
  DetalleCitas: { id: string };
  EditarCitas: { id: string };
  Dashboard: undefined; // Añade esta ruta para navegar después de eliminar
  // Agrega otras rutas aquí si es necesario
};

type DetalleCitasRouteProp = RouteProp<RootStackParamList, 'DetalleCitas'>;
type DetalleCitasNavigationProp = StackNavigationProp<RootStackParamList, 'DetalleCitas'>;

type Cita = {
  motivo: string;
  fechaCita: string;
  veterinario: string;
  estado: string;
  animalId: string;
};

type Animal = {
  nombre: string;
  especie: string;
  edad: string;
  unidadEdad: string;
  estadoSalud: string;
  adoptanteId?: string;
};

type Adoptante = {
  nombre: string;
  id: string;
};

const DetalleCitas = () => {
  const route = useRoute<DetalleCitasRouteProp>();
  const navigation = useNavigation<DetalleCitasNavigationProp>();
  const { id } = route.params;

  const [cita, setCita] = useState<Cita | null>(null);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [adoptante, setAdoptante] = useState<Adoptante | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetallesCita = async () => {
      setLoading(true);
      try {
        // Obtener detalles de la cita
        const citaRes = await api.get<Cita>(`/citas/${id}`);
        setCita(citaRes.data);

        // Obtener detalles del animal asociado
        const animalRes = await api.get<Animal>(`/animales/${citaRes.data.animalId}`);
        setAnimal(animalRes.data);

        // Si el animal tiene un adoptante, obtener sus detalles
        if (animalRes.data.adoptanteId) {
          const adoptanteRes = await api.get<Adoptante>(`/adoptantes/${animalRes.data.adoptanteId}`);
          setAdoptante(adoptanteRes.data);
        }
      } catch (error) {
        console.error('Error al obtener detalles de la cita', error);
        setError('Error al cargar los detalles de la cita.');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Error al cargar los detalles de la cita.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetallesCita();
  }, [id]);

  const handleEliminarCita = () => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setEliminando(true);
            try {
              await api.delete(`/citas/${id}`);
              Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Cita eliminada exitosamente.',
              });
              navigation.navigate('Dashboard'); // Navegar al Dashboard después de eliminar
            } catch (error) {
              console.error('Error al eliminar la cita', error);
              setError('Error al eliminar la cita.');
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al eliminar la cita.',
              });
            } finally {
              setEliminando(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditarCita = () => {
    navigation.navigate('EditarCitas', { id });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando detalles de la cita...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!cita) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se encontró la cita.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Detalles de la Cita */}
      <Card style={styles.card}>
        <Card.Title title="Detalles de la Cita" />
        <Card.Content>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Motivo:</Text> {cita.motivo}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Fecha:</Text> {new Date(cita.fechaCita).toLocaleDateString()}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Veterinario:</Text> {cita.veterinario}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Estado:</Text> {cita.estado}
          </Text>
        </Card.Content>
      </Card>

      {/* Detalles del Animal */}
      {animal && (
        <Card style={styles.card}>
          <Card.Title title="Detalles del Animal" />
          <Card.Content>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Nombre:</Text> {animal.nombre}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Especie:</Text> {animal.especie}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Edad:</Text> {animal.edad} {animal.unidadEdad}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Estado de Salud:</Text> {animal.estadoSalud}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Detalles del Adoptante */}
      {adoptante && (
        <Card style={styles.card}>
          <Card.Title title="Detalles del Adoptante" />
          <Card.Content>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Nombre:</Text> {adoptante.nombre}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>ID:</Text> {adoptante.id}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Botones de Acción */}
      <View style={styles.actionButtonsContainer}>
        <Button
          mode="contained"
          onPress={handleEditarCita}
          style={styles.button}
        >
          Editar Cita
        </Button>
        <Button
          mode="contained"
          onPress={handleEliminarCita}
          style={[styles.button, styles.deleteButton]}
          loading={eliminando}
          disabled={eliminando}
        >
          {eliminando ? 'Eliminando...' : 'Eliminar Cita'}
        </Button>
      </View>

      {/* Toast Notifications */}
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 16,
  },
  text: {
    marginBottom: 8,
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 0.48,
    padding: 8,
  },
  deleteButton: {
    backgroundColor: '#d9534f',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
  },
  errorText: {
    color: '#d9534f',
    fontSize: 16,
  },
});

export default DetalleCitas;
