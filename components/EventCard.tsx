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
        <Text style={styles.infoText}>📅 {formatDate(event.date)}</Text>
        <Text style={styles.infoText}>📍 {event.location}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>👤 {event.organizer}</Text>
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
});

export default EventCard;