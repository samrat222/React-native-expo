import {
  ActivityIndicator,
  Button,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
// import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";

import CreateAgency from "./CreateAgency";

const SaAgencyList = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const callListApi = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const resp = await fetch(
        `https://rs-be.octopi-labs.com/api/1.0.0/brokerList?pageNo=0&pageSize=20&sortOrder=desc`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-JWT-Assertion": token,
          },
        }
      );
      if (resp.ok) {
        const response = await resp.json();
        setData(response.data);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callListApi();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>
        {item.firstName} {item.lastName}
      </Text>
      {/* <Text style={styles.cell}>{item.roleName}</Text> */}
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.phoneNo}</Text>
      <Text
        style={[
          styles.cell,
          item.statusID === 1 ? styles.active : styles.inactive,
        ]}
      >
        {item.statusID === 1 ? "Active" : "Inactive"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="0000ff" />
        <Text style={{ color: "black" }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="Create Agency"
        onPress={() => navigation.navigate("CreateAgency")}
      />
      {/* <FullPageLoader isActive={loading} /> */}
      <Text style={styles.title}>Agencies</Text>
      <View style={styles.table}>
        <View style={styles.header}>
          <Text style={styles.headerCell}>BrokerName</Text>
          {/* <Text style={styles.headerCell}>Role</Text> */}
          <Text style={styles.headerCell}>Email</Text>
          <Text style={styles.headerCell}>Phone</Text>
          <Text style={styles.headerCell}>Status</Text>
        </View>
        {data && (
          <FlatList
            data={data.brokerListDTOS}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </View>
  );
};

export default SaAgencyList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "black",
  },
  table: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "black",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    color: "black",
  },
  active: {
    color: "green",
  },
  inactive: {
    color: "red",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: StatusBar.currentHeight,
    justifyContent: "center",
    alignItems: "center",
  },
});
