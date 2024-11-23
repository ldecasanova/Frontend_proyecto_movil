// src/components/CalendarioCitas.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
// Eliminamos la importación de 'Event' ya que no es necesaria
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { Text } from 'react-native-paper';

// Definición de interfaces para los datos
interface Adoptante {
  id: number;
  nombre: string;
}

interface Animal {
  id: number;
  nombre: string;
  adoptante?: Adoptante;
}

interface Cita {
  id: number;
  animalId: number;
  fechaCita: string;
  motivo: string;
  veterinario: string;
  animal?: Animal;
}

// Definición de las rutas de navegación
type RootStackParamList = {
  DetallesCita: { citaId: string };
  // Agrega otras rutas aquí si es necesario
};

// Definimos nuestro propio tipo de evento
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
        console.log('Respuesta completa:', res);

        if (Array.isArray(res.data)) {
          console.log('Citas recibidas:', res.data);

          const eventosCitas: MyEvent[] = res.data.map((cita: Cita) => {
            const startDate = new Date(cita.fechaCita);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Duración de 1 hora

            // Obtener el nombre del adoptante o del animal
            const nombreAdoptante = cita.animal?.adoptante?.nombre;
            const nombreAnimal = cita.animal?.nombre;
            const nombreMostrar = nombreAdoptante || nombreAnimal || 'Sin nombre';

            return {
              id: cita.id.toString(), // El id debe ser una cadena
              title: `${nombreMostrar} - ${cita.motivo}`,
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

  const handlePressEvent = (event: MyEvent) => {
    const citaId = event.id;
    // Navegar a la pantalla de detalles de la cita
    navigation.navigate('DetallesCita', { citaId });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando citas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar
        events={eventos}
        height={600}
        mode="month" // Puedes cambiar a 'week' o 'day'
        onPressEvent={handlePressEvent}
        locale="es"
        swipeEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarioCitas;
