# 🌾 Annsetu — Live Mandi Price Mobile Application

> **Annsetu** (अन्नसेतु) means "bridge of food/grain" in Sanskrit.  
> This app bridges farmers and markets by surfacing real-time mandi commodity prices from the Government of India's Open Data Portal.

> **Platform:** Android (APK) — built with React Native + Expo (SDK 54)

---

## Quick Start

### Prerequisites

- **Node.js** v18+ installed → [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)
- **Expo Go** app on your Android phone (for testing) → [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

> **Note:** No separate backend server is needed! The app calls the Government API (data.gov.in) directly.

---

### 1. Clone / Extract the Project

```bash
# If using the ZIP:
unzip annsetu.zip
cd annsetu
```

---

### 2. Set Up the Mobile App

```bash
cd mobile
npm install
```

Start the Expo development server:

```bash
npx expo start
```

You should see a QR code in the terminal.

---

### 3. Test on Your Phone

1. Make sure your **phone and computer are on the same Wi-Fi network**
2. Open the **Expo Go** app on your phone
3. Scan the QR code from the terminal
4. The Annsetu app will load on your phone!

> **Tip:** If the QR code doesn't work, press `w` in the terminal to open the web version in your laptop's browser.

---

### 4. Use the App

1. You'll see **"Annsetu"** in the top-left corner
2. Tap **"Find Mandi Prices"**
3. See the **Minimum** and **Maximum** prices for Potato in Uttar Pradesh displayed below the button
4. Commodity (Potato) and State (Uttar Pradesh) are fixed

---

### 5. Build the APK (Optional)

To create a standalone APK file:

```bash
cd mobile

# Install EAS CLI globally
npm install -g eas-cli

# Log in to Expo account (create one at expo.dev if needed)
eas login

# Build APK for Android
eas build -p android --profile preview
```

The `preview` profile creates an APK (vs AAB for Play Store). You'll get a download link once the build completes.

---

## Project Structure

```
annsetu/
├── mobile/
│   ├── App.js             ← Entry point — loads HomeScreen
│   ├── app.json           ← Expo configuration (app name, icon)
│   ├── package.json       ← React Native dependencies (Expo SDK 54)
│   └── src/
│       ├── screens/
│       │   └── HomeScreen.js  ← Main screen — button + price display
│       ├── services/
│       │   └── api.js         ← Calls data.gov.in API directly
│       └── theme.js           ← Colors, spacing, shadows
│
├── backend/               ← (Legacy — not needed anymore)
│   └── server.js          ← Express server (kept for reference)
│
├── README.md              ← This file
├── STUDY_GUIDE.md         ← Full project walkthrough for beginners
└── .gitignore
```

---

## How It Works

```
┌──────────────────────────────────────────────┐
│              ANDROID DEVICE                    │
│                                                │
│   App.js ──renders──► HomeScreen.js            │
│                          │                     │
│                   User taps button             │
│                          │                     │
│                          ▼                     │
│              api.js → fetch(data.gov.in)       │
│                          │                     │
└──────────────────────────┼─────────────────────┘
                           │  HTTPS GET Request
                           ▼
┌──────────────────────────────────────────────┐
│     GOVERNMENT API (api.data.gov.in)           │
│                                                │
│   Returns JSON with mandi price records        │
│                                                │
└──────────────────────────┬─────────────────────┘
                           │  JSON Response
                           ▼
┌──────────────────────────────────────────────┐
│              ANDROID DEVICE                    │
│                                                │
│   api.js parses min/max prices                 │
│   HomeScreen shows the results                 │
│                                                │
└──────────────────────────────────────────────┘
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Download latest Expo Go" error | Make sure you're using **Expo SDK 54** (check `package.json` has `"expo": "~54.0.0"`) |
| "No mandi price data found" | The government API may be temporarily unavailable — try again |
| Expo Go won't connect | Ensure phone and computer are on the same Wi-Fi network |
| QR code not scanning | Press `w` in terminal to open web version, or type the URL manually in Expo Go |
| "No internet connection" | Check your phone/computer has internet access |

---

## Deployment Notes

- **Mobile App:** Use `eas build` to create APKs or AABs for the Google Play Store.
- **No backend needed** — the app talks to data.gov.in directly.

---

## License

MIT — Free to use, modify, and distribute.
