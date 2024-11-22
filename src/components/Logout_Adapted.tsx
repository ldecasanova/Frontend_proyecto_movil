
import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

function Logout() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // 1. Limpiar datos de AsyncStorage
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('nombre');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('direccion');

        // 2. Redirigir al login
        navigation.navigate('Login');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    };

    performLogout();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Logout;
