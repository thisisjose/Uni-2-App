import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      try {
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('🔴 Error en redirección:', error);
        // Si falla la redirección, al menos mostrar login
        router.replace('/login');
      }
    }
  }, [loading, user]);

  // Mostrar pantalla de carga mientras se verifica
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <Text style={{ fontSize: 16, color: '#4A5F7F' }}>Cargando...</Text>
    </View>
  );
}
