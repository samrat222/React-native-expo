import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState } from "react";
import { decodeRolesFromToken } from "../utilities/helper";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const { navigate } = useNavigation();

  // Function to log in the user
  const login = async (userData) => {
    try {
      const resp = await fetch("https://rs-be.octopi-labs.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (resp.ok) {
        const response = await resp.json();
        if (response.accessToken) {
          console.log(response.accessToken);
          await AsyncStorage.setItem("token", response.accessToken);
          setUser(response.accessToken);
          console.log("Token stored successfully");
          const roles = await decodeRolesFromToken();
          return roles;
        }
      } else {
        // Handle error response
        console.error("Login failed:", result.message);
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert(
        "Login Failed",
        "Something went wrong. Please try again later."
      );
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
