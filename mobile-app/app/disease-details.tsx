import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import api from "../utils/api";

export default function DiseaseDetails() {
  const { id } = useLocalSearchParams();
  const [disease, setDisease] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisease = async () => {
      try {
        const response = await api.get(`/diseases/${id}`);
        setDisease(response.data);
      } catch (err) {
        console.log("Error fetching disease details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDisease();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#166534" />
      </View>
    );
  }

  if (!disease) {
    return (
      <View style={styles.centered}>
        <Text>Disease not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{disease.diseaseName}</Text>
      {disease.scientificName ? (
        <Text style={styles.scientificName}>{disease.scientificName}</Text>
      ) : null}

      <View style={styles.tagRow}>
        <Text style={styles.tag}>{disease.category}</Text>
        <Text style={styles.tag}>{disease.affectedArea.join(", ")}</Text>
      </View>

      <Section title="Description" content={disease.description} />
      <Section title="Symptoms" content={disease.symptoms} />
      <Section title="Causes" content={disease.causes} />
      <Section title="Prevention Methods" content={disease.preventionMethods} />
    </ScrollView>
  );
}

function Section({ title, content }: { title: string; content?: string }) {
  if (!content) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    padding: 20,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#166534" },
  scientificName: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#6b7280",
    marginTop: 2,
  },
  tagRow: { flexDirection: "row", gap: 8, marginTop: 12, marginBottom: 20 },
  tag: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 4,
  },
  sectionText: { fontSize: 14, color: "#374151", lineHeight: 20 },
});
