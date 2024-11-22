
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  setUserId: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    };
    fetchUserId();
  }, []);

  const logout = async () => {
    setUserId(null);
    await AsyncStorage.removeItem('userId');
  };

  const handleSetUserId = async (id: string | null) => {
    setUserId(id);
    if (id) {
      await AsyncStorage.setItem('userId', id);
    } else {
      await AsyncStorage.removeItem('userId');
    }
  };

  return (
    <AuthContext.Provider value={{ userId, setUserId: handleSetUserId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
