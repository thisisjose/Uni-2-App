import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import EventCard from '../../components/EventCard';
import { Event } from '../../core/models/Event';
import { EventRepository } from '../../core/repositories/EventRepository';
import { useAuth } from '../../hooks/useAuth';

export default function HomeScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const eventRepository = new EventRepository();

  // Cargar eventos disponibles (solo activos a los que no estoy unido)
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const allEvents = await eventRepository.getAllEvents();
      
      if (allEvents) {
        // Filtrar: a los que el usuario NO está unido (mostrar todos los estados)
        const availableEvents = allEvents.filter(event => {
          try {
            const participants = event.participants || [];
            const isNotParticipant = !participants.some(
              p => (typeof p.userId === 'object' ? p.userId._id : p.userId) === user?._id?.toString()
            );
            return isNotParticipant;
          } catch (err) {
            // If structure is unexpected, include the event so it can be inspected in UI
            console.warn('Unexpected event.participants structure for event', event._id, err);
            return true;
          }
        });
        
        setEvents(availableEvents);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  const handleEventPress = (eventId: string) => {
    router.push({
      pathname: '/(tabs)/event/detail',
      params: { id: eventId },
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0B63D6" />
        <Text style={styles.loadingText}>Cargando campañas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Campañas</Text>
        <Text style={styles.subtitle}>Únete a una campaña solidaria</Text>
      </View>

      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={item => item.id || item._id}
          renderItem={({ item }) => (
            <EventCard 
              event={item}
              onPress={() => handleEventPress(item.id || item._id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No hay campañas disponibles</Text>
          <Text style={styles.emptyText}>
            Vuelve más tarde para ver nuevas campañas o revisa las que ya completaste.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F8FAFC'
  },
  loadingText: { marginTop: 12, color: '#4A5F7F', fontWeight: '500' },
  header: { 
    backgroundColor: '#FFFFFF',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDE5F0'
  },
  title: { fontSize: 28, fontWeight: '800', color: '#0B63D6', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#4A5F7F', marginTop: 8, fontWeight: '500' },
  listContent: { paddingVertical: 12 },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1A2B3D', marginBottom: 12, textAlign: 'center' },
  emptyText: { fontSize: 14, color: '#4A5F7F', textAlign: 'center', lineHeight: 22 }
});
