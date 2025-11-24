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
    padding: 30,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
});
