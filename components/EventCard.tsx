import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Event } from '../core/models/Event';

interface Props {
  event: Event;
  onPress: () => void;
}

const EventCard: React.FC<Props> = ({ event, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const progressPercentage = (event.currentProgress / event.targetGoal) * 100;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{event.title}</Text>
        <View style={[styles.statusBadge, 
          { backgroundColor: event.status === 'active' ? '#34C759' : '#FF9500' }
        ]}>
          <Text style={styles.statusText}>
            {event.status === 'active' ? 'Activo' : 'Finalizado'}
          </Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>📅 {formatDate(event.date)}</Text>
        <Text style={styles.infoText}>📍 {event.location}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          👤 {(() => {
            // Prefer createdBy object if available (may include email)
            if (event.createdBy && typeof event.createdBy === 'object') {
              const name = event.createdBy.name || event.organizer || '';
              const email = (event.createdBy as any).email;
              return `${name}${email ? ' - ' + email : ''}`;
            }
            return event.organizer;
          })()}
        </Text>
        <Text style={styles.infoText}>{getCategoryLabel(event.category)}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressLabels}>
            <Text style={styles.progressText}>
              {event.currentProgress} de {event.targetGoal} en la meta
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
    </TouchableOpacity>
  );
};

// Helper para mostrar categorías en español
const getCategoryLabel = (category: string): string => {
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#F0F3F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
    color: '#1A2B3D',
    letterSpacing: 0.2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    color: '#4A5F7F',
    marginBottom: 12,
    lineHeight: 21,
    fontWeight: '400',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F3F9',
  },
  infoText: {
    fontSize: 13,
    color: '#4A5F7F',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 14,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 13,
    color: '#1A2B3D',
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 13,
    color: '#0B63D6',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  progressBar: {
    height: 7,
    backgroundColor: '#E6F0FB',
    borderRadius: 3.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0B63D6',
    borderRadius: 3.5,
  },
});

export default EventCard;