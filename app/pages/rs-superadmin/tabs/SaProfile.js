import { Button, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@/app/context/AuthContext";

const SaProfile = () => {
  const { setUser } = useContext(AuthContext);
  const { navigate } = useNavigation();
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      console.log("Token removed successfully");
      setUser(null);
      // navigate("Login");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "black" }}>This is Super Admin Profile page</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default SaProfile;

const styles = StyleSheet.create({});
