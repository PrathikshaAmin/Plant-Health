import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config";

export default function MyImages() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const userId = await SecureStore.getItemAsync("userId");
        const response = await axios.get(`${API_URL}/images/user/${userId}`);
        setImages(response.data);
      } catch (err) {
        console.log("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // API_URL includes "/api", so strip it to get the base server URL for images
  const baseUrl = API_URL.replace("/api", "");

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#15803d"
          style={{ marginTop: 40 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Uploaded Images</Text>
      <FlatList
        data={images}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <Image
              source={{ uri: `${baseUrl}${item.imageUrl}` }}
              style={styles.image}
            />
            <Text style={styles.fileName}>{item.originalFileName}</Text>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No images uploaded yet</Text>
        }
      />
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 14,
    overflow: "hidden",
  },
  image: { width: "100%", height: 180 },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#166534",
    margin: 10,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#6b7280",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  emptyText: { textAlign: "center", color: "#6b7280", marginTop: 40 },
});
