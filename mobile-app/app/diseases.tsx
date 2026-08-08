import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../utils/api";

const CATEGORIES = ["Fungal", "Bacterial", "Viral", "Pest"];
const AREAS = ["Leaf", "Stem", "Root", "Fruit", "Whole Plant"];

export default function Diseases() {
  const [diseases, setDiseases] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDiseases = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (area) params.append("affectedArea", area);

      const response = await api.get(`/diseases?${params.toString()}`);
      setDiseases(response.data);
    } catch (err) {
      console.log("Error fetching diseases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, [search, category, area]);

  const toggleFilter = (type: "category" | "area", value: string) => {
    if (type === "category") setCategory(category === value ? "" : value);
    else setArea(area === value ? "" : value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Disease Library</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or symptom..."
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.filterLabel}>Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
      >
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.filterChip,
              category === c && styles.filterChipActive,
            ]}
            onPress={() => toggleFilter("category", c)}
          >
            <Text
              style={[
                styles.filterChipText,
                category === c && styles.filterChipTextActive,
              ]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.filterLabel}>Affected Area</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
      >
        {AREAS.map((a) => (
          <TouchableOpacity
            key={a}
            style={[styles.filterChip, area === a && styles.filterChipActive]}
            onPress={() => toggleFilter("area", a)}
          >
            <Text
              style={[
                styles.filterChipText,
                area === a && styles.filterChipTextActive,
              ]}
            >
              {a}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <Text style={{ marginTop: 20 }}>Loading...</Text>
      ) : (
        <FlatList
          data={diseases}
          keyExtractor={(item: any) => item._id}
          style={{ marginTop: 12 }}
          renderItem={({ item }: any) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/disease-details?id=${item._id}`)}
            >
              <Text style={styles.cardTitle}>{item.diseaseName}</Text>
              <Text style={styles.cardSubtitle}>
                {item.category} • {item.affectedArea.join(", ")}
              </Text>
              <Text style={styles.cardText} numberOfLines={2}>
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No diseases found</Text>
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
  searchInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 6,
  },
  filterRow: { marginBottom: 10 },
  filterChip: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: "#15803d", borderColor: "#15803d" },
  filterChipText: { fontSize: 13, color: "#374151" },
  filterChipTextActive: { color: "white", fontWeight: "600" },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#166534" },
  cardSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
    marginBottom: 6,
  },
  cardText: { fontSize: 13, color: "#4b5563" },
  emptyText: { textAlign: "center", color: "#6b7280", marginTop: 40 },
});
