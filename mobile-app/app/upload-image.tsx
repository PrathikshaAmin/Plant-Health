import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../utils/api";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function UploadImage() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedInfo, setUploadedInfo] = useState<any>(null);
  const router = useRouter();
  const { diagnosisId } = useLocalSearchParams();

  const pickImage = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to continue");
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setUploadedInfo(null);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return;
    setUploading(true);

    try {
      const fileName = imageUri.split("/").pop() || "photo.jpg";
      const fileType = fileName.split(".").pop();

      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);
      // userId is no longer sent — the server identifies the owner from the JWT

      const response = await api.post("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadedInfo(response.data);
    } catch (err: any) {
      Alert.alert(
        "Upload Failed",
        err.response?.data?.message || "Something went wrong",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Plant Photo</Text>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={() => pickImage(true)}>
        <Text style={styles.buttonText}>📷 Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => pickImage(false)}>
        <Text style={styles.buttonText}>🖼️ Choose from Gallery</Text>
      </TouchableOpacity>

      {imageUri && !uploadedInfo && (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={uploadImage}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={[styles.buttonText, { color: "white" }]}>Upload</Text>
          )}
        </TouchableOpacity>
      )}

      {uploadedInfo && (
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>✅ Upload Successful</Text>
          <Text style={styles.successText}>
            File: {uploadedInfo.originalFileName}
          </Text>
          <Text style={styles.successText}>
            Size: {(uploadedInfo.fileSize / 1024).toFixed(1)} KB
          </Text>
          <Text style={styles.successText}>
            Uploaded: {new Date(uploadedInfo.createdAt).toLocaleString()}
          </Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setImageUri(null);
              setUploadedInfo(null);
            }}
          >
            <Text style={[styles.buttonText, { color: "white" }]}>
              Upload Another
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/my-images")}
          >
            <Text style={[styles.buttonText, { color: "white" }]}>
              View All My Images
            </Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 20,
  },
  placeholder: {
    height: 220,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderText: { color: "#9ca3af" },
  preview: { height: 220, borderRadius: 10, marginBottom: 20 },
  button: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#15803d",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: "#15803d",
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  secondaryButton: {
    backgroundColor: "#15803d",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#15803d",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
  },
  successCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 10,
    marginTop: 10,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 8,
  },
  successText: { fontSize: 14, color: "#4b5563", marginBottom: 4 },
});
