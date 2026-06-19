// =============================================
// Annsetu — API Service
// Calls data.gov.in directly for mandi prices
// Calls WeatherAPI.com directly for weather data
// =============================================

const USE_BACKEND = true;
const BACKEND_URL = 'http://192.168.29.217:3001';
const API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const API_KEY = '579b464db66ec23bdd0000011eca722018e9429560514de390d5bb1e';

const WEATHER_API_URL = 'https://api.weatherapi.com/v1/forecast.json';
const WEATHER_API_KEY = 'cc98b5f11d594fa893f52703261806';

/**
 * Fetches the list of distinct states from the Mandi API.
 * Returns an array of state name strings, sorted alphabetically.
 */
export async function fetchStates() {
  try {
    const url = `${API_URL}?api-key=${API_KEY}&format=json&limit=1000`;

    const response = await fetch(url);
    const data = await response.json();

    const records = data?.records;
    if (!records || records.length === 0) {
      throw new Error('No data found to extract states.');
    }

    const stateSet = new Set();
    for (const r of records) {
      const state = r.state || r.State;
      if (state && state.trim()) {
        stateSet.add(state.trim());
      }
    }

    if (stateSet.size === 0) {
      throw new Error('Could not extract state names from data.');
    }

    return Array.from(stateSet).sort();
  } catch (err) {
    if (err.message.includes('Network request failed')) {
      throw new Error('No internet connection. Please check your network.');
    }
    throw err;
  }
}

/**
 * Fetches mandi prices for the given state and commodity from data.gov.in directly.
 * Returns { minPrice, maxPrice }
 */
export async function fetchMandiPrices(state = 'Uttar Pradesh', commodity = 'Potato') {
  try {
    const url = `${API_URL}?api-key=${API_KEY}&format=json&limit=10&filters[commodity]=${encodeURIComponent(commodity)}&filters[state]=${encodeURIComponent(state)}`;

    const response = await fetch(url);
    const data = await response.json();

    const records = data?.records;
    if (!records || records.length === 0) {
      throw new Error('No mandi price data found.');
    }

    const minPrices = [];
    const maxPrices = [];

    for (const r of records) {
      const minVal = parseFloat(r.min_price || r.Min_Price || 0);
      const maxVal = parseFloat(r.max_price || r.Max_Price || 0);
      if (minVal > 0) minPrices.push(minVal);
      if (maxVal > 0) maxPrices.push(maxVal);
    }

    if (minPrices.length === 0 && maxPrices.length === 0) {
      throw new Error('Could not read prices from the data.');
    }

    return {
      minPrice: Math.min(...minPrices),
      maxPrice: Math.max(...maxPrices),
    };
  } catch (err) {
    if (err.message.includes('Network request failed')) {
      throw new Error('No internet connection. Please check your network.');
    }
    throw err;
  }
}

/**
 * Fetches current weather and 5-day forecast for a specific city.
 * Returns temperature, condition, humidity, wind, and forecast array.
 */
export async function fetchWeather(city) {
  try {
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_WEATHERAPI_KEY') {
      throw new Error('Weather API key not configured. Please add your key in mobile/src/services/api.js.');
    }

    const url = `${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(`Location "${city}" not found.`);
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid weather API key. Please check your WeatherAPI.com key.');
      }
      throw new Error('Could not fetch weather. Please try again.');
    }

    const data = await response.json();

    const locationName = data.location?.region
      ? `${data.location.name}, ${data.location.region}`
      : (data.location?.name || city);

    const forecastDays = data.forecast?.forecastday?.map((dayItem) => ({
      date: dayItem.date,
      maxTemp: dayItem.day?.maxtemp_c != null ? Math.round(dayItem.day.maxtemp_c) : null,
      minTemp: dayItem.day?.mintemp_c != null ? Math.round(dayItem.day.mintemp_c) : null,
      conditionText: dayItem.day?.condition?.text || 'Clear',
      humidity: dayItem.day?.avghumidity || 0,
    })) || [];

    return {
      temp: data.current?.temp_c != null ? Math.round(data.current.temp_c) : null,
      description: data.current?.condition?.text || 'Clear',
      mainCondition: data.current?.condition?.text || 'Clear',
      humidity: data.current?.humidity || 0,
      windSpeed: data.current?.wind_kph != null ? Math.round(data.current.wind_kph) : 0,
      location: locationName,
      forecast: forecastDays,
    };
  } catch (err) {
    if (err.message.includes('Network request failed')) {
      throw new Error('No internet connection. Please check your network.');
    }
    throw err;
  }
}

// =============================================
// Backend2 — Farmer Cold Storage Data
// =============================================

const BACKEND2_URL = 'http://192.168.29.217:3002'; // Android emulator → localhost
// Use 'http://localhost:3002' for iOS simulator or web

/**
 * Fetches a farmer's cold storage data by ID from backend2.
 * Returns { id, name, commodity, roomNumber, totalBags, weight, age }
 */
export async function fetchFarmerData(farmerId) {
  try {
    const url = `${BACKEND2_URL}/api/farmer/${farmerId}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch farmer data.');
    }

    return data.farmer;
  } catch (err) {
    if (err.message.includes('Network request failed')) {
      throw new Error('Cannot reach storage server. Make sure backend2 is running on port 3002.');
    }
    throw err;
  }
}