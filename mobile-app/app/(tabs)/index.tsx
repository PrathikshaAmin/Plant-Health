import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("userId");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🌿 Plant Health</Text>
          <Text style={styles.subtitle}>Diagnose and care for your plants</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

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
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/history")}
      >
        <Text style={styles.cardTitle}>📋 My Diagnosis History</Text>
        <Text style={styles.cardText}>View your past plant diagnoses</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/upload-image")}
      >
        <Text style={styles.cardTitle}>📷 Upload Plant Photo</Text>
        <Text style={styles.cardText}>
          Take or select a photo of your plant
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#166534" },
  subtitle: { fontSize: 14, color: "#4b5563", marginTop: 2 },
  logoutText: {
    color: "#dc2626",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 4,
  },
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
