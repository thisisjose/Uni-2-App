import { router } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const eventos = [
  { id: "1", nombre: "Colecta de comida", descripcion: "Apoyo a familias", fecha: "10 Feb 2025" },
  { id: "2", nombre: "Donación de ropa", descripcion: "Ropa para invierno", fecha: "22 Feb 2025" },
];

export default function EventList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos</Text>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: "/event/detail", params: { id: item.id } })}
          >
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardDesc}>{item.descripcion}</Text>
            <Text style={styles.cardDate}>{item.fecha}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/admin/create-event")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 28, fontWeight: "700", marginBottom: 10, textAlign: "center",
  },
  card: {
    padding: 20,
    backgroundColor: "#F4F6FB",
    borderRadius: 12,
    marginBottom: 12
  },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardDesc: { marginTop: 5, color: "#555" },
  cardDate: { marginTop: 5, color: "#888", fontStyle: "italic" },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#0066FF",
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: { fontSize: 36, color: "#fff", marginTop: -4 },
});
