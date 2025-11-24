import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

export default function Register() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <FormInput label="Nombre" placeholder="Tu nombre" />
      <FormInput label="Correo" placeholder="correo@ejemplo.com" />
      <FormInput label="Contraseña" secure placeholder="********" />

      <Button
        text="Registrarme"
        onPress={() => router.push("/event/list")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
});
