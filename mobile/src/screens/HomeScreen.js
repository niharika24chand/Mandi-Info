// =============================================
// HomeScreen — Main screen of the Annsetu app
// Simple: Annsetu title, one button, show prices
// =============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { fetchMandiPrices } from '../services/api';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchMandiPrices();
      setMinPrice(result.minPrice);
      setMaxPrice(result.maxPrice);
    } catch (err) {
      setError(err.message);
      setMinPrice(null);
      setMaxPrice(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E4032" />

      {/* Header with Annsetu in the corner */}
      <View style={styles.header}>
        <Text style={styles.brandName}>Annsetu</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Mandi Prices</Text>
        <Text style={styles.subtitle}>Potato — Uttar Pradesh</Text>

        {/* Fetch Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleFetch}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <View style={styles.buttonRow}>
              <Text style={styles.buttonText}>Fetching…</Text>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <Text style={styles.buttonText}>Find Mandi Prices</Text>
          )}
        </TouchableOpacity>

        {/* Error Message */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Price Display */}
        {minPrice !== null && maxPrice !== null && (
          <View style={styles.priceSection}>
            {/* Min Price Card */}
            <View style={[styles.priceCard, styles.minCard]}>
              <Text style={styles.priceLabel}>MINIMUM PRICE</Text>
              <Text style={[styles.priceValue, { color: '#2D6A4F' }]}>
                ₹{minPrice.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.priceUnit}>per quintal</Text>
            </View>

            {/* Max Price Card */}
            <View style={[styles.priceCard, styles.maxCard]}>
              <Text style={styles.priceLabel}>MAXIMUM PRICE</Text>
              <Text style={[styles.priceValue, { color: '#D4882D' }]}>
                ₹{maxPrice.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.priceUnit}>per quintal</Text>
            </View>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Data from data.gov.in</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EDD6',
  },

  // Header — Annsetu in the top-left corner
  header: {
    backgroundColor: '#1E4032',
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 54,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F0A830',
    letterSpacing: 0.5,
  },

  // Main content area
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E4032',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7A7A7A',
    marginTop: 6,
    marginBottom: 30,
  },

  // Button
  button: {
    backgroundColor: '#1E4032',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 40,
    elevation: 4,
    shadowColor: '#1E4032',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Error
  errorBox: {
    marginTop: 20,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E05C5C',
    width: '100%',
  },
  errorText: {
    color: '#4A4A4A',
    fontSize: 14,
    textAlign: 'center',
  },

  // Price cards
  priceSection: {
    marginTop: 30,
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  priceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1E4032',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  minCard: {
    borderTopWidth: 4,
    borderTopColor: '#52B788',
  },
  maxCard: {
    borderTopWidth: 4,
    borderTopColor: '#D4882D',
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: '#7A7A7A',
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  priceUnit: {
    fontSize: 12,
    color: '#7A7A7A',
  },

  // Footer
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#7A7A7A',
  },
});
