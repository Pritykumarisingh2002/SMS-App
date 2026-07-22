import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.6:5000";

interface FeeHead {
  head: string;
  amount: number;
}

interface Transaction {
  receiptNo: string;
  date: string;
  amount: number;
  transactionId: string;
  feeHeads: FeeHead[];
}

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
  try {
    const studentData = await AsyncStorage.getItem("student");

    console.log("Stored Student:", studentData);

    if (!studentData) {
      setLoading(false);
      return;
    }

    const student = JSON.parse(studentData);

    console.log("Student Admno:", student.admno);

    const response = await axios.get(
      `${BASE_URL}/transaction-history`,
      {
        params: {
          admno: student.admno,
        },
      }
    );

    console.log(
      "Transaction Response:",
      JSON.stringify(response.data, null, 2)
    );

    if (response.data.success) {
      setTransactions(response.data.transactions || []);
    }

    setLoading(false);
  } catch (error) {
    console.log("Transaction Error:", error);
    setLoading(false);
  }
};

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
        {loading ? (
          <ActivityIndicator size="large" />
        ) : transactions.length === 0 ? (
          <Text>No Transaction Found</Text>
        ) : (
          transactions.map((item) => (
            <View
              key={item.receiptNo}
              style={{
                marginBottom: 20,
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Receipt No: {item.receiptNo}
              </Text>

              <Text>Date: {item.date}</Text>
              <Text>
                Transaction ID: {item.transactionId}
              </Text>

              <Text
                style={{
                  marginTop: 10,
                  fontWeight: "bold",
                }}
              >
                Fee Details
              </Text>

              {item.feeHeads.map((fee, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 4,
                  }}
                >
                  <Text>{fee.head}</Text>
                  <Text>₹{fee.amount}</Text>
                </View>
              ))}

              <View
                style={{
                  marginTop: 10,
                  borderTopWidth: 1,
                  borderColor: "#ddd",
                  paddingTop: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Total Paid
                </Text>

                <Text
                  style={{
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  ₹{item.amount}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}