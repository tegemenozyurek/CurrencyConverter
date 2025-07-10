import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Import components from tabs folder
import Navbar from './tabs/Navbar';
import QuickConvertScreen from './tabs/QuickConvertScreen';
import ExchangeOfficeScreen from './tabs/ExchangeOfficeScreen';
import HistoryScreen from './tabs/HistoryScreen';
import ContactScreen from './tabs/ContactScreen';

export default function App() {
  const [activeItem, setActiveItem] = useState('quick-convert');
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  // Offline currency rates caching
  useEffect(() => {
    initializeRatesCache();
  }, []);

  const initializeRatesCache = async () => {
    try {
      // Check internet connection
      const networkState = await NetInfo.fetch();
      
      if (networkState.isConnected) {
        console.log('Internet connected - Updating currency rates cache...');
        await updateRatesCache();
      } else {
        console.log('No internet - Using cached rates if available');
      }
    } catch (error) {
      console.error('Error initializing rates cache:', error);
    }
  };

  const updateRatesCache = async () => {
    try {
      // Fetch rates for all major currencies
      const baseCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY'];
      const allRates = {};
      
      for (const baseCurrency of baseCurrencies) {
        try {
          const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
          const data = await response.json();
          
          if (data.rates) {
            allRates[baseCurrency] = {
              rates: data.rates,
              lastUpdated: new Date().toISOString(),
            };
          }
        } catch (error) {
          console.warn(`Failed to fetch rates for ${baseCurrency}:`, error);
        }
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem('cachedExchangeRates', JSON.stringify(allRates));
      await AsyncStorage.setItem('ratesLastUpdated', new Date().toISOString());
      
      console.log('Currency rates cache updated successfully');
    } catch (error) {
      console.error('Error updating rates cache:', error);
    }
  };

  const handleSetActiveItem = (item) => {
    setActiveItem(item);
    if (item === 'history') {
      setHistoryRefreshKey(prev => prev + 1);
    }
  };

  const renderScreen = () => {
    switch (activeItem) {
      case 'quick-convert':
        return <QuickConvertScreen />;
      case 'exchange-office':
        return <ExchangeOfficeScreen />;
      case 'history':
        return <HistoryScreen key={historyRefreshKey} />;
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
      <Navbar activeItem={activeItem} setActiveItem={handleSetActiveItem} />
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
