// src/components/AdoptantesList.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, Snackbar, ActivityIndicator, Text } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axios from 'axios';

// 1. Definir RootStackParamList dentro del mismo archivo
type RootStackParamList = {
  AdoptantesList: undefined;
  DetalleAdoptante: { id: number };
  // Añade otras rutas según sea necesario
};

// 2. Tipar useNavigation correctamente
type AdoptantesListNavigationProp = NavigationProp<RootStackParamList, 'AdoptantesList'>;

// 3. Definir el tipo Adoptante
interface Adoptante {
  id: number;
  nombre: string;
  email: string;
  direccion: string;
  telefono: string;
}

const AdoptantesList = () => {
  const navigation = useNavigation<AdoptantesListNavigationProp>();
  const [adoptantes, setAdoptantes] = useState<Adoptante[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 4. Cambiar localhost por la IP de tu máquina de desarrollo
  const API_BASE_URL = 'http://192.168.x.x:8080/api'; // Reemplaza '192.168.x.x' con tu IP real

  useEffect(() => {
    fetchAdoptantes();
  }, []);

  // 5. Definir la función fetchAdoptantes correctamente
  const fetchAdoptantes = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Adoptante[]>(`${API_BASE_URL}/adoptantes`);
      setAdoptantes(res.data);
    } catch (error) {
      console.error('Error al obtener adoptantes', error);
      setError('Error al cargar la lista de adoptantes.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Manejar la eliminación con confirmación
  const handleEliminar = async (id: number) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar este adoptante?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setEliminandoId(id);
            try {
              await axios.delete(`${API_BASE_URL}/adoptantes/${id}`);
              setAdoptantes(adoptantes.filter((adoptante) => adoptante.id !== id));
              setError(null); // Limpiar errores si la eliminación fue exitosa
            } catch (error) {
              console.error('Error al eliminar adoptante', error);
              setError('Error al eliminar el adoptante. Inténtalo nuevamente.');
            } finally {
              setEliminandoId(null);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        adoptantes.map((adoptante) => (
          <Card key={adoptante.id} style={styles.card}>
            <Card.Title title={adoptante.nombre} subtitle={`Correo: ${adoptante.email}`} />
            <Card.Content>
              <Text>Dirección: {adoptante.direccion}</Text>
              <Text>Teléfono: {adoptante.telefono}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => handleEliminar(adoptante.id)}
                loading={eliminandoId === adoptante.id}
                disabled={eliminandoId === adoptante.id}
                style={styles.button}
              >
                {eliminandoId === adoptante.id ? 'Eliminando...' : 'Eliminar'}
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('DetalleAdoptante', { id: adoptante.id })}
                style={styles.button}
              >
                Detalles
              </Button>
            </Card.Actions>
          </Card>
        ))
      )}
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
  button: {
    marginRight: 8,
  },
});

export default AdoptantesList;
