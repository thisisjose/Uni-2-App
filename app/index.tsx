import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Uni2</Text>
      <Text style={styles.subtitle}>Aquí se mostrarán los eventos</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Ir a Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push('/event/list')}>
        <Text style={styles.buttonText}>Ver Eventos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    marginBottom: 20
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    width: '70%',
    marginTop: 10
  },
  buttonSecondary: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    width: '70%',
    marginTop: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16
  }
});
