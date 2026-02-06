// NutriSnap - Open Food Facts API Module

const OFF_API_BASE = 'https://world.openfoodfacts.org';
const OFF_DEBOUNCE_MS = 600;

let _offDebounceTimer = null;
let _offAbortController = null;

// Search Open Food Facts for brand foods
async function searchOpenFoodFacts(query) {
  if (!query || query.length < 3) return [];

  // Cancel any in-flight request
  if (_offAbortController) {
    _offAbortController.abort();
  }
  _offAbortController = new AbortController();

  try {
    const url = `${OFF_API_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10&fields=product_name,brands,nutriments,serving_size,code,image_front_small_url`;

    const response = await fetch(url, {
      signal: _offAbortController.signal,
      headers: {
        'User-Agent': 'NutriSnap/2.0'
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (!data.products) return [];

    return data.products
      .filter(p => p.product_name && p.nutriments)
      .map(p => {
        const n = p.nutriments;
        return {
          id: 'off_' + (p.code || crypto.randomUUID()),
          name: p.product_name + (p.brands ? ` (${p.brands})` : ''),
          category: 'Brand',
          calories: Math.round(n['energy-kcal_100g'] || n['energy-kcal'] || 0),
          protein: Math.round((n.proteins_100g || 0) * 10) / 10,
          carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
          fat: Math.round((n.fat_100g || 0) * 10) / 10,
          fiber: Math.round((n.fiber_100g || 0) * 10) / 10,
          serving: 100,
          unit: 'g',
          source: 'openfoodfacts',
          imageUrl: p.image_front_small_url || null
        };
      });
  } catch (e) {
    if (e.name === 'AbortError') return [];
    console.warn('Open Food Facts search failed:', e);
    return [];
  }
}

// Debounced search that returns a promise
function searchOpenFoodFactsDebounced(query) {
  return new Promise((resolve) => {
    clearTimeout(_offDebounceTimer);
    _offDebounceTimer = setTimeout(async () => {
      const results = await searchOpenFoodFacts(query);
      resolve(results);
    }, OFF_DEBOUNCE_MS);
  });
}

// Cache a brand food to IndexedDB for offline reuse
async function cacheOpenFoodFactsItem(food) {
  try {
    const existing = await nutriDB.get('customFoods', food.id);
    if (!existing) {
      await nutriDB.put('customFoods', {
        ...food,
        createdAt: Date.now()
      });
    }
  } catch (e) {
    console.warn('Failed to cache OFF food:', e);
  }
}
