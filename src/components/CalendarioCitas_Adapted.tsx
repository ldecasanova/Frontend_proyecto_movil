
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card, Text } from 'react-native-paper';
import axios from 'axios';

const CalendarioCitas = () => {
  const [items, setItems] = useState({});

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/citas');
        const citas = res.data;
        const citasFormatted = citas.reduce((acc: { [key: string]: any[] }, cita: any) => {
          const date = cita.fechaCita.split('T')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({
            name: `${cita.animal.nombre} - ${cita.motivo}`,
            veterinario: cita.veterinario,
            time: cita.fechaCita.split('T')[1].slice(0, 5), // Extraer hora
          });
          return acc;
        }, {} as { [key: string]: any[] });
        setItems(citasFormatted);
      } catch (error) {
        console.error('Error al obtener citas', error);
      }
    };
    fetchCitas();
  }, []);

  const renderItem = (item: any) => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>Hora: {item.time}</Text>
          <Text style={styles.subtitle}>Veterinario: {item.veterinario}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <Agenda
      items={items}
      renderItem={renderItem}
      selected={new Date().toISOString().split('T')[0]} // Fecha actual
      theme={{
        agendaDayTextColor: 'black',
        agendaDayNumColor: 'black',
        agendaTodayColor: 'blue',
        agendaKnobColor: 'blue',
      }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
});

export default CalendarioCitas;
