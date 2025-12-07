import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Event } from '../../core/models/Event';
import { EventRepository } from '../../core/repositories/EventRepository';
import { useAuth } from '../../hooks/useAuth';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const eventRepository = new EventRepository();

  // Función para obtener el ID del usuario de un participante
  const getParticipantUserId = (participant: any): string => {
    return typeof participant.userId === 'object' 
      ? participant.userId._id 
      : participant.userId;
  };

  // Función para obtener el nombre del usuario de un participante
  const getParticipantUserName = (participant: any): string => {
    return typeof participant.userId === 'object' 
      ? participant.userId.name 
      : 'Usuario';
  };

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const eventData = await eventRepository.getEventById(id as string);
      
      if (eventData) {
        setEvent(eventData);
      } else {
        Alert.alert('Error', 'No se encontró el evento');
      }
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo cargar el evento');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!id || !event || !user) return;
    
    // Verificar en frontend primero
    const isAlreadyParticipant = event.participants.some(
      p => getParticipantUserId(p) === user._id
    );
    
    if (isAlreadyParticipant) {
      Alert.alert('Ya participas', 'Ya estás unido a esta campaña');
      return;
    }
    
    setJoining(true);
    try {
      const updatedEvent = await eventRepository.joinEvent(id as string);
      if (updatedEvent) {
        setEvent(updatedEvent);
        // Sin alert, solo se actualiza la UI
      }
      // No necesitas else, si hay error lo captura el catch
    } catch (error: any) {
      // Manejar específicamente el error de "ya participas"
      if (error.message.includes('Ya estás participando')) {
        Alert.alert('Ya participas', 'Ya estás en esta campaña');
        // Recargar el evento para sincronizar estado
        loadEvent();
      } else {
        Alert.alert('Error', error.message || 'Error al unirse');
      }
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!id || !event || !user) return;
    
    Alert.alert(
      'Salir de la campaña',
      '¿Estás seguro de que quieres dejar de participar en esta campaña?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, salir', 
          style: 'destructive',
          onPress: async () => {
            // TODO: Implementar endpoint para salirse
            Alert.alert(
              'Funcionalidad pendiente', 
              'La opción para salirse de eventos estará disponible pronto.'
            );
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      food: 'Alimentos',
      clothes: 'Ropa',
      books: 'Libros',
      toys: 'Juguetes',
      medical: 'Medicina',
      other: 'Otros'
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando campaña...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Campaña no encontrada</Text>
        <Text style={styles.errorText}>
          Puede que esta campaña ya no exista o haya sido eliminada.
        </Text>
        <TouchableOpacity style={styles.errorBackButton} onPress={() => router.back()}>
          <Text style={styles.errorBackButtonText}>Volver a campañas</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progressPercentage = (event.currentProgress / event.targetGoal) * 100;
  const isParticipant = event.participants.some(
    p => getParticipantUserId(p) === user?._id
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonHeader}>
          <Text style={styles.backButtonHeaderText}>‹</Text>
        </TouchableOpacity>
        
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        
        <View style={[
          styles.statusBadge,
          { backgroundColor: event.status === 'active' ? '#34C759' : '#FF9500' }
        ]}>
          <Text style={styles.statusText}>
            {event.status === 'active' ? 'ACTIVA' : 'FINALIZADA'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Fecha y Hora</Text>
            <Text style={styles.infoText}>{formatDate(event.date)}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <Text style={styles.infoText}>{event.location}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Organizador</Text>
            <Text style={styles.infoText}>{event.organizer}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Categoría</Text>
            <Text style={styles.infoText}>{getCategoryLabel(event.category)}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>
                {event.currentProgress} / {event.targetGoal} participantes
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.min(progressPercentage, 100).toFixed(0)}%
              </Text>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(progressPercentage, 100)}%` }
                ]} 
              />
            </View>
          </View>

          {event.status === 'active' && !isParticipant && (
            <TouchableOpacity 
              style={styles.joinButton}
              onPress={handleJoinEvent}
              disabled={joining}
            >
              <Text style={styles.joinButtonText}>
                {joining ? 'Uniéndose...' : '¡Únete a esta campaña!'}
              </Text>
            </TouchableOpacity>
          )}

          {isParticipant && (
            <View style={styles.participationContainer}>
              <View style={styles.joinedBadge}>
                <Text style={styles.joinedText}>Ya estás participando</Text>
                <Text style={styles.joinedDate}>
                  Te uniste el {new Date(event.participants.find(p => 
                    getParticipantUserId(p) === user?._id
                  )?.joinedAt || '').toLocaleDateString('es-ES')}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.leaveButton}
                onPress={handleLeaveEvent}
              >
                <Text style={styles.leaveButtonText}>Salir de la campaña</Text>
              </TouchableOpacity>
            </View>
          )}

          {event.status !== 'active' && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveText}>
                {event.status === 'completed' ? '✅ Campaña completada' : '❌ Campaña cancelada'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>👥 Participantes ({event.currentProgress})</Text>
          {event.participants.length > 0 ? (
            event.participants.map((participant, index) => (
              <View key={participant._id || index} style={styles.participantItem}>
                <Text style={styles.participantName}>
                  👤 {getParticipantUserName(participant)}
                  {getParticipantUserId(participant) === user?._id && ' (Tú)'}
                </Text>
                <Text style={styles.participantDate}>
                  Se unió el {new Date(participant.joinedAt).toLocaleDateString('es-ES')}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Aún no hay participantes. ¡Sé el primero!</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  loadingText: { marginTop: 10, color: '#666' },
  errorTitle: { fontSize: 20, fontWeight: 'bold', color: '#FF3B30', marginBottom: 10 },
  errorText: { textAlign: 'center', color: '#666', marginBottom: 20 },
  // Botón para pantalla de error (nuevo nombre)
  errorBackButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8 },
  errorBackButtonText: { color: 'white', fontWeight: 'bold' },
  // Header
  header: { 
    backgroundColor: 'white', 
    padding: 15,
    paddingTop: 50,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  // Botón de retroceso en header (nuevo nombre)
  backButtonHeader: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backButtonHeaderText: { 
    color: '#007AFF', 
    fontWeight: 'bold',
    fontSize: 20
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    flex: 1,
    textAlign: 'center'
  },
  statusBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16,
    marginLeft: 10
  },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  scrollView: { flex: 1 },
  card: { 
    backgroundColor: 'white', 
    margin: 15, 
    padding: 20, 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionContainer: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF'
  },
  description: { 
    fontSize: 16, 
    lineHeight: 24, 
    color: '#333',
    textAlign: 'justify'
  },
  infoSection: { marginBottom: 15 },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#666', 
    marginBottom: 5 
  },
  infoText: { fontSize: 16, color: '#333' },
  progressContainer: { marginTop: 20, marginBottom: 20 },
  progressLabels: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  progressText: { fontSize: 16, fontWeight: '600', color: '#333' },
  progressPercentage: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
  progressBar: { 
    height: 10, 
    backgroundColor: '#E8E8E8', 
    borderRadius: 5, 
    overflow: 'hidden' 
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: '#007AFF', 
    borderRadius: 5 
  },
  joinButton: { 
    backgroundColor: '#34C759', 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 10
  },
  joinButtonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  participationContainer: {
    marginTop: 10
  },
  joinedBadge: { 
    backgroundColor: '#E8F5E9', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center',
    marginBottom: 10
  },
  joinedText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 16 },
  joinedDate: { color: '#4CAF50', fontSize: 14, marginTop: 4 },
  leaveButton: {
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30'
  },
  leaveButtonText: {
    color: '#FF3B30',
    fontWeight: '600'
  },
  inactiveBadge: { 
    backgroundColor: '#FFF3E0', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 10
  },
  inactiveText: { color: '#EF6C00', fontWeight: 'bold', fontSize: 16 },
  participantsSection: { 
    backgroundColor: 'white', 
    margin: 15, 
    marginTop: 0,
    padding: 20, 
    borderRadius: 12,
    marginBottom: 30
  },
  participantItem: { 
    backgroundColor: '#F8F9FA', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 8 
  },
  participantName: { fontSize: 15, fontWeight: '500' },
  participantDate: { fontSize: 13, color: '#666', marginTop: 2 },
  emptyText: { 
    textAlign: 'center', 
    color: '#999', 
    fontStyle: 'italic',
    padding: 20 
  }
});