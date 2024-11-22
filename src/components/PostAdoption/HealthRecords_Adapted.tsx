
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Text, Snackbar } from 'react-native-paper';
import axios from '../../api/axios_Adapted';

function HealthRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await axios.get('/registro-salud');
        setRecords(response.data);
      } catch (error) {
        console.error('Error al obtener los registros de salud', error);
        setError('Error al cargar los registros de salud.');
      } finally {
        setLoading(false);
      }
    };
    fetchHealthRecords();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        records.length > 0 ? (
          records.map((record: { id: number; fechaConsulta: string; descripcion: string; veterinario: string; animalId: number }) => (
            <Card key={record.id} style={styles.card}>
              <Card.Title title={`Consulta: ${record.fechaConsulta}`} />
              <Card.Content>
                <Text>Descripción: {record.descripcion}</Text>
                <Text>Veterinario: {record.veterinario}</Text>
                <Text>Mascota ID: {record.animalId}</Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.noRecords}>No hay registros de salud disponibles.</Text>
        )
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
  noRecords: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default HealthRecords;
