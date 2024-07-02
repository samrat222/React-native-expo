import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import AgencyBrokerDashboard from "./pages/agency-broker/AgencyBrokerDashboard";
import AgencySuperadminDashboard from "./pages/agency-superadmin/AgencySuperadminDashboard";
import SubAdminDashboard from "./pages/rs-subadmin/SubAdminDashboard";
import SaDashboard from "./pages/rs-superadmin/SaDashboard";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/Login";
import CreateAgency from "./pages/rs-superadmin/tabs/CreateAgency";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const CommonStack = () => {
  const { user, setUser } = useContext(AuthContext);

  const checkToken = async () => {
    const token = AsyncStorage.getItem("token");
    if (token) {
      setUser(token);
    } else {
      setUser(null);
    }
  };
  useEffect(() => {
    checkToken();
  }, []);

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Group>
          <Stack.Screen
            name="SaDashboard"
            intiinitialRouteName="SaDashboard"
            component={SaDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SubAdminDashboard"
            component={SubAdminDashboard}
          />
          <Stack.Screen
            name="AgencySuperadminDashboard"
            component={AgencySuperadminDashboard}
          />
          <Stack.Screen
            name="AgencyBrokerDashboard"
            component={AgencyBrokerDashboard}
          />
          <Stack.Screen
            name="CreateAgency"
            component={CreateAgency}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            intiinitialRouteName="Login"
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default CommonStack;
