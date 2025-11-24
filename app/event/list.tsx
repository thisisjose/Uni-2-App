import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventCard from "../../components/EventCard";

const eventos = [
  { id: "1", nombre: "Colecta de comida", descripcion: "Apoyo a familias", fecha: "10 Feb 2025" },
  { id: "2", nombre: "Donación de ropa", descripcion: "Ropa para invierno", fecha: "22 Feb 2025" },
  { id: "3", nombre: "Recolección de útiles", descripcion: "Útiles escolares", fecha: "03 Mar 2025" },
];

export default function EventList() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Eventos activos</Text>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/event/detail", params: { id: item.id } })}
          >
            <EventCard title={item.nombre} date={item.fecha} location={item.descripcion} />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/admin/create-event")}
        accessibilityLabel="Crear evento"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FBFF", paddingHorizontal: 20, paddingTop: 24 },
  title: { fontSize: 26, fontWeight: "800", color: "#063256", marginBottom: 12 },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    backgroundColor: "#0B63D6",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0b63d6",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
  fabText: { fontSize: 34, color: "#fff", lineHeight: 36 },
});
