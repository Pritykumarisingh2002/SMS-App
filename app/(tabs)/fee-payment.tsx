import axios from "axios";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Checkbox from "expo-checkbox";

import Header from "../../components/header";
// import Sidebar from "../../components/sidebar";
import TransactionTable from "../../components/transactionTable";

interface FeeItem {
  AC_NO: number;
  AC_NAME: string;
  fee: number;
}

const screenWidth = Dimensions.get("window").width;
const isMobile = screenWidth < 768;
export default function FeePayment() {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [feeData, setFeeData] = useState<FeeItem[]>([]);
  const [totalFee, setTotalFee] = useState<number>(0);
  const [paidMonths, setPaidMonths] = useState<string[]>([]);
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

  // const feePerMonth = 1500;
  // const totalAmount = selectedMonths.length * feePerMonth;
  interface FeeItem {
    AC_NO: number;
    AC_NAME: string;
    fee: number;
  }

  const monthlyFee =
    feeData.length > 0
      ? Number((feeData[0] as any).fee)
      : 0;

  const selectedFee =
    selectedMonths.length * monthlyFee;

  useEffect(() => {
    getFee();
  }, []);

  const getFee = async () => {
    try {
      const studentData =
        await AsyncStorage.getItem("student");

      if (!studentData) {
        console.log("Student not found in storage");
        return;
      }

      const student = JSON.parse(studentData);

      console.log("Logged Student:", student);

      const response = await axios.get(
        "http://192.168.1.6:5000/student-fee",
        {
          params: {
            admno: student.admno,
          },
        }
      );

      console.log("Fee Response:", response.data);

      setFeeData(response.data.fees || []);
      setTotalFee(response.data.totalFee || 0);

      if (response.data.paidMonths) {
        setPaidMonths(response.data.paidMonths);
      }

      const noterms =
        response.data.student?.noterms || 0;

      const monthsPaid = months.slice(0, noterms);

      setPaidMonths(monthsPaid);
    } catch (error) {
      console.log("Fee Fetch Error:", error);
    }
  };

  const toggleMonth = (month: string) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(
        selectedMonths.filter((m) => m !== month)
      );
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const handlePayment = () => {
    console.log(
      "Selected Months:",
      selectedMonths
    );

    console.log(
      "Payable Amount:",
      selectedFee
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />

      <View style={styles.container}>
        {/* <Sidebar /> */}

        <ScrollView style={styles.content}>
          <Text style={styles.notice}>
            PLEASE CONTACT SCHOOL ACCOUNTS OFFICE BEFORE RE-PAYMENT OF FEE IF
            FEE AMOUNT IS DEDUCTED FROM YOUR BANK ACCOUNT BUT NOT REFLECTED IN
            THE PORTAL.
          </Text>

          {/* <Text style={styles.heading}>Fee Payment</Text> */}

          <View style={[styles.cardRow, isMobile && styles.cardColumn,]}>
            {/* Monthly Fee Card */}
            <View style={styles.card}>
              <View
                style={[
                  styles.cardHeader,
                  { backgroundColor: "#00c0ef" },
                ]}
              >
                <Text style={styles.cardTitle}>
                  Monthly Fees
                </Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.monthGrid}>
                  {months.map((month) => {
                    const isPaid = paidMonths.includes(month);

                    return (
                      <View
                        key={month}
                        style={styles.monthItem}
                      >
                        <Checkbox
                          value={
                            isPaid ||
                            selectedMonths.includes(month)
                          }
                          disabled={isPaid}
                          onValueChange={() =>
                            toggleMonth(month)
                          }
                        />

                        <Text
                          style={[
                            styles.monthText,
                            isPaid && {
                              color: "green",
                              fontWeight: "bold",
                            },
                          ]}
                        >
                          {month}
                          {isPaid ? " ✓" : ""}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* <View style={styles.table}>
  <View style={styles.tableRow}>
    <Text style={styles.tableHeading}>
      Fee Type
    </Text>
    <Text style={styles.tableHeading}>
      Amount
    </Text>
  </View>

  {feeData.length === 0 ? (
    <Text>Loading Fees...</Text>
  ) : (
    feeData.map((item) => (
      <View
        key={item.AC_NO}
        style={styles.tableRow}
      >
        <Text>{item.AC_NAME}</Text>
        <Text>₹{item.fee}</Text>
      </View>
    ))
  )}

  <View style={styles.tableRow}>
    <Text style={styles.totalText}>
      Total Fee Structure
    </Text>
    <Text style={styles.totalText}>
      ₹{totalFee}
    </Text>
  </View>
</View> */}
              </View>
            </View>

            {/* Other Fee Card */}
            <View style={styles.card}>
              <View
                style={[
                  styles.cardHeader,
                  { backgroundColor: "#f39c12" },
                ]}
              >
                <Text style={styles.cardTitle}>
                  Other Fees
                </Text>
              </View>

              {/* <View style={styles.cardBody}>
                <Text style={styles.emptyText}>
                  No Other Fees Available
                </Text>
              </View> */}
              <View style={styles.cardBody}>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableHeading}>
                      Fee Type
                    </Text>
                    <Text style={styles.tableHeading}>
                      Amount
                    </Text>
                  </View>
                </View>

                {feeData.length === 0 ? (
                  <Text>Loading Fees...</Text>
                ) : (
                  feeData.map((item) => (
                    <View
                      key={item.AC_NO}
                      style={styles.tableRow}
                    >
                      <Text>{item.AC_NAME}</Text>
                      <Text>₹{item.fee}</Text>
                    </View>
                  ))
                )}

                <View style={styles.tableRow}>
                  <Text style={styles.totalText}>
                    Total Fee Structure
                  </Text>
                  <Text style={styles.totalText}>
                    ₹{totalFee}
                  </Text>
                </View>
              </View>
            </View>

            {/* Total Fee Card */}
            <View style={styles.card}>
              <View
                style={[
                  styles.cardHeader,
                  { backgroundColor: "#00a65a" },
                ]}
              >
                <Text style={styles.cardTitle}>
                  Total Fees
                </Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.tableRow}>
                  <Text>Selected Months</Text>
                  <Text>
                    {selectedMonths.length}
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text>Tuition Fees</Text>
                  <Text>₹{selectedFee}</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.totalText}>
                    Total
                  </Text>
                  <Text style={styles.totalText}>
                    ₹{selectedFee}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.payButton}
                  onPress={handlePayment}
                >
                  <Text style={styles.payButtonText}>
                    Pay Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Selected Months */}
          {/* <View style={styles.selectedBox}>
            <Text style={styles.selectedTitle}>
              Selected Months
            </Text>

            <Text>
              {selectedMonths.length > 0
                ? selectedMonths.join(", ")
                : "No month selected"}
            </Text>
          </View> */}

          {/* Transaction History */}
          <TransactionTable />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },

  content: {
    flex: 1,
    backgroundColor: "#ecf0f5",
    padding: 15,
  },

  notice: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
  },

  heading: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: "300",
  },

  cardRow: {
    flexDirection: "row",
    gap: 15,
  },

  cardColumn: {
    flexDirection: "column",
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },

  cardHeader: {
    padding: 12,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  cardBody: {
    padding: 15,
  },

  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  monthItem: {
    width: screenWidth < 768 ? "33%" : "25%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  monthText: {
    marginLeft: 8,
    fontSize: 14,
  },

  table: {
    marginTop: 15,
  },

  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    flexWrap: "wrap",
  },

  tableHeading: {
    fontWeight: "bold",
  },

  totalText: {
    fontWeight: "bold",
    fontSize: 16,
  },

  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 30,
  },

  payButton: {
    marginTop: 20,
    backgroundColor: "#3498db",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },

  payButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  selectedBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  selectedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});