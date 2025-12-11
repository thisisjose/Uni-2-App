import AsyncStorage from '@react-native-async-storage/async-storage';
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

  const getLocalJoined = async (userId?: string | undefined): Promise<string[]> => {
    try {
      if (!userId) return [];
      const key = `joinedEvents:${userId}`;
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('[social] could not read joinedEvents', e);
      return [];
    }
  };

  // Cargar solo eventos a los que estoy unido
  const loadMyEvents = useCallback(async () => {
    try {
      // Don't load 'joined campaigns' for organizers or admins — this screen is for volunteers
      if (user?.role && user.role !== 'user') {
        setEvents([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const allEvents = await eventRepository.getAllEvents();
      
      if (allEvents) {
        // Ensure events that report participantsCount but don't include participants
        // are fetched in full so we can inspect participants.
        const populatedEvents = await Promise.all(allEvents.map(async (event) => {
          const participantsEmpty = (event.participants || []).length === 0;
          const hasCount = (event as any).participantsCount > 0;
          if (participantsEmpty && hasCount) {
            const eid = event._id || event.id;
            if (!eid) {
              console.warn('[social] skip fetching full event — no id:', event);
              return event;
            }
            try {
              const full = await eventRepository.getEventById(eid);
              return full || event;
            } catch (err: any) {
              console.warn('[social] failed to fetch full event', eid, err?.message || err);
              return event;
            }
          }
          return event;
        }));

        // Filtrar: solo eventos a los que el usuario ESTÁ unido
        const currentUserId = user?.id || user?._id;
        const localJoined = await getLocalJoined(currentUserId?.toString());
        console.log('[social] currentUserId:', currentUserId, 'events fetched:', populatedEvents.length, 'localJoined:', localJoined.length);
        const myEvents = populatedEvents.filter(event => {
          const participants = event.participants || [];
          const eid = event._id || event.id;
          // If we have a local marker, include it regardless of participants array
          if (eid && localJoined.includes(eid)) return true;

          // Log quick info for debugging
          if (participants.length === 0) {
            // nothing to check
            return false;
          }
          const matched = participants.some(p => {
            const pId = typeof p.userId === 'object' ? (p.userId as any)._id || (p.userId as any).id : p.userId;
            // Compare by id OR by email as a fallback (some endpoints may return different shapes)
            const byId = currentUserId ? pId === currentUserId?.toString() : false;
            const byEmail = (p as any).email && user?.email ? (p as any).email === user.email : false;
            if (byId || byEmail) return true;
            return false;
          });
          if (!matched) {
            // Useful debug when a user is expected to be part of an event
            console.debug('[social] user not in event participants:', { eventId: event._id || event.id, participantsCount: participants.length });
          }
          return matched;
        });
        
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
