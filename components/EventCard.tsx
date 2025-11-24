import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string;
  date: string;
  location: string;
}

export default function EventCard({ title, date, location }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{date}</Text>
      <Text style={styles.location}>{location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    color: "#555",
    marginTop: 4,
  },
  location: {
    marginTop: 6,
    color: "#777",
  },
});
