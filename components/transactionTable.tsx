import React from "react";
import { View, Text } from "react-native";

export default function TransactionTable() {
  return (
    <View
      style={{
        marginTop: 30,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
      }}
    >
      <View
        style={{
          backgroundColor: "#00c0ef",
          padding: 15,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Transaction History
        </Text>
      </View>

      <View style={{ padding: 15 }}>
        <Text>No Transaction Found</Text>
      </View>
    </View>
  );
}