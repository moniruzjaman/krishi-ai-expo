import { analyzeCropImage, chatWithAgriExpert } from '../src/services/gemini';

// Mock fetch
global.fetch = jest.fn();

describe('Gemini AI Service', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should throw error when API key is missing', async () => {
    // Ensure no env var is set
    delete process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    await expect(
      analyzeCropImage('base64image', 'image/jpeg', 'bn'),
    ).rejects.toThrow('EXPO_PUBLIC_GEMINI_API_KEY is not set');

    await expect(
      chatWithAgriExpert([{ role: 'user', content: 'hello' }], 'bn'),
    ).rejects.toThrow('EXPO_PUBLIC_GEMINI_API_KEY is not set');
  });

  it('should call Gemini API with correct parameters', async () => {
    process.env.EXPO_PUBLIC_GEMINI_API_KEY = 'test-api-key';

    const mockGeminiResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          candidates: [
            {
              content: {
                parts: [{ text: 'Test response from Gemini' }],
              },
            },
          ],
        }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce(mockGeminiResponse);

    const result = await analyzeCropImage('base64image', 'image/jpeg', 'bn');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain('generativelanguage.googleapis.com');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body).contents).toBeDefined();

    expect(result).toBe('Test response from Gemini');
  });

  it('should handle API errors gracefully', async () => {
    process.env.EXPO_PUBLIC_GEMINI_API_KEY = 'test-api-key';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: () => Promise.resolve('API key invalid'),
    });

    await expect(
      analyzeCropImage('base64image', 'image/jpeg', 'bn'),
    ).rejects.toMatchObject({
      message: expect.stringContaining('Gemini API error 403'),
    });
  });
});