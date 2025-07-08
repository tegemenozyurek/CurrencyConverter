import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QuickConvertScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Quick Convert</Text>
      <Text style={styles.screenContent}>Currency conversion will be implemented here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  screenContent: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 