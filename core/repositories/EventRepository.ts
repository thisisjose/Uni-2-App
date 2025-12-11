import api from '../../services/api';
import { CreateEventData, Event, EventStatus } from '../models/Event';

export class EventRepository {
  private normalizeEvent(raw: any): Event {
    if (!raw) return raw;
    const normalized: any = {
      ...raw,
      _id: raw._id || raw.id,
      id: raw.id || raw._id,
      participants: raw.participants || [],
      currentProgress: raw.currentProgress ?? raw.participantsCount ?? 0,
      targetGoal: raw.targetGoal ?? 0,
      organizer: raw.organizer || (raw.createdBy && typeof raw.createdBy === 'object' ? raw.createdBy.name : raw.organizer) || '',
    };
    return normalized as Event;
  }
  // Obtener todos los eventos
  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await api.get('/events');
      const list = response.data.data || [];
      return list.map((r: any) => this.normalizeEvent(r));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  // Obtener evento por ID
async getEventById(id: string): Promise<Event | null> {
  try {
    console.log('🔍 Repository: GET /events/' + id);
    const response = await api.get(`/events/${id}`);
    
    console.log('✅ Repository: Respuesta completa:', JSON.stringify(response.data, null, 2));
    
    // Verifica la estructura de la respuesta
    if (response.data.success && response.data.data) {
      const raw = response.data.data;
      return this.normalizeEvent(raw);
    } else {
      console.warn('⚠️ Repository: Estructura inesperada:', response.data);
      return null;
    }
  } catch (error: any) {
    console.error('❌ Repository Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return null;
  }
}

  // Crear nuevo evento (solo admin)
  async createEvent(eventData: CreateEventData): Promise<Event | null> {
  try {
    console.log('Creando evento:', eventData);
    const response = await api.post('/events', eventData);
    
    if (response.data.success) {
      console.log('✅ Evento creado:', response.data.data);
      return this.normalizeEvent(response.data.data);
    } else {
      throw new Error(response.data.message || 'Error creando evento');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('❌ Error createEvent:', errorMessage);
    throw new Error(errorMessage);
  }
}


  // Unirse a evento (MÓDULO OPERATIVO)
  // POST - Unirse a evento (MÓDULO OPERATIVO)
async joinEvent(eventId: string): Promise<Event | null> {
  try {
    console.log('Uniéndose al evento:', eventId);
    const response = await api.post(`/events/${eventId}/join`);
    
    if (response.data.success) {
      return this.normalizeEvent(response.data.data);
    } else {
      // Lanzar error con el mensaje del servidor
      throw new Error(response.data.message || 'Error uniéndose al evento');
    }
  } catch (error: any) {
    // Si el error viene del servidor, usa su mensaje
    const errorMessage = error.response?.data?.message || error.message;
    console.error('❌ Error joinEvent:', errorMessage);
    throw new Error(errorMessage); // IMPORTANTE: lanzar el error
  }
}

  // Actualizar evento (solo admin)
  async updateEvent(id: string, eventData: Partial<CreateEventData>): Promise<Event | null> {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return this.normalizeEvent(response.data.data);
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  }

  // Eliminar evento (solo admin)
  async deleteEvent(id: string): Promise<boolean> {
  try {
    console.log('Eliminando evento:', id);
    const response = await api.delete(`/events/${id}`);
    
    if (response.data.success) {
      console.log('✅ Evento eliminado');
      return true;
    } else {
      throw new Error(response.data.message || 'Error eliminando evento');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('❌ Error deleteEvent:', errorMessage);
    throw new Error(errorMessage);
    }
  }
// Salirse de evento
async leaveEvent(eventId: string): Promise<Event | null> {
  try {
    console.log('🚪 Saliendo del evento:', eventId);
    const response = await api.post(`/events/${eventId}/leave`);
    
    if (response.data.success) {
      return this.normalizeEvent(response.data.data);
    } else {
      throw new Error(response.data.message || 'Error saliéndose del evento');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('❌ Error leaveEvent:', errorMessage);
    throw new Error(errorMessage);
  }
}

// Actualizar status del evento (solo admin)
async updateEventStatus(id: string, status: EventStatus): Promise<Event | null> {
  try {
    console.log('📝 Actualizando status del evento:', id, 'a:', status);
    const response = await api.put(`/events/${id}`, { status });
    
    if (response.data.success) {
      console.log('✅ Status actualizado');
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Error actualizando status');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('❌ Error updateEventStatus:', errorMessage);
    throw new Error(errorMessage);
  }
}
  // Obtener eventos creados por el organizador actual
  // Obtener eventos creados por el organizador actual
  // Si se proporciona `userId`, filtra para devolver solo eventos creados por ese usuario.
  async getMyEvents(userId?: string): Promise<Event[]> {
    try {
      const response = await api.get('/events/mine');
      const list = response.data.data || [];
      const normalized = list.map((r: any) => this.normalizeEvent(r));
      if (userId) {
        return normalized.filter((e: any) => {
          if (!e.createdBy) return false;
          const cb = e.createdBy;
          const cbId = typeof cb === 'object' ? (cb._id || cb.id) : cb;
          return cbId === userId;
        });
      }
      return normalized;
    } catch (error: any) {
      console.error('Error fetching my events (primary):', error.response?.data || error.message);
      // Fallback: try to fetch all events and filter by createdBy matching provided userId
      try {
        const allResp = await api.get('/events');
        const all = allResp.data.data || [];
        const normalized = all.map((r: any) => this.normalizeEvent(r));
        if (userId) {
          return normalized.filter((e: any) => {
            if (!e.createdBy) return false;
            const cb = e.createdBy;
            const cbId = typeof cb === 'object' ? (cb._id || cb.id) : cb;
            return cbId === userId;
          });
        }
        return normalized;
      } catch (err) {
        console.error('Fallback getAllEvents failed:', err);
        return [];
      }
    }
  }

  // Actualizar asistencia/estado de participante (organizer)
  async updateParticipantAttendance(eventId: string, participantId: string, attended: boolean): Promise<boolean> {
    try {
      const response = await api.patch(`/events/${eventId}/participants/${participantId}/attendance`, { attended });
      return response.data.success;
    } catch (error: any) {
      console.error('Error updating participant attendance:', error.response?.data || error.message);
      return false;
    }
  }

}