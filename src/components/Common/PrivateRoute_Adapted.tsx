
import React from 'react';
import { useAuth } from '../../contexts/AuthContext_Adapted'; // Ensure this path is correct and the module is properly exported
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { userId } = useAuth();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!userId) {
      navigation.navigate('Login' as never); // Ensure the type matches the expected parameter type
    }
  }, [userId, navigation]);

  if (!userId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}

export default PrivateRoute;
