import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const SubAdminDashboard = () => {
  return (
    <View>
      <Text style={styles.text}>This is SubAdmin Dashboard</Text>
    </View>
  );
};

export default SubAdminDashboard;

const styles = StyleSheet.create({
  text: {
    marginTop: 20,
    fontSize: 20,
    color: 'black',
  },
});
