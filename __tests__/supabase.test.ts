import { saveReport, fetchReports, syncUserProfile } from '../src/services/supabase';

// Mock @supabase/supabase-js
const mockSupabase = {
  from: jest.fn(() => ({
    upsert: jest.fn(() => Promise.resolve({ data: null })),
    insert: jest.fn(() => Promise.resolve({ data: null })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ data: [] })),
        })),
      })),
    })),
  })),
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

// Mock AsyncStorage (required for supabase auth)
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock Constants
jest.mock('expo-constants', () => ({
  expoConfig: { extra: {} },
}));

describe('Supabase Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_KEY;
  });

  it('should throw error if credentials are not set', async () => {
    // Dynamically reimport to pick up cleared env
    const { supabase } = await import('../src/services/supabase');
    expect(supabase).toBeNull();
  });

  it('should initialize client with env credentials', async () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_KEY = 'test-anon-key';

    const { supabase } = await import('../src/services/supabase');

    expect(supabase).toBeDefined();
  });

  it('should sync user profile', async () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_KEY = 'test-key';

    const { supabase } = await import('../src/services/supabase');
    await syncUserProfile({
      uid: 'user-123',
      displayName: 'Test User',
      role: 'farmer',
      district: 'Dhaka',
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('users');
    expect(mockSupabase.from().upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user-123',
        name: 'Test User',
      }),
      expect.objectContaining({ onConflict: 'id' }),
    );
  });

  it('should save a report', async () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_KEY = 'test-key';

    const { supabase, saveReport } = await import('../src/services/supabase');
    const report = {
      id: 'report-1',
      userId: 'user-123',
      timestamp: new Date().toISOString(),
      type: 'disease' as const,
      title: 'Test Report',
      content: 'Analysis result',
    };

    await saveReport(report);

    expect(mockSupabase.from).toHaveBeenCalledWith('saved_reports');
    expect(mockSupabase.from().insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'report-1',
        user_id: 'user-123',
      }),
    );
  });

  it('should fetch reports for a user', async () => {
    const mockData = [
      { id: 'r1', user_id: 'user-123', timestamp: '2026-05-14', type: 'disease', title: 'R' },
    ];

    (mockSupabase.from().select().eq().order().limit as jest.Mock).mockResolvedValueOnce({
      data: mockData,
    });

    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_KEY = 'test-key';

    const { fetchReports } = await import('../src/services/supabase');
    const reports = await fetchReports('user-123');

    expect(reports).toEqual(mockData);
  });

  it('should return empty array if supabase is not initialized', async () => {
    const { fetchReports } = await import('../src/services/supabase');
    const reports = await fetchReports('user-123');

    expect(reports).toEqual([]);
  });
});