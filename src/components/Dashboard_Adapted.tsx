import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Text, List, Snackbar } from 'react-native-paper';
import axios from 'axios';

interface Animal {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  unidadEdad: string;
  estadoSalud: string;
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
        const res = await axios.get<Animal[]>('http://localhost:8080/api/animales');
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

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView>
          {animales.map((animal) => (
            <Card key={animal.id} style={styles.card}>
              <Card.Title title={animal.nombre} subtitle={`Especie: ${animal.especie}`} />
              <Card.Content>
                <Text>Edad: {animal.edad} {animal.unidadEdad}</Text>
                <Text>Estado de salud: {animal.estadoSalud}</Text>
                <Text>ID Adoptante: {animal.adoptanteId}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        action={{ label: 'OK', onPress: () => setError(null) }}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 16,
  },
});

export default Dashboard;
