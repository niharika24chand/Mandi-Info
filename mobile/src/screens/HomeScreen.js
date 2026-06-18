// =============================================
// HomeScreen — Main screen of the Annsetu app
// Annsetu title, state selector + fetch prices
// =============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { fetchMandiPrices, fetchStates } from '../services/api';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [error, setError] = useState(null);

  // State selection
  const [selectedState, setSelectedState] = useState(null);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [statesList, setStatesList] = useState([]);
  const [stateSearch, setStateSearch] = useState('');

  const handleSelectState = async () => {
    setStateModalVisible(true);
    setStateSearch('');

    // Only fetch states if we haven't already loaded them
    if (statesList.length === 0) {
      setStatesLoading(true);
      try {
        const states = await fetchStates();
        setStatesList(states);
      } catch (err) {
        setError(err.message);
        setStateModalVisible(false);
      } finally {
        setStatesLoading(false);
      }
    }
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setStateModalVisible(false);
    // Clear old prices when changing state
    setMinPrice(null);
    setMaxPrice(null);
    setError(null);
  };

  const handleFetch = async () => {
    if (!selectedState) {
      setError('Please select a state first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchMandiPrices(selectedState);
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

  // Filter states by search query
  const filteredStates = statesList.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

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
        <Text style={styles.subtitle}>
          Potato — {selectedState || 'Select a state'}
        </Text>

        {/* Button Row */}
        <View style={styles.buttonRow}>
          {/* Select State Button */}
          <TouchableOpacity
            style={[styles.button, styles.stateButton]}
            onPress={handleSelectState}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {selectedState ? `📍 ${selectedState}` : '📍 Select State'}
            </Text>
          </TouchableOpacity>

          {/* Fetch Prices Button */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.fetchButton,
              (loading || !selectedState) && styles.buttonDisabled,
            ]}
            onPress={handleFetch}
            disabled={loading || !selectedState}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <Text style={styles.buttonText}>Fetching…</Text>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : (
              <Text style={styles.buttonText}>🔍 Find Prices</Text>
            )}
          </TouchableOpacity>
        </View>

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

      {/* =============== State Selection Modal =============== */}
      <Modal
        visible={stateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setStateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setStateModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search states…"
                placeholderTextColor="#7A7A7A"
                value={stateSearch}
                onChangeText={setStateSearch}
                autoCorrect={false}
              />
            </View>

            {/* States List */}
            {statesLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color="#1E4032" />
                <Text style={styles.loadingText}>Loading states…</Text>
              </View>
            ) : (
              <FlatList
                data={filteredStates}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      No states found matching "{stateSearch}"
                    </Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.stateItem,
                      selectedState === item && styles.stateItemSelected,
                    ]}
                    onPress={() => handleStateSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.stateItemText,
                        selectedState === item && styles.stateItemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {selectedState === item && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
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

  // Button row — two buttons side by side
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#1E4032',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  stateButton: {
    backgroundColor: '#2D6A4F',
    flex: 1,
  },
  fetchButton: {
    backgroundColor: '#1E4032',
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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

  // ============= Modal Styles =============
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#F5EDD6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAD9B0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E4032',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAD9B0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E4032',
  },

  // Search inside the modal
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#EAD9B0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#1A1A1A',
  },

  // State list items
  stateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  stateItemSelected: {
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
  },
  stateItemText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  stateItemTextSelected: {
    color: '#2D6A4F',
    fontWeight: '600',
  },
  checkMark: {
    fontSize: 18,
    color: '#2D6A4F',
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: '#EAD9B0',
    marginHorizontal: 24,
  },

  // Loading & empty states
  modalLoading: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#7A7A7A',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#7A7A7A',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
