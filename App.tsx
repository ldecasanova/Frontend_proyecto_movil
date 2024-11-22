// App.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
// Importar pantallas de autenticación


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={Dashboard} />
    <Tab.Screen name="Adoptantes" component={AdoptantesList} />
    <Tab.Screen name="Registrar Animal" component={RegistrarAnimal} />
    <Tab.Screen name="Calendario" component={CalendarioCitas} />
    <Tab.Screen name="Perfil" component={Perfil} />
    <Tab.Screen name="Cerrar Sesión" component={Logout} />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
  </Stack.Navigator>
);

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
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userId ? (
          <Stack.Screen name="App" component={AppTabs} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <PaperProvider>
      <RootNavigator />
    </PaperProvider>
  );
}
