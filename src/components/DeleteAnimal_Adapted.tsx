
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Snackbar, ActivityIndicator, Text } from 'react-native-paper';
import axios from 'axios';

const DeleteAnimal = () => {
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eliminandoId, setEliminandoId] = useState(null);

  useEffect(() => {
    fetchAnimales();
  }, []);

  const fetchAnimales = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/animales');
      setAnimales(res.data);
    } catch (error) {
      console.error('Error al obtener animales', error);
      setError('Error al obtener la lista de animales.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
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
});

export default DeleteAnimal;
