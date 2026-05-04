---
name: supabase
description: Skill for Supabase database operations and common patterns in the krishi-ai-expo project
---

# Supabase Skill

This skill provides common patterns and utilities for working with Supabase in the krishi-ai-expo project.

## Common Operations

### User Profile Management
- Sync user profile data with Supabase
- Fetch user preferences and settings
- Update user location and role information

### Report Handling
- Save disease/soil/pest/yield/chat reports
- Fetch user reports with filtering and pagination
- Delete or archive old reports

### Caching Patterns
- Use Supabase for offline-first data synchronization
- Handle conflict resolution for concurrent updates
- Implement cache invalidation strategies

## Common Functions

### saveUserProfile
```typescript
export const syncUserProfile = async (user: UserProfile): Promise<void> => {
  if (!supabase || !user.uid) return;
  try {
    await supabase.from('users').upsert({
      id: user.uid,
      name: user.displayName,
      phone: user.mobile,
      role: user.role,
      location: user.district ? `${user.district}, ${user.upazila ?? ''}` : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn('Supabase profile sync failed:', err);
  }
};
```

### saveReport
```typescript
export const saveReport = async (report: SavedReport): Promise<void> => {
  if (!supabase) return;
  try {
    await supabase.from('saved_reports').insert({
      id: report.id,
      user_id: report.userId,
      timestamp: report.timestamp,
      type: report.type,
      title: report.title,
      content: report.content,
      icon: report.icon,
    });
  } catch (err) {
    console.warn('Supabase report save failed:', err);
  }
};
```

### fetchReports
```typescript
export const fetchReports = async (userId: string): Promise<SavedReport[]> => {
  if (!supabase) return [];
  try {
    const { data } = await supabase
      .from('saved_reports')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(50);
    return (data ?? []) as SavedReport[];
  } catch {
    return [];
  }
};
```

## Best Practices

1. Always check if supabase client is initialized before use
2. Use proper error handling with console.warn for non-critical failures
3. Implement proper TypeScript interfaces for all database tables
4. Use upsert for profile data to handle both insert and update
5. Order queries by timestamp descending for recent-first display
6. Limit query results to prevent excessive data loading

## Tables Reference

### users
- id (string, primary key)
- name (string)
- phone (string, nullable)
- role (string, nullable)
- location (string, nullable)
- updated_at (timestamp)

### saved_reports
- id (string, primary key)
- user_id (string, foreign key)
- timestamp (string)
- type: 'disease' | 'soil' | 'pest' | 'yield' | 'chat'
- title (string)
- content (string)
- icon (string, nullable)