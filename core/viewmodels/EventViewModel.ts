import { CreateEventData, Event } from '../models/Event';
import { EventRepository } from '../repositories/EventRepository';

export class EventViewModel {
  private eventRepository: EventRepository;
  
  constructor() {
    this.eventRepository = new EventRepository();
  }

  // Estado
  events: Event[] = [];
  currentEvent: Event | null = null;
  isLoading = false;
  error: string | null = null;

  // Métodos
  async loadEvents() {
    this.isLoading = true;
    this.error = null;
    
    try {
      this.events = await this.eventRepository.getAllEvents();
    } catch (error: any) {
      this.error = error.message;
      console.error('Error loading events:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadEventById(id: string) {
  this.isLoading = true;
  this.error = null;
  
  try {
    console.log('🔄 ViewModel: Cargando evento ID:', id);
    this.currentEvent = await this.eventRepository.getEventById(id);
    console.log('✅ ViewModel: Evento cargado:', this.currentEvent ? 'SÍ' : 'NO');
  } catch (error: any) {
    console.error('❌ ViewModel Error:', error);
    this.error = error.message;
  } finally {
    this.isLoading = false;
  }
}

  async createEvent(eventData: CreateEventData): Promise<Event | null> {
    this.isLoading = true;
    this.error = null;
    
    try {
      const event = await this.eventRepository.createEvent(eventData);
      if (event) {
        this.events.unshift(event); // Agregar al inicio
      }
      return event;
    } catch (error: any) {
      this.error = error.message;
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async joinEvent(eventId: string): Promise<Event | null> {
    this.isLoading = true;
    this.error = null;
    
    try {
      const updatedEvent = await this.eventRepository.joinEvent(eventId);
      
      // Actualizar en la lista de eventos
      const index = this.events.findIndex(e => e._id === eventId);
      if (index !== -1 && updatedEvent) {
        this.events[index] = updatedEvent;
      }
      
      // Actualizar evento actual si es el mismo
      if (this.currentEvent && this.currentEvent._id === eventId) {
        this.currentEvent = updatedEvent;
      }
      
      return updatedEvent;
    } catch (error: any) {
      this.error = error.message;
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async deleteEvent(id: string): Promise<boolean> {
    this.isLoading = true;
    
    try {
      const success = await this.eventRepository.deleteEvent(id);
      if (success) {
        this.events = this.events.filter(event => event._id !== id);
      }
      return success;
    } catch (error: any) {
      this.error = error.message;
      return false;
    } finally {
      this.isLoading = false;
    }
  }
}