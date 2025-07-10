import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const CURRENCIES = [
  { label: '🇺🇸 USD - US Dollar', value: 'USD' },
  { label: '🇪🇺 EUR - Euro', value: 'EUR' },
  { label: '🇹🇷 TRY - Turkish Lira', value: 'TRY' },
  { label: '🇬🇧 GBP - British Pound', value: 'GBP' },
  { label: '🇯🇵 JPY - Japanese Yen', value: 'JPY' },
  { label: '🇨🇭 CHF - Swiss Franc', value: 'CHF' },
  { label: '🇨🇦 CAD - Canadian Dollar', value: 'CAD' },
  { label: '🇦🇺 AUD - Australian Dollar', value: 'AUD' },
  { label: '🇨🇳 CNY - Chinese Yuan', value: 'CNY' },
  { label: '🇮🇳 INR - Indian Rupee', value: 'INR' },
  { label: '🇰🇷 KRW - South Korean Won', value: 'KRW' },
  { label: '🇷🇺 RUB - Russian Ruble', value: 'RUB' },
  { label: '🇧🇷 BRL - Brazilian Real', value: 'BRL' },
  { label: '🇿🇦 ZAR - South African Rand', value: 'ZAR' },
  { label: '🇲🇽 MXN - Mexican Peso', value: 'MXN' },
  { label: '🇸🇬 SGD - Singapore Dollar', value: 'SGD' },
  { label: '🇭🇰 HKD - Hong Kong Dollar', value: 'HKD' },
  { label: '🇳🇴 NOK - Norwegian Krone', value: 'NOK' },
  { label: '🇸🇪 SEK - Swedish Krona', value: 'SEK' },
  { label: '🇩🇰 DKK - Danish Krone', value: 'DKK' },
  { label: '🇵🇱 PLN - Polish Złoty', value: 'PLN' },
  { label: '🇨🇿 CZK - Czech Koruna', value: 'CZK' },
  { label: '🇭🇺 HUF - Hungarian Forint', value: 'HUF' },
  { label: '🇦🇪 AED - UAE Dirham', value: 'AED' },
  { label: '🇸🇦 SAR - Saudi Riyal', value: 'SAR' },
  { label: '🇮🇱 ILS - Israeli Shekel', value: 'ILS' },
  { label: '🇰🇼 KWD - Kuwaiti Dinar', value: 'KWD' },
  { label: '🇶🇦 QAR - Qatari Riyal', value: 'QAR' },
  { label: '🇪🇬 EGP - Egyptian Pound', value: 'EGP' },
  { label: '🇹🇭 THB - Thai Baht', value: 'THB' },
  { label: '🇲🇾 MYR - Malaysian Ringgit', value: 'MYR' },
  { label: '🇵🇭 PHP - Philippine Peso', value: 'PHP' },
  { label: '🇮🇩 IDR - Indonesian Rupiah', value: 'IDR' },
  { label: '🇻🇳 VND - Vietnamese Dong', value: 'VND' },
  { label: '🇳🇿 NZD - New Zealand Dollar', value: 'NZD' },
  { label: '🇦🇷 ARS - Argentine Peso', value: 'ARS' },
  { label: '🇨🇱 CLP - Chilean Peso', value: 'CLP' },
  { label: '🇨🇴 COP - Colombian Peso', value: 'COP' },
  { label: '🇵🇪 PEN - Peruvian Sol', value: 'PEN' },
  { label: '🇺🇾 UYU - Uruguayan Peso', value: 'UYU' },
];

