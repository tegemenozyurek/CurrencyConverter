import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ContactScreen() {
  const emailAddress = 'egemenozyurek@outlook.com';
  
  const handleEmailPress = () => {
    Clipboard.setString(emailAddress);
    Alert.alert('Copied!', 'Email address copied to clipboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="mail-outline" size={80} color="#3498db" />
      </View>
      
      <Text style={styles.title}>Contact Us</Text>
      
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Help us improve our application.
        </Text>
        <Text style={styles.message}>
          For suggestions and feedback:
        </Text>
      </View>
      
      <TouchableOpacity style={styles.emailButton} onPress={handleEmailPress}>
        <Ionicons name="copy-outline" size={20} color="white" style={styles.emailIcon} />
        <Text style={styles.emailText}>{emailAddress}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
  },
  messageContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  emailIcon: {
    marginRight: 10,
  },
  emailText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 