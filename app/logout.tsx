import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function Logout() {
  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.removeItem("student");
      router.replace("/login");
    };

    logout();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}