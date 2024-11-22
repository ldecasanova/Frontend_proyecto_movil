
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Snackbar, ActivityIndicator, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

function AdoptantesList() {
  interface Adoptante {
    id: number;
    nombre: string;
    email: string;
    direccion: string;
    telefono: string;
  }

  const [adoptantes, setAdoptantes] = useState<Adoptante[]>([]);
  const [loading, setLoading] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchAdoptantes();
  }, []);
      setError('Error al cargar la lista de adoptantes.');
  const fetchAdoptantes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/adoptantes`);
      setAdoptantes(res.data);
    } catch (error) {
      console.error('Error al obtener adoptantes', error);
      setError('Error al cargar la lista de adoptantes.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    setEliminandoId(id);
    try {
      await axios.delete(`${API_BASE_URL}/adoptantes/${id}`);
      setAdoptantes(adoptantes.filter((adoptante) => adoptante.id !== id));
    } catch (error) {
      console.error('Error al eliminar adoptante', error);
      setError('Error al eliminar el adoptante. Inténtalo nuevamente.');
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        adoptantes.map((adoptante) => (
          <Card key={adoptante.id} style={styles.card}>
            <Card.Title title={adoptante.nombre} subtitle={`Correo: ${adoptante.email}`} />
            <Card.Content>
              <Text>Dirección: {adoptante.direccion}</Text>
              <Text>Teléfono: {adoptante.telefono}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => handleEliminar(adoptante.id)}
                loading={eliminandoId === adoptante.id}
                disabled={eliminandoId === adoptante.id}
              >
                Eliminar
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('DetalleAdoptante', { id: adoptante.id })}
              >
                Detalles
              </Button>
            </Card.Actions>
          </Card>
        ))
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
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 16,
  },
});

export default AdoptantesList;
