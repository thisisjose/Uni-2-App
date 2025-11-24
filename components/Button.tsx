import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  text: string;
  onPress: () => void;
  type?: "primary" | "secondary";
}

export default function Button({ text, onPress, type = "primary" }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, type === "secondary" && styles.secondary]}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#005EFF",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 8,
  },
  secondary: {
    backgroundColor: "#27ae60",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
