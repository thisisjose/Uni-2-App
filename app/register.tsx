import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

export default function Register() {
  return (
    <LinearGradient colors={["#F3FBFF", "#E6F4FF"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete a la comunidad y crea campañas</Text>
        </View>

        <View style={styles.form}>
          <FormInput label="Nombre" placeholder="Tu nombre" />
          <FormInput label="Correo" placeholder="correo@uni.edu" />
          <FormInput label="Contraseña" secure placeholder="********" />

          <Button text="Registrarme" onPress={() => router.push("/event/list")} type="secondary" />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, justifyContent: "center" },
  header: { paddingHorizontal: 28, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: "800", color: "#073A56" },
  subtitle: { color: "#4A6B84", marginTop: 6 },
  form: { paddingHorizontal: 28, marginTop: 10 },
});
