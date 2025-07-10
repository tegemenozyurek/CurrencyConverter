import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('conversionHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all conversion history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('conversionHistory');
              setHistory([]);
            } catch (error) {
              console.error('Error clearing history:', error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="time-outline" size={24} color="#fff" />
          </View>
          <Text style={styles.title}>Conversion History</Text>
          <Text style={styles.subtitle}>Your recent currency conversions</Text>
        </View>
        
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* History List */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="hourglass-outline" size={48} color="#667eea" />
            </View>
            <Text style={styles.emptyTitle}>No History Yet</Text>
            <Text style={styles.emptyText}>
              Your conversion history will appear here after you make your first currency conversion.
            </Text>
          </View>
        ) : (
          <View style={styles.historyContainer}>
            {history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <LinearGradient
                  colors={['#fff', '#f8f9fa']}
                  style={styles.historyCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Conversion Details */}
                  <View style={styles.conversionDetails}>
                    <View style={styles.amountRow}>
                      <View style={styles.fromAmount}>
                        <Text style={styles.amountValue}>{formatNumber(item.amount)}</Text>
                        <Text style={styles.currencyCode}>{item.fromCurrency}</Text>
                      </View>
                      
                      <View style={styles.arrowContainer}>
                        <Ionicons name="arrow-forward" size={20} color="#667eea" />
                      </View>
                      
                      <View style={styles.toAmount}>
                        <Text style={styles.resultValue}>{item.result}</Text>
                        <Text style={styles.currencyCode}>{item.toCurrency}</Text>
                      </View>
                    </View>
                    
                    {/* Exchange Rate */}
                    <View style={styles.rateContainer}>
                      <Ionicons 
                        name={item.isOffline ? "cloud-offline" : "trending-up"} 
                        size={14} 
                        color={item.isOffline ? "#ff9500" : "#11998e"} 
                      />
                      <Text style={styles.rateText}>
                        1 {item.fromCurrency} = {item.exchangeRate < 1 
                          ? item.exchangeRate.toFixed(6) 
                          : item.exchangeRate.toFixed(4)} {item.toCurrency}
                      </Text>
                      {item.isOffline && (
                        <View style={styles.offlineBadge}>
                          <Text style={styles.offlineBadgeText}>OFFLINE</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {/* Timestamp */}
                  <View style={styles.timestampContainer}>
                    <Ionicons name="time-outline" size={12} color="#6c757d" />
                    <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.08,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ff6b6b',
    gap: 6,
  },
  clearButtonText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  },
  historyContainer: {
    paddingBottom: 20,
  },
  historyItem: {
    marginBottom: 16,
  },
  historyCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  conversionDetails: {
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fromAmount: {
    flex: 1,
    alignItems: 'flex-start',
  },
  toAmount: {
    flex: 1,
    alignItems: 'flex-end',
  },
  arrowContainer: {
    marginHorizontal: 15,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11998e',
    marginBottom: 2,
  },
  currencyCode: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  rateText: {
    fontSize: 12,
    color: '#11998e',
    fontWeight: '500',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  offlineBadge: {
    backgroundColor: '#ff9500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  offlineBadgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
}); 