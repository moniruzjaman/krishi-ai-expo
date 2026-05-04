---
name: expo
description: Skill for Expo CLI operations and common patterns in the krishi-ai-expo project
---

# Expo Skill

This skill provides common patterns and utilities for working with Expo in the krishi-ai-expo project.

## Common Operations

### Development Server
- Start Expo development server for different platforms
- Configure tunneling for remote device access
- Clear cache and reset project state

### Building and Deployment
- Create development builds with EAS
- Submit to app stores (Google Play, Apple App Store)
- Manage over-the-air (OTA) updates

### Configuration Management
- Work with app.json/app.config.js
- Manage environment variables
- Configure plugins and permissions

## Common Commands

### Start Development Server
```bash
# Web
npm run web

# Android
npm run android

# iOS
npm run ios

# All platforms
npm run start
```

### Testing
```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### EAS Build
```bash
# Development build
eas build --profile development --platform all

# Preview build
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all
```

### Submit to Stores
```bash
# Submit to Google Play
eas submit --platform android

# Submit to App Store
eas submit --platform ios
```

## Best Practices

1. Always test on physical devices when possible
2. Use development client for native debugging
3. Keep expo and SDK versions aligned
4. Use constants from expo-constants for config
5. Handle permissions gracefully with expo-permissions
6. Optimize images and assets for mobile
7. Use expo-updates for OTA updates
8. Test push notifications on physical devices

## Environment Variables

Required in .env file:
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_KEY
- Optional: SUPABASE_URL, SUPABASE_ANON_KEY for server-side

## Common Issues and Solutions

### JavaScript Bundle Issues
- Clear cache: `expo start -c`
- Reset project: `expo start -c --dev-client`

### Native Module Problems
- Clean and reinstall: 
  ```bash
  rm -rf node_modules && npm install
  cd ios && pod install && cd ..
  ```

### Build Failures
- Check expo-doctor: `npx expo-doctor`
- Verify SDK compatibility
- Check plugin configurations in app.json