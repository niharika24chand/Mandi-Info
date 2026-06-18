# Mandi-Info

A simple app that fetches live mandi prices for **Potato in Uttar Pradesh** from the Government of India's open data portal (data.gov.in).

Built as a prototype to demonstrate how agricultural market data can be surfaced in a clean, accessible UI.

---

## Tech Stack

- **Mobile:** React Native + Expo
- **Backend:** Node.js + Express

---

## Project Structure
Mandi-Info/

├── backend/

│   ├── server.js        ← Express server, calls the govt API and returns clean JSON

│   ├── package.json     ← Backend dependencies

│   ├── .env.example     ← Template for environment variables

│   └── .env             ← Your actual API key (never push this)

│

├── mobile/

│   ├── App.js           ← Entry point, loads the home screen

│   ├── index.js         ← Registers the app with Expo

│   ├── app.json         ← Expo app configuration (name, icon, splash)

│   ├── eas.json         ← Build configuration for APK generation

│   └── src/             ← Screens, API logic, and theme

│

└── README.md

## How it works

The mobile app calls the Express backend, which fetches data from data.gov.in using a server-side API key and returns the min and max prices to display.