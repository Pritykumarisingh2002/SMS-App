import { View, Text, TouchableOpacity } from "react-native";

export default function Sidebar() {
  return (
    <View
      style={{
        width: 260,
        backgroundColor: "#222d32",
      }}
    >
      <View
        style={{
          padding: 20,
          backgroundColor: "#1a2226",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Student Portal BHS
        </Text>
      </View>

      <View
        style={{
          padding: 20,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          1726
        </Text>

        <Text
          style={{
            color: "#fff",
            marginTop: 5,
          }}
        >
          PRITY SINGH
        </Text>
      </View>

      <TouchableOpacity
        style={{
          padding: 15,
          backgroundColor: "#1e282c",
        }}
      >
        <Text style={{ color: "#fff" }}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          padding: 15,
          backgroundColor: "#1e282c",
          marginTop: 1,
        }}
      >
        <Text style={{ color: "#fff" }}>Fee Payment</Text>
      </TouchableOpacity>
    </View>
  );
}