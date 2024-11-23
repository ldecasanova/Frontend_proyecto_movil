
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Snackbar, ActivityIndicator, Text } from 'react-native-paper';
import axios from 'axios';

const DeleteAnimal = () => {
  const [animales, setAnimales] = useState<{ id: number; nombre: string; especie: string; edad: number; estadoSalud: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  useEffect(() => {
    fetchAnimales();
  }, []);

  const fetchAnimales = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://192.168.1.43:8080/api/animales');
      setAnimales(res.data);
    } catch (error) {
      console.error('Error al obtener animales', error);
      setError('Error al obtener la lista de animales.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    setEliminandoId(id);
    try {
      await axios.delete(`http://localhost:8080/api/animales/${id}`);
      setAnimales(animales.filter((animal) => animal.id !== id));
    } catch (error) {
      console.error('Error al eliminar animal', error);
      setError('Error al eliminar el animal. Inténtalo nuevamente.');
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        animales.map((animal) => (
          <Card key={animal.id} style={styles.card}>
            <Card.Title title={animal.nombre} subtitle={`Especie: ${animal.especie}`} />
            <Card.Content>
              <Text>Edad: {animal.edad}</Text>
              <Text>Estado de salud: {animal.estadoSalud}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => handleEliminar(animal.id)}
                loading={eliminandoId === animal.id}
                disabled={eliminandoId === animal.id}
              >
                Eliminar
              </Button>
            </Card.Actions>
          </Card>
        ))
      )}
      <Snackbar
        visible={error !== ''}
        onDismiss={() => setError('')}
        action={{ label: 'OK', onPress: () => setError('') }}
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
});

export default DeleteAnimal;
