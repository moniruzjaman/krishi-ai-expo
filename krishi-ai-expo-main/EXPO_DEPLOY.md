# 📱 Krishi AI – Expo Go Publishing Guide

## What this project uses
- **Expo SDK 53** (managed workflow)
- **Expo Router v4** (file-based navigation)
- **React Native 0.76** (new architecture enabled)
- Targeted for **Expo Go** (no custom native modules)

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 | [nodejs.org](https://nodejs.org) |
| npm | ≥ 9 | bundled |
| Expo CLI | latest | `npm i -g expo` |
| EAS CLI | latest | `npm i -g eas-cli` |
| Expo Go app | latest | App Store / Play Store |

---

## 1. Clone & Install

```bash
git clone https://github.com/your-org/krishi-ai.git
cd krishi-ai
npm install
```

---

## 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

> **Important:** Expo only exposes env vars prefixed with `EXPO_PUBLIC_` to the app bundle.
> Never put secret keys directly in client-side code.

---

## 3. Run in Expo Go (Development)

```bash
# Start the Metro bundler
npx expo start

# Options:
#  Press 's' → switch to Expo Go mode
#  Press 'a' → open Android emulator
#  Press 'i' → open iOS simulator
#  Scan QR → open in Expo Go on your phone
```

Your phone and computer must be on the **same Wi-Fi network**.

---

## 4. Publish an Update (OTA via EAS Update)

This allows anyone with Expo Go to load your app via a shareable URL.

### 4a. Login & Configure

```bash
npx eas-cli login
npx eas-cli init   # creates your EAS project, updates app.json with projectId
```

### 4b. Configure EAS Update

Create `eas.json`:

```json
{
  "cli": { "version": ">= 14.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "update": {
    "channel": "production"
  }
}
```

### 4c. Set EAS Secrets (replaces .env for cloud builds)

```bash
eas secret:create --scope project --name EXPO_PUBLIC_GEMINI_API_KEY --value "your_key"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL   --value "https://..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_KEY   --value "your_key"
```

### 4d. Publish

```bash
# Publish to the 'production' channel
npx eas update --branch production --message "Release v2.1.0"
```

Your update will be available at:
```
exp://u.expo.dev/<your-project-id>?channel-name=production
```

Share this URL or QR code — users open it in Expo Go.

---

## 5. Build Standalone Apps (for App Store / Play Store)

> This requires EAS Build (cloud build service, free tier available).

```bash
# Android APK (for internal testing)
npx eas build --platform android --profile preview

# iOS (requires Apple Developer account)
npx eas build --platform ios --profile production

# Both platforms
npx eas build --platform all --profile production
```

### Submit to stores:
```bash
npx eas submit --platform android
npx eas submit --platform ios
```

---

## 6. Expo Go Limitations to be aware of

| Feature | Expo Go Support |
|---------|----------------|
| Camera (image picker) | ✅ Yes |
| Location | ✅ Yes |
| Audio playback (expo-av) | ✅ Yes |
| Haptics | ✅ Yes |
| Push notifications | ✅ Development only |
| Custom native modules | ❌ Requires dev build |
| Firebase Analytics | ❌ Requires dev build |
| Background tasks | ❌ Limited |

All features used in this app are **fully compatible with Expo Go**.

---

## 7. Project Structure

```
krishi-ai-expo/
├── app/                    ← Expo Router screens (file = route)
│   ├── _layout.tsx         ← Root layout (fonts, splash, navigation)
│   ├── (tabs)/             ← Bottom tab navigator
│   │   ├── _layout.tsx     ← Tab bar config
│   │   ├── index.tsx       ← 🏠 Home
│   │   ├── tools.tsx       ← 🛠️ Tools Hub
│   │   ├── learn.tsx       ← 🎓 Learning Center
│   │   └── profile.tsx     ← 👤 Profile
│   ├── analyzer.tsx        ← 📸 AI Scanner (modal)
│   ├── chat.tsx            ← 🤖 Chatbot
│   ├── pesticide.tsx       ← 🧪 Pesticide Expert
│   ├── soil.tsx            ← 🔬 Soil Expert
│   ├── yield.tsx           ← 📊 Yield Predictor
│   ├── weather.tsx         ← ⛅ Weather
│   ├── calendar.tsx        ← 📅 Crop Calendar
│   ├── market.tsx          ← 💰 Market Prices
│   ├── nutrient.tsx        ← ⚗️ Fertilizer Calc
│   └── library.tsx         ← 📚 Disease Library
│
├── src/
│   ├── constants/index.ts  ← All app data (markets, crops, etc.)
│   ├── services/
│   │   ├── gemini.ts       ← Google Gemini AI integration
│   │   └── supabase.ts     ← Supabase cloud sync
│   ├── hooks/
│   │   └── useLanguage.ts  ← Bengali/English language hook
│   └── components/
│       └── UI.tsx          ← Shared RN components
│
├── assets/icons/           ← App icons (add your PNG files here)
├── app.json                ← Expo config
├── babel.config.js         ← Babel (Reanimated plugin)
├── eas.json                ← EAS Build config (create manually)
├── .env                    ← Your secrets (gitignored!)
├── .env.example            ← Template
└── package.json
```

---

## 8. Adding App Icons

Place these PNG files in `assets/icons/`:

| File | Size | Purpose |
|------|------|---------|
| `icon.png` | 1024×1024 | iOS / general |
| `adaptive-icon.png` | 1024×1024 | Android adaptive icon foreground |
| `splash.png` | 1284×2778 | Splash screen |
| `favicon.png` | 48×48 | Web |

Use [Figma](https://figma.com), [Canva](https://canva.com) or [EAS's icon generator](https://expo.dev/tools/icon-generator) to create them.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| **Metro bundler won't start** | `npx expo start --clear` |
| **Expo Go shows blank screen** | Check `.env` for `EXPO_PUBLIC_GEMINI_API_KEY` |
| **"Unable to resolve module"** | `rm -rf node_modules && npm install` |
| **QR code not scanning** | Phone and PC on same Wi-Fi; try tunnel mode: `npx expo start --tunnel` |
| **TypeScript errors** | `npx tsc --noEmit` to see all errors |
| **Image picker crashes** | Ensure permissions are granted; check `app.json` plugin config |
| **Gemini API 403** | Check your API key and that Gemini API is enabled in Google Cloud Console |

---

**Made with ❤️ for Bangladeshi Farmers | কৃষি AI v2.1.0**
