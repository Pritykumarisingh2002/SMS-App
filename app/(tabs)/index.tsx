import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;
export default function Dashboard() {
  const [profileVisible, setProfileVisible] = useState(false);
  const [student, setStudent] = useState<any>(null);
  useEffect(() => {
    loadStudent();
  }, []);

  const loadStudent = async () => {
    try {
      const data = await AsyncStorage.getItem("student");

      if (data) {
        setStudent(JSON.parse(data));
      } else {
        router.replace("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("student");

      setProfileVisible(false);

      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (!student) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }
  return (

    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Dashboard</Text>
            <Text style={styles.pageSubtitle}>
              Information
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setProfileVisible(true)}
          >
            <Ionicons
              name="person-circle"
              size={60}
              color="#3c8dbc"
            />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingCard}>
          <Text style={styles.greeting}>
            {getGreeting()}, {student.name}
          </Text>

          <Text style={styles.greetingSub}>
            Welcome to Student Portal
          </Text>
        </View>

        {/* Cards */}
<View style={styles.studentCard}>
  <Text style={styles.studentTitle}>
    Student Details
  </Text>

  <View style={styles.studentBody}>
    <Text>Name : {student.name}</Text>
    <Text>Class : {student.CLCAPTION}</Text>
    <Text>Section : {student.section}</Text>
    <Text>Adm No : {student.admno}</Text>
    <Text>Mobile : {student.m_phone}</Text>
  </View>
</View>

<View style={styles.statsRow}>
  <View style={styles.feeCard}>
    <FontAwesome5
      name="rupee-sign"
      size={40}
      color="rgba(255,255,255,0.3)"
    />

    <Text style={styles.bigNumber}>₹0</Text>

    <Text style={styles.cardText}>
      Pending Fees
    </Text>
  </View>

  <View style={styles.attendanceCard}>
    <Ionicons
      name="stats-chart"
      size={45}
      color="rgba(255,255,255,0.3)"
    />

    <Text style={styles.bigNumber}>
      100%
    </Text>

    <Text style={styles.cardText}>
      Attendance
    </Text>
  </View>
</View>

        {/* Calendar */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#fff"
            />

            <Text style={styles.calendarTitle}>
              Calendar & Events
            </Text>
          </View>

          <View style={styles.calendarBody}>
            <Text style={styles.month}>
              {new Date().toLocaleString(
                "default",
                {
                  month: "long",
                  year: "numeric",
                }
              )}
            </Text>

            <Text style={styles.event}>
              • Independence Day - 15 Aug
            </Text>

            <Text style={styles.event}>
              • Teachers Day - 05 Sep
            </Text>

            <Text style={styles.event}>
              • Gandhi Jayanti - 02 Oct
            </Text>

            <Text style={styles.event}>
              • Christmas - 25 Dec
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <Modal
        visible={profileVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModal}>
            <Ionicons
              name="person-circle"
              size={90}
              color="#3c8dbc"
            />

            <Text style={styles.profileName}>
              {student.name}
            </Text>

            <Text>
              Admission No : {student.admno}
            </Text>

            <Text>
              Mobile No : {student.m_phone}
            </Text>

            <Text>
              Class : {student.CLCAPTION}
            </Text>

            <Text>
              Section : {student.section}
            </Text>

            {/* <Text>
              Section : {student.dob}
            </Text> */}

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>
                Logout
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setProfileVisible(false)
              }
            >
              <Text style={{ marginTop: 15 }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f5",
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  pageTitle: {
    fontSize: 32,
    color: "#444",
  },

  pageSubtitle: {
    color: "#888",
  },

  greetingCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },

  greeting: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },

  greetingSub: {
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },

  statsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 20,
},

  studentCard: {
    // flex: 1,
    backgroundColor: "#d2d6de",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
  },

  studentTitle: {
    backgroundColor: "#c1c7d1",
    padding: 12,
    fontWeight: "bold",
  },

  studentBody: {
    padding: 12,
    gap: 6,
  },

  feeCard: {
    flex: 1,
    backgroundColor: "#00c0ef",
    padding: 15,
    borderRadius: 8,
    marginRight: 6,
  minHeight: 130,
  },

  attendanceCard: {
    flex: 1,
    backgroundColor: "#00a65a",
    padding: 15,
    borderRadius: 8,
    marginLeft: 6,
  minHeight: 130,
  },

  bigNumber: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },

  cardText: {
    color: "#fff",
    marginTop: 5,
  },

  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },

  calendarHeader: {
    backgroundColor: "#00a65a",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  calendarTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },

  calendarBody: {
    padding: 15,
  },

  month: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },

  event: {
    marginBottom: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  profileModal: {
    width: 320,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
  },

  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  logoutBtn: {
    backgroundColor: "#dd4b39",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 20,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});