import { StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  label: string;
  placeholder?: string;
  secure?: boolean;
}

export default function FormInput({ label, placeholder, secure }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secure}
        style={styles.input}
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    fontSize: 16,
  },
});
