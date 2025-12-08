import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EventCard from '../../components/EventCard';
import { EventRepository } from '../../core/repositories/EventRepository';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';

export default function EventsScreen() {
  const { events, loading, error, loadEvents } = useEvents();
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const eventRepository = new EventRepository();

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salir', 
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/detail?id=${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    Alert.alert(
      'Eliminar campaña',
      '¿Estás seguro de que quieres eliminar esta campaña? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await eventRepository.deleteEvent(eventId);
              if (success) {
                // Recargar la lista completa
                await loadEvents();
                Alert.alert('Éxito', 'Campaña eliminada');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo eliminar la campaña');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.eventItem}>
      <EventCard 
        event={item} 
        onPress={() => handleEventPress(item._id)}
      />
      
      {user?.role === 'admin' && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteEvent(item._id)}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Campañas Solidarias</Text>
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.welcome}>Hola, {user?.name}</Text>
            <Text style={styles.roleText}>
              {user?.role === 'admin' ? 'Eres Administrador' : 'Eres Voluntario'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
        
        {user?.role === 'admin' && (
          <TouchableOpacity 
            style={styles.adminButton}
            onPress={() => router.push('/admin/create-event')}
          >
            <Text style={styles.adminButtonText}>+ Crear Nueva Campaña</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && events.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text>Cargando campañas...</Text>
          <Text style={styles.debugText}>Consultando API: https://uni-2-api.onrender.com</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadEvents}>
            <Text>Reintentar</Text>
          </TouchableOpacity>
          <Text style={styles.debugText}>Verifica la consola para más detalles</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text>No hay campañas activas</Text>
          {user?.role === 'admin' && (
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => router.push('/admin/create-event')}
            >
              <Text style={styles.createButtonText}>Crear primera campaña</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.list}
        />
      )}
      
      {/* Debug info - solo en desarrollo */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Eventos: {events.length} | Cargando: {loading.toString()} | Error: {error || 'none'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    backgroundColor: '#FFFFFF', 
    padding: 20, 
    paddingTop: 52,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDE5F0'
  },
  title: { 
    fontSize: 26, 
    fontWeight: '800', 
    marginBottom: 16,
    textAlign: 'center',
    color: '#0B63D6',
    letterSpacing: -0.3
  },
  userInfo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  welcome: { 
    fontSize: 15, 
    color: '#1A2B3D',
    fontWeight: '700',
    letterSpacing: 0.2
  },
  roleText: {
    fontSize: 13,
    color: '#4A5F7F',
    marginTop: 4,
    fontWeight: '500'
  },
  logoutText: { 
    color: '#FF3B30', 
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2
  },
  adminButton: { 
    backgroundColor: '#0B63D6', 
    padding: 14, 
    borderRadius: 10, 
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0B63D6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5
  },
  adminButtonText: { 
    color: 'white', 
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3
  },
  list: { 
    padding: 12,
    paddingBottom: 24
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 24 
  },
  errorText: { 
    color: '#FF3B30', 
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600'
  },
  retryButton: { 
    backgroundColor: '#E6F0FB', 
    padding: 12, 
    borderRadius: 10,
    marginTop: 12,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: '#0B63D6'
  },
  createButton: { 
    backgroundColor: '#0B63D6', 
    padding: 14, 
    borderRadius: 10, 
    marginTop: 20,
    paddingHorizontal: 24,
    shadowColor: '#0B63D6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5
  },
  createButtonText: { 
    color: 'white', 
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3
  },
  debugContainer: {
    backgroundColor: '#1A2B3D',
    padding: 10,
    margin: 12,
    borderRadius: 8
  },
  debugText: {
    color: '#9BB7DB',
    fontSize: 11,
    fontFamily: 'monospace'
  },
  eventItem: {
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 14,
    alignItems: 'center',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2
  }
});