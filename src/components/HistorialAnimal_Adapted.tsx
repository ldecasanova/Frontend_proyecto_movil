
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Text, List, Snackbar } from 'react-native-paper';
import axios from 'axios';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  HistorialAnimal: { id: string };
};

type HistorialAnimalRouteProp = RouteProp<RootStackParamList, 'HistorialAnimal'>;
type HistorialAnimalNavigationProp = StackNavigationProp<RootStackParamList, 'HistorialAnimal'>;

type Props = {
  route: HistorialAnimalRouteProp;
  navigation: HistorialAnimalNavigationProp;
};

type Animal = {
  id: string;
  nombre: string;
};

type Cita = {
  id: string;
  fechaCita: string;
  motivo: string;
  estado: string;
};

type Vacuna = {
  id: string;
  nombre: string;
  fechaAplicacion: string;
};

const HistorialAnimal = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const fetchHistorial = async () => {
      setLoading(true);
      try {
        const animalRes = await axios.get(`${API_BASE_URL}/animales/${id}`);
        const citasRes = await axios.get(`${API_BASE_URL}/citas/animal/${id}`);
        const vacunasRes = await axios.get(`${API_BASE_URL}/vacunas/animal/${id}`);

        setAnimal(animalRes.data);
        setCitas(citasRes.data);
        setVacunas(vacunasRes.data);
      } catch (error) {
        console.error('Error al obtener el historial del animal', error);
        setError('Error al cargar el historial del animal.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {animal && (
            <Card style={styles.card}>
              <Card.Title title={animal.nombre} subtitle={`ID: ${animal.id}`} />
            </Card>
          )}
          <Card style={styles.card}>
            <Card.Title title="Citas" />
            <Card.Content>
              {citas.length > 0 ? (
                citas.map((cita) => (
                  <List.Item
                    key={cita.id}
                    title={`Fecha: ${cita.fechaCita}`}
                    description={`Motivo: ${cita.motivo}, Estado: ${cita.estado}`}
                  />
                ))
              ) : (
                <Text>No hay citas registradas.</Text>
              )}
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Title title="Vacunas" />
            <Card.Content>
              {vacunas.length > 0 ? (
                vacunas.map((vacuna) => (
                  <List.Item
                    key={vacuna.id}
                    title={`Nombre: ${vacuna.nombre}`}
                    description={`Fecha: ${vacuna.fechaAplicacion}`}
                  />
                ))
              ) : (
                <Text>No hay vacunas registradas.</Text>
              )}
            </Card.Content>
          </Card>
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
});

export default HistorialAnimal;
