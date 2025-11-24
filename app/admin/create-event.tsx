import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";

export default function CreateEvent() {
  const [image, setImage] = useState<string | null>(null);

  async function pickImage() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled) setImage(res.assets[0].uri);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Nuevo Evento</Text>

        <FormInput label="Nombre" placeholder="Colecta de ropa" />
        <FormInput label="Descripción" placeholder="Detalles..." />
        <FormInput label="Fecha" placeholder="10/02/2025" />

        <TouchableOpacity style={styles.imgBtn} onPress={pickImage}>
          <Text style={styles.imgBtnText}>Seleccionar imagen</Text>
        </TouchableOpacity>

        {image ? <Image source={{ uri: image }} style={styles.preview} /> : null}

        <Button text="Guardar evento" onPress={() => router.push("/event/list")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7FBFF" },
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: "800", color: "#063256", marginBottom: 14 },
  imgBtn: {
    backgroundColor: "#EAF3FF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D7EFFF",
  },
  imgBtnText: { color: "#0B63D6", fontWeight: "700" },
  preview: { width: "100%", height: 180, borderRadius: 12, marginBottom: 12 },
});
