import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const AgencySuperadminDashboard = () => {
  return (
    <View>
      <Text style={styles.Text}>This is Agency Superadmin Dashboard</Text>
    </View>
  );
};

export default AgencySuperadminDashboard;

const styles = StyleSheet.create({
  Text: {
    marginTop: 20,
    fontSize: 20,
    color: 'black',
  },
});
