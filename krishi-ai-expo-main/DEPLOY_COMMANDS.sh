# ─── Krishi AI Expo – Deploy Commands (run on YOUR machine) ──────────────────
# Account: expo.dev/accounts/krishiai
# Backend: https://api.krishiai.live/api/v1

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
eas update --branch production --message "Krishi AI v2.1.0 – api.krishiai.live" --non-interactive
# → Prints QR code + exp:// link. Open in Expo Go instantly.

# ── Step 5 (optional): Build standalone APK ──────────────────────────────────
eas build --platform android --profile preview
# → Returns download link for .apk in ~10 minutes

# ── Step 6 (optional): Run locally for testing ───────────────────────────────
npx expo start
# Scan QR with Expo Go app on same Wi-Fi

# ── What's wired up ───────────────────────────────────────────────────────────
# Primary API  → https://api.krishiai.live/api/v1  (your FastAPI backend)
# Fallback     → Google Gemini direct (if backend unreachable)
# Supabase     → nmngzjrrysjzuxfcklrk.supabase.co  (user sync)
# Supabase key → already in .env
# Owner        → krishiai  (set in app.json)

# ── Backend endpoints called by the app ───────────────────────────────────────
# POST /api/v1/diagnosis/image   → AI crop scanner
# POST /api/v1/chat              → Agri chatbot
# POST /api/v1/pesticide/recommend → Pesticide expert
# POST /api/v1/soil/analyze      → Soil expert
# POST /api/v1/yield/predict     → Yield predictor
# POST /api/v1/learn/content     → Learning center
