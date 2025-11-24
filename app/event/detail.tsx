import { router, useLocalSearchParams } from "expo-router";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const eventos: Record<
  string,
  {
    nombre: string;
    descripcion: string;
    fecha: string;
  }
> = {
  "1": {
    nombre: "Colecta de comida",
    descripcion: "Recolectamos alimentos no perecederos.",
    fecha: "10 Feb 2025",
  },
  "2": {
    nombre: "Donación de ropa",
    descripcion: "Ropa para invierno para personas vulnerables.",
    fecha: "22 Feb 2025",
  },
};

export default function EventDetail() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Validación segura del evento
  const evento = id && eventos[id] ? eventos[id] : eventos["1"];

  return (
    <View style={styles.center}>
      <Modal transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>{evento.nombre}</Text>
            <Text style={styles.desc}>{evento.descripcion}</Text>
            <Text style={styles.date}>{evento.fecha}</Text>

            <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
              <Text style={styles.btnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1 },
  modalBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 10 },
  desc: { color: "#555", marginBottom: 10, fontSize: 16 },
  date: { color: "#888", marginBottom: 20, fontStyle: "italic" },
  btn: {
    backgroundColor: "#0066FF",
    padding: 12,
    borderRadius: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
