import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import api from "../utils/api";

// A simple check to tell an email apart from a mobile number as the user types
const isEmail = (value: string) => value.includes("@");

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // email OR mobile number
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const trimmed = identifier.trim();
      const payload = isEmail(trimmed)
        ? { email: trimmed, password }
        : { mobileNumber: trimmed, password };

      const response = await api.post("/auth/login", payload);
      await SecureStore.setItemAsync("token", response.data.token);
      await SecureStore.setItemAsync("userId", response.data._id);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Login Failed",
        err.response?.data?.message || "Something went wrong",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 Plant Health</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or Mobile Number"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text
          style={{
            color: "#15803d",
            textAlign: "center",
            marginTop: 16,
            fontSize: 14,
          }}
        >
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/forgot-password")}>
        <Text
          style={{
            color: "#6b7280",
            textAlign: "center",
            marginTop: 12,
            fontSize: 13,
          }}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f0fdf4",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#166534",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#15803d",
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
