import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  text: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "ghost";
  style?: ViewStyle;
}

export default function Button({ text, onPress, type = "primary", style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        type === "secondary" && styles.secondary,
        type === "ghost" && styles.ghost,
        style,
      ]}
      activeOpacity={0.85}
    >
      <Text style={[styles.text, type === "ghost" && styles.ghostText]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0B63D6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: "#0b63d6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  secondary: {
    backgroundColor: "#2DB16D",
    shadowColor: "#2db16d",
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#0B63D6",
    shadowColor: "transparent",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  ghostText: {
    color: "#0B63D6",
  },
});
