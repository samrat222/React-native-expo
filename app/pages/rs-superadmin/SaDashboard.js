import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SaHome from "./tabs/SaHome";
// import Icon from 'react-native-vector-icons/FontAwesome';
import SaProfile from "./tabs/SaProfile";
import SaAgencyList from "./tabs/SaAgencyList";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import PNG
import home from "../../assets/home.png";
import list from "../../assets/list.png";
import profile from "../../assets/profile.png";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SaDashboard = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={SaHome}
        options={{
          tabBarIcon: () => (
            <Image source={home} style={{ width: 20, height: 20 }} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="AgencyList"
        component={SaAgencyList}
        options={{
          tabBarIcon: () => <Image source={list} style={styles.tabIcon} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={SaProfile}
        options={{
          tabBarIcon: () => {
            return <Image source={profile} style={styles.tabIcon} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default SaDashboard;

const styles = StyleSheet.create({
  text: {
    marginTop: 20,
    fontSize: 20,
    color: "black",
  },
  tabIcon: {
    width: 20,
    height: 20,
  },
});
