import EventCard from "components/EventCard";
import React from "react";
import { ScrollView, Text, View } from "react-native";

// Tus datos locales
const events = [
  { id: 1, title: "Evento de Prueba", date: "2025-01-10", location: "Auditorio", status: "activo" },
  { id: 2, title: "Junta General", date: "2025-01-12", location: "Sala 4", status: "cancelado" },
  { id: 3, title: "Taller Creativo", date: "2025-01-15", location: "Laboratorio", status: "completado" },
];

// Normaliza el status por si llega raro
function normalizeStatus(status?: string): "activo" | "cancelado" | "completado" {
  const s = status?.toLowerCase();

  if (s === "cancelado") return "cancelado";
  if (s === "completado") return "completado";

  return "activo"; // default
}

export default function ListScreen() {
  return (
    <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 60 }}>
      {/* 🔽 AQUÍ SE BAJA LA PANTALLA 🔽 */}

      <Text style={{ fontSize: 26, fontWeight: "800", color: "#063256", marginBottom: 15 }}>
        Lista de Eventos
      </Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {events.map((ev) => (
          <EventCard
            key={ev.id}
            title={ev.title}
            date={ev.date}
            location={ev.location}
            status={normalizeStatus(ev.status)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
