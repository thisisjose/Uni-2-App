import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import EventCard from '../../components/EventCard';
import { Event } from '../../core/models/Event';
import { EventRepository } from '../../core/repositories/EventRepository';
import { useAuth } from '../../hooks/useAuth';

const eventRepo = new EventRepository();

export default function MyEventsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    console.log('[my-events] user present, role:', user.role, 'id:', user._id);
    // Only load organizer's events when the user is an organizer
    if (user.role === 'organizer') {
      loadMyEvents(user._id);
    } else {
      // Clear list for non-organizers
      setEvents([]);
    }
  }, [user]);

  const loadMyEvents = async (userId?: string) => {
    setLoading(true);
    const list = await eventRepo.getMyEvents(userId);
    setEvents(list);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Campañas</Text>
        {/* Botón Crear Campaña para organizadores */}
        <Text style={styles.createLink} onPress={() => router.push('/admin/create-event')}>Crear Campaña</Text>
      </View>
      <View style={styles.content}>
        <FlatList
          data={events}
          keyExtractor={(item) => item.id || item._id}
          onRefresh={loadMyEvents}
          refreshing={loading}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => router.push(`/(tabs)/event/detail?id=${item.id || item._id}`)}
            />
          )}
          ListEmptyComponent={() => (
            <View style={{ padding: 24 }}>
              <Text style={{ color: '#7B8BA3' }}>No tienes campañas creadas.</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#FFFFFF', paddingTop: 52, paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 0.5, borderBottomColor: '#DDE5F0' },
  title: { fontSize: 28, fontWeight: '800', color: '#0B63D6' },
  content: { padding: 16, flex: 1 },
  createLink: { position: 'absolute', right: 20, top: 58, color: '#007AFF', fontWeight: '700' }
});
