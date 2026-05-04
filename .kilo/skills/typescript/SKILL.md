---
name: typescript
description: Skill for TypeScript best practices and linting in the krishi-ai-expo project
---

# TypeScript Skill

This skill provides TypeScript best practices and patterns used in the krishi-ai-expo project.

## tsconfig.json Overview

Based on the project's tsconfig.json:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "target": "es2022",
    "lib": ["es2022"],
    "sourceMap": true,
    "rootDir": ".",
    "resolveJsonModule": true,
    "skipLibCheck": true
  }
}
```

## Common Type Patterns

### User Profile Interface
From src/services/supabase.ts:
```typescript
export interface UserProfile {
  uid: string;
  displayName: string;
  mobile?: string;
  role?: string;
  district?: string;
  upazila?: string;
}
```

### Saved Report Interface
```typescript
export interface SavedReport {
  id: string;
  userId: string;
  timestamp: string;
  type: 'disease' | 'soil' | 'pest' | 'yield' | 'chat';
  title: string;
  content: string;
  icon?: string;
}
```

## Best Practices

### 1. Type Safety
- Use `strict`: true for maximum type checking
- Prefer `unknown` over `any` for uncertain types
- Use explicit return types for public functions
- Avoid `any` unless absolutely necessary

### 2. Interface Design
- Use interfaces for object shapes that may be implemented
- Use type aliases for complex types, unions, and mappings
- Make properties optional with `?` when appropriate
- Use readonly for immutable properties

### 3. Function Types
```typescript
// Good: explicit return type
async function fetchReports(userId: string): Promise<SavedReport[]> {
  // implementation
}

// Good: typed parameters
function saveReport(report: SavedReport): Promise<void> {
  // implementation
}

// Avoid: implicit any
function processData(data) { // Bad
  // implementation
}
```

### 4. Error Handling
```typescript
// Good: typed catch
try {
  // operation
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Unknown error:', error);
  }
}

// Even better: unknown type with type guard
try {
  // operation
} catch (error) {
  if (error && typeof error === 'object' && 'message' in error) {
    console.error(String(error.message));
  } else {
    console.error('Unknown error:', String(error));
  }
}
```

### 5. Async/Await Patterns
```typescript
// Good: proper async typing
async function fetchUserData(): Promise<UserProfile | null> {
  try {
    const { data } = await supabase.from('users').select().eq('id', userId).single();
    return data ? (data as UserProfile) : null;
  } catch {
    return null;
  }
}

// Avoid: fire-and-forget without handling
someAsyncFunction().then(() => {}); // Bad if not handled

// Better: either handle or explicitly mark as fire-and-forget
someAsyncFunction().catch(console.error); // Good
// or
void someAsyncFunction(); // Explicitly ignored
```

### 6. Nullish Coalescing and Optional Chaining
```typescript
// Good: nullish coalescing for defaults
const name = user.displayName ?? 'Anonymous';

// Good: optional chaining for nested properties
const location = user.district ?? null;

// Combine both safely
const userLocation = user.district ?? user.upazila ?? 'Unknown';
```

## Common Utility Types

From examining the codebase, these patterns emerge:

### API Response Types
```typescript
type ApiResponse<T> = {
  data?: T;
  error?: unknown;
  loading: boolean;
};

// Or for Supabase-like responses
type SupabaseResponse<T> = {
  data: T | null;
  error: { message: string; code: string } | null;
  count: number | null;
};
```

### Loading States
```typescript
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: unknown };
```

## Naming Conventions

### Interfaces and Types
- Use PascalCase (e.g., `UserProfile`, `SavedReport`)
- Prefix interfaces with `I` only if team convention requires it (not used in this project)
- Use descriptive names that convey purpose

### Variables and Functions
- Use camelCase
- Boolean variables: start with `is`, `has`, `should`, `can` (e.g., `isLoading`, `hasError`)
- Functions: use verbs (e.g., `fetchReports`, `saveUserProfile`)

### Constants
- Use UPPER_SNAKE_CASE for true constants
- Use const for values that won't change
- Group related constants in enums or objects

## Linting Rules (ESLint + TypeScript)

The project likely uses standard TypeScript ESLint rules. Key patterns to enforce:

### 1. Consistent Returns
- Functions should either always return a value or never return
- Avoid mixed return statements

### 2. Proper Typing
- No implicit any (`@typescript-eslint/no-explicit-any`)
- Explicit return types for public functions (`@typescript-eslint/explicit-module-boundary-types`)
- Typed destructuring (`@typescript-eslint-consistent-type-definitions`)

### 3. Null Safety
- Strict null checks (`@typescript-eslint/strict-null-checks`)
- Prefer nullish coalescing over logical OR for defaults
- Use optional chaining safely

### 4. Code Style
- Consistent brace style
- Semicolons required
- No trailing commas in single-line statements
- Proper import ordering

## Project-Specific Patterns

### Expo Modules
```typescript
// Good: typing Expo constants
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.API_URL ?? '';

// Good: typing AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('@key', JSON.stringify(value));
```

### React Native Components
```typescript
// Good: typing component props
interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const MyButton: React.FC<Props> = ({ title, onPress, disabled }) => {
  return (
    <Button title={title} onPress={onPress} disabled={disabled} />
  );
};

// Good: typing state and props in class components
interface State {
  loading: boolean;
  data: Item[] | null;
}

class MyComponent extends React.Component<Props, State> {
  // implementation
}
```

## Common TypeScript Pitfalls to Avoid

1. **Overusing any** - Leads to loss of type safety
2. **Ignoring strict null checks** - Causes runtime errors
3. **Misusing optional chaining** - Can hide real errors
4. **Inconsistent return types** - Makes functions harder to use
5. **Not typing event handlers** - Loses type information for events
6. **Using any in arrays** - Loses type safety for collections

## Migration Tips for JavaScript to TypeScript

1. **Start with strict mode off** - Gradually increase strictness
2. **Convert interfaces first** - Define shapes of data
3. **Type exports and imports** - Module boundaries are key
4. **Use allowJs: true** - During transition period
5. **Leverage inference** - Let TypeScript infer types where obvious
6. **Add JSDoc comments** - As temporary type definitions
7. **Convert one file at a time** - Focus on high-value files first

## Resources

- TypeScript Handbook: https://www.typescriptlang.org/docs/
- React Native + TypeScript: https://reactnative.dev/docs/typescript
- Expo TypeScript Guide: https://docs.expo.dev/versions/latest/sdk/typescript/
- ESLint TypeScript: https://typescript-eslint.io/