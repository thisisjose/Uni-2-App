import { useEffect, useState } from 'react';
import { Event } from '../core/models/Event';
import { EventRepository } from '../core/repositories/EventRepository';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const eventRepository = new EventRepository();

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando eventos desde API...');
      
      const eventsData = await eventRepository.getAllEvents();
      console.log('📦 Eventos recibidos:', eventsData.length);
      
      setEvents(eventsData);
    } catch (err: any) {
      setError(err.message || 'Error cargando eventos');
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return { events, loading, error, loadEvents };
};