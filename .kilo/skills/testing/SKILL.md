---
name: testing
description: Skill for React Native testing patterns and utilities in the krishi-ai-expo project
---

# Testing Skill

This skill provides common patterns and utilities for testing React Native components and services in the krishi-ai-expo project.

## Common Operations

### Component Testing
- Test UI components with React Native Testing Library
- Mock native modules and APIs
- Test navigation and routing with expo-router

### Service Testing
- Mock Supabase client for service tests
- Test async operations and error handling
- Mock AsyncStorage and other Expo modules

### Test Utilities
- Custom renderers with providers
- Test data factories and builders
- Mock date/time for consistent tests

## Testing Setup

The project uses Jest with React Native Testing Library and Jest Expo preset.

### jest.config.json
```json
{
  "preset": "jest-expo",
  "setupFilesAfterEnv": ["@testing-library/jest-native/extend-expect"],
  "testMatch": ["**/?(*.)+(spec|test).[tj]s?(x)"]
}
```

### jest.setup.js
```javascript
import '@testing-library/jest-native/extend-expect';
```

## Common Patterns

### Component Test Structure
```typescript
import { render, screen } from '@testing-library/react-native';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    render(<MyComponent />);
  });

  it('renders correctly', () => {
    expect(screen.getByText(/expected text/i)).toBeTruthy();
  });

  it('handles user interaction', () => {
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeEnabled();
    // firePress(button); // uncomment when testing interactions
  });
});
```

### Service Test Structure
```typescript
import { supabase } from '../services/supabase';

// Mock supabase
jest.mock('../services/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({ data: [], error: null }),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockResolvedValue({ data: [], error: null }),
  },
}));

describe('supabase service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save report correctly', async () => {
    await saveReport({ /* test data */ });
    expect(supabase.from).toHaveBeenCalledWith('saved_reports');
    expect(supabase.insert).toHaveBeenCalled();
  });
});
```

## Mocking Common Modules

### AsyncStorage Mock
```typescript
// __mocks__/@react-native-async-storage/async-storage.js
const mockData = new Map();
export default {
  getItem: jest.fn(async (key) => mockData.get(key) || null),
  setItem: jest.fn(async (key, value) => {
    mockData.set(key, value);
    return Promise.resolve();
  }),
  removeItem: jest.fn(async (key) => {
    mockData.delete(key);
    return Promise.resolve();
  }),
  clear: jest.fn(async () => {
    mockData.clear();
    return Promise.resolve();
  }),
};
```

### Expo Constants Mock
```typescript
// __mocks__/expo-constants.js
export default {
  expoConfig: {
    extra: {
      SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_ANON_KEY: 'test-key',
    },
  },
};
```

## Best Practices

1. Test behavior, not implementation details
2. Use meaningful test names that describe what should happen
3. Keep tests isolated - reset mocks between tests
4. Test both success and error cases
5. Use act() for async operations that cause state updates
6. Mock external services (Supabase, APIs) to make tests fast and reliable
7. Test accessibility labels and roles when appropriate
8. Use testID sparingly - prefer accessibility labels and text content

## Common Test Utilities

### Custom Renderer with Providers
```typescript
// test-utils.tsx
import { ReactNode } from 'react';
import { render as rtlRender } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../store';

export const render = (ui: ReactNode, options = {}) => {
  const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );

  return rtlRender(<Wrapper>{ui}</Wrapper>, options);
};

export * from '@testing-library/react-native';
```

### Test Data Builders
```typescript
// test/factories.ts
export const buildUserProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  uid: 'test-user-id',
  displayName: 'Test Farmer',
  mobile: '+8801234567890',
  role: 'farmer',
  district: 'Dhaka',
  upazila: 'Motijheel',
  ...overrides,
});

export const buildSavedReport = (overrides: Partial<SavedReport> = {}): SavedReport => ({
  id: 'test-report-id',
  userId: 'test-user-id',
  timestamp: new Date().toISOString(),
  type: 'disease',
  title: 'Test Report',
  content: 'This is a test report',
  icon: '🌱',
  ...overrides,
});
```

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test src/components/MyComponent.test.tsx

# Run tests matching a pattern
npm run test -- --testNamePattern="should save report"
```

## Continuous Integration

In CI environments, consider:
- Using `--ci` flag with Jest
- Collecting coverage reports
- Setting up test timeout limits
- Running tests on multiple Node.js versions if needed