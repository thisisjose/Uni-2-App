import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

export default function Login() {
  return (
    <LinearGradient colors={["#E6F2FF", "#D7EEFF"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>

        {/* --- LOGO CENTRADO --- */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/icons/IconoUni2.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* --- FORMULARIO --- */}
        <View style={styles.form}>
          <FormInput label="Correo" placeholder="correo@uni.edu" />
          <FormInput label="Contraseña" secure placeholder="********" />

          <Button text="Entrar" onPress={() => router.push("/event/list")} />

          <TouchableOpacity
            onPress={() => router.push("/register")}
            style={styles.registerRow}
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta?{" "}
              <Text style={styles.registerLink}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- PIE DE PÁGINA --- */}
        <Text style={styles.footer}>Universitario • Comunidad • Solidario</Text>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, justifyContent: "space-between" },

  logoContainer: {
    marginTop: 60,
    alignItems: "center",
  },

  logo: {
    width: 250,   // <<-- TAMAÑO AUMENTADO
    height: 250,  // <<-- TAMAÑO AUMENTADO
  },

  form: {
    paddingHorizontal: 28,
    marginTop: -10,
  },

  registerRow: { marginTop: 12, alignItems: "center" },
  registerText: { color: "#4A6B84" },
  registerLink: { color: "#0B63D6", fontWeight: "700" },

  footer: { textAlign: "center", color: "#7E9FB3", marginBottom: 16 },
});
