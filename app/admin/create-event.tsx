import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";

export default function CreateEvent() {
  const [image, setImage] = useState<string | null>(null);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Evento</Text>

      <FormInput label="Nombre del evento" placeholder="Colecta..." />
      <FormInput label="Descripción" placeholder="Detalles del evento" />
      <FormInput label="Fecha" placeholder="10/02/2025" />

      <TouchableOpacity style={styles.imgPicker} onPress={pickImage}>
        <Text style={styles.imgPickerText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <Button text="Guardar" onPress={() => router.push("/event/list")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  imgPicker: {
    backgroundColor: "#E8ECF7",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  imgPickerText: { textAlign: "center", fontWeight: "600" },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
});
