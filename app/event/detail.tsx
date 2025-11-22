import { StyleSheet, Text, View } from 'react-native';

export default function EventDetail() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del Evento</Text>
      <Text style={styles.text}>Aquí irá la información completa de un evento.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    color: '#555'
  }
});
