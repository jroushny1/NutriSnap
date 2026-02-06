// NutriSnap - Claude Vision AI Food Analysis Module

const VISION_MODEL = 'claude-haiku-4-5-20251001';

const VISION_PROMPT = `You are a nutrition estimation assistant. Analyze this food photo and identify each distinct food item visible.

For each item, estimate:
- name: descriptive food name
- portion_grams: estimated weight in grams (use plate/utensil size as reference)
- calories: estimated calories
- protein: grams of protein
- carbs: grams of carbs
- fat: grams of fat
- confidence: "high", "medium", or "low"

Return ONLY valid JSON in this format, no other text:
{"items": [{"name": "...", "portion_grams": 0, "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "confidence": "medium"}]}

If you cannot identify food in the image, return: {"items": [], "error": "Could not identify food items"}`;

// Analyze a food photo using Claude Vision
async function analyzeFood(imageBlob, textHint) {
  const apiKey = await nutriDB.getSetting('anthropicApiKey');
  if (!apiKey) {
    throw new Error('No API key configured. Add your Anthropic API key in Settings.');
  }

  // Convert blob to base64
  const base64 = await blobToBase64(imageBlob);
  const mediaType = imageBlob.type || 'image/jpeg';

  // Build prompt with optional text hint
  let prompt = VISION_PROMPT;
  if (textHint && textHint.trim()) {
    prompt += `\n\nUser description/hint: "${textHint.trim()}"`;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: VISION_MODEL,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64
            }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${response.status}`);
  }

  const result = await response.json();
  const text = result.content?.[0]?.text || '';

  // Parse JSON from response
  try {
    const parsed = JSON.parse(text);
    if (parsed.error) {
      return { items: [], error: parsed.error };
    }
    return { items: parsed.items || [] };
  } catch (e) {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      return { items: parsed.items || [] };
    }
    throw new Error('Failed to parse AI response');
  }
}

// Test API key validity
async function testApiKey(apiKey) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }]
      })
    });
    return response.ok;
  } catch (e) {
    return false;
  }
}

// Convert blob to base64 string (without data URL prefix)
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
