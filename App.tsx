
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';

// Importar componentes adaptados
import Dashboard from './src/components/Dashboard_Adapted';
import AdoptantesList from './src/components/AdoptantesList_Adapted';
import RegistrarAnimal from './src/components/RegistrarAnimal_Adapted';
import AgendarCita from './src/components/AgendarCitas_Adapted';
import Perfil from './src/components/Perfil_Adapted';
import Logout from './src/components/Logout_Adapted';
import CalendarioCitas from './src/components/CalendarioCitas_Adapted';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Dashboard" component={Dashboard} />
          <Tab.Screen name="Adoptantes" component={AdoptantesList} />
          <Tab.Screen name="Registrar Animal" component={RegistrarAnimal} />
          <Tab.Screen name="Calendario" component={CalendarioCitas} />
          <Tab.Screen name="Perfil" component={Perfil} />
          <Tab.Screen name="Cerrar Sesión" component={Logout} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}