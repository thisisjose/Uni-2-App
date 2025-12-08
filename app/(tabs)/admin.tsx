import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Redirigir si no es admin
  if (user?.role !== 'admin') {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>🚫</Text>
          <Text style={styles.errorTitle}>Acceso Denegado</Text>
          <Text style={styles.errorText}>
            Solo los administradores pueden acceder a esta sección.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Administración</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Text style={styles.iconText}>➕</Text>
          </View>
          <Text style={styles.cardTitle}>Crear Nueva Campaña</Text>
          <Text style={styles.cardDescription}>
            Agrega una nueva campaña solidaria para que los voluntarios puedan unirse.
          </Text>
          <TouchableOpacity 
            style={styles.cardButton}
            onPress={() => router.push('/admin/create-event')}
          >
            <Text style={styles.cardButtonText}>Crear Campaña</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Text style={styles.iconText}>📊</Text>
          </View>
          <Text style={styles.cardTitle}>Ver Estadísticas</Text>
          <Text style={styles.cardDescription}>
            Revisa el progreso y estado de todas tus campañas.
          </Text>
          <TouchableOpacity 
            style={[styles.cardButton, styles.cardButtonSecondary]}
            onPress={() => router.push('/')}
          >
            <Text style={styles.cardButtonTextSecondary}>Ver Campañas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 16
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 12,
    textAlign: 'center'
  },
  errorText: {
    fontSize: 14,
    color: '#4A5F7F',
    textAlign: 'center',
    lineHeight: 22
  },
  header: { 
    backgroundColor: '#FFFFFF',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDE5F0'
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#FF9500', 
    letterSpacing: -0.5 
  },
  content: {
    padding: 16,
    gap: 16
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#F0F3F9'
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  iconText: {
    fontSize: 32
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2B3D',
    marginBottom: 8,
    letterSpacing: 0.2
  },
  cardDescription: {
    fontSize: 14,
    color: '#4A5F7F',
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '500'
  },
  cardButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },
  cardButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2
  },
  cardButtonSecondary: {
    backgroundColor: '#F0F3F9',
    shadowColor: 'transparent'
  },
  cardButtonTextSecondary: {
    color: '#FF9500'
  }
});
