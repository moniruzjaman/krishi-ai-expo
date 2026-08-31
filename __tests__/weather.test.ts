import { fetchWeather, getWeather, DEFAULT_LAT, DEFAULT_LNG } from '../src/services/weather';

const mockFetch = jest.fn();

global.fetch = mockFetch;

describe('Weather Service', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  const mockOpenMeteoResponse = {
    current: {
      time: '2026-05-14T12:00:00',
      temperature_2m: 30,
      relative_humidity_2m: 65,
      weather_code: 0,
      wind_speed_10m: 12,
    },
    daily: {
      time: ['2026-05-14', '2026-05-15', '2026-05-16'],
      weather_code: [0, 1, 3],
      temperature_2m_max: [32, 30, 28],
      temperature_2m_min: [24, 23, 22],
    },
  };

  it('should fetch and parse weather data correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockOpenMeteoResponse),
    });

    const result = await fetchWeather(DEFAULT_LAT, DEFAULT_LNG);

    expect(result).toHaveProperty('location');
    expect(result).toHaveProperty('temp');
    expect(result).toHaveProperty('humidity');
    expect(result).toHaveProperty('wind');
    expect(result).toHaveProperty('condition');
    expect(result).toHaveProperty('forecast');
    expect(result).toHaveProperty('advisory');
    expect(result.temp).toBe(30);
    expect(result.forecast.length).toBe(3);
  });

  it('should include Bengali weather descriptions', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockOpenMeteoResponse),
    });

    const result = await fetchWeather();

    expect(result.condition).toBe('পরিষ্কার আকাশ');
    expect(result.forecast[0].day).toBe('আজ');
  });

  it('should generate advisory for rainy conditions', async () => {
    const rainyResponse = {
      ...mockOpenMeteoResponse,
      daily: {
        ...mockOpenMeteoResponse.daily,
        weather_code: [80, 80, 63],
      },
      current: {
        ...mockOpenMeteoResponse.current,
        temperature_2m: 36,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(rainyResponse),
    });

    const result = await fetchWeather();

    expect(result.advisory).toContain('বৃষ্টিপাত');
    expect(result.advisory).toContain('তাপমাত্রা বেশি');
  });

  it('should use Dhaka defaults when coordinates not provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockOpenMeteoResponse),
    });

    await fetchWeather(); // uses default coords

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('latitude=' + DEFAULT_LAT);
    expect(url).toContain('longitude=' + DEFAULT_LNG);
  });
});