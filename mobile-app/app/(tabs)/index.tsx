import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 Plant Health</Text>
      <Text style={styles.subtitle}>Diagnose and care for your plants</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/diseases")}
      >
        <Text style={styles.cardTitle}>📖 Disease Library</Text>
        <Text style={styles.cardText}>Browse and search plant diseases</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/diagnosis")}
      >
        <Text style={styles.cardTitle}>🔍 Diagnose My Plant</Text>
        <Text style={styles.cardText}>
          Answer a few questions to get a diagnosis
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0fdf4",
    paddingTop: 60,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#166534" },
  subtitle: { fontSize: 14, color: "#4b5563", marginBottom: 24 },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 4,
  },
  cardText: { fontSize: 14, color: "#6b7280" },
});
