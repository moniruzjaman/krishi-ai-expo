/**
 * Code splitting configuration for optimized bundle loading
 * Helps lazy load routes and components to reduce initial bundle size
 */

import React, { Suspense, ComponentType } from 'react';
import { View, ActivityIndicator } from 'react-native';

/**
 * Loading fallback component
 */
export const LoadingFallback: React.FC = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
    }}
  >
    <ActivityIndicator size="large" color="#0A8A1F" />
  </View>
);

/**
 * Lazy load component with Suspense boundary
 */
export const lazyComponent = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) => {
  return (props: P) => (
    <Suspense fallback={fallback || <LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
};

/**
 * Code splitting strategy for tools
 * Each tool screen can be lazy loaded when needed
 */
export const toolLazyLoadConfig = {
  // Heavy tools that benefit from code splitting
  analyzer: () =>
    import('../app/analyzer').then((m) => ({
      default: m.default,
    })),
  chat: () =>
    import('../app/chat').then((m) => ({
      default: m.default,
    })),
  market: () =>
    import('../app/market').then((m) => ({
      default: m.default,
    })),
  weather: () =>
    import('../app/weather').then((m) => ({
      default: m.default,
    })),
  library: () =>
    import('../app/library').then((m) => ({
      default: m.default,
    })),

  // Light tools can stay in main bundle
  pesticide: () =>
    import('../app/pesticide').then((m) => ({
      default: m.default,
    })),
  soil: () =>
    import('../app/soil').then((m) => ({
      default: m.default,
    })),
  yield: () =>
    import('../app/yield').then((m) => ({
      default: m.default,
    })),
  calendar: () =>
    import('../app/calendar').then((m) => ({
      default: m.default,
    })),
  nutrient: () =>
    import('../app/nutrient').then((m) => ({
      default: m.default,
    })),
} as const;

/**
 * Bundle size optimization recommendations:
 *
 * 1. **Enable Hermes Engine** in app.json for faster JS execution
 *    ```json
 *    {
 *      "plugins": [
 *        ["expo-build-properties", {
 *          "android": { "enableHermes": true },
 *          "ios": { "enableHermes": true }
 *        }]
 *      ]
 *    }
 *    ```
 *
 * 2. **Optimize Assets**
 *    - Compress images using ImageOptim or TinyPNG
 *    - Use WebP format for better compression
 *    - Remove unused fonts
 *
 * 3. **Tree Shake Unused Code**
 *    - Remove unused dependencies
 *    - Use ES6 imports/exports for better tree shaking
 *    - Review lodash/moment usage (heavy libraries)
 *
 * 4. **Dynamic Imports**
 *    - Lazy load heavy screens/components
 *    - Split large datasets (constants) by domain
 *    - Load libraries on demand
 *
 * 5. **Minification & Obfuscation**
 *    - Enable in production builds
 *    - Use expo-optimize for production
 *    - Review Babel configuration
 *
 * 6. **Monitor Bundle Size**
 *    - Use `expo-bundle-analyzer` to visualize bundle
 *    - Set bundle size budgets in CI/CD
 *    - Track bundle size over time
 *
 * Commands:
 * ```bash
 * # Analyze bundle
 * expo export --platform ios --analyzer
 *
 * # Optimize bundle
 * expo optimize
 *
 * # Production build
 * eas build --platform all --build-type production
 * ```
 */

/**
 * Performance monitoring utilities
 */
export const performanceMetrics = {
  /**
   * Measure component render time
   */
  measureRender: (componentName: string, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`${componentName} rendered in ${duration.toFixed(2)}ms`);

    // Log if render time exceeds threshold (16ms for 60fps)
    if (duration > 16) {
      console.warn(
        `⚠️ ${componentName} render time (${duration.toFixed(2)}ms) exceeds 16ms threshold`
      );
    }
  },

  /**
   * Measure API call time
   */
  measureAPICall: (endpoint: string, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`API call to ${endpoint} completed in ${duration.toFixed(2)}ms`);
  },
};

/**
 * Export performance utilities for use throughout app
 */
export const optimizationTips = `
# Bundle Optimization Checklist

## Immediate Actions
- [ ] Install dependencies with: npm install --legacy-peer-deps
- [ ] Test bundle size: expo export --platform ios --analyzer
- [ ] Enable Hermes engine in app.json
- [ ] Compress all images to WebP format

## Code Quality
- [ ] Run Jest tests: npm test
- [ ] Check TypeScript: npm run type-check (if available)
- [ ] Lint code: npm run lint (if available)

## Performance
- [ ] Implement code splitting for tool screens
- [ ] Use lazy loading for heavy components
- [ ] Cache API responses for offline support
- [ ] Implement React.memo for pure components

## Monitoring
- [ ] Set up Sentry for crash reporting
- [ ] Add performance monitoring
- [ ] Track bundle size in CI/CD
- [ ] Monitor app startup time

## Deployment
- [ ] Build with EAS: eas build --platform all --build-type production
- [ ] Test on real devices
- [ ] Monitor Firebase Analytics
- [ ] Set up auto-scaling for backend APIs
`;
