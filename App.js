import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// Navbar Component
function Navbar({ activeItem, setActiveItem }) {
  const menuItems = [
    { 
      id: 'quick-convert', 
      label: 'Convert',
      icon: 'swap-horizontal',
      iconType: 'Ionicons'
    },
    { 
      id: 'exchange-office', 
      label: 'Find Cash',
      icon: 'attach-money',
      iconType: 'MaterialIcons'
    },
    { 
      id: 'history', 
      label: 'History',
      icon: 'time-outline',
      iconType: 'Ionicons'
    },
    { 
      id: 'contact', 
      label: 'Contact',
      icon: 'call-outline',
      iconType: 'Ionicons'
    }
  ];

  const renderIcon = (item, isActive) => {
    const iconColor = isActive ? 'white' : '#7f8c8d';
    const iconSize = 24;

    if (item.iconType === 'Ionicons') {
      return <Ionicons name={item.icon} size={iconSize} color={iconColor} />;
    } else if (item.iconType === 'MaterialIcons') {
      return <MaterialIcons name={item.icon} size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbar}>
        <View style={styles.navbarContent}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                activeItem === item.id && styles.navItemActive
              ]}
              onPress={() => setActiveItem(item.id)}
            >
              {renderIcon(item, activeItem === item.id)}
              <Text style={[
                styles.navText,
                activeItem === item.id && styles.navTextActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// Content Components
function QuickConvertScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Quick Convert</Text>
      <Text style={styles.screenContent}>Currency conversion will be implemented here</Text>
    </View>
  );
}

function ExchangeOfficeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Find Exchange Office</Text>
      <Text style={styles.screenContent}>Map and exchange office locations will be shown here</Text>
    </View>
  );
}

function HistoryScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>History</Text>
      <Text style={styles.screenContent}>Your conversion history will be displayed here</Text>
    </View>
  );
}

function ContactScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Contact Us</Text>
      <Text style={styles.screenContent}>Contact information and support options</Text>
    </View>
  );
}

export default function App() {
  const [activeItem, setActiveItem] = useState('quick-convert');

  const renderScreen = () => {
    switch (activeItem) {
      case 'quick-convert':
        return <QuickConvertScreen />;
      case 'exchange-office':
        return <ExchangeOfficeScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'contact':
        return <ContactScreen />;
      default:
        return <QuickConvertScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Content with padding bottom for navbar */}
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.content}>
          {renderScreen()}
        </View>
      </SafeAreaView>

      {/* Fixed navbar at bottom */}
      <Navbar activeItem={activeItem} setActiveItem={setActiveItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 100, // Increased space for bigger navbar
  },
  content: {
    flex: 1,
    padding: 20,
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navbar: {
    paddingVertical: 16,
    paddingBottom: 25, // Extra padding for safe area
    minHeight: 80,
  },
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  navItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: screenWidth / 4 - 20,
    minHeight: 50,
  },
  navItemActive: {
    backgroundColor: '#3498db',
    transform: [{ scale: 1.08 }],
  },
  navText: {
    fontSize: 10,
    color: '#7f8c8d',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
  navTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
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
