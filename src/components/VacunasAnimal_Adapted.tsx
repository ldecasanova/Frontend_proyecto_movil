// src/components/VacunasAnimal.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Card, Text, Button, Snackbar, TextInput, HelperText } from 'react-native-paper';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { format, parseISO } from 'date-fns';
import { Picker } from '@react-native-picker/picker'; // Asegúrate de instalar esta librería

type RootStackParamList = {
  VacunasAnimal: { animalId: string };
  // Agrega otras rutas aquí si es necesario
};

type VacunasAnimalRouteProp = RouteProp<RootStackParamList, 'VacunasAnimal'>;

interface Vacuna {
  id: number;
  nombre: string;
  fechaAplicacion: string;
  proximaAplicacion?: string;
  veterinario: string;
  animalId: number;
}

const VacunasAnimal = ({ route }: { route: VacunasAnimalRouteProp }) => {
  const { animalId } = route.params;
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [agregando, setAgregando] = useState<boolean>(false);
  const [eliminando, setEliminando] = useState<number | null>(null);

  // Estados para el formulario de agregar vacuna
  const [nombreSeleccionado, setNombreSeleccionado] = useState<string>('Vacuna Común');
  const [nombrePersonalizado, setNombrePersonalizado] = useState<string>('');
  const [fechaAplicacion, setFechaAplicacion] = useState<string>('');

  const navigation = useNavigation();

  const API_BASE_URL =
    Platform.OS === 'android' ? 'http://192.168.1.43:8080/api' : 'http://localhost:8080/api';

  const ref = React.createRef();
  
  useEffect(() => {
    const fetchVacunas = async () => {
      setLoading(true);
      try {
        if (!animalId || isNaN(Number(animalId))) {
          throw new Error('ID de animal inválido.');
        }
        const res = await axios.get<Vacuna[]>(`${API_BASE_URL}/animales/${animalId}/vacunas`);
        setVacunas(res.data);
      } catch (error) {
        console.error('Error al obtener vacunas', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Error al obtener vacunas.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVacunas();
  }, [animalId]);

  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0];
    setFechaAplicacion(hoy);
  }, []);

  const handleAgregarVacuna = async () => {
    // Validaciones
    if (
      !nombreSeleccionado ||
      (nombreSeleccionado === 'Otra' && !nombrePersonalizado.trim()) ||
      !fechaAplicacion
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor, complete todos los campos.',
      });
      return;
    }

    const fechaSeleccionada = new Date(fechaAplicacion);
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    if (fechaSeleccionada > ahora) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'La fecha de aplicación no puede ser una fecha futura.',
      });
      return;
    }

    setAgregando(true);
    try {
      const nombreFinal =
        nombreSeleccionado === 'Otra' ? nombrePersonalizado.trim() : nombreSeleccionado;

      const nuevaVacuna = {
        nombre: nombreFinal,
        fechaAplicacion,
        animalId: parseInt(animalId, 10),
      };

      const res = await axios.post<Vacuna>(`${API_BASE_URL}/vacunas`, nuevaVacuna);
      setVacunas([...vacunas, res.data]);

      // Resetear campos del formulario
      setNombreSeleccionado('Vacuna Común');
      setNombrePersonalizado('');
      setFechaAplicacion(new Date().toISOString().split('T')[0]);

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Vacuna agregada exitosamente.',
      });
    } catch (error) {
      console.error('Error al agregar la vacuna', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al agregar la vacuna.',
      });
    } finally {
      setAgregando(false);
    }
  };

  const handleEliminarVacuna = (vacunaId: number) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar esta vacuna?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setEliminando(vacunaId);
            try {
              await axios.delete(`${API_BASE_URL}/vacunas/${vacunaId}`);
              setVacunas(vacunas.filter((vacuna) => vacuna.id !== vacunaId));
              Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Vacuna eliminada exitosamente.',
              });
            } catch (error) {
              console.error('Error al eliminar la vacuna', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al eliminar la vacuna.',
              });
            } finally {
              setEliminando(null);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const opcionesNombre = ['Vacuna Común', 'Vacuna Triple Viral', 'Vacuna Anti-Rabia', 'Otra'];

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Cargando vacunas...</Text>
        </View>
      ) : (
        <ScrollView>
          {/* Formulario para agregar nueva vacuna */}
          <Card style={styles.formCard}>
            <Card.Title title="Agregar Nueva Vacuna" />
            <Card.Content>
              {/* Selección de nombre de vacuna */}
              <Text style={styles.label}>Nombre de la Vacuna</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={nombreSeleccionado}
                  onValueChange={(itemValue) => setNombreSeleccionado(itemValue)}
                  style={styles.picker}
                >
                  {opcionesNombre.map((opcion) => (
                    <Picker.Item label={opcion} value={opcion} key={opcion} />
                  ))}
                </Picker>
              </View>

              {/* Si el nombre seleccionado es 'Otra', mostrar un campo de texto adicional */}
              {nombreSeleccionado === 'Otra' && (
                <>
                  <TextInput
                    label="Nombre Personalizado"
                    mode="outlined"
                    value={nombrePersonalizado}
                    onChangeText={(text) => setNombrePersonalizado(text)}
                    style={styles.input}
                    placeholder="Escribe el nombre de la vacuna"
                  />
                  <HelperText type="error" visible={!nombrePersonalizado.trim()}>
                    Este campo es obligatorio.
                  </HelperText>
                </>
              )}

              {/* Fecha de aplicación */}
              <TextInput
                label="Fecha de Aplicación"
                mode="outlined"
                value={fechaAplicacion}
                onChangeText={(text) => setFechaAplicacion(text)}
                style={styles.input}
                placeholder="Selecciona la fecha de aplicación"
                keyboardType="default"
              />
              <HelperText type="error" visible={!fechaAplicacion}>
                Este campo es obligatorio.
              </HelperText>

              {/* Botón para agregar vacuna */}
              <Button
                mode="contained"
                onPress={handleAgregarVacuna}
                loading={agregando}
                disabled={agregando}
                style={styles.button}
              >
                {agregando ? 'Agregando...' : 'Agregar Vacuna'}
              </Button>
            </Card.Content>
          </Card>

          {/* Lista de vacunas */}
          <Text style={styles.listTitle}>Lista de Vacunas</Text>
          {vacunas.length === 0 ? (
            <Text style={styles.noDataText}>Este animal no tiene vacunas registradas.</Text>
          ) : (
            vacunas.map((vacuna) => (
              <Card key={vacuna.id} style={styles.card}>
                <Card.Title
                  title={vacuna.nombre}
                  subtitle={`Veterinario: ${vacuna.veterinario}`}
                />
                <Card.Content>
                  <Text>
                    <Text style={styles.boldText}>Fecha de Aplicación: </Text>
                    {format(parseISO(vacuna.fechaAplicacion), 'dd/MM/yyyy')}
                  </Text>
                  {vacuna.proximaAplicacion && (
                    <Text>
                      <Text style={styles.boldText}>Próxima Aplicación: </Text>
                      {format(parseISO(vacuna.proximaAplicacion), 'dd/MM/yyyy')}
                    </Text>
                  )}
                </Card.Content>
                <Card.Actions>
                  <Button
                    mode="outlined"
                    onPress={() => handleEliminarVacuna(vacuna.id)}
                    loading={eliminando === vacuna.id}
                    disabled={eliminando === vacuna.id}
                  >
                    {eliminando === vacuna.id ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                </Card.Actions>
              </Card>
            ))
          )}
        </ScrollView>
      )}
      {/* Toast Notifications */}
      <Toast />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formCard: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  card: {
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default VacunasAnimal;
