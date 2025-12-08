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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { 
    backgroundColor: 'white', 
    padding: 20, 
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10,
    textAlign: 'center'
  },
  userInfo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  welcome: { 
    fontSize: 16, 
    color: '#333',
    fontWeight: '500'
  },
  roleText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  logoutText: { 
    color: '#FF3B30', 
    fontWeight: '500',
    fontSize: 16
  },
  adminButton: { 
    backgroundColor: '#007AFF', 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 5
  },
  adminButtonText: { 
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 16
  },
  list: { 
    padding: 10,
    paddingBottom: 20
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  errorText: { 
    color: '#FF3B30', 
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16
  },
  retryButton: { 
    backgroundColor: '#E8E8E8', 
    padding: 12, 
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 20
  },
  createButton: { 
    backgroundColor: '#007AFF', 
    padding: 14, 
    borderRadius: 8, 
    marginTop: 20,
    paddingHorizontal: 20
  },
  createButtonText: { 
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 16
  },
  debugContainer: {
    backgroundColor: '#333',
    padding: 8,
    margin: 10,
    borderRadius: 6
  },
  debugText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'monospace'
  },
  // Nuevos estilos para eliminar
  eventItem: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});