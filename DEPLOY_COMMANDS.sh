# ─── Krishi AI Expo – Deploy Commands (run on YOUR machine) ──────────────────
# Account: expo.dev/accounts/krishiai
# API: Gemini 2.0 Flash (direct, no backend)

# ── Step 1: Setup ─────────────────────────────────────────────────────────────
cd krishi-ai-expo
npm install

# ── Step 2: Set your EAS token ────────────────────────────────────────────────
# (generate a fresh token at expo.dev/accounts/krishiai/settings/access-tokens)
export EXPO_TOKEN="your-new-token-here"

# ── Step 3: Link project to your account ─────────────────────────────────────
eas init
# → This updates app.json with your real projectId automatically

# ── Step 4: Publish OTA update (Expo Go preview) ─────────────────────────────
eas update --branch production --message "Krishi AI v2.1.0 – Gemini direct" --non-interactive
# → Prints QR code + exp:// link. Open in Expo Go instantly.

# ── Step 5 (optional): Build standalone APK ──────────────────────────────────
eas build --platform android --profile preview
# → Returns download link for .apk in ~10 minutes

# ── Step 6 (optional): Run locally for testing ───────────────────────────────
npx expo start
# Scan QR with Expo Go app on same Wi-Fi

# ── What's wired up ───────────────────────────────────────────────────────────
# API          → Google Gemini 2.0 Flash (direct, no backend)
# Supabase     → nmngzjrrysjzuxfcklrk.supabase.co  (user sync)
# Supabase key → already in .env
# Owner        → krishiai  (set in app.json)
