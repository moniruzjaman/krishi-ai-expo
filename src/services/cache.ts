import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Offline caching service for managing cached data with expiration
 * Useful for caching API responses (market prices, weather, etc.)
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const CACHE_PREFIX = '@krishi_ai_cache_';

/**
 * Get cached data if it exists and hasn't expired
 */
export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();

    // Check if cache has expired
    if (now - entry.timestamp > entry.ttl) {
      // Delete expired cache
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error(`Error reading cache for key ${key}:`, error);
    return null;
  }
};

/**
 * Cache data with optional TTL (default: 1 hour)
 */
export const setCacheData = async <T>(
  key: string,
  data: T,
  ttlMinutes: number = 60
): Promise<boolean> => {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    };
    await AsyncStorage.setItem(
      `${CACHE_PREFIX}${key}`,
      JSON.stringify(entry)
    );
    return true;
  } catch (error) {
    console.error(`Error caching data for key ${key}:`, error);
    return false;
  }
};

/**
 * Get data from cache or fallback to API call
 */
export const getOrFetchData = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMinutes: number = 60
): Promise<T> => {
  // Try to get from cache first
  const cached = await getCachedData<T>(key);
  if (cached) {
    console.log(`Cache hit for key: ${key}`);
    return cached;
  }

  // Fetch from API if not cached
  console.log(`Cache miss for key: ${key}, fetching from API`);
  const data = await fetchFn();

  // Cache the result
  await setCacheData(key, data, ttlMinutes);

  return data;
};

/**
 * Clear specific cache entry
 */
export const clearCache = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    return true;
  } catch (error) {
    console.error(`Error clearing cache for key ${key}:`, error);
    return false;
  }
};

/**
 * Clear all app cache
 */
export const clearAllCache = async (): Promise<boolean> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
    return true;
  } catch (error) {
    console.error('Error clearing all cache:', error);
    return false;
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = async (): Promise<{
  totalCacheSize: number;
  cacheEntries: string[];
  expiredEntries: string[];
}> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));
    const expiredEntries: string[] = [];
    let totalSize = 0;
    const now = Date.now();

    for (const key of cacheKeys) {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        totalSize += cached.length;
        try {
          const entry: CacheEntry<any> = JSON.parse(cached);
          if (now - entry.timestamp > entry.ttl) {
            expiredEntries.push(key);
          }
        } catch {
          // Ignore parsing errors
        }
      }
    }

    return {
      totalCacheSize: totalSize,
      cacheEntries: cacheKeys,
      expiredEntries,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return {
      totalCacheSize: 0,
      cacheEntries: [],
      expiredEntries: [],
    };
  }
};

/**
 * Cleanup expired cache entries
 */
export const cleanupExpiredCache = async (): Promise<number> => {
  try {
    const stats = await getCacheStats();
    let cleaned = 0;

    for (const key of stats.expiredEntries) {
      await AsyncStorage.removeItem(key);
      cleaned++;
    }

    console.log(`Cleaned up ${cleaned} expired cache entries`);
    return cleaned;
  } catch (error) {
    console.error('Error cleaning up expired cache:', error);
    return 0;
  }
};
