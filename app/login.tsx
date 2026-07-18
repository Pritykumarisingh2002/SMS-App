import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const BASE_URL = "http://192.168.1.6:5000";

export default function Login() {
  const [admno, setAdmno] = useState("");
  const [m_phone, setMphone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!admno.trim() || !m_phone.trim()) {
      Alert.alert(
        "Validation",
        "Please enter Admission Number and Mobile Number"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/student-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admno,
            m_phone,
          }),
        }
      );

      const data = await response.json();

      console.log("Login Response:", data);

      if (data.success) {
        await AsyncStorage.setItem(
          "student",
          JSON.stringify(data.student)
        );

        router.replace("/(tabs)/fee-payment");
      } else {
        Alert.alert(
          "Login Failed",
          data.message || "Invalid credentials"
        );
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Student Login
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Admission Number"
          value={admno}
          onChangeText={setAdmno}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={m_phone}
          onChangeText={setMphone}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Login
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: 350,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 25,
    elevation: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3c8dbc",
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 15,
  },

  button: {
    backgroundColor: "#3c8dbc",
    padding: 14,
    borderRadius: 6,
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});