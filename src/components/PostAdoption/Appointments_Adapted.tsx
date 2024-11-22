
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, List, Snackbar } from 'react-native-paper';
import axios from 'axios';

interface Appointment {
  id: number;
  animalId: number;
  fechaCita: string;
  motivo: string;
  veterinario: string;
}

interface AppointmentsProps {
  navigation: any;
}

const Appointments: React.FC<AppointmentsProps> = ({ navigation }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/citas');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error al obtener las citas', error);
        setError('Error al cargar las citas.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        appointments.map((appointment) => (
          <Card key={appointment.id} style={styles.card}>
            <Card.Title title={`Mascota ID: ${appointment.animalId}`} />
            <Card.Content>
              <List.Item
                title={`Fecha: ${appointment.fechaCita}`}
                description={`Motivo: ${appointment.motivo}
Veterinario: ${appointment.veterinario}`}
              />
            </Card.Content>
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

export default Appointments;
