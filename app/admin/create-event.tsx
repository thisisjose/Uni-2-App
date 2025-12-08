import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { EventCategory } from '../../core/models/Event';
import { EventRepository } from '../../core/repositories/EventRepository';
import { useAuth } from '../../hooks/useAuth';

export default function CreateEventScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [targetGoal, setTargetGoal] = useState('');
  const [category, setCategory] = useState<EventCategory>('other');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const eventRepository = new EventRepository();
  const { user } = useAuth();

  // Verificar que sea admin
  if (user?.role !== 'admin') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Acceso denegado. Solo administradores pueden crear eventos.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleCreateEvent = async () => {
    // Validaciones
    if (!title.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'La descripción es requerida');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'La ubicación es requerida');
      return;
    }
    if (!organizer.trim()) {
      Alert.alert('Error', 'El organizador es requerido');
      return;
    }
    if (!targetGoal || parseInt(targetGoal) <= 0) {
      Alert.alert('Error', 'El objetivo debe ser mayor a 0');
      return;
    }

    // Asegurar que category sea EventCategory válido
    const validCategories: EventCategory[] = ['food', 'clothes', 'books', 'toys', 'medical', 'other'];
    const validCategory = validCategories.includes(category) 
    ? category 
    : 'other';

  const eventData = {
    title,
    description,
    date: date.toISOString(),
    location,
    organizer,
    targetGoal: parseInt(targetGoal),
    category: validCategory
  };

  setLoading(true);
  try {
    const newEvent = await eventRepository.createEvent(eventData);
    if (newEvent) {
      // LIMPIAR FORMULARIO PARA QUE EL ADMIN PUEDA CREAR OTRO EVENTO SI SE LE DA LA GANA XDDDDD
      setTitle('');
      setDescription('');
      setDate(new Date());
      setLocation('');
      setOrganizer('');
      setTargetGoal('');
      setCategory('other');
      
      Alert.alert(
        '¡Éxito!',
        'Campaña creada correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/event/list') // ESTE TE REDIRIGE A LA LIST DE EVENTOS XD
          }
        ]
      );
    }
  } catch (error: any) {
    Alert.alert('Error', error.message || 'No se pudo crear la campaña');
  } finally {
    setLoading(false);
  }
};

  const categories = [
    { label: 'Alimentos', value: 'food' as EventCategory },
    { label: 'Ropa', value: 'clothes' as EventCategory },
    { label: 'Libros', value: 'books' as EventCategory },
    { label: 'Juguetes', value: 'toys' as EventCategory },
    { label: 'Medicina', value: 'medical' as EventCategory },
    { label: 'Otros', value: 'other' as EventCategory }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Crear Nueva Campaña</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Colecta de alimentos navideños"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe el propósito de la campaña..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          maxLength={500}
        />

        <Text style={styles.label}>Fecha y Hora *</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {date.toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Ubicación *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Plaza Central, Centro Comunitario"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Organizador *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Comunidad Solidaria, Voluntarios UNI-2"
          value={organizer}
          onChangeText={setOrganizer}
        />

        <Text style={styles.label}>Objetivo (número de participantes) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 100"
          value={targetGoal}
          onChangeText={setTargetGoal}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue: EventCategory) => setCategory(itemValue)}
            style={styles.picker}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.createButton, loading && styles.disabledButton]}
          onPress={handleCreateEvent}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Creando...' : 'Crear Campaña'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// LOS STYLES QUEDAN IGUAL (no los modifico)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  errorText: { 
    textAlign: 'center', 
    color: '#FF3B30', 
    fontSize: 16,
    marginBottom: 20 
  },
  backButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8 },
  backButtonText: { color: 'white', fontWeight: 'bold' },
  header: {
    backgroundColor: 'white',
    padding: 15,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center'
  },
  form: {
    padding: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  dateButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333'
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden'
  },
  picker: {
    height: 50
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  disabledButton: {
    backgroundColor: '#999'
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30'
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600'
  }
});