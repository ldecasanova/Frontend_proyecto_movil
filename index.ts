import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent ensures proper environment setup for Expo
registerRootComponent(App);
