
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Text, List, TextInput, Button, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { format } from 'date-fns';

interface RouteParams {
  params: {
    id: string;
  };
}

interface Navigation {
  navigate: (screen: string, params?: any) => void;
}

interface Vacuna {
  nombre: string;
  fechaAplicacion: string;
}

const VacunasAnimal = ({ route, navigation }: { route: RouteParams; navigation: Navigation }) => {
  const { id } = route.params;
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [nombreSeleccionado, setNombreSeleccionado] = useState('Vacuna Común');
  const [nombrePersonalizado, setNombrePersonalizado] = useState('');
  const [fechaAplicacion, setFechaAplicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const fetchVacunas = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/vacunas/animal/${id}`);
        setVacunas(res.data);
      } catch (error) {
        console.error('Error al obtener vacunas', error);
        setError('Error al cargar las vacunas del animal.');
      } finally {
        setLoading(false);
      }
    };

    fetchVacunas();
  }, [id]);

  const handleAgregarVacuna = async () => {
    if (!nombreSeleccionado || !fechaAplicacion) {
      setError('El nombre y la fecha de la vacuna son obligatorios.');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/vacunas`, {
        nombre: nombreSeleccionado === 'Personalizado' ? nombrePersonalizado : nombreSeleccionado,
        fechaAplicacion,
        animalId: id,
      });
      setVacunas([...vacunas, { nombre: nombreSeleccionado, fechaAplicacion }]);
      setNombrePersonalizado('');
      setFechaAplicacion('');
    } catch (error) {
      console.error('Error al agregar vacuna', error);
      setError('Error al agregar la vacuna. Inténtelo nuevamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Card style={styles.card}>
            <Card.Title title="Vacunas Registradas" />
            <Card.Content>
              {vacunas.length > 0 ? (
                vacunas.map((vacuna, index) => (
                  <List.Item
                    key={index}
                    title={vacuna.nombre}
                    description={`Fecha: ${format(new Date(vacuna.fechaAplicacion), 'yyyy-MM-dd')}`}
                  />
                ))
              ) : (
                <Text>No hay vacunas registradas.</Text>
              )}
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Title title="Registrar Nueva Vacuna" />
            <Card.Content>
              <TextInput
                label="Nombre de la Vacuna"
                value={nombreSeleccionado === 'Personalizado' ? nombrePersonalizado : nombreSeleccionado}
                onChangeText={
                  nombreSeleccionado === 'Personalizado'
                    ? setNombrePersonalizado
                    : setNombreSeleccionado
                }
                style={styles.input}
              />
              <TextInput
                label="Fecha de Aplicación"
                value={fechaAplicacion}
                onChangeText={setFechaAplicacion}
                placeholder="YYYY-MM-DD"
                style={styles.input}
              />
              <Button mode="contained" onPress={handleAgregarVacuna} style={styles.button}>
                Agregar Vacuna
              </Button>
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
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default VacunasAnimal;
