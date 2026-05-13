/**
 * @jest-environment node
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCachedData,
  setCacheData,
  getOrFetchData,
  clearCache,
  clearAllCache,
  getCacheStats,
  cleanupExpiredCache,
} from '../src/services/cache';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

describe('Cache Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setCacheData', () => {
    it('should cache data with timestamp and TTL', async () => {
      const key = 'test_key';
      const data = { foo: 'bar' };
      await setCacheData(key, data, 60);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      const storedArg = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const entry = JSON.parse(storedArg);
      expect(entry.data).toEqual(data);
      expect(entry.ttl).toBe(60 * 60 * 1000); // 60 minutes in ms
      expect(typeof entry.timestamp).toBe('number');
    });
  });

  describe('getCachedData', () => {
    it('should return null if key does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await getCachedData('nonexistent');
      expect(result).toBeNull();
    });

    it('should return cached data if not expired', async () => {
      const key = 'valid_key';
      const data = { result: 42 };
      const entry = {
        data,
        timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
        ttl: 60 * 60 * 1000, // 1 hour TTL
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(entry));

      const result = await getCachedData(key);
      expect(result).toEqual(data);
    });

    it('should return null and remove expired cache', async () => {
      const key = 'expired_key';
      const entry = {
        data: { old: 'data' },
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        ttl: 60 * 60 * 1000, // 1 hour TTL
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(entry));

      const result = await getCachedData(key);
      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@krishi_ai_cache_' + key);
    });

    it('should handle JSON parse errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');
      const result = await getCachedData('bad_key');
      expect(result).toBeNull();
    });
  });

  describe('getOrFetchData', () => {
    it('should return cached data when available', async () => {
      const key = 'cached_key';
      const cached = { from: 'cache' };
      const entry = {
        data: cached,
        timestamp: Date.now(),
        ttl: 60 * 60 * 1000,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(entry));

      const fetchFn = jest.fn(() => Promise.resolve({ from: 'api' }));
      const result = await getOrFetchData(key, fetchFn, 60);

      expect(result).toEqual(cached);
      expect(fetchFn).not.toHaveBeenCalled();
    });

    it('should fetch from API when cache miss', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const freshData = { from: 'api' };
      const fetchFn = jest.fn(() => Promise.resolve(freshData));

      const result = await getOrFetchData(key, fetchFn, 60);

      expect(result).toEqual(freshData);
      expect(fetchFn).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });
});