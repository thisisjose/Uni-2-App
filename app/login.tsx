import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Uni-2</Text>
      <Text style={styles.subtitle}>Ingresa para continuar</Text>

      <FormInput label="Correo" placeholder="correo@ejemplo.com" />
      <FormInput label="Contraseña" secure placeholder="********" />

      <Button
        text="Entrar"
        onPress={() => router.push("/event/list")}
      />

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 16,
    color: "#777",
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#005EFF",
    fontWeight: "600",
    fontSize: 15
  },
});
