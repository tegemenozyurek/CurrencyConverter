import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useState } from 'react';

// Import components from tabs folder
import Navbar from './tabs/Navbar';
import QuickConvertScreen from './tabs/QuickConvertScreen';
import ExchangeOfficeScreen from './tabs/ExchangeOfficeScreen';
import HistoryScreen from './tabs/HistoryScreen';
import ContactScreen from './tabs/ContactScreen';

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
});
