import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Header() {
  const [profileVisible, setProfileVisible] =
    useState(false);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    loadStudent();
  }, []);

  const loadStudent = async () => {
    try {
      const data =
        await AsyncStorage.getItem("student");

      if (data) {
        setStudent(JSON.parse(data));
      }
    } catch (error) {
      console.log(error);
    }
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

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>
          Baridih High School
        </Text>

        <TouchableOpacity
          onPress={() => setProfileVisible(true)}
        >
          <Ionicons
            name="person-circle"
            size={42}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

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
              {student?.name}
            </Text>

            <Text>
              Admission No : {student?.admno}
            </Text>

            <Text>
              Mobile No : {student?.m_phone}
            </Text>

            <Text>
              Class : {student?.CLCAPTION}
            </Text>

            <Text>
              Section : {student?.section}
            </Text>

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
  header: {
    height: 60,
    backgroundColor: "#3c8dbc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
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