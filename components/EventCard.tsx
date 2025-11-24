import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string;
  date: string;
  location?: string;
}

export default function EventCard({ title, date, location }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      {location ? <Text style={styles.location}>{location}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E6F0FB",
    shadowColor: "#0B63D6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 17, fontWeight: "700", color: "#063256" },
  date: { fontSize: 13, color: "#6B8CA6" },
  location: { marginTop: 8, color: "#5B7A8F" },
});
