// =============================================
// HomeScreen — Annsetu App
// Tabs: Prices | Storage | Weather
// UI matching the premium card-based design
// =============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { fetchMandiPrices, fetchStates, fetchWeather, fetchFarmerData } from '../services/api';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme';

// Commodity emoji map
const COMMODITY_EMOJI = {
  Wheat: '🌾', Rice: '🍚', Paddy: '🌾', Maize: '🌽', Potato: '🥔',
  Onion: '🧅', Tomato: '🍅', Soybean: '🫘', Mustard: '🌿', Cotton: '☁️',
  Sugarcane: '🎋', 'Gram (Chana)': '🫘', Moong: '🫛', 'Arhar (Tur)': '🫘',
  Groundnut: '🥜', Apple: '🍎', Banana: '🍌', Mango: '🥭', Garlic: '🧄',
  Turmeric: '🟡',
};

export default function HomeScreen() {
  // ── Tabs ──────────────────────────────────────
  const [activeTab, setActiveTab] = useState('prices');

  // ── Mandi Prices state ────────────────────────
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [error, setError] = useState(null);

  // State selector
  const [selectedState, setSelectedState] = useState(null);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [statesList, setStatesList] = useState([]);
  const [stateSearch, setStateSearch] = useState('');

  // Commodity selector
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [commodityModalVisible, setCommodityModalVisible] = useState(false);
  const [commoditySearch, setCommoditySearch] = useState('');
  const COMMODITIES = [
    'Wheat', 'Rice', 'Paddy', 'Maize', 'Potato', 'Onion', 'Tomato',
    'Soybean', 'Mustard', 'Cotton', 'Sugarcane', 'Gram (Chana)',
    'Moong', 'Arhar (Tur)', 'Groundnut', 'Apple', 'Banana', 'Mango',
    'Garlic', 'Turmeric',
  ];

  // ── Weather state ─────────────────────────────
  const [city, setCity] = useState('Agra');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  // ── Farmer Storage state ──────────────────────
  const [farmerLoading, setFarmerLoading] = useState(false);
  const [farmerData, setFarmerData] = useState(null);
  const [farmerError, setFarmerError] = useState(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState(null);
  const FARMER_IDS = [101, 102, 103, 104];

  // Auto-fetch weather when entering weather tab for the first time
  useEffect(() => {
    if (activeTab === 'weather' && !weatherData && !weatherLoading) {
      handleFetchWeather('Agra');
    }
  }, [activeTab]);

  // ── Mandi Prices handlers ─────────────────────
  const handleSelectState = async () => {
    setStateModalVisible(true);
    setStateSearch('');
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
    setMinPrice(null);
    setMaxPrice(null);
    setError(null);
  };

  const handleSelectCommodity = () => {
    setCommodityModalVisible(true);
    setCommoditySearch('');
  };

  const handleCommoditySelect = (commodity) => {
    setSelectedCommodity(commodity);
    setCommodityModalVisible(false);
    setMinPrice(null);
    setMaxPrice(null);
    setError(null);
  };

  const filteredCommodities = COMMODITIES.filter((c) =>
    c.toLowerCase().includes(commoditySearch.toLowerCase())
  );

  const handleFetch = async () => {
    if (!selectedState) {
      setError('Please select a state first.');
      return;
    }
    if (!selectedCommodity) {
      setError('Please select a commodity first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMandiPrices(selectedState, selectedCommodity);
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

  const filteredStates = statesList.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // ── Weather handlers ──────────────────────────
  const handleFetchWeather = async (searchCity = city) => {
    if (!searchCity.trim()) {
      setWeatherError('Please enter a district or city name.');
      return;
    }
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await fetchWeather(searchCity);
      setWeatherData(data);
    } catch (err) {
      setWeatherError(err.message);
      setWeatherData(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  // ── Farmer Storage handlers ───────────────────
  const handleFetchFarmer = async (id) => {
    setSelectedFarmerId(id);
    setFarmerLoading(true);
    setFarmerError(null);
    try {
      const data = await fetchFarmerData(id);
      setFarmerData(data);
    } catch (err) {
      setFarmerError(err.message);
      setFarmerData(null);
    } finally {
      setFarmerLoading(false);
    }
  };

  // ── Weather helpers ───────────────────────────
  const getDayName = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  };

  const getWeatherEmoji = (condition) => {
    const cond = condition ? condition.toLowerCase() : '';
    if (cond.includes('clear') || cond.includes('sunny')) return '☀️';
    if (cond.includes('cloud') || cond.includes('overcast') || cond.includes('mist') || cond.includes('haze') || cond.includes('fog')) return '☁️';
    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower') || cond.includes('patchy')) return '🌧️';
    if (cond.includes('thunder') || cond.includes('storm')) return '⛈️';
    if (cond.includes('snow') || cond.includes('sleet') || cond.includes('blizzard')) return '❄️';
    return '🌡️';
  };

  const getWeatherBg = (condition) => {
    const cond = condition ? condition.toLowerCase() : '';
    if (cond.includes('clear') || cond.includes('sunny')) return '#FFF3E0';
    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower') || cond.includes('patchy') || cond.includes('thunder') || cond.includes('storm')) return '#E1F5FE';
    if (cond.includes('cloud') || cond.includes('overcast') || cond.includes('mist') || cond.includes('haze') || cond.includes('fog')) return '#ECEFF1';
    return COLORS.white;
  };

  const getWeatherBorderColor = (condition) => {
    const cond = condition ? condition.toLowerCase() : '';
    if (cond.includes('clear') || cond.includes('sunny')) return COLORS.amber;
    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower') || cond.includes('patchy') || cond.includes('thunder') || cond.includes('storm')) return '#4FC3F7';
    if (cond.includes('cloud') || cond.includes('overcast') || cond.includes('mist') || cond.includes('haze') || cond.includes('fog')) return '#B0BEC5';
    return COLORS.greenLight;
  };

  const commodityEmoji = COMMODITY_EMOJI[selectedCommodity] || '🌾';

  // ── Render ────────────────────────────────────
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1B3C2D" />

      {/* ═══ HEADER ═══ */}
      <View style={styles.header}>
        <Text style={styles.brandName}>Annsetu</Text>
        <Text style={styles.brandTagline}>Connecting Farmers with Markets</Text>
        <View style={styles.brandAccent} />
      </View>

      {/* ═══ PILL TAB BAR ═══ */}
      <View style={styles.tabBarWrap}>
        <View style={styles.tabBar}>
          {[
            { key: 'prices', icon: '🌿', label: 'Prices' },
            { key: 'storage', icon: '🏬', label: 'Storage' },
            { key: 'weather', icon: '☀️', label: 'Weather' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabPill, activeTab === tab.key && styles.tabPillActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabPillText, activeTab === tab.key && styles.tabPillTextActive]}>
                {tab.icon} {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'prices' ? (
          /* ════════════ MANDI PRICES TAB ════════════ */
          <View style={styles.tabBody}>
            {/* Title */}
            <Text style={styles.pageTitle}>
              {selectedCommodity ? `${selectedCommodity} Mandi Prices` : 'Mandi Prices'}
            </Text>
            <Text style={styles.pageSubtitle}>Live price ranges by state · per quintal</Text>

            {/* FILTERS label */}
            <Text style={styles.sectionLabel}>FILTERS</Text>

            {/* State Filter Card */}
            <TouchableOpacity style={styles.filterCard} onPress={handleSelectState} activeOpacity={0.7}>
              <Text style={styles.filterLabel}>STATE</Text>
              <View style={styles.filterRow}>
                <Text style={styles.filterValue}>
                  {selectedState || 'Select a state'}
                </Text>
                <Text style={styles.filterChevron}>›</Text>
              </View>
            </TouchableOpacity>

            {/* Commodity Filter Card */}
            <TouchableOpacity style={styles.filterCard} onPress={handleSelectCommodity} activeOpacity={0.7}>
              <Text style={styles.filterLabel}>COMMODITY</Text>
              <View style={styles.filterRow}>
                <Text style={styles.filterValue}>
                  {selectedCommodity ? `${commodityEmoji}  ${selectedCommodity}` : 'Select a commodity'}
                </Text>
                <Text style={styles.filterChevron}>›</Text>
              </View>
            </TouchableOpacity>

            {/* Fetch Button */}
            <TouchableOpacity
              style={[
                styles.fetchBtn,
                (loading || !selectedState || !selectedCommodity) && styles.fetchBtnDisabled,
              ]}
              onPress={handleFetch}
              disabled={loading || !selectedState || !selectedCommodity}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.fetchBtnRow}>
                  <Text style={styles.fetchBtnText}>Fetching…</Text>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              ) : (
                <Text style={styles.fetchBtnText}>🔍  Fetch Market Prices</Text>
              )}
            </TouchableOpacity>

            {/* Error */}
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            {/* Results Card */}
            {minPrice !== null && maxPrice !== null && (
              <View style={styles.resultCard}>
                {/* Result Header */}
                <View style={styles.resultHeader}>
                  <Text style={styles.resultEmoji}>{commodityEmoji}</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.resultCommodity}>{selectedCommodity}</Text>
                    <Text style={styles.resultMarket}>📍 {selectedState}</Text>
                  </View>
                </View>

                <View style={styles.resultDivider} />

                {/* Min / Max Prices */}
                <View style={styles.priceRow}>
                  <View style={styles.priceCol}>
                    <Text style={styles.priceLabelText}>MIN PRICE</Text>
                    <Text style={[styles.priceAmount, { color: COLORS.greenMid }]}>
                      ₹{minPrice.toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.priceUnit}>per quintal</Text>
                  </View>
                  <View style={styles.priceDivider} />
                  <View style={styles.priceCol}>
                    <Text style={styles.priceLabelText}>MAX PRICE</Text>
                    <Text style={[styles.priceAmount, { color: '#D35400' }]}>
                      ₹{maxPrice.toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.priceUnit}>per quintal</Text>
                  </View>
                </View>

                {/* Spread */}
                <View style={styles.spreadRow}>
                  <Text style={styles.spreadLabel}>SPREAD</Text>
                  <Text style={styles.spreadValue}>
                    ₹{(maxPrice - minPrice).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ) : activeTab === 'weather' ? (
          /* ════════════ WEATHER TAB ════════════ */
          <View style={styles.tabBody}>
            <Text style={styles.pageTitle}>Weather Info</Text>
            <Text style={styles.pageSubtitle}>Current & 5-Day Forecast</Text>

            {/* Search Card */}
            <View style={styles.weatherSearchCard}>
              <Text style={styles.filterLabel}>CITY / DISTRICT</Text>
              <View style={styles.weatherSearchRow}>
                <TextInput
                  style={styles.weatherInput}
                  placeholder="Enter district/city (e.g. Agra)"
                  placeholderTextColor={COLORS.textLight}
                  value={city}
                  onChangeText={setCity}
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={[styles.weatherSearchBtn, weatherLoading && styles.fetchBtnDisabled]}
                  onPress={() => handleFetchWeather()}
                  disabled={weatherLoading}
                  activeOpacity={0.8}
                >
                  {weatherLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.weatherSearchBtnText}>Search</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {weatherError && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {weatherError}</Text>
              </View>
            )}

            {weatherData && (
              <View style={{ width: '100%' }}>
                {/* Current Weather Card */}
                <View
                  style={[
                    styles.weatherCard,
                    {
                      backgroundColor: getWeatherBg(weatherData.mainCondition),
                      borderTopColor: getWeatherBorderColor(weatherData.mainCondition),
                    },
                  ]}
                >
                  <Text style={styles.weatherLocation}>📍 {weatherData.location}</Text>
                  <View style={styles.tempRow}>
                    <Text style={styles.weatherEmoji}>
                      {getWeatherEmoji(weatherData.mainCondition)}
                    </Text>
                    <Text style={styles.weatherTemp}>{weatherData.temp}°C</Text>
                  </View>
                  <Text style={styles.weatherDesc}>{weatherData.description}</Text>

                  <View style={styles.weatherDetails}>
                    <View style={styles.weatherDetailItem}>
                      <Text style={styles.weatherDetailLabel}>HUMIDITY</Text>
                      <Text style={styles.weatherDetailValue}>💧 {weatherData.humidity}%</Text>
                    </View>
                    <View style={styles.weatherDetailDivider} />
                    <View style={styles.weatherDetailItem}>
                      <Text style={styles.weatherDetailLabel}>WIND SPEED</Text>
                      <Text style={styles.weatherDetailValue}>💨 {weatherData.windSpeed} km/h</Text>
                    </View>
                  </View>
                </View>

                {/* 5-Day Forecast */}
                {weatherData.forecast && weatherData.forecast.length > 0 && (
                  <View style={styles.forecastContainer}>
                    <Text style={styles.forecastTitle}>5-Day Forecast</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.forecastScroll}
                    >
                      {weatherData.forecast.map((dayItem, idx) => (
                        <View key={dayItem.date + idx} style={styles.forecastCard}>
                          <Text style={styles.forecastDayName}>{getDayName(dayItem.date)}</Text>
                          <Text style={styles.forecastEmoji}>
                            {getWeatherEmoji(dayItem.conditionText)}
                          </Text>
                          <Text style={styles.forecastTempMax}>{dayItem.maxTemp}°C</Text>
                          <Text style={styles.forecastTempMin}>{dayItem.minTemp}°C</Text>
                          <Text style={styles.forecastCondition} numberOfLines={1}>
                            {dayItem.conditionText}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}
          </View>
        ) : (
          /* ════════════ FARMER STORAGE TAB ════════════ */
          <View style={styles.tabBody}>
            <Text style={styles.pageTitle}>Cold Storage</Text>
            <Text style={styles.pageSubtitle}>Select a Farmer ID to view storage details</Text>

            <Text style={styles.sectionLabel}>FARMER ID</Text>

            {/* Farmer ID Buttons */}
            <View style={styles.farmerIdRow}>
              {FARMER_IDS.map((id) => (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.farmerIdButton,
                    selectedFarmerId === id && styles.farmerIdButtonActive,
                    farmerLoading && styles.fetchBtnDisabled,
                  ]}
                  onPress={() => handleFetchFarmer(id)}
                  disabled={farmerLoading}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.farmerIdText,
                      selectedFarmerId === id && styles.farmerIdTextActive,
                    ]}
                  >
                    🧑‍🌾 {id}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {farmerLoading && (
              <View style={styles.farmerLoadingBox}>
                <ActivityIndicator size="large" color={COLORS.greenDeep} />
                <Text style={styles.loadingText}>Fetching farmer data…</Text>
              </View>
            )}

            {farmerError && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {farmerError}</Text>
              </View>
            )}

            {farmerData && !farmerLoading && (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={{ fontSize: 32 }}>🧑‍🌾</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.resultCommodity}>{farmerData.name}</Text>
                    <Text style={styles.resultMarket}>Farmer ID: {farmerData.id}</Text>
                  </View>
                </View>

                <View style={styles.resultDivider} />

                <View style={styles.farmerDetailGrid}>
                  <View style={styles.farmerDetailItem}>
                    <Text style={styles.farmerDetailLabel}>COMMODITY</Text>
                    <Text style={styles.farmerDetailValue}>{COMMODITY_EMOJI[farmerData.commodity] || '📦'} {farmerData.commodity}</Text>
                  </View>
                  <View style={styles.farmerDetailItem}>
                    <Text style={styles.farmerDetailLabel}>ROOM NUMBER</Text>
                    <Text style={styles.farmerDetailValue}>🚪 {farmerData.roomNumber}</Text>
                  </View>
                  <View style={styles.farmerDetailItem}>
                    <Text style={styles.farmerDetailLabel}>TOTAL BAGS</Text>
                    <Text style={styles.farmerDetailValue}>🛍️ {farmerData.totalBags}</Text>
                  </View>
                  <View style={styles.farmerDetailItem}>
                    <Text style={styles.farmerDetailLabel}>WEIGHT</Text>
                    <Text style={styles.farmerDetailValue}>⚖️ {farmerData.weight}</Text>
                  </View>
                </View>

                <View style={styles.spreadRow}>
                  <Text style={styles.spreadLabel}>AGE (DAYS STORED)</Text>
                  <Text style={styles.spreadValue}>📅 {farmerData.age} days</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ═══ FOOTER ═══ */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {activeTab === 'prices'
            ? 'Data directly from data.gov.in'
            : activeTab === 'weather'
            ? 'Data from WeatherAPI.com'
            : 'Farmer cold storage data'}
        </Text>
      </View>

      {/* ═══ STATE SELECTION MODAL ═══ */}
      <Modal
        visible={stateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setStateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setStateModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearchContainer}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search states…"
                placeholderTextColor="#7A7A7A"
                value={stateSearch}
                onChangeText={setStateSearch}
                autoCorrect={false}
              />
            </View>

            {statesLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color={COLORS.greenDeep} />
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
                      styles.modalItem,
                      selectedState === item && styles.modalItemSelected,
                    ]}
                    onPress={() => handleStateSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedState === item && styles.modalItemTextSelected,
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

      {/* ═══ COMMODITY SELECTION MODAL ═══ */}
      <Modal
        visible={commodityModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCommodityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Commodity</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setCommodityModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearchContainer}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search commodities…"
                placeholderTextColor="#7A7A7A"
                value={commoditySearch}
                onChangeText={setCommoditySearch}
                autoCorrect={false}
              />
            </View>

            <FlatList
              data={filteredCommodities}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No commodities found matching "{commoditySearch}"
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedCommodity === item && styles.modalItemSelected,
                  ]}
                  onPress={() => handleCommoditySelect(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedCommodity === item && styles.modalItemTextSelected,
                    ]}
                  >
                    {COMMODITY_EMOJI[item] || '🌾'}  {item}
                  </Text>
                  {selectedCommodity === item && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ══════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F1EA',
  },

  // ── Header ────────────────────────────────────
  header: {
    backgroundColor: '#1B3C2D',
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  brandTagline: {
    fontSize: 13,
    color: '#A9C3B7',
    marginTop: 2,
  },
  brandAccent: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.greenLight,
    borderRadius: 2,
    marginTop: 10,
  },

  // ── Pill Tab Bar ──────────────────────────────
  tabBarWrap: {
    backgroundColor: '#1B3C2D',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F4F1EA',
    borderRadius: RADIUS.full,
    padding: 4,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: RADIUS.full,
  },
  tabPillActive: {
    backgroundColor: '#1B3C2D',
  },
  tabPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMid,
  },
  tabPillTextActive: {
    color: '#FFFFFF',
  },

  // ── Scroll / Tab Body ─────────────────────────
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  tabBody: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  // ── Page Title ────────────────────────────────
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },

  // ── Section Label ─────────────────────────────
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.textLight,
    marginBottom: 10,
  },

  // ── Filter Cards ──────────────────────────────
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E2D4',
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
  },
  filterChevron: {
    fontSize: 22,
    color: COLORS.textLight,
    marginLeft: 8,
  },

  // ── Fetch Button ──────────────────────────────
  fetchBtn: {
    backgroundColor: '#1B3C2D',
    borderRadius: RADIUS.full,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    ...SHADOWS.md,
  },
  fetchBtnDisabled: {
    opacity: 0.45,
  },
  fetchBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fetchBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },

  // ── Error ─────────────────────────────────────
  errorBox: {
    marginTop: 12,
    backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.md,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.errorRed,
  },
  errorText: {
    color: COLORS.textMid,
    fontSize: 13,
  },

  // ── Result Card ───────────────────────────────
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E8E2D4',
    ...SHADOWS.sm,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 36,
  },
  resultCommodity: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  resultMarket: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#EDE8DC',
    marginVertical: 16,
  },

  // ── Price Row ─────────────────────────────────
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  priceCol: {
    flex: 1,
    alignItems: 'center',
  },
  priceDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#EDE8DC',
  },
  priceLabelText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '800',
  },
  priceUnit: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },

  // ── Spread Row ────────────────────────────────
  spreadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAF5',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#EDE8DC',
  },
  spreadLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textLight,
    letterSpacing: 0.5,
  },
  spreadValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  // ── Weather: Search Card ──────────────────────
  weatherSearchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E2D4',
  },
  weatherSearchRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  weatherInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE8DC',
  },
  weatherSearchBtn: {
    backgroundColor: '#1B3C2D',
    borderRadius: RADIUS.md,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  weatherSearchBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Weather Card ──────────────────────────────
  weatherCard: {
    borderRadius: RADIUS.lg,
    padding: 24,
    borderTopWidth: 5,
    ...SHADOWS.md,
    marginBottom: 20,
  },
  weatherLocation: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  weatherEmoji: {
    fontSize: 48,
  },
  weatherTemp: {
    fontSize: 44,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  weatherDesc: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textMid,
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  weatherDetails: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: RADIUS.md,
    padding: 14,
  },
  weatherDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  weatherDetailDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  weatherDetailLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  weatherDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },

  // ── 5-Day Forecast ────────────────────────────
  forecastContainer: {
    marginTop: 10,
    marginBottom: 24,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B3C2D',
    marginBottom: 12,
  },
  forecastScroll: {
    gap: 12,
    paddingRight: 10,
  },
  forecastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: 14,
    width: 105,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E2D4',
    ...SHADOWS.sm,
  },
  forecastDayName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  forecastEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  forecastTempMax: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  forecastTempMin: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  forecastCondition: {
    fontSize: 10,
    color: COLORS.textMid,
    textTransform: 'capitalize',
    textAlign: 'center',
    width: '100%',
  },

  // ── Farmer Storage ────────────────────────────
  farmerIdRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  farmerIdButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#E8E2D4',
    ...SHADOWS.sm,
  },
  farmerIdButtonActive: {
    backgroundColor: '#1B3C2D',
    borderColor: '#1B3C2D',
  },
  farmerIdText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  farmerIdTextActive: {
    color: '#FFFFFF',
  },
  farmerLoadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  farmerDetailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  farmerDetailItem: {
    width: '47%',
    backgroundColor: '#FAFAF5',
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EDE8DC',
  },
  farmerDetailLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  farmerDetailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },

  // ── Footer ────────────────────────────────────
  footer: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E8E2D4',
    backgroundColor: '#F4F1EA',
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textLight,
  },

  // ── Modal ─────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#F4F1EA',
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
    borderBottomColor: '#E8E2D4',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B3C2D',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8E2D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B3C2D',
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E8E2D4',
  },
  modalSearchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  modalSearchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: COLORS.textDark,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  modalItemSelected: {
    backgroundColor: 'rgba(27, 60, 45, 0.08)',
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  modalItemTextSelected: {
    color: '#1B3C2D',
    fontWeight: '600',
  },
  checkMark: {
    fontSize: 18,
    color: '#1B3C2D',
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: '#E8E2D4',
    marginHorizontal: 24,
  },
  modalLoading: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
