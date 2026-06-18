// =============================================
// Annsetu — API Service
// Calls the Government Mandi API directly
// No backend server needed!
// =============================================

const API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const API_KEY = '579b464db66ec23bdd0000011eca722018e9429560514de390d5bb1e';

/**
 * Fetches the list of distinct states from the Mandi API.
 * We fetch a large batch and extract unique state names.
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

    // Extract unique state names
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
 * Fetches potato mandi prices for the given state from data.gov.in
 * Returns { minPrice, maxPrice }
 */
export async function fetchMandiPrices(state = 'Uttar Pradesh') {
  try {
    const url = `${API_URL}?api-key=${API_KEY}&format=json&limit=10&filters[commodity]=Potato&filters[state]=${encodeURIComponent(state)}`;

    const response = await fetch(url);
    const data = await response.json();

    const records = data?.records;

    if (!records || records.length === 0) {
      throw new Error('No mandi price data found.');
    }

    // Get all min and max prices from the records
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
