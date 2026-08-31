const HF_TOKEN = process.env.EXPO_PUBLIC_HF_TOKEN || '';
const HF_API_BASE = 'https://api-inference.huggingface.co/models';

const PRIMARY_MODEL = 'linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification';
const FALLBACK_MODEL = 'linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification';

export interface PlantDiseaseResult {
  disease: string;
  crop: string;
  confidence: number;
  isHealthy: boolean;
}

interface HFClassification {
  label: string;
  score: number;
}

function parseLabel(label: string): { crop: string; disease: string } {
  const trimmed = label.trim();

  if (trimmed.includes('___')) {
    const parts = trimmed.split('___');
    return {
      crop: parts[0].replace(/_/g, ' ').replace(/\s+/g, ' ').trim(),
      disease: (parts[1] || '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim(),
    };
  }

  const knownCrops = [
    'Corn', 'Maize', 'Rice', 'Potato', 'Wheat', 'Tomato', 'Apple',
    'Grape', 'Orange', 'Peach', 'Pepper', 'Soybean', 'Strawberry',
    'Blueberry', 'Cherry', 'Squash', 'Raspberry',
  ];

  for (const crop of knownCrops) {
    if (trimmed.startsWith(crop)) {
      const disease = trimmed.slice(crop.length).trim();
      return { crop, disease: disease || 'Unknown' };
    }
  }

  return { crop: '', disease: trimmed };
}

async function callHFModel(
  modelId: string,
  base64Image: string,
  mimeType: string,
): Promise<HFClassification[] | null> {
  const token = HF_TOKEN;
  if (!token) return null;

  try {
    const response = await fetch(`${HF_API_BASE}/${modelId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `data:${mimeType};base64,${base64Image}`,
      }),
    });

    if (!response.ok) {
      console.warn(`HF API error (${modelId}): ${response.status}`);
      return null;
    }

    const data: HFClassification[] = await response.json();
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch (err) {
    console.warn(`HF API call failed (${modelId}):`, err);
    return null;
  }
}

export const classifyPlantDisease = async (
  base64Image: string,
  mimeType: string,
): Promise<PlantDiseaseResult | null> => {
  let results = await callHFModel(PRIMARY_MODEL, base64Image, mimeType);

  if (!results || results.length === 0) {
    results = await callHFModel(FALLBACK_MODEL, base64Image, mimeType);
  }

  if (!results || results.length === 0) return null;

  const top = results[0];
  const parsed = parseLabel(top.label);

  return {
    disease: parsed.disease,
    crop: parsed.crop,
    confidence: top.score,
    isHealthy: top.label.toLowerCase().includes('healthy'),
  };
};
