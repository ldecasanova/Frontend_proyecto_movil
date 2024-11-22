// src/components/RegisterAnimal.tsx

import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Card, Snackbar, ActivityIndicator, Text } from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';

type RootStackParamList = {
  RegisterAnimal: undefined;
  Dashboard: undefined;
};

interface RegisterAnimalProps {
  navigation: NavigationProp<RootStackParamList, 'RegisterAnimal'>;
}

const RegisterAnimal: React.FC<RegisterAnimalProps> = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [edad, setEdad] = useState('');
  const [unidadEdad, setUnidadEdad] = useState('');
  const [estadoSalud, setEstadoSalud] = useState('');
  const [adoptanteId, setAdoptanteId] = useState('');

  interface Adoptante {
    id: string;
    nombre: string;
  }

  const [adoptantes, setAdoptantes] = useState<Adoptante[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Estados para manejar la visibilidad de los Dropdown
  const [showDropDownUnidadEdad, setShowDropDownUnidadEdad] = useState(false);
  const [showDropDownAdoptante, setShowDropDownAdoptante] = useState(false);

  // Reemplaza '192.168.x.x' con la dirección IP real de tu máquina de desarrollo
  const API_BASE_URL = 'http://192.168.x.x:8080/api'; // <--- Actualiza esta línea

  useEffect(() => {
    const fetchAdoptantes = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Adoptante[]>(`${API_BASE_URL}/adoptantes`);
        setAdoptantes(res.data);
      } catch (error) {
        console.error('Error al obtener adoptantes', error);
        setError('Error al obtener adoptantes.');
      } finally {
        setLoading(false);
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
      await axios.post(`${API_BASE_URL}/animales`, {
        nombre,
        especie,
        edad: parseInt(edad, 10), // Asegúrate de enviar un número si es necesario
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
          {/* Dropdown para Unidad de Edad */}
          <DropDownPicker
            open={showDropDownUnidadEdad}
            setOpen={setShowDropDownUnidadEdad}
            value={unidadEdad}
            setValue={setUnidadEdad}
            items={[
              { label: 'Años', value: 'años' },
              { label: 'Meses', value: 'meses' },
            ]}
            style={styles.input}
          />
          <TextInput
            label="Estado de Salud"
            value={estadoSalud}
            onChangeText={setEstadoSalud}
            style={styles.input}
          />
          {/* Dropdown para Adoptante */}
          <DropDownPicker
            open={showDropDownAdoptante}
            setOpen={setShowDropDownAdoptante}
            value={adoptanteId}
            setValue={setAdoptanteId}
            items={adoptantes.map((adoptante) => ({
              label: adoptante.nombre,
              value: adoptante.id,
            }))}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            Registrar
          </Button>
        </Card.Content>
      </Card>
      {loading && <ActivityIndicator size="large" style={styles.loading} />}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={3000}
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
  loading: {
    marginTop: 16,
  },
});

export default RegisterAnimal;
