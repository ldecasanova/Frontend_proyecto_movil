
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

// Importar pantallas adaptadas
import Dashboard from './Dashboard_Adapted';
import AdoptantesList from './AdoptantesList_Adapted';
import RegistrarAnimal from './RegistrarAnimal_Adapted';
import AgendarCita from './AgendarCitas_Adapted';

const Tab = createBottomTabNavigator();

function Layout() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Animales" component={Dashboard} />
          <Tab.Screen name="Usuarios" component={AdoptantesList} />
          <Tab.Screen name="Registrar Animal" component={RegistrarAnimal} />
          <Tab.Screen name="Agendar Cita" component={AgendarCita} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default Layout;
