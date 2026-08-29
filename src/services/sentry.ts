import * as Sentry from '@sentry/react-native';

/**
 * Initialize Sentry for crash reporting and error monitoring
 * Usage: Call initSentry() in your app's entry point before rendering
 */
export const initSentry = () => {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    if (__DEV__) {
      console.warn('Sentry DSN not configured – error reporting disabled.');
    }
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    debug: __DEV__,
    environment: __DEV__ ? 'development' : 'production',
    maxBreadcrumbs: 100,
    attachStacktrace: true,
    beforeSend: (event, hint) => {
      if (__DEV__) {
        console.log('Sentry Event:', event);
      }
      return event;
    },
    ignoreErrors: [
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',
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
