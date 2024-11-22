
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Snackbar, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const AgregarAdoptante = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const handleAgregar = async () => {
    if (!nombre || !email || !direccion || !telefono) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/adoptantes', {
        nombre,
        email,
        direccion,
        telefono,
      });
      navigation.navigate('AdoptantesList' as never);
    } catch (error) {
      console.error('Error al agregar adoptante', error);
      setError('Error al agregar el adoptante. Inténtalo nuevamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Agregar Adoptante" />
        <Card.Content>
          <TextInput
            label="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
          <TextInput
            label="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            label="Dirección"
            value={direccion}
            onChangeText={setDireccion}
            style={styles.input}
          />
          <TextInput
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAgregar} style={styles.button}>
            Agregar Adoptante
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

export default AgregarAdoptante;
