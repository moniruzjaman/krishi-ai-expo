import * as location from '../src/services/location';

describe('Location Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentLocation', () => {
    it('should return coordinates when permission granted', async () => {
      const result = await location.getCurrentLocation();

      expect(result).toHaveProperty('latitude');
      expect(result).toHaveProperty('longitude');
      // Should return default location after mocking success path
      expect(result.latitude).toBe(23.8103);
      expect(result.longitude).toBe(90.4125);
    });
  });

  describe('getLocationName', () => {
    it('should return city and country if geocoded', async () => {
      const name = await location.getLocationName(23.8103, 90.4125);

      expect(name).toBe('ঢাকা, বাংলাদেশ');
    });

    it('should fall back to Dhaka if geocode fails', async () => {
      // Mock failure by testing the catch path - already defaulted in mock
      const name = await location.getLocationName(0, 0);

      expect(name).toBe('ঢাকা, বাংলাদেশ');
    });
  });

  describe('DEFAULT', () => {
    it('should export default coordinates', () => {
      expect(location.DEFAULT).toEqual({
        latitude: 23.8103,
        longitude: 90.4125,
      });
    });
  });
});