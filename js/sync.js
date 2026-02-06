// NutriSnap - Supabase Cloud Backup Module

let _supabase = null;

// Initialize Supabase client
async function initSupabase() {
  const url = await nutriDB.getSetting('supabaseUrl');
  const key = await nutriDB.getSetting('supabaseKey');

  if (!url || !key) return null;

  // Load Supabase client from CDN if not already loaded
  if (typeof window.supabase === 'undefined') {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  _supabase = window.supabase.createClient(url, key);

  // Sign in anonymously
  const { data: { session } } = await _supabase.auth.getSession();
  if (!session) {
    await _supabase.auth.signInAnonymously();
  }

  return _supabase;
}

// Sync local data to Supabase
async function syncToSupabase() {
  const client = await initSupabase();
  if (!client) throw new Error('Supabase not configured. Add URL and key in Settings.');

  const lastSync = await nutriDB.getSetting('lastSyncAt') || 0;

  // Get all local data
  const entries = await nutriDB.getAll('entries');
  const weights = await nutriDB.getAll('weights');
  const recipes = await nutriDB.getAll('recipes');
  const settings = await nutriDB.getAll('settings');
  const customFoods = await nutriDB.getAll('customFoods');

  // Filter to items modified since last sync (using createdAt or timestamp)
  const newEntries = entries.filter(e => (e.createdAt || 0) > lastSync);
  const newWeights = weights.filter(w => (w.timestamp || 0) > lastSync);

  // Strip photo blobs before syncing
  const cleanEntries = newEntries.map(e => {
    const { photoBlob, ...rest } = e;
    return rest;
  });

  const cleanRecipes = recipes.map(r => {
    const { photoBlob, ...rest } = r;
    return rest;
  });

  // Upsert to Supabase tables
  if (cleanEntries.length > 0) {
    const { error } = await client.from('food_entries').upsert(cleanEntries, { onConflict: 'id' });
    if (error) console.warn('Sync entries error:', error.message);
  }

  if (newWeights.length > 0) {
    const { error } = await client.from('weights').upsert(newWeights, { onConflict: 'date' });
    if (error) console.warn('Sync weights error:', error.message);
  }

  if (cleanRecipes.length > 0) {
    const { error } = await client.from('recipes').upsert(cleanRecipes, { onConflict: 'id' });
    if (error) console.warn('Sync recipes error:', error.message);
  }

  if (customFoods.length > 0) {
    const cleanFoods = customFoods.map(f => {
      const { photoBlob, ...rest } = f;
      return rest;
    });
    const { error } = await client.from('custom_foods').upsert(cleanFoods, { onConflict: 'id' });
    if (error) console.warn('Sync custom foods error:', error.message);
  }

  // Sync settings (excluding api keys for safety)
  const safeSettings = settings.filter(s =>
    !s.key.includes('apiKey') && !s.key.includes('supabase')
  );
  if (safeSettings.length > 0) {
    const { error } = await client.from('settings').upsert(
      safeSettings.map(s => ({ key: s.key, value: JSON.stringify(s.value) })),
      { onConflict: 'key' }
    );
    if (error) console.warn('Sync settings error:', error.message);
  }

  // Update last sync timestamp
  await nutriDB.setSetting('lastSyncAt', Date.now());

  return {
    entries: cleanEntries.length,
    weights: newWeights.length,
    recipes: cleanRecipes.length
  };
}

// Restore data from Supabase
async function restoreFromSupabase() {
  const client = await initSupabase();
  if (!client) throw new Error('Supabase not configured.');

  // Pull all data
  const { data: entries } = await client.from('food_entries').select('*');
  const { data: weights } = await client.from('weights').select('*');
  const { data: recipes } = await client.from('recipes').select('*');
  const { data: customFoods } = await client.from('custom_foods').select('*');
  const { data: settings } = await client.from('settings').select('*');

  // Merge into IndexedDB
  let restored = 0;

  if (entries) {
    for (const entry of entries) {
      await nutriDB.put('entries', entry);
      restored++;
    }
  }

  if (weights) {
    for (const w of weights) {
      await nutriDB.put('weights', w);
      restored++;
    }
  }

  if (recipes) {
    for (const r of recipes) {
      await nutriDB.put('recipes', r);
      restored++;
    }
  }

  if (customFoods) {
    for (const f of customFoods) {
      await nutriDB.put('customFoods', f);
      restored++;
    }
  }

  if (settings) {
    for (const s of settings) {
      await nutriDB.setSetting(s.key, JSON.parse(s.value));
    }
  }

  return restored;
}
