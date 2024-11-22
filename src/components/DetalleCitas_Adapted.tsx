
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Snackbar, ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const DetalleCitas = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [cita, setCita] = useState(null);
  const [animal, setAnimal] = useState(null);
  const [adoptante, setAdoptante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetallesCita = async () => {
      setLoading(true);
      try {
        const citaRes = await axios.get(`http://localhost:8080/api/citas/${id}`);
        setCita(citaRes.data);
        const animalRes = await axios.get(`http://localhost:8080/api/animales/${citaRes.data.animalId}`);
        setAnimal(animalRes.data);
        if (animalRes.data.adoptanteId) {
          const adoptanteRes = await axios.get(
            `http://localhost:8080/api/adoptantes/${animalRes.data.adoptanteId}`
          );
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
                <Text>Motivo: {cita.motivo}</Text>
                <Text>Fecha: {cita.fechaCita}</Text>
                <Text>Veterinario: {cita.veterinario}</Text>
                <Text>Estado: {cita.estado}</Text>
              </Card.Content>
            </Card>
          )}
          {animal && (
            <Card style={styles.card}>
              <Card.Title title="Detalles del Animal" />
              <Card.Content>
                <Text>Nombre: {animal.nombre}</Text>
                <Text>Especie: {animal.especie}</Text>
                <Text>Edad: {animal.edad}</Text>
                <Text>Estado de Salud: {animal.estadoSalud}</Text>
              </Card.Content>
            </Card>
          )}
          {adoptante && (
            <Card style={styles.card}>
              <Card.Title title="Detalles del Adoptante" />
              <Card.Content>
                <Text>Nombre: {adoptante.nombre}</Text>
                <Text>ID: {adoptante.id}</Text>
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
  button: {
    marginTop: 16,
  },
});

export default DetalleCitas;
