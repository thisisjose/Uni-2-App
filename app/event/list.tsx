import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EventList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos</Text>

      <TouchableOpacity onPress={() => router.push('/event/detail')}>
        <Text style={styles.item}>• Evento 1</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/event/detail')}>
        <Text style={styles.item}>• Evento 2</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/admin/create-event')}>
        <Text style={styles.adminLink}>+ Crear evento (admin)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15
  },
  item: {
    fontSize: 18,
    marginBottom: 8
  },
  adminLink: {
    marginTop: 20,
    fontSize: 16,
    color: '#ff9800'
  }
});
