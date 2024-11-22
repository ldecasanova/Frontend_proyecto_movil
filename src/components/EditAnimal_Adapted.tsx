
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Snackbar, Card } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Dropdown } from 'react-native-paper-dropdown';

const EditAnimal = () => {
  const route = useRoute<{ key: string; name: string; params: { id: string } }>();
  const navigation = useNavigation();
  const { id } = route.params;

  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [edad, setEdad] = useState('');
  const [unidadEdad, setUnidadEdad] = useState('años');
  const [estadoSalud, setEstadoSalud] = useState('');
  const [adoptanteId, setAdoptanteId] = useState('');
  const [adoptantes, setAdoptantes] = useState<{ id: string; nombre: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const animalRes = await axios.get(`http://localhost:8080/api/animales/${id}`);
        const { nombre, especie, edad, unidadEdad, estadoSalud, adoptanteId } = animalRes.data;
        setNombre(nombre);
        setEspecie(especie);
        setEdad(edad.toString());
        setUnidadEdad(unidadEdad);
        setEstadoSalud(estadoSalud);
        setAdoptanteId(adoptanteId);
        const adoptantesRes = await axios.get('http://localhost:8080/api/adoptantes');
        setAdoptantes(adoptantesRes.data);
      } catch (error) {
        console.error('Error al obtener datos del animal', error);
        setError('Error al cargar los datos del animal.');
      }
    };

    fetchAnimalData();
  }, [id]);

  const handleGuardarCambios = async () => {
    if (!nombre || !especie || !edad || !estadoSalud || !adoptanteId) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    try {
      await axios.put(`http://localhost:8080/api/animales/${id}`, {
        nombre,
        especie,
        edad: parseInt(edad, 10),
        unidadEdad,
        estadoSalud,
        adoptanteId,
      });
      navigation.navigate('Dashboard' as never);
    } catch (error) {
      console.error('Error al actualizar datos del animal', error);
      setError('Error al guardar los cambios. Inténtalo nuevamente.');
    }
  };

  return (
    <><ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Editar Animal" />
        <Card.Content>
          <TextInput
            label="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input} />
          <TextInput
            label="Especie"
            value={especie}
            onChangeText={setEspecie}
            style={styles.input} />
          <TextInput
            label="Edad"
            value={edad}
            onChangeText={setEdad}
            keyboardType="numeric"
            style={styles.input} />
          <Picker
            selectedValue={unidadEdad}
            onValueChange={(itemValue) => setUnidadEdad(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Años" value="años" />
            <Picker.Item label="Meses" value="meses" />
          </Picker>
          /
          <TextInput
            label="Estado de Salud"
            value={estadoSalud}
            onChangeText={setEstadoSalud}
            style={styles.input} />
          <Picker
            selectedValue={adoptanteId}
            onValueChange={(itemValue) => setAdoptanteId(itemValue)}
            style={styles.input}
          >
            {adoptantes.map((adoptante) => (
              <Picker.Item key={adoptante.id} label={adoptante.nombre} value={adoptante.id} />
            ))}
          </Picker>
          <Button mode="contained" onPress={handleGuardarCambios} style={styles.button}>
            Guardar Cambios
          </Button>
        </Card.Content>
      </Card>
    </ScrollView><Snackbar
      visible={!!error}
      onDismiss={() => setError(null)}
      action={{ label: 'OK', onPress: () => setError(null) }}
    >
        {error}
      </Snackbar></>
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

export default EditAnimal;
