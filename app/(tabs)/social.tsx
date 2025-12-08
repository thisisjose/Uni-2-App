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

export default function SocialScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const eventRepository = new EventRepository();

  // Cargar solo eventos a los que estoy unido
  const loadMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      const allEvents = await eventRepository.getAllEvents();
      
      if (allEvents) {
        // Filtrar: solo eventos a los que el usuario ESTÁ unido
        const myEvents = allEvents.filter(event =>
          event.participants.some(
            p => (typeof p.userId === 'object' ? p.userId._id : p.userId) === user?._id?.toString()
          )
        );
        
        // Ordenar por fecha (próximos primero)
        myEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(myEvents);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadMyEvents();
    }, [loadMyEvents])
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
        <ActivityIndicator size="large" color="#2DB16D" />
        <Text style={styles.loadingText}>Cargando tus campañas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Campañas</Text>
        <Text style={styles.subtitle}>Campañas a las que te has unido</Text>
      </View>

      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <EventCard 
              event={item}
              onPress={() => handleEventPress(item._id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No te has unido a ninguna campaña</Text>
          <Text style={styles.emptyText}>
            Ve a "Campañas" y únete a una para empezar a ayudar.
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
  title: { fontSize: 28, fontWeight: '800', color: '#2DB16D', letterSpacing: -0.5 },
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
