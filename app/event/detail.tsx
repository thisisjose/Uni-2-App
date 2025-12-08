import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  const [leaving, setLeaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const eventRepository = new EventRepository();

  // Función para obtener el ID del usuario de un participante
  const getParticipantUserId = (participant: any): string => {
    if (!participant || !participant.userId) return '';
    
    if (typeof participant.userId === 'object') {
      return participant.userId._id?.toString() || '';
    }
    
    return participant.userId?.toString() || '';
  };

  // Función para obtener el nombre del usuario de un participante
  const getParticipantUserName = (participant: any): string => {
    if (!participant || !participant.userId) return 'Usuario';
    
    if (typeof participant.userId === 'object') {
      return participant.userId.name || 'Usuario';
    }
    
    return 'Usuario';
  };

  useEffect(() => {
    if (id) {
      console.log('🔄 useEffect: Cargando evento con ID:', id);
      console.log('👤 Usuario actual:', user?.name, 'ID:', user?._id);
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
        
        // 🔍 DEBUG: Verificar datos cargados
        console.log('🔍 DEBUG Event cargado:');
        console.log('📱 Usuario ID:', user?._id);
        console.log('🎯 Evento ID:', eventData._id);
        console.log('👥 Total participantes:', eventData.participants.length);
        
        if (eventData.participants.length > 0) {
          console.log('📊 Lista de participantes:');
          eventData.participants.forEach((p, i) => {
            const pId = getParticipantUserId(p);
            console.log(`   ${i}: ID=${pId}, Nombre=${getParticipantUserName(p)}`);
          });
        }
        
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
      p => getParticipantUserId(p) === user._id?.toString()
    );
    
    console.log('🎯 Verificación join:');
    console.log('   User ID:', user._id);
    console.log('   isAlreadyParticipant:', isAlreadyParticipant);
    
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
    
    // Verificar que realmente está participando
    const isParticipant = event.participants.some(
      p => getParticipantUserId(p) === user._id?.toString()
    );
    
    console.log('🎯 Verificación leave:');
    console.log('   User ID:', user._id);
    console.log('   isParticipant:', isParticipant);
    
    if (!isParticipant) {
      Alert.alert('No participas', 'No estás unido a esta campaña');
      return;
    }
    
    Alert.alert(
      'Salir de la campaña',
      '¿Estás seguro de que quieres dejar de participar en esta campaña?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, salir', 
          style: 'destructive',
          onPress: async () => {
            setLeaving(true);
            try {
              const updatedEvent = await eventRepository.leaveEvent(id as string);
              if (updatedEvent) {
                setEvent(updatedEvent);
                Alert.alert(
                  'Te has salido',
                  'Has dejado de participar en esta campaña',
                  [{ text: 'OK' }]
                );
              }
            } catch (error: any) {
              if (error.message.includes('No estás participando')) {
                Alert.alert('No participas', 'No estás en esta campaña');
                loadEvent();
              } else {
                Alert.alert('Error', error.message || 'No se pudo salir de la campaña');
              }
            } finally {
              setLeaving(false);
            }
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

  // 🔍 DEBUG: Verificar estado antes de renderizar
  console.log('🎯 RENDER - Estado actual:');
  console.log('📦 Evento:', event ? 'Cargado' : 'Null');
  console.log('👤 User:', user ? 'Autenticado' : 'No autenticado');
  console.log('🆔 User ID:', user?._id);
  console.log('📊 User ID tipo:', typeof user?._id);

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

  // Verificación MEJORADA de isParticipant
  const isParticipant = event.participants.some(p => {
    const participantId = getParticipantUserId(p);
    const userId = user?._id?.toString();
    const isMatch = participantId === userId;
    
    console.log(`🔍 Comparando: ${participantId} === ${userId} ? ${isMatch}`);
    return isMatch;
  });

  console.log('✅ Resultado final isParticipant:', isParticipant);
  console.log('👥 Total participantes para mostrar:', event.participants.length);

  const progressPercentage = (event.currentProgress / event.targetGoal) * 100;

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
                {event.currentProgress} / {event.targetGoal} en la meta
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
                    getParticipantUserId(p) === user?._id?.toString()
                  )?.joinedAt || '').toLocaleDateString('es-ES')}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.leaveButton, leaving && styles.leavingButton]}
                onPress={handleLeaveEvent}
                disabled={leaving}
              >
                <Text style={styles.leaveButtonText}>
                  {leaving ? 'Saliendo...' : 'Salir de la campaña'}
                </Text>
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
            event.participants.map((participant, index) => {
              const isCurrentUser = getParticipantUserId(participant) === user?._id?.toString();
              return (
                <View key={participant._id || index} style={styles.participantItem}>
                  <Text style={styles.participantName}>
                    👤 {getParticipantUserName(participant)}
                    {isCurrentUser && ' (Tú)'}
                  </Text>
                  <Text style={styles.participantDate}>
                    Se unió el {new Date(participant.joinedAt).toLocaleDateString('es-ES')}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>Aún no hay participantes. ¡Sé el primero!</Text>
          )}
        </View>

    </View>
  
)}
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
  errorBackButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8 },
  errorBackButtonText: { color: 'white', fontWeight: 'bold' },
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
  leavingButton: {
    opacity: 0.6
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