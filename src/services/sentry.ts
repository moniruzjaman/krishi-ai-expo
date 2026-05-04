import * as Sentry from '@sentry/react-native';

/**
 * Initialize Sentry for crash reporting and error monitoring
 * Usage: Call initSentry() in your app's entry point before rendering
 */
export const initSentry = () => {
  Sentry.init({
    // Replace with your actual Sentry DSN
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
    
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
    tracesSampleRate: 1.0,
    
    // Enable debug in development
    debug: __DEV__,
    
    // Set environment
    environment: __DEV__ ? 'development' : 'production',
    
    // Capture breadcrumbs for better error tracking
    maxBreadcrumbs: 100,
    
    // Attach stack traces to all messages
    attachStacktrace: true,
    
    // Configure error filtering
    beforeSend: (event, hint) => {
      // Don't send errors in development unless explicitly set
      if (__DEV__) {
        console.log('Sentry Event:', event);
        // Optionally return null to not send in development
        // return null;
      }
      return event;
    },
    
    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Random plugins/extensions
      'chrome-extension://',
      'moz-extension://',
      // Network errors
      'NetworkError',
      'Network error',
      'Non-Error promise rejection captured',
    ],
  });
};

/**
 * Capture an exception with Sentry
 */
export const captureException = (error: Error) => {
  Sentry.captureException(error);
};

/**
 * Capture a message with Sentry
 */
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};

/**
 * Set user context for Sentry
 */
export const setSentryUser = (userId: string, email?: string, username?: string) => {
  Sentry.setUser({
    id: userId,
    email: email || undefined,
    username: username || undefined,
  });
};

/**
 * Clear user context
 */
export const clearSentryUser = () => {
  Sentry.setUser(null);
};

/**
 * Add breadcrumb for tracking user actions
 */
export const addBreadcrumb = (message: string, category: string = 'user-action') => {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
  });
};
