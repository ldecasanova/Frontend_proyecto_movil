// src/components/DetalleCitas.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Snackbar, ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../api/axios_Adapted';

// 1. Definir RootStackParamList dentro del mismo archivo
type RootStackParamList = {
  DetalleCitas: { id: string };
  EditarCitas: { id: string };
};

// 2. Definir los tipos para useRoute y useNavigation
type DetalleCitasRouteProp = RouteProp<RootStackParamList, 'DetalleCitas'>;
type DetalleCitasNavigationProp = StackNavigationProp<RootStackParamList, 'DetalleCitas'>;

// 3. Definir los tipos de datos recibidos de la API
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
  unidadEdad: string; // Asegúrate de que tu backend envía este campo
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
      } finally {
        setLoading(false);
      }
    };

    fetchDetallesCita();
  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {cita && (
            <Card style={styles.card}>
              <Card.Title title="Detalles de la Cita" />
              <Card.Content>
                <Text style={styles.text}>
                  <Text style={styles.bold}>Motivo:</Text> {cita.motivo}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.bold}>Fecha:</Text> {new Date(cita.fechaCita).toLocaleDateString()}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.bold}>Veterinario:</Text> {cita.veterinario}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.bold}>Estado:</Text> {cita.estado}
                </Text>
              </Card.Content>
            </Card>
          )}
          {animal && (
            <Card style={styles.card}>
              <Card.Title title="Detalles del Animal" />
              <Card.Content>
                <Text style={styles.text}>
                  <Text style={styles.bold}>Nombre:</Text> {animal.nombre}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.bold}>Especie:</Text> {animal.especie}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.bold}>Edad:</Text> {animal.edad} {animal.unidadEdad}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.bold}>Estado de Salud:</Text> {animal.estadoSalud}
                </Text>
              </Card.Content>
            </Card>
          )}
          {adoptante && (
            <Card style={styles.card}>
              <Card.Title title="Detalles del Adoptante" />
              <Card.Content>
                <Text style={styles.text}>
                  <Text style={styles.bold}>Nombre:</Text> {adoptante.nombre}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.bold}>ID:</Text> {adoptante.id}
                </Text>
              </Card.Content>
            </Card>
          )}
          <Button
            mode="contained"
            onPress={() => navigation.navigate('EditarCitas', { id })}
            style={styles.button}
          >
            Editar Cita
          </Button>
        </>
      )}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setError(null),
        }}
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
  button: {
    marginTop: 16,
    padding: 8,
  },
  text: {
    marginBottom: 8,
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default DetalleCitas;
