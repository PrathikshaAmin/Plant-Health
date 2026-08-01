import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { API_URL } from "../config";

export default function Register() {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !mobileNumber || !email || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        mobileNumber,
        email,
        password,
      });
      await SecureStore.setItemAsync("token", response.data.token);
      await SecureStore.setItemAsync("userId", response.data._id);
      router.replace("/(tabs)");
      // } catch (err: any) {
      //   Alert.alert(
      //     "Registration Failed",
      //     err.response?.data?.message || "Something went wrong",
      //   );
      // }
    } catch (err: any) {
      console.log(
        "REGISTER ERROR:",
        JSON.stringify(err.response?.data || err.message, null, 2),
      );
      Alert.alert(
        "Registration Failed",
        err.response?.data?.message || "Something went wrong",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 Create Account</Text>
      <Text style={styles.subtitle}>Join Plant Health</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#166534",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#15803d",
    padding: 14,
    borderRadius: 8,
    marginTop: 4,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  linkText: {
    color: "#15803d",
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
});
