import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
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
  const [dateText, setDateText] = useState('');
  const [timeText, setTimeText] = useState('');
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [targetGoal, setTargetGoal] = useState('');
  const [category, setCategory] = useState<EventCategory>('other');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const eventRepository = new EventRepository();
  const { user } = useAuth();

  // Refs para los inputs
  const dateInputRef = useRef<TextInput>(null);
  const timeInputRef = useRef<TextInput>(null);

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

  // Formatear fecha automáticamente
  const formatDateInput = (text: string) => {
    // Solo números
    let numbers = text.replace(/\D/g, '');
    
    // Limitar a 8 dígitos (DDMMYYYY)
    if (numbers.length > 8) {
      numbers = numbers.substring(0, 8);
    }
    
    // Aplicar formato
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
    } else {
      return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}/${numbers.substring(4, 8)}`;
    }
  };

  // Formatear hora automáticamente
  const formatTimeInput = (text: string) => {
    // Solo números
    let numbers = text.replace(/\D/g, '');
    
    // Limitar a 4 dígitos (HHMM)
    if (numbers.length > 4) {
      numbers = numbers.substring(0, 4);
    }
    
    // Aplicar formato
    if (numbers.length <= 2) {
      return numbers;
    } else {
      return `${numbers.substring(0, 2)}:${numbers.substring(2)}`;
    }
  };

  // Manejar cambio de fecha
  const handleDateChange = (text: string) => {
    const formatted = formatDateInput(text);
    setDateText(formatted);
    
    // Auto-focus en el siguiente campo
    if (formatted.length === 10) { // DD/MM/YYYY completo
      timeInputRef.current?.focus();
    }
  };

  // Manejar cambio de hora
  const handleTimeChange = (text: string) => {
    const formatted = formatTimeInput(text);
    setTimeText(formatted);
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

    // Validar fecha
    if (!dateText || dateText.length < 10) {
      Alert.alert('Error', 'Complete la fecha (DD/MM/AAAA)');
      return;
    }

    // Validar hora
    if (!timeText || timeText.length < 5) {
      Alert.alert('Error', 'Complete la hora (HH:MM)');
      return;
    }

    // Parsear fecha
    const [dayStr, monthStr, yearStr] = dateText.split('/');
    const [hourStr, minuteStr] = timeText.split(':');
    
    const day = parseInt(dayStr);
    const month = parseInt(monthStr);
    const year = parseInt(yearStr);
    const hours = parseInt(hourStr);
    const minutes = parseInt(minuteStr);

    // Validar valores
    if (isNaN(day) || day < 1 || day > 31) {
      Alert.alert('Error', 'Día inválido (1-31)');
      return;
    }
    if (isNaN(month) || month < 1 || month > 12) {
      Alert.alert('Error', 'Mes inválido (1-12)');
      return;
    }
    if (isNaN(year) || year < 2024 || year > 2030) {
      Alert.alert('Error', 'Año inválido (2024-2030)');
      return;
    }
    if (isNaN(hours) || hours < 0 || hours > 23) {
      Alert.alert('Error', 'Hora inválida (00-23)');
      return;
    }
    if (isNaN(minutes) || minutes < 0 || minutes > 59) {
      Alert.alert('Error', 'Minutos inválidos (00-59)');
      return;
    }

    const eventDate = new Date(year, month - 1, day, hours, minutes);
    
    // Validar que la fecha sea válida
    if (isNaN(eventDate.getTime())) {
      Alert.alert('Error', 'Fecha u hora inválida');
      return;
    }

    // Validar que no sea fecha pasada
    if (eventDate < new Date()) {
      Alert.alert('Error', 'La fecha y hora deben ser futuras');
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
      date: eventDate.toISOString(),
      location,
      organizer,
      targetGoal: parseInt(targetGoal),
      category: validCategory
    };

    setLoading(true);
    try {
      const newEvent = await eventRepository.createEvent(eventData);
      if (newEvent) {
        // LIMPIAR FORMULARIO
        setTitle('');
        setDescription('');
        setDateText('');
        setTimeText('');
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
              onPress: () => router.replace('/event/list')
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

        <Text style={styles.label}>Fecha (DD/MM/AAAA) *</Text>
        <TextInput
          ref={dateInputRef}
          style={styles.input}
          placeholder="DD/MM/AAAA"
          value={dateText}
          onChangeText={handleDateChange}
          keyboardType="numeric"
          maxLength={10}
        />
        <Text style={styles.hintText}>
          Escribe números: 05022025 → 05/02/2025
        </Text>

        <Text style={styles.label}>Hora (HH:MM) *</Text>
        <TextInput
          ref={timeInputRef}
          style={styles.input}
          placeholder="HH:MM"
          value={timeText}
          onChangeText={handleTimeChange}
          keyboardType="numeric"
          maxLength={5}
        />
        <Text style={styles.hintText}>
          Formato 24 horas: 1430 → 14:30
        </Text>

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

// STYLES IGUAL (sin cambios)
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
  hintText: {
    fontSize: 12,
    color: '#666',
    marginTop: -15,
    marginBottom: 15,
    fontStyle: 'italic'
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