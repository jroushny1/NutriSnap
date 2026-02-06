// NutriSnap - Main Application Controller

class App {
  constructor() {
    this.settings = {};
    this.weightChart = null;
  }

  async init() {
    // Initialize database
    await nutriDB.init();

    // Initialize camera
    camera.init();
    camera.setupListeners();

    // Setup UI event listeners
    ui.setupEventListeners();

    // Load settings
    this.settings = await nutriDB.getSettings();

    // Check if first run
    const onboarded = await nutriDB.getSetting('onboarded');
    if (!onboarded) {
      ui.showOnboarding();
    }

    // Initialize weight chart
    const canvas = document.getElementById('weight-chart');
    if (canvas) {
      this.weightChart = new SimpleChart(canvas);
    }

    // Refresh date when app returns from background
    this._lastDateStr = ui.formatDate(new Date());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const now = new Date();
        const todayStr = ui.formatDate(now);
        if (todayStr !== this._lastDateStr) {
          const wasViewingOldToday = ui.formatDate(ui.currentDate) === this._lastDateStr;
          this._lastDateStr = todayStr;
          if (wasViewingOldToday) {
            ui.currentDate = now;
          }
          this.loadDayEntries();
        }
        // Check for SW updates
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(reg => reg.update());
        }
      }
    });

    // Load initial view
    this.loadDayEntries();
  }

  // Load entries for current date
  async loadDayEntries() {
    const dateStr = ui.formatDate(ui.currentDate);
    const entries = await nutriDB.getEntriesByDate(dateStr);
    this.settings = await nutriDB.getSettings();
    ui.renderDiary(entries, this.settings);
  }

  // Add food entry from serving modal
  async addFoodEntry() {
    if (!ui.selectedFood) return;

    const amount = parseFloat(document.getElementById('serving-amount').value) || 1;
    const unit = document.getElementById('serving-unit').value;
    const food = ui.selectedFood;

    // Calculate actual serving size in original units
    let servingSize, servingUnit;
    let multiplier = amount;

    if (unit === 'g') {
      servingSize = amount;
      servingUnit = 'g';
      multiplier = amount / 100;
    } else if (unit === 'oz') {
      servingSize = amount;
      servingUnit = 'oz';
      multiplier = (amount * 28.35) / 100;
    } else {
      servingSize = amount;
      servingUnit = 'serving';
      multiplier = amount * ((food.serving || 100) / 100);
    }

    // Check if this is for a recipe ingredient
    if (ui.currentMeal === 'recipe-ingredient') {
      ui.addRecipeIngredient(food, servingSize, servingUnit);
      ui.closeModal('serving-modal');
      ui.openModal('recipe-modal');
      return;
    }

    const entry = {
      date: ui.formatDate(ui.currentDate),
      meal: ui.currentMeal,
      foodId: food.id,
      name: food.name,
      servingSize: servingSize,
      servingUnit: servingUnit,
      calories: food.calories * multiplier,
      protein: food.protein * multiplier,
      carbs: food.carbs * multiplier,
      fat: food.fat * multiplier,
      fiber: (food.fiber || 0) * multiplier,
      photoBlob: ui.currentPhoto
    };

    await nutriDB.addEntry(entry);
    ui.closeAllModals();
    this.loadDayEntries();
  }

  // Add custom food
  async addCustomFood() {
    const name = document.getElementById('custom-name').value.trim();
    const calories = parseFloat(document.getElementById('custom-calories').value) || 0;
    const protein = parseFloat(document.getElementById('custom-protein').value) || 0;
    const carbs = parseFloat(document.getElementById('custom-carbs').value) || 0;
    const fat = parseFloat(document.getElementById('custom-fat').value) || 0;

    if (!name) return;

    const customFood = {
      name,
      calories,
      protein,
      carbs,
      fat,
      fiber: 0,
      serving: 100,
      unit: 'g',
      category: 'Custom'
    };

    await nutriDB.addCustomFood(customFood);

    // Open serving modal with custom food
    ui.openServingModal(customFood);

    // Clear form
    document.getElementById('custom-food-form').reset();
  }

  // Delete entry
  async deleteEntry(id) {
    await nutriDB.deleteEntry(id);
    this.loadDayEntries();
  }

  // Load recipes
  async loadRecipes() {
    const recipes = await nutriDB.getRecipes();
    ui.renderRecipes(recipes);
  }

  // Edit recipe
  async editRecipe(id) {
    const recipes = await nutriDB.getRecipes();
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      ui.openRecipeModal(recipe);
    }
  }

  // Save recipe
  async saveRecipe() {
    const name = document.getElementById('recipe-name').value.trim();
    const servings = parseInt(document.getElementById('recipe-servings').value) || 1;

    if (!name || ui.recipeIngredients.length === 0) {
      alert('Please enter a recipe name and add at least one ingredient.');
      return;
    }

    // Calculate totals
    let totalCal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    ui.recipeIngredients.forEach(ing => {
      totalCal += ing.calories || 0;
      totalProtein += ing.protein || 0;
      totalCarbs += ing.carbs || 0;
      totalFat += ing.fat || 0;
    });

    const recipe = {
      id: ui.editingRecipe ? ui.editingRecipe.id : undefined,
      name,
      servings,
      ingredients: ui.recipeIngredients,
      totalCalories: totalCal,
      totalProtein: totalProtein,
      totalCarbs: totalCarbs,
      totalFat: totalFat,
      perServing: {
        calories: totalCal / servings,
        protein: totalProtein / servings,
        carbs: totalCarbs / servings,
        fat: totalFat / servings
      },
      photoBlob: ui.recipePhoto
    };

    if (ui.editingRecipe) {
      await nutriDB.updateRecipe(recipe);
    } else {
      await nutriDB.addRecipe(recipe);
    }

    ui.closeAllModals();
    this.loadRecipes();
  }

  // Add recipe to meal
  async addRecipeToMeal(recipeId) {
    const recipes = await nutriDB.getRecipes();
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    // Ask which meal
    const meal = prompt('Add to which meal? (breakfast, lunch, dinner, snacks)', 'lunch');
    if (!meal || !['breakfast', 'lunch', 'dinner', 'snacks'].includes(meal.toLowerCase())) {
      return;
    }

    const entry = {
      date: ui.formatDate(ui.currentDate),
      meal: meal.toLowerCase(),
      foodId: 'recipe_' + recipe.id,
      name: recipe.name + ' (1 serving)',
      servingSize: 1,
      servingUnit: 'serving',
      calories: recipe.perServing.calories,
      protein: recipe.perServing.protein,
      carbs: recipe.perServing.carbs,
      fat: recipe.perServing.fat,
      fiber: 0,
      photoBlob: recipe.photoBlob
    };

    await nutriDB.addEntry(entry);
    ui.switchView('diary');
    this.loadDayEntries();
  }

  // Load progress
  async loadProgress() {
    const weights = await nutriDB.getWeights();
    this.settings = await nutriDB.getSettings();
    ui.renderProgress(weights, this.settings, this.weightChart);
  }

  // Save weight
  async saveWeight() {
    const weight = parseFloat(document.getElementById('weight-input').value);
    const date = document.getElementById('weight-date').value;

    if (!weight || !date) return;

    await nutriDB.logWeight(date, weight);
    ui.closeModal('weight-modal');
    this.loadProgress();
  }

  // Load settings
  async loadSettings() {
    this.settings = await nutriDB.getSettings();
    ui.renderSettings(this.settings);
  }

  // Save settings
  async saveSettings() {
    const newSettings = {
      dailyCalorieGoal: parseInt(document.getElementById('setting-calories').value) || 1800,
      proteinGoal: parseInt(document.getElementById('setting-protein').value) || 120,
      carbGoal: parseInt(document.getElementById('setting-carbs').value) || 180,
      fatGoal: parseInt(document.getElementById('setting-fat').value) || 60,
      startWeight: parseFloat(document.getElementById('setting-start-weight').value) || null,
      targetWeight: parseFloat(document.getElementById('setting-target-weight').value) || null,
      weightUnit: document.getElementById('setting-weight-unit').value || 'lbs'
    };

    await nutriDB.setSettings(newSettings);
    this.settings = newSettings;
    alert('Settings saved!');
  }

  // Export data
  async exportData() {
    const data = await nutriDB.exportData();

    // Remove photo blobs for export (too large for JSON)
    const exportData = JSON.parse(JSON.stringify(data, (key, value) => {
      if (key === 'photoBlob') return undefined;
      return value;
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrisnap-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import data
  async importData(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await nutriDB.importData(data);
      alert('Data imported successfully!');
      this.loadDayEntries();
    } catch (error) {
      alert('Failed to import data: ' + error.message);
    }
  }

  // Complete onboarding
  async completeOnboarding() {
    const calories = parseInt(document.getElementById('onboard-calories').value) || 1800;
    const currentWeight = parseFloat(document.getElementById('onboard-current-weight').value);
    const targetWeight = parseFloat(document.getElementById('onboard-target-weight').value);
    const weightUnit = document.getElementById('onboard-weight-unit').value;

    await nutriDB.setSettings({
      dailyCalorieGoal: calories,
      proteinGoal: Math.round(calories * 0.25 / 4), // ~25% of calories from protein
      carbGoal: Math.round(calories * 0.45 / 4), // ~45% of calories from carbs
      fatGoal: Math.round(calories * 0.30 / 9), // ~30% of calories from fat
      startWeight: currentWeight || null,
      targetWeight: targetWeight || null,
      weightUnit: weightUnit,
      onboarded: true
    });

    // Log initial weight if provided
    if (currentWeight) {
      await nutriDB.logWeight(ui.formatDate(new Date()), currentWeight);
    }

    ui.closeModal('onboarding-modal');
    this.settings = await nutriDB.getSettings();
    this.loadDayEntries();
  }
}

// Global app instance
const app = new App();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
