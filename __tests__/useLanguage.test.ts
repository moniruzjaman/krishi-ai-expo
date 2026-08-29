import { renderHook, act } from '@testing-library/react-native';
import { useLanguage } from '../src/hooks/useLanguage';

// Mock AsyncStorage
const mockSetItem = jest.fn(() => Promise.resolve());
const mockGetItem = jest.fn(() => Promise.resolve(null));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: mockGetItem,
  setItem: mockSetItem,
}));

describe('useLanguage Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
  });

  it('should default to Bengali', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.lang).toBe('bn');
  });

  it('should switch language', async () => {
    const { result } = renderHook(() => useLanguage());

    await act(async () => {
      await result.current.setLang('en');
    });

    expect(result.current.lang).toBe('en');
    expect(mockSetItem).toHaveBeenCalledWith('krishi_ai_lang', 'en');
  });

  it('should translate text correctly', async () => {
    const { result } = renderHook(() => useLanguage());

    // Bengali
    expect(result.current.t('বাংলা', 'English')).toBe('বাংলা');

    // Switch to English
    await act(async () => {
      await result.current.setLang('en');
    });

    expect(result.current.t('বাংলা', 'English')).toBe('English');
  });
});