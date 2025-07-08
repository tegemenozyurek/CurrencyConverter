import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function Navbar({ activeItem, setActiveItem }) {
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

const styles = StyleSheet.create({
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
    paddingBottom: 25,
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
}); 