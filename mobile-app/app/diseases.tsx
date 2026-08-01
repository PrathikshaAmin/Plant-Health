import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { API_URL } from "../config";

export default function Diseases() {
  const [diseases, setDiseases] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDiseases = async (searchTerm = "") => {
    try {
      const url = searchTerm
        ? `${API_URL}/diseases?search=${searchTerm}`
        : `${API_URL}/diseases`;
      const response = await axios.get(url);
      setDiseases(response.data);
    } catch (err) {
      console.log("Error fetching diseases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    fetchDiseases(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Disease Library</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or symptom..."
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={diseases}
          keyExtractor={(item: any) => item._id}
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
    marginBottom: 16,
  },
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
