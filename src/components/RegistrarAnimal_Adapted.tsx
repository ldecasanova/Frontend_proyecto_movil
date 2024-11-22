
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Card, Snackbar, Dropdown } from 'react-native-paper';
import axios from 'axios';

const RegisterAnimal = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [edad, setEdad] = useState('');
  const [unidadEdad, setUnidadEdad] = useState('años');
  const [estadoSalud, setEstadoSalud] = useState('');
  const [adoptanteId, setAdoptanteId] = useState('');
  const [adoptantes, setAdoptantes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdoptantes = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/adoptantes');
        setAdoptantes(res.data);
      } catch (error) {
        console.error('Error al obtener adoptantes', error);
        setError('Error al obtener adoptantes.');
      }
    };
    fetchAdoptantes();
  }, []);

  const handleRegister = async () => {
    if (!nombre || !especie || !edad || !estadoSalud || !adoptanteId) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/animales', {
        nombre,
        especie,
        edad,
        unidadEdad,
        estadoSalud,
        adoptanteId,
      });
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error al registrar animal', error);
      setError('Error al registrar el animal.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Registrar Animal" />
        <Card.Content>
          <TextInput
            label="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
          <TextInput
            label="Especie"
            value={especie}
            onChangeText={setEspecie}
            style={styles.input}
          />
          <TextInput
            label="Edad"
            value={edad}
            onChangeText={setEdad}
            keyboardType="numeric"
            style={styles.input}
          />
          <Dropdown
            label="Unidad de Edad"
            value={unidadEdad}
            onValueChange={setUnidadEdad}
            data={[
              { value: 'años', label: 'Años' },
              { value: 'meses', label: 'Meses' },
            ]}
            style={styles.input}
          />
          <TextInput
            label="Estado de Salud"
            value={estadoSalud}
            onChangeText={setEstadoSalud}
            style={styles.input}
          />
          <Dropdown
            label="Adoptante"
            value={adoptanteId}
            onValueChange={setAdoptanteId}
            data={adoptantes.map((adoptante) => ({
              value: adoptante.id,
              label: adoptante.nombre,
            }))}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            Registrar
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

export default RegisterAnimal;
