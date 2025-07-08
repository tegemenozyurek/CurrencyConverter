import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function ExchangeOfficeScreen() {
  return (
    <ScrollView 
      style={styles.exchangeScreenContainer}
      contentContainerStyle={styles.exchangeScrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <MaterialIcons name="attach-money" size={60} color="white" />
          </View>
          <View style={styles.iconShadow} />
        </View>
        
        <View style={styles.badgeContainer}>
          <Text style={styles.comingSoonBadge}>COMING SOON</Text>
        </View>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresGrid}>
        <Text style={styles.featuresTitle}>Upcoming Features</Text>
        
        {screenWidth > 600 ? (
          // Single row for larger screens
          <View style={styles.featuresRow}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="location-outline" size={28} color="#3498db" />
              </View>
              <Text style={styles.featureCardTitle}>GPS Finder</Text>
              <Text style={styles.featureCardDesc}>Location-based search</Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="time-outline" size={28} color="#e74c3c" />
              </View>
              <Text style={styles.featureCardTitle}>Live Hours</Text>
              <Text style={styles.featureCardDesc}>Real-time availability</Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <MaterialIcons name="trending-up" size={28} color="#27ae60" />
              </View>
              <Text style={styles.featureCardTitle}>Best Rates</Text>
              <Text style={styles.featureCardDesc}>Compare exchange rates</Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="map-outline" size={28} color="#f39c12" />
              </View>
              <Text style={styles.featureCardTitle}>Map View</Text>
              <Text style={styles.featureCardDesc}>Interactive map interface</Text>
            </View>
          </View>
        ) : (
          // Two rows for smaller screens
          <>
            <View style={styles.featuresRow}>
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="location-outline" size={28} color="#3498db" />
                </View>
                <Text style={styles.featureCardTitle}>GPS Finder</Text>
                <Text style={styles.featureCardDesc}>Location-based search</Text>
              </View>
              
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="time-outline" size={28} color="#e74c3c" />
                </View>
                <Text style={styles.featureCardTitle}>Live Hours</Text>
                <Text style={styles.featureCardDesc}>Real-time availability</Text>
              </View>
            </View>
            
            <View style={styles.featuresRow}>
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <MaterialIcons name="trending-up" size={28} color="#27ae60" />
                </View>
                <Text style={styles.featureCardTitle}>Best Rates</Text>
                <Text style={styles.featureCardDesc}>Compare exchange rates</Text>
              </View>
              
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="map-outline" size={28} color="#f39c12" />
                </View>
                <Text style={styles.featureCardTitle}>Map View</Text>
                <Text style={styles.featureCardDesc}>Interactive map interface</Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Bottom Spacer */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  exchangeScreenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  exchangeScrollContent: {
    padding: screenWidth > 600 ? 40 : 20,
    alignItems: 'center',
    maxWidth: 800,
    alignSelf: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  iconShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
  },
  badgeContainer: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  comingSoonBadge: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuresGrid: {
    width: '100%',
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: screenWidth > 400 ? 20 : 15,
    width: screenWidth > 600 ? '22%' : '45%',
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 5,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
    textAlign: 'center',
  },
  featureCardDesc: {
    fontSize: 13,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
}); 