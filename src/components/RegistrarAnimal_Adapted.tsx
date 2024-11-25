// src/components/RegisterAnimal.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Snackbar,
  Text,
  RadioButton,
} from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Para el ícono similar a FaPaw

type RootStackParamList = {
  Dashboard: undefined;
  // Otras rutas si es necesario
};

interface RegisterAnimalProps {
  navigation: NavigationProp<RootStackParamList, 'Dashboard'>;
}

interface Adoptante {
  id: string;
  nombre: string;
}

const RegisterAnimal: React.FC<RegisterAnimalProps> = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [edad, setEdad] = useState('');
  const [unidadEdad, setUnidadEdad] = useState<'años' | 'meses'>('años');
  const [estadoSalud, setEstadoSalud] = useState('');
  const [genero, setGenero] = useState<'Macho' | 'Hembra'>('Macho');
  const [adoptanteId, setAdoptanteId] = useState('');

  const [adoptantes, setAdoptantes] = useState<Adoptante[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Reemplaza '192.168.x.x' con la dirección IP real de tu máquina de desarrollo
  const API_BASE_URL = 'http://192.168.1.43:8080/api'; // <--- Actualiza esta línea

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
    // Validaciones
    if (!nombre || !especie || !edad || !estadoSalud || !genero || !adoptanteId) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (isNaN(Number(edad)) || Number(edad) <= 0) {
      setError('La edad debe ser un número positivo.');
      return;
    }

    setLoading(true);
    try {
      const animalData = {
        nombre,
        especie,
        edad: parseInt(edad, 10),
        unidadEdad,
        estadoSalud,
        genero,
        adoptanteId,
      };

      await axios.post(`${API_BASE_URL}/animales`, animalData);
      Alert.alert('Éxito', 'Animal registrado exitosamente.', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
      ]);
    } catch (error) {
      console.error('Error al registrar animal', error);
      setError('Error al registrar el animal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado con Ícono */}
      <View style={styles.header}>
        <Icon name="paw" size={40} color="#16A34A" />
        <Text style={styles.headerText}>Registrar Nuevo Animal</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          {/* Nombre del animal */}
          <TextInput
            label="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            mode="outlined"
          />

          {/* Especie del animal */}
          <TextInput
            label="Especie"
            value={especie}
            onChangeText={setEspecie}
            style={styles.input}
            mode="outlined"
          />

          {/* Edad del animal */}
          <TextInput
            label="Edad"
            value={edad}
            onChangeText={setEdad}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />

          {/* Unidad de Edad - Radio Buttons */}
          <View style={styles.radioGroup}>
            <Text style={styles.radioLabel}>Unidad de Edad:</Text>
            <RadioButton.Group
              onValueChange={(value) => setUnidadEdad(value as 'años' | 'meses')}
              value={unidadEdad}
            >
              <View style={styles.radioButton}>
                <RadioButton value="años" />
                <Text style={styles.radioText}>Años</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="meses" />
                <Text style={styles.radioText}>Meses</Text>
              </View>
            </RadioButton.Group>
          </View>

          {/* Género - Radio Buttons */}
          <View style={styles.radioGroup}>
            <Text style={styles.radioLabel}>Género:</Text>
            <RadioButton.Group
              onValueChange={(value) => setGenero(value as 'Macho' | 'Hembra')}
              value={genero}
            >
              <View style={styles.radioButton}>
                <RadioButton value="Macho" />
                <Text style={styles.radioText}>Macho</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="Hembra" />
                <Text style={styles.radioText}>Hembra</Text>
              </View>
            </RadioButton.Group>
          </View>

          {/* Estado de Salud */}
          <TextInput
            label="Estado de Salud"
            value={estadoSalud}
            onChangeText={setEstadoSalud}
            style={styles.input}
            mode="outlined"
          />

          {/* Adoptante - Dropdown Picker */}
          <Text style={styles.dropdownLabel}>Adoptante:</Text>
          <RadioButton.Group
            onValueChange={(value) => setAdoptanteId(value)}
            value={adoptanteId}
          >
            <View style={styles.dropdownContainer}>
              {adoptantes.map((adoptante) => (
                <View key={adoptante.id} style={styles.radioButton}>
                  <RadioButton value={adoptante.id} />
                  <Text style={styles.radioText}>
                    {adoptante.nombre} (ID: {adoptante.id})
                  </Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>

      {/* Botón de Registro */}
      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Registrar
      </Button>

      {/* Indicador de Carga */}
      {loading && <ActivityIndicator size="large" style={styles.loading} color="#2563EB" />}

      {/* Snackbar para Errores */}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setError(null),
        }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16A34A',
    marginLeft: 8,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioText: {
    fontSize: 16,
    color: '#374151',
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  loading: {
    marginTop: 16,
  },
});

export default RegisterAnimal;