export default function QuickConvertScreen() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [slideAnim] = useState(new Animated.Value(50));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for amount input
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => pulseLoop.stop();
  }, []);

  const getExchangeRateFromCache = async (from, to) => {
    try {
      const cachedRates = await AsyncStorage.getItem('cachedExchangeRates');
      if (cachedRates) {
        const rates = JSON.parse(cachedRates);
        if (rates[from] && rates[from].rates[to]) {
          return {
            rate: rates[from].rates[to],
            lastUpdated: rates[from].lastUpdated,
            isFromCache: true
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error reading cached rates:', error);
      return null;
    }
  };

  const fetchExchangeRateOnline = async (from, to) => {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const data = await response.json();
      
      if (data.rates[to]) {
        return {
          rate: data.rates[to],
          lastUpdated: new Date().toISOString(),
          isFromCache: false
        };
      }
      return null;
    } catch (error) {
      console.error('Online API Error:', error);
      return null;
    }
  };

  const fetchExchangeRate = async () => {
    if (!amount || amount === '0' || isNaN(parseFloat(amount))) {
      Alert.alert('Invalid Input', 'Please enter a valid numeric amount');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Amount must be greater than zero');
      return;
    }

    setLoading(true);
    setIsOffline(false);

    try {
      // Check internet connection
      const networkState = await NetInfo.fetch();
      let rateData = null;

      if (networkState.isConnected) {
        // Try to get live rates first
        rateData = await fetchExchangeRateOnline(fromCurrency, toCurrency);
        
        if (!rateData) {
          // If online fetch fails, fallback to cache
          rateData = await getExchangeRateFromCache(fromCurrency, toCurrency);
          setIsOffline(true);
        }
      } else {
        // No internet, use cached rates
        rateData = await getExchangeRateFromCache(fromCurrency, toCurrency);
        setIsOffline(true);
      }

      if (rateData && rateData.rate) {
        const rate = rateData.rate;
        const convertedAmount = (parseFloat(amount) * rate);
        
        // Format result based on currency
        let formattedResult;
        if (toCurrency === 'JPY' || toCurrency === 'KRW' || toCurrency === 'VND' || toCurrency === 'IDR') {
          formattedResult = Math.round(convertedAmount).toLocaleString();
        } else {
          formattedResult = convertedAmount.toFixed(2);
        }
        
        setExchangeRate(rate);
        setResult(formattedResult);
        
        // Save to history
        await saveToHistory({
          amount: parseFloat(amount),
          fromCurrency,
          toCurrency,
          result: formattedResult,
          exchangeRate: rate,
          isOffline: rateData.isFromCache,
          timestamp: rateData.lastUpdated,
        });
        
        // Enhanced result animation
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();

        // Show offline mode indicator
        if (rateData.isFromCache) {
          const lastUpdated = new Date(rateData.lastUpdated).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          setTimeout(() => {
            Alert.alert(
              'Offline Mode',
              `Using cached exchange rates from ${lastUpdated}. Connect to internet for live rates.`,
              [{ text: 'OK' }]
            );
          }, 1000);
        }
      } else {
        Alert.alert(
          'No Data Available',
          'Unable to get exchange rates. Please check your internet connection and try again, or wait for cached data to be available.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Exchange rate fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult('');
    setExchangeRate(null);
    
    // Enhanced swap animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 120,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const clearAll = () => {
    setAmount('');
    setResult('');
    setExchangeRate(null);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const saveToHistory = async (conversionData) => {
    try {
      // Get existing history
      const existingHistory = await AsyncStorage.getItem('conversionHistory');
      let history = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Add new conversion to the beginning of the array
      const newConversion = {
        ...conversionData,
        timestamp: new Date().toISOString(),
        id: Date.now(), // Simple ID generation
      };
      
      history.unshift(newConversion);
      
      // Keep only the last 10 conversions
      history = history.slice(0, 10);
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem('conversionHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving conversion to history:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ]
          }
        ]}>

          {/* Combined Converter Card */}
          <Animated.View style={[styles.card, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient
              colors={['#667eea', '#764ba2', '#f093fb']}
              style={styles.cardHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="calculator-outline" size={22} color="#fff" />
              <Text style={styles.cardHeaderText}>Currency Converter</Text>
            </LinearGradient>
            
            <View style={styles.converterContainer}>
              {/* Amount Input Section */}
              <View style={styles.amountSection}>
                <Text style={styles.sectionLabel}>
                  <Ionicons name="wallet-outline" size={16} color="#667eea" />
                  {' '}Amount to Convert
                </Text>
                <View style={styles.amountInputWrapper}>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    placeholderTextColor="#bbb"
                    keyboardType="numeric"
                    textAlign="center"
                  />
                </View>
              </View>

              {/* Currencies Section */}
              <View style={styles.currenciesSection}>
                <View style={styles.currencyPairContainer}>
                  <View style={styles.currencyRowContainer}>
                    {/* From Currency */}
                    <View style={styles.currencyColumn}>
                      <View style={styles.currencyLabelContainer}>
                        <Ionicons name="arrow-up-outline" size={16} color="#667eea" />
                        <Text style={styles.currencyLabel}>From</Text>
                      </View>
                      <View style={styles.pickerWrapper}>
                        <View style={styles.pickerContainer}>
                          <RNPickerSelect
                            value={fromCurrency}
                            onValueChange={setFromCurrency}
                            items={CURRENCIES}
                            style={pickerSelectStyles}
                            placeholder={{}}
                            Icon={() => <Ionicons name="chevron-down" size={20} color="#667eea" />}
                          />
                          <View style={styles.pickerOverlay}>
                            <Text style={styles.currencyCode}>{fromCurrency}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Swap Button */}
                    <View style={styles.swapButtonContainer}>
                      <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
                        <LinearGradient
                          colors={['#4facfe', '#00f2fe']}
                          style={styles.swapGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Ionicons name="swap-horizontal" size={24} color="#fff" />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    {/* To Currency */}
                    <View style={styles.currencyColumn}>
                      <View style={styles.currencyLabelContainer}>
                        <Ionicons name="arrow-down-outline" size={16} color="#667eea" />
                        <Text style={styles.currencyLabel}>To</Text>
                      </View>
                      <View style={styles.pickerWrapper}>
                        <View style={styles.pickerContainer}>
                          <RNPickerSelect
                            value={toCurrency}
                            onValueChange={setToCurrency}
                            items={CURRENCIES}
                            style={pickerSelectStyles}
                            placeholder={{}}
                            Icon={() => <Ionicons name="chevron-down" size={20} color="#667eea" />}
                          />
                          <View style={styles.pickerOverlay}>
                            <Text style={styles.currencyCode}>{toCurrency}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Enhanced Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.convertButton}
              onPress={fetchExchangeRate}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#999', '#666'] : ['#667eea', '#764ba2']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="calculator-outline" size={22} color="#fff" />
                    <Text style={styles.buttonText}>Convert Now</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
              <View style={styles.clearButtonContent}>
                <Ionicons name="refresh-outline" size={20} color="#667eea" />
                <Text style={styles.clearButtonText}>Reset</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Enhanced Result Card */}
          {result && (
            <Animated.View style={[
              styles.card, 
              styles.resultCard,
              { transform: [{ scale: scaleAnim }] }
            ]}>
              <LinearGradient
                colors={['#11998e', '#38ef7d']}
                style={styles.cardHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.cardHeaderText}>Conversion Result</Text>
              </LinearGradient>
              
              <View style={styles.resultContainer}>
                <View style={styles.resultAmountContainer}>
                  <Text style={styles.resultAmount}>
                    {result}
                  </Text>
                  <Text style={styles.resultCurrency}>{toCurrency}</Text>
                </View>
                
                {exchangeRate && (
                  <View style={styles.rateInfo}>
                    <View style={styles.rateRow}>
                      <Ionicons 
                        name={isOffline ? "cloud-offline" : "trending-up"} 
                        size={16} 
                        color={isOffline ? "#ff9500" : "#11998e"} 
                      />
                      <Text style={styles.rateText}>
                        1 {fromCurrency} = {exchangeRate < 1 ? exchangeRate.toFixed(6) : exchangeRate.toFixed(4)} {toCurrency}
                      </Text>
                    </View>
                    <Text style={styles.rateSubtext}>
                      {isOffline ? 'Cached rate' : 'Live rate'} • Updated {new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                    {isOffline && (
                      <View style={styles.offlineIndicator}>
                        <Ionicons name="wifi-outline" size={14} color="#ff9500" />
                        <Text style={styles.offlineText}>Working offline</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </Animated.View>
          )}

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    gap: 12,
  },
  cardHeaderText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  converterContainer: {
    padding: 28,
  },
  amountSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInputWrapper: {
    position: 'relative',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    borderWidth: 3,
    borderColor: '#e9ecef',
    borderRadius: 20,
    padding: 24,
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
  },
  currenciesSection: {
    marginBottom: 0,
  },
  currencyPairContainer: {
    gap: 20,
  },
  currencyRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  currencyColumn: {
    flex: 1,
  },
  currencyLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  currencyLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pickerWrapper: {
    borderRadius: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  pickerContainer: {
    borderWidth: 3,
    borderColor: '#e9ecef',
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 40,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    letterSpacing: 1,
  },
  swapButtonContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  swapButton: {
    position: 'relative',
  },
  swapGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  convertButton: {
    flex: 2,
    borderRadius: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#667eea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  clearButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  clearButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    borderWidth: 3,
    borderColor: '#11998e',
  },
  resultContainer: {
    padding: 28,
    alignItems: 'center',
  },
  resultAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  resultAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#11998e',
    marginRight: 8,
  },
  resultCurrency: {
    fontSize: 24,
    fontWeight: '600',
    color: '#11998e',
    opacity: 0.8,
  },
  rateInfo: {
    backgroundColor: '#f0fdf4',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dcfce7',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  rateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  rateSubtext: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    gap: 4,
  },
  offlineText: {
    fontSize: 11,
    color: '#ff9500',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    color: 'transparent',
    paddingRight: 54,
    fontWeight: '500',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    color: 'transparent',
    paddingRight: 54,
    fontWeight: '500',
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 24 : 26,
    right: 24,
  },
}); 