import { Text, View } from "react-native";
import React, { useContext } from "react";

// navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import Login from "./screens/Login";
import SaDashboard from "./pages/rs-superadmin/SaDashboard";
import SubAdminDashboard from "./pages/rs-subadmin/SubAdminDashboard";
import AgencySuperadminDashboard from "./pages/agency-superadmin/AgencySuperadminDashboard";
import AgencyBrokerDashboard from "./pages/agency-broker/AgencyBrokerDashboard";
import SaAgencyList from "./pages/rs-superadmin/tabs/SaAgencyList";
import CreateAgency from "./pages/rs-superadmin/tabs/CreateAgency";
import { AuthProvider } from "./context/AuthContext";
import CommonStack from "./CommonStack";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <CommonStack />
    </AuthProvider>
  );
};

export default App;
