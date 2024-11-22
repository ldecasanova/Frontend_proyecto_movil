
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar, Card } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditarCita = () => {
  type RouteParams = {
    id: string;
    cita: {
      fechaCita: string;
      motivo: string;
      veterinario: string;
      estado: string;
    };
  };

  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation();
  const { id, cita } = route.params;

  const [fechaCita, setFechaCita] = useState(new Date(cita.fechaCita));
  const [motivo, setMotivo] = useState(cita.motivo);
  const [veterinario, setVeterinario] = useState(cita.veterinario);
  const [estado, setEstado] = useState(cita.estado);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActualizarCita = async () => {
    if (!fechaCita || !motivo || !veterinario || !estado) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    try {
      await axios.put(`http://localhost:8080/api/citas/${id}`, {
        fechaCita: fechaCita.toISOString(),
        motivo,
        veterinario,
        estado,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar la cita', error);
      setError('Error al actualizar la cita. Inténtalo nuevamente.');
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFechaCita(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Editar Cita" />
        <Card.Content>
          <Button onPress={() => setShowDatePicker(true)} mode="outlined" style={styles.input}>
            {`Fecha de la Cita: ${fechaCita.toLocaleDateString()} ${fechaCita.toLocaleTimeString()}`}
          </Button>
          {showDatePicker && (
            <DateTimePicker
              value={fechaCita}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
            />
          )}
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
          <TextInput
            label="Estado"
            value={estado}
            onChangeText={setEstado}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleActualizarCita} style={styles.button}>
            Guardar Cambios
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default EditarCita;
