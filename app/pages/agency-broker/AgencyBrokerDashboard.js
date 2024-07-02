import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const AgencyBrokerDashboard = () => {
  return (
    <View>
      <Text style={styles.Text}>This is Agency Broker Dashboard</Text>
    </View>
  );
};

export default AgencyBrokerDashboard;

const styles = StyleSheet.create({
  Text: {
    marginTop: 20,
    fontSize: 20,
    color: 'black',
  },
});
