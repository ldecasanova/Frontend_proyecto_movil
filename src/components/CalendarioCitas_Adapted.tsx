// src/components/CalendarioCitas.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import axios from 'axios';
import { Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Para el ícono similar a FaPaw

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

  // Reemplaza '192.168.x.x' con la dirección IP real de tu máquina de desarrollo
  const API_BASE_URL = 'http://192.168.1.43:8080/api'; // <--- Actualiza esta línea

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await axios.get<Cita[]>(`${API_BASE_URL}/citas`);
        console.log('Citas recibidas:', res.data);

        if (Array.isArray(res.data)) {
          // Obtener los animales asociados a las citas
          const citasConAnimales = await Promise.all(
            res.data.map(async (cita) => {
              try {
                const animalRes = await axios.get<Animal>(
                  `${API_BASE_URL}/animales/${cita.animalId}`
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
            const nombreUsuario = cita.animal?.adoptante?.nombre || 'Cita';

            return {
              id: cita.id.toString(),
              title: `${nombreUsuario} - ${cita.motivo}`,
              start: startDate,
              end: endDate,
              data: cita, // Adjuntamos la cita completa para uso futuro si es necesario
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

  // Eliminamos la función de manejar la selección de eventos para evitar navegación
  /*
  const handleSelectEvent = (event: MyEvent) => {
    const citaId = parseInt(event.id, 10);
    navigation.navigate('DetallesCita', { citaId });
  };
  */

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
      {/* Encabezado con Ícono */}
      <View style={styles.header}>
        <Icon name="calendar-alt" size={30} color="#4CAF50" />
        <Text style={styles.title}>Calendario de Citas</Text>
      </View>

      <Calendar
        events={eventos}
        height={CALENDAR_HEIGHT}
        mode="month"
        locale="es"
        // Eliminamos la prop onPressEvent para evitar navegación
        // onPressEvent={handleSelectEvent}
        swipeEnabled={true}
        weekStartsOn={1} // Para que la semana comience en lunes
        showTime={false} // Oculta las horas en la vista de mes
        // Puedes añadir más props según tus necesidades
      />

      {/* Snackbar para Errores */}
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

export default CalendarioCitas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 8,
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
