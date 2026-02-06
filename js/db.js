// NutriSnap - IndexedDB Database Module

const DB_NAME = 'nutrisnap';
const DB_VERSION = 1;

class NutriDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Food entries store
        if (!db.objectStoreNames.contains('entries')) {
          const entriesStore = db.createObjectStore('entries', { keyPath: 'id' });
          entriesStore.createIndex('date', 'date', { unique: false });
          entriesStore.createIndex('meal', 'meal', { unique: false });
          entriesStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Custom foods store
        if (!db.objectStoreNames.contains('customFoods')) {
          const customStore = db.createObjectStore('customFoods', { keyPath: 'id' });
          customStore.createIndex('name', 'name', { unique: false });
        }

        // Recipes store
        if (!db.objectStoreNames.contains('recipes')) {
          const recipesStore = db.createObjectStore('recipes', { keyPath: 'id' });
          recipesStore.createIndex('name', 'name', { unique: false });
        }

        // Weight entries store
        if (!db.objectStoreNames.contains('weights')) {
          const weightsStore = db.createObjectStore('weights', { keyPath: 'date' });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Generic CRUD operations
  async add(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Food entry specific methods
  async addEntry(entry) {
    entry.id = entry.id || crypto.randomUUID();
    entry.createdAt = entry.createdAt || Date.now();
    return this.add('entries', entry);
  }

  async getEntriesByDate(date) {
    return this.getByIndex('entries', 'date', date);
  }

  async deleteEntry(id) {
    return this.delete('entries', id);
  }

  async updateEntry(entry) {
    return this.put('entries', entry);
  }

  // Get recent foods (last 20 unique foods)
  async getRecentFoods() {
    const entries = await this.getAll('entries');
    const seen = new Set();
    const recent = [];

    // Sort by createdAt descending
    entries.sort((a, b) => b.createdAt - a.createdAt);

    for (const entry of entries) {
      const key = entry.foodId || entry.name;
      if (!seen.has(key)) {
        seen.add(key);
        recent.push({
          foodId: entry.foodId,
          name: entry.name,
          calories: Math.round(entry.calories / entry.servingSize * 100), // per 100g equiv
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
          servingSize: entry.servingSize,
          servingUnit: entry.servingUnit
        });
        if (recent.length >= 20) break;
      }
    }
    return recent;
  }

  // Custom foods
  async addCustomFood(food) {
    food.id = food.id || 'custom_' + crypto.randomUUID();
    return this.add('customFoods', food);
  }

  async getCustomFoods() {
    return this.getAll('customFoods');
  }

  // Recipes
  async addRecipe(recipe) {
    recipe.id = recipe.id || crypto.randomUUID();
    recipe.createdAt = recipe.createdAt || Date.now();
    return this.add('recipes', recipe);
  }

  async updateRecipe(recipe) {
    return this.put('recipes', recipe);
  }

  async getRecipes() {
    return this.getAll('recipes');
  }

  async deleteRecipe(id) {
    return this.delete('recipes', id);
  }

  // Weight
  async logWeight(date, weight) {
    return this.put('weights', { date, weight, timestamp: Date.now() });
  }

  async getWeights() {
    const weights = await this.getAll('weights');
    return weights.sort((a, b) => a.date.localeCompare(b.date));
  }

  async getLatestWeight() {
    const weights = await this.getWeights();
    return weights.length > 0 ? weights[weights.length - 1] : null;
  }

  // Settings
  async getSetting(key) {
    const result = await this.get('settings', key);
    return result ? result.value : null;
  }

  async setSetting(key, value) {
    return this.put('settings', { key, value });
  }

  async getSettings() {
    const settings = await this.getAll('settings');
    const obj = {};
    for (const s of settings) {
      obj[s.key] = s.value;
    }
    return obj;
  }

  async setSettings(settingsObj) {
    for (const [key, value] of Object.entries(settingsObj)) {
      await this.setSetting(key, value);
    }
  }

  // Export all data
  async exportData() {
    const data = {
      entries: await this.getAll('entries'),
      customFoods: await this.getAll('customFoods'),
      recipes: await this.getAll('recipes'),
      weights: await this.getAll('weights'),
      settings: await this.getAll('settings'),
      exportedAt: new Date().toISOString()
    };
    return data;
  }

  // Import data
  async importData(data) {
    if (data.entries) {
      for (const entry of data.entries) {
        await this.put('entries', entry);
      }
    }
    if (data.customFoods) {
      for (const food of data.customFoods) {
        await this.put('customFoods', food);
      }
    }
    if (data.recipes) {
      for (const recipe of data.recipes) {
        await this.put('recipes', recipe);
      }
    }
    if (data.weights) {
      for (const weight of data.weights) {
        await this.put('weights', weight);
      }
    }
    if (data.settings) {
      for (const setting of data.settings) {
        await this.put('settings', setting);
      }
    }
  }
}

// Global instance
const nutriDB = new NutriDB();
