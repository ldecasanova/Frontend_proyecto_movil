// navigation.d.ts
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  DetalleCitas: { id: string };
  EditarCitas: { id: string };
  // Add other routes here
};

type EditarCitasScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditarCitas'
>;

type EditarCitasScreenRouteProp = RouteProp<RootStackParamList, 'EditarCitas'>;

export type EditarCitasProps = {
  navigation: EditarCitasScreenNavigationProp;
  route: EditarCitasScreenRouteProp;
};