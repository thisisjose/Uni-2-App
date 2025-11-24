import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const eventos: Record<
  string,
  { nombre: string; descripcion: string; fecha: string }
> = {
  "1": {
    nombre: "Colecta de comida",
    descripcion:
      "Recolectamos alimentos no perecederos para apoyar a familias locales.",
    fecha: "10 Feb 2025",
  },
  "2": {
    nombre: "Donación de ropa",
    descripcion:
      "Ropa de invierno destinada a comunidades vulnerables.",
    fecha: "22 Feb 2025",
  },
  "3": {
    nombre: "Recolección de útiles",
    descripcion:
      "Útiles escolares para estudiantes de bajos recursos.",
    fecha: "03 Mar 2025",
  },
};

export default function EventDetail() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const evento = eventos[id ?? ""];

  // --- Protección si no existe el evento ---
  if (!evento) {
    return (
      <View style={{ flex: 1 }}>
        <Modal transparent animationType="fade" visible>
          <BlurView intensity={35} tint="dark" style={styles.blurBg}>
            <View style={styles.card}>
              <Text style={styles.title}>Evento no encontrado</Text>

              <Text style={styles.desc}>
                Puede que este evento ya no exista o haya sido eliminado.
              </Text>

              <TouchableOpacity
                style={styles.btn}
                onPress={() => router.back()}
              >
                <Text style={styles.btnText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>
      </View>
    );
  }

  // --- Modal correcto ---
  return (
    <View style={{ flex: 1 }}>
      <Modal transparent animationType="fade" visible>
        <BlurView intensity={35} tint="dark" style={styles.blurBg}>
          <View style={styles.card}>
            <Text style={styles.title}>{evento.nombre}</Text>

            <Text style={styles.sectionLabel}>Descripción</Text>
            <Text style={styles.desc}>{evento.descripcion}</Text>

            <Text style={styles.sectionLabel}>Fecha</Text>
            <Text style={styles.date}>{evento.fecha}</Text>

            <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
              <Text style={styles.btnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  blurBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "85%",
    minHeight: "55%",
    backgroundColor: "rgba(255,255,255,0.90)",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#063256",
    marginBottom: 18,
    textAlign: "center",
  },

  sectionLabel: {
    fontSize: 14,
    color: "#0B63D6",
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 4,
  },

  desc: {
    color: "#4A6B84",
    fontSize: 16,
    marginBottom: 10,
  },

  date: {
    color: "#245F86",
    fontSize: 16,
    marginBottom: 25,
    fontStyle: "italic",
  },

  btn: {
    backgroundColor: "#0B63D6",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: "auto",
  },

  btnText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
