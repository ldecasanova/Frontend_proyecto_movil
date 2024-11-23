// App.tsx

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Alert, StyleSheet, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // Importar Toast

// Importar iconos
import Ionicons from 'react-native-vector-icons/Ionicons';

// Importar componentes adaptados
import Dashboard from './src/components/Dashboard_Adapted';
import AdoptantesList from './src/components/AdoptantesList_Adapted';
import RegistrarAnimal from './src/components/RegistrarAnimal_Adapted';
import AgendarCita from './src/components/AgendarCitas_Adapted';
import Perfil from './src/components/Perfil_Adapted';
import Logout from './src/components/Logout_Adapted';
import CalendarioCitas from './src/components/CalendarioCitas_Adapted';
import Login from './src/components/Auth/Login_Adapted';
import Register from './src/components/Auth/Register_Adapted';

// Importar pantallas adicionales
import DetallesCita from './src/components/DetalleCitas_Adapted';
import VacunasAnimal from './src/components/VacunasAnimal_Adapted';
import EditarAnimal from './src/components/EditAnimal_Adapted';

// Definir tipos para la navegación
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AppTabs: undefined;
  DetallesCita: { citaId: string };
  VacunasAnimal: { animalId: string };
  AgendarCita: { animalId: string };
  EditarAnimal: { animalId: string };
  Logout: undefined;
  // Agrega otras rutas aquí si es necesario
};

// Crear navegadores
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

// Definir Tab Navigator con iconos
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string = '';

        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Adoptantes':
            iconName = focused ? 'people' : 'people-outline';
            break;
          case 'Registrar Animal':
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            break;
          case 'Calendario':
            iconName = focused ? 'calendar' : 'calendar-outline';
            break;
          case 'Perfil':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'ellipse';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={Dashboard} />
    <Tab.Screen name="Adoptantes" component={AdoptantesList} />
    <Tab.Screen name="Registrar Animal" component={RegistrarAnimal} />
    <Tab.Screen name="Calendario" component={CalendarioCitas} />
    <Tab.Screen name="Perfil" component={Perfil} />
    {/* Removemos 'Cerrar Sesión' de las tabs */}
  </Tab.Navigator>
);

// Definir Root Navigator para manejar la autenticación
const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
      } catch (error) {
        console.error('Error al verificar el estado de inicio de sesión', error);
        Alert.alert('Error', 'Ocurrió un error al verificar el estado de inicio de sesión.');
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    // Mostrar indicador de carga mientras se verifica el estado de autenticación
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={userId ? 'AppTabs' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        {/* Rutas de autenticación */}
        {!userId ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : (
          <>
            <Stack.Screen name="AppTabs" component={AppTabs} />
            {/* Rutas adicionales dentro de la aplicación */}
            <Stack.Screen name="DetallesCita" component={DetallesCita} />
            <Stack.Screen name="VacunasAnimal" component={VacunasAnimal} />
            <Stack.Screen name="AgendarCita" component={AgendarCita} />
            <Stack.Screen name="EditarAnimal" component={EditarAnimal} />
            <Stack.Screen name="Logout" component={Logout} />
            {/* Agrega otras pantallas aquí si es necesario */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Definir el componente principal de la aplicación
export default function App() {
  // Ignorar advertencias de LogBox que no son críticas
  useEffect(() => {
    LogBox.ignoreLogs(['Setting a timer']);
  }, []);

  return (
    <PaperProvider>
      <RootNavigator />
      <Toast /> {/* Incluir Toast en el componente raíz */}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
