// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  userId: string | null;
  signIn: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({
  userId: null,
  signIn: async () => {},
  signOut: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    };
    loadUserId();
  }, []);

  const signIn = async (newUserId: string) => {
    await AsyncStorage.setItem('userId', newUserId);
    setUserId(newUserId);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userId');
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
