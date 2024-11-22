
import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const NavBar = () => {
  const navigation = useNavigation();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'dashboard', title: 'Animales', icon: 'paw' },
    { key: 'adoptantes', title: 'Adoptantes', icon: 'account-group' },
    { key: 'calendario', title: 'Citas', icon: 'calendar' },
    { key: 'perfil', title: 'Perfil', icon: 'account-circle' },
  ]);

  const handleNavigate = (key: string) => {
    navigation.navigate(key as never);
  };

  const renderScene = BottomNavigation.SceneMap({
    dashboard: () => <></>,
    adoptantes: () => <></>,
    calendario: () => <></>,
    perfil: () => <></>,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default NavBar;
