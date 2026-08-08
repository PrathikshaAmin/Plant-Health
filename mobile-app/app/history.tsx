import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "expo-router";
import api from "../utils/api";

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) return;
      const response = await api.get(`/history/user/${userId}`);
      setHistory(response.data);
    } catch (err) {
      console.log("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  // Refetch every time this screen comes into focus, so new diagnoses show up
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnosis History</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }: any) => (
            <View style={styles.card}>
              <Text style={styles.diseaseName}>
                {item.suggestedDisease?.diseaseName || "Unknown"}
              </Text>
              <Text style={styles.score}>Match Score: {item.matchScore}%</Text>
              <Text style={styles.meta}>
                {item.affectedArea} • {item.severity} severity
              </Text>
              <Text style={styles.symptoms}>
                Symptoms:{" "}
                {item.symptomsSelected
                  .map((s: any) => s.symptomName)
                  .join(", ")}
              </Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No diagnosis history yet. Try the wizard!
            </Text>
          }
        />
      )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  diseaseName: { fontSize: 17, fontWeight: "600", color: "#166534" },
  score: { fontSize: 14, color: "#15803d", fontWeight: "600", marginTop: 2 },
  meta: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  symptoms: { fontSize: 13, color: "#4b5563", marginTop: 4 },
  date: { fontSize: 11, color: "#9ca3af", marginTop: 8 },
  emptyText: { textAlign: "center", color: "#6b7280", marginTop: 40 },
});
