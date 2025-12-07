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
  container: { width: "100%", marginBottom: 14 },
  label: { color: "#1F4F8A", marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#F4F8FD",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#12344A",
    borderWidth: 1,
    borderColor: "#E6F0FB",
  },
});
