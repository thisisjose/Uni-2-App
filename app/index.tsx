import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uni-2</Text>
      <Text style={styles.subtitle}>Colectas y campañas en un solo lugar</Text>

      <Button text="Ir a Login" onPress={() => router.push("/login")} />
      <Button
        text="Ver Eventos"
        type="secondary"
        onPress={() => router.push("/event/list")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 56,
    fontWeight: "800",
    color: "#0B63D6",
    letterSpacing: -1,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    color: "#4A5F7F",
    textAlign: "center",
    marginBottom: 56,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});
