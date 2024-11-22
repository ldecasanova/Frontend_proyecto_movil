
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Snackbar, Card, Menu } from 'react-native-paper';
import axios from 'axios';

const AgendarCita = ({ route, navigation }: { route: any, navigation: any }) => {
  const { id } = route.params || {};
  const [animalId, setAnimalId] = useState(id || '');
  const [fechaCita, setFechaCita] = useState('');
  const [motivo, setMotivo] = useState('');
  const [veterinario, setVeterinario] = useState('');
  const [animales, setAnimales] = useState<{ id: string, nombre: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/animales');
        setAnimales(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de animales', error);
        setError('Error al cargar la lista de animales.');
      }
    };

    fetchAnimales();
  }, []);

  const handleAgendarCita = async () => {
    if (!animalId || !fechaCita || !motivo || !veterinario) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/citas', {
        animalId,
        fechaCita,
        motivo,
        veterinario,
      });
      navigation.navigate('HistorialAnimal', { id: animalId });
    } catch (error) {
      console.error('Error al agendar la cita', error);
      setError('Error al agendar la cita. Inténtalo nuevamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Agendar Cita" />
        <Card.Content>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button onPress={() => setMenuVisible(true)}>
                {animalId ? animales.find(animal => animal.id === animalId)?.nombre : 'Seleccionar Animal'}
              </Button>
            }
          >
            {animales.map((animal) => (
              <Menu.Item
                key={animal.id}
                onPress={() => {
                  setAnimalId(animal.id);
                  setMenuVisible(false);
                }}
                title={animal.nombre}
              />
            ))}
          </Menu>
          <TextInput
            label="Fecha de la Cita"
            value={fechaCita}
            onChangeText={setFechaCita}
            placeholder="YYYY-MM-DD"
            style={styles.input}
          />
          <TextInput
            label="Motivo"
            value={motivo}
            onChangeText={setMotivo}
            style={styles.input}
          />
          <TextInput
            label="Veterinario"
            value={veterinario}
            onChangeText={setVeterinario}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAgendarCita} style={styles.button}>
            Agendar Cita
          </Button>
        </Card.Content>
      </Card>
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

export default AgendarCita;
