import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeRolesFromToken } from "../utilities/helper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(2, "Password too short!").required("Required"),
});

const Login = () => {
  // const {setUser} = useContext(AuthContext)
  const [Loading, setLoading] = useState(false);
  const { user, login } = useContext(AuthContext);
  const { navigate } = useNavigation();

  const handleLogin = async (username, password) => {
    setLoading(true);
    const userData = { username, password };

    const roles = await login(userData);
    if (roles) {
      if (roles === 1) {
        navigate("SaDashboard");
      } else if (roles === 2) {
        navigate("SubAdminDashboard");
      } else if (roles === 4) {
        navigate("AgencyBrokerDashboard");
      }
    } else {
      //
    }
    setLoading(false);
  };

  if (Loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="0000ff" />
        <Text style={{ color: "black" }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Sign in </Text>
      </View>
      <Formik
        initialValues={{
          email: "superadmin@rent-savvy.com",
          password: "Welcome01#",
        }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          // Handle form submission
          console.log(values);
          await handleLogin(values.email, values.password);
          // console.log(handleLogin());
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <Text style={styles.headingText}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && touched.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            <Text style={styles.headingText}>Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <Button onPress={handleSubmit} title="Sigin" />
          </View>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: "#000000",
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
  headingText: {
    color: "#000000",
  },
  title: {
    fontSize: 20,
    color: "#000000",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: StatusBar.currentHeight,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Login;
