import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateEvent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear un Evento</Text>

      <TextInput placeholder="Título del evento" style={styles.input} />
      <TextInput placeholder="Descripción" style={styles.input} />
      <TextInput placeholder="Fecha" style={styles.input} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Guardar Evento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#ff9800',
    padding: 14,
    borderRadius: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  }
});
