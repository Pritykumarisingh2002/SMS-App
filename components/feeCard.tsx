import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface Props {
  title: string;
  color: string;
  type: string;
}

export default function FeeCard({
  title,
  color,
  type,
}: Props) {
  const months = [
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
    "JAN",
    "FEB",
    "MAR",
  ];

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: color,
          },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.body}>
        {type === "monthly" && (
          <>
            <View style={styles.monthGrid}>
              {months.map((m) => (
                <Text key={m}>{m}</Text>
              ))}
            </View>

            <View style={styles.table}>
              <View style={styles.row}>
                <Text>Tuition Fee</Text>
                <Text>0.00</Text>
              </View>

              <View style={styles.row}>
                <Text>Total</Text>
                <Text>0.00</Text>
              </View>
            </View>
          </>
        )}

        {type === "total" && (
          <TouchableOpacity
            style={{
              backgroundColor: "#5bc0de",
              padding: 10,
              borderRadius: 4,
              marginTop: 20,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "#fff" }}>
              Pay Now
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  header: {
    padding: 12,
  },

  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  body: {
    padding: 12,
  },

  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  table: {
    marginTop: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
});