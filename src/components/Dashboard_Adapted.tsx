// src/components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Card, Text, Button, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { useIsFocused, useNavigation, NavigationProp } from '@react-navigation/native';

// Define tu lista de rutas aquí si es necesario
type RootStackParamList = {
  DetalleCitas: { citaId: string };
  VacunasAnimal: { animalId: string };
  AgendarCita: { animalId: string };
  EditarAnimal: { animalId: string };
  RegistrarAnimal: undefined;
  EliminarAnimal: undefined;
  CalendarioCitas: undefined;
  // Agrega otras rutas aquí si es necesario
};

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

  const isFocused = useIsFocused(); // Hook para detectar si la pantalla está enfocada
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchAnimales = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Animal[]>('http://192.168.1.43:8080/api/animales'); // Asegúrate de ajustar la URL según tu entorno
        setAnimales(res.data);
      } catch (error) {
        console.error('Error al obtener animales', error);
        setError('Error al obtener animales.');
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchAnimales();
    }
  }, [isFocused]); // El efecto se ejecuta cada vez que cambia isFocused

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Cargando animales...</Text>
        </View>
      ) : (
        <ScrollView>
          {/* Lista de animales */}
          {animales.map((animal) => (
            <Card key={animal.id} style={styles.card}>
              <Card.Title title={animal.nombre} subtitle={`Especie: ${animal.especie}`} />
              <Card.Content>
                <Text style={styles.text}>Edad: {animal.edad} {animal.unidadEdad}</Text>
                <Text style={styles.text}>Estado de salud: {animal.estadoSalud}</Text>
                <Text style={styles.text}>ID Adoptante: {animal.adoptanteId}</Text>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('VacunasAnimal', { animalId: animal.id.toString() })}
                  style={styles.cardButton}
                >
                  Ver Vacunas
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('AgendarCita', { animalId: animal.id.toString() })}
                  style={styles.cardButton}
                >
                  Agendar Cita
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('EditarAnimal', { animalId: animal.id.toString() })}
                  style={styles.cardButton}
                >
                  Editar
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </ScrollView>
      )}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={3000}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
  },
  text: {
    marginBottom: 4,
    fontSize: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  cardButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default Dashboard;
