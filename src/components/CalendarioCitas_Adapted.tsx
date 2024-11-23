// src/components/CalendarioCitas.tsx

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { State } from 'react-native-gesture-handler';

interface Adoptante {
  id: number;
  nombre: string;
}

interface Animal {
  id: number;
  nombre: string;
  adoptante: Adoptante;
}

interface Cita {
  id: number;
  animalId: number;
  fechaCita: string;
  motivo: string;
  veterinario: string;
  animal?: Animal;
}

type RootStackParamList = {
  DetallesCita: { citaId: number };
  // Agrega otras rutas aquí si es necesario
};

// Definimos nuestra propia interfaz para los eventos
interface MyEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  data?: Cita;
}

const CalendarioCitas = () => {
  const [eventos, setEventos] = useState<MyEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await axios.get<Cita[]>('http://192.168.1.43:8080/api/citas');
        console.log('Citas recibidas:', res.data);

        if (Array.isArray(res.data)) {
          // Obtener los animales asociados a las citas
          const citasConAnimales = await Promise.all(
            res.data.map(async (cita) => {
              try {
                const animalRes = await axios.get<Animal>(
                  `http://192.168.1.43:8080/${cita.animalId}`
                );
                const animal = animalRes.data;
                return { ...cita, animal };
              } catch (error) {
                console.error(
                  `Error al obtener el animal para la cita con ID ${cita.id}:`,
                  error
                );
                return cita; // Devolvemos la cita sin el animal
              }
            })
          );

          const eventosCitas: MyEvent[] = citasConAnimales.map((cita: Cita) => {
            const startDate = new Date(cita.fechaCita);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Duración de 1 hora

            // Obtener el nombre del adoptante o del animal
            const nombreUsuario = cita.animal?.adoptante?.nombre || 'Sin nombre';

            return {
              id: cita.id.toString(),
              title: `${nombreUsuario} - ${cita.motivo}`,
              start: startDate,
              end: endDate,
              data: cita, // Adjuntamos la cita completa para usarla luego
            };
          });

          setEventos(eventosCitas);
          console.log('Eventos para el calendario:', eventosCitas);
        } else {
          console.error('La respuesta no es un array:', res.data);
          setError('Error al obtener citas: respuesta inválida del servidor.');
        }
      } catch (error) {
        console.error('Error al obtener citas:', error);
        setError('Error al obtener citas. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchCitas();
  }, []);

  const handleSelectEvent = (event: MyEvent) => {
    const citaId = parseInt(event.id, 10);
    navigation.navigate('DetallesCita', { citaId });
  };

  const { height } = Dimensions.get('window');
  const CALENDAR_HEIGHT = height * 0.6; // Ajusta este valor según tus necesidades

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando citas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendario de Citas</Text>
      <Calendar
        events={eventos}
        height={CALENDAR_HEIGHT}
        mode="month"
        locale="es"
        onPressEvent={handleSelectEvent}
        swipeEnabled={true}
        weekStartsOn={1} // Para que la semana comience en lunes
        showTime={false} // Oculta las horas en la vista de mes
        // Puedes añadir más props según tus necesidades
      />
    </View>
  );
};

export default CalendarioCitas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#4CAF50',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 18,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    textAlign: 'center',
  },
});
