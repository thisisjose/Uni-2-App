import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface Props extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export default function FormInput({
  label,
  placeholder,
  secureTextEntry,
  containerStyle,
  inputStyle,
  ...rest
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#9BB7DB"
        style={[styles.input, inputStyle]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 16 },
  label: { color: "#1F4F8A", marginBottom: 8, fontWeight: "600", fontSize: 14, letterSpacing: 0.2 },
  input: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    color: "#12344A",
    borderWidth: 1.5,
    borderColor: "#DDE5F0",
    shadowColor: "#0B63D6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
});
