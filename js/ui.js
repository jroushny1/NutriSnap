// NutriSnap - UI Components Module

class UI {
  constructor() {
    this.currentView = 'diary';
    this.currentDate = new Date();
    this.currentMeal = null;
    this.selectedFood = null;
    this.currentPhoto = null;
    this.editingRecipe = null;
    this.recipeIngredients = [];
    this.recipePhoto = null;
  }

  // Date utilities
  formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  formatDisplayDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateStr = this.formatDate(date);
    if (dateStr === this.formatDate(today)) return 'Today';
    if (dateStr === this.formatDate(yesterday)) return 'Yesterday';
    if (dateStr === this.formatDate(tomorrow)) return 'Tomorrow';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  // Navigation
  switchView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(viewName + '-view').classList.add('active');
    document.querySelector(`.nav-btn[data-view="${viewName}"]`).classList.add('active');

    this.currentView = viewName;

    // Trigger view-specific updates
    if (viewName === 'diary') app.loadDayEntries();
    if (viewName === 'recipes') app.loadRecipes();
    if (viewName === 'progress') app.loadProgress();
    if (viewName === 'settings') app.loadSettings();
  }

  // Modal management
  openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
  }

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  }

  closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
  }

  // Food search modal
  openFoodModal(meal) {
    this.currentMeal = meal;
    this.selectedFood = null;
    this.currentPhoto = null;

    // Reset modal state
    document.getElementById('food-search-input').value = '';
    document.getElementById('food-search-results').innerHTML = '';
    document.querySelectorAll('#food-modal .tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#food-modal .tab-content').forEach(t => t.classList.remove('active'));
    document.querySelector('#food-modal .tab-btn[data-tab="search"]').classList.add('active');
    document.getElementById('search-tab').classList.add('active');

    this.openModal('food-modal');
    document.getElementById('food-search-input').focus();

    // Load recent foods
    this.loadRecentFoods();
  }

  async loadRecentFoods() {
    const recent = await nutriDB.getRecentFoods();
    const container = document.getElementById('recent-foods-list');

    if (recent.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🕐</div><p>No recent foods</p></div>';
      return;
    }

    container.innerHTML = recent.map(food => `
      <div class="recent-food-item" data-food='${JSON.stringify(food)}'>
        <div>
          <div class="result-name">${food.name}</div>
          <div class="result-info">${food.servingSize}${food.servingUnit}</div>
        </div>
        <span class="result-info">${food.calories} cal</span>
      </div>
    `).join('');
  }

  renderSearchResults(results) {
    const container = document.getElementById('food-search-results');

    if (results.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No foods found</p></div>';
      return;
    }

    container.innerHTML = results.map(food => `
      <div class="search-result" data-id="${food.id}">
        <div>
          <div class="result-name">${food.name}</div>
          <div class="result-info">${food.category} · ${food.serving}${food.unit}</div>
        </div>
        <span class="result-info">${food.calories} cal</span>
      </div>
    `).join('');
  }

  // Serving modal
  openServingModal(food) {
    this.selectedFood = food;
    this.currentPhoto = null;

    document.getElementById('serving-food-name').textContent = food.name;
    document.getElementById('serving-amount').value = 1;
    document.getElementById('serving-photo-preview').innerHTML = '';

    // Set default unit options based on food
    const unitSelect = document.getElementById('serving-unit');
    unitSelect.innerHTML = `
      <option value="serving">serving (${food.serving || 100}${food.unit || 'g'})</option>
      <option value="g">grams</option>
      <option value="oz">oz</option>
    `;

    this.updateServingNutrition();
    this.closeModal('food-modal');
    this.openModal('serving-modal');
  }

  updateServingNutrition() {
    if (!this.selectedFood) return;

    const amount = parseFloat(document.getElementById('serving-amount').value) || 1;
    const unit = document.getElementById('serving-unit').value;
    const food = this.selectedFood;

    let multiplier = amount;
    if (unit === 'g') {
      multiplier = amount / 100;
    } else if (unit === 'oz') {
      multiplier = (amount * 28.35) / 100;
    } else {
      // "serving" - use food's default serving
      multiplier = amount * ((food.serving || 100) / 100);
    }

    document.getElementById('serving-calories').textContent = Math.round(food.calories * multiplier);
    document.getElementById('serving-protein').textContent = Math.round(food.protein * multiplier);
    document.getElementById('serving-carbs').textContent = Math.round(food.carbs * multiplier);
    document.getElementById('serving-fat').textContent = Math.round(food.fat * multiplier);
  }

  setServingPhoto(blob) {
    this.currentPhoto = blob;
    camera.blobToDataUrl(blob).then(dataUrl => {
      document.getElementById('serving-photo-preview').innerHTML = `<img src="${dataUrl}" alt="Food photo">`;
    });
  }

  // Diary rendering
  renderDiary(entries, settings) {
    // Update date display
    document.getElementById('current-date').textContent = this.formatDisplayDate(this.currentDate);

    // Group entries by meal
    const meals = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    entries.forEach(entry => {
      if (meals[entry.meal]) {
        meals[entry.meal].push(entry);
      }
    });

    // Calculate totals
    let totalCal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    entries.forEach(e => {
      totalCal += e.calories || 0;
      totalProtein += e.protein || 0;
      totalCarbs += e.carbs || 0;
      totalFat += e.fat || 0;
    });

    // Update summary
    document.getElementById('calories-consumed').textContent = Math.round(totalCal);
    document.getElementById('calories-goal').textContent = settings.dailyCalorieGoal || 1800;
    updateProgressRing('calorie-ring', totalCal / (settings.dailyCalorieGoal || 1800));

    document.getElementById('protein-value').textContent = Math.round(totalProtein);
    document.getElementById('carbs-value').textContent = Math.round(totalCarbs);
    document.getElementById('fat-value').textContent = Math.round(totalFat);

    updateMacroBar('protein-bar', totalProtein / (settings.proteinGoal || 120));
    updateMacroBar('carbs-bar', totalCarbs / (settings.carbGoal || 180));
    updateMacroBar('fat-bar', totalFat / (settings.fatGoal || 60));

    // Render each meal section
    Object.keys(meals).forEach(meal => {
      const section = document.querySelector(`.meal-section[data-meal="${meal}"]`);
      const itemsContainer = section.querySelector('.meal-items');
      const caloriesSpan = section.querySelector('.meal-calories');

      const mealCals = meals[meal].reduce((sum, e) => sum + (e.calories || 0), 0);
      caloriesSpan.textContent = Math.round(mealCals) + ' cal';

      if (meals[meal].length === 0) {
        itemsContainer.innerHTML = '';
        return;
      }

      itemsContainer.innerHTML = meals[meal].map(entry => {
        const thumb = entry.photoBlob
          ? `<img class="food-thumb" src="" data-entry-id="${entry.id}" alt="">`
          : '<div class="food-thumb"></div>';
        return `
          <div class="food-item" data-id="${entry.id}">
            ${thumb}
            <div class="food-info">
              <div class="food-name">${entry.name}</div>
              <div class="food-serving">${entry.servingSize}${entry.servingUnit}</div>
            </div>
            <span class="food-cals">${Math.round(entry.calories)}</span>
            <button class="food-delete" data-id="${entry.id}">&times;</button>
          </div>
        `;
      }).join('');

      // Load photo thumbnails
      meals[meal].forEach(async entry => {
        if (entry.photoBlob) {
          const img = itemsContainer.querySelector(`img[data-entry-id="${entry.id}"]`);
          if (img) {
            const dataUrl = await camera.blobToDataUrl(entry.photoBlob);
            img.src = dataUrl;
          }
        }
      });
    });
  }

  // Recipe modal
  openRecipeModal(recipe = null) {
    this.editingRecipe = recipe;
    this.recipeIngredients = recipe ? [...recipe.ingredients] : [];
    this.recipePhoto = recipe ? recipe.photoBlob : null;

    document.getElementById('recipe-modal-title').textContent = recipe ? 'Edit Recipe' : 'New Recipe';
    document.getElementById('recipe-name').value = recipe ? recipe.name : '';
    document.getElementById('recipe-servings').value = recipe ? recipe.servings : 4;
    document.getElementById('recipe-photo-preview').innerHTML = '';

    if (this.recipePhoto) {
      camera.blobToDataUrl(this.recipePhoto).then(dataUrl => {
        document.getElementById('recipe-photo-preview').innerHTML = `<img src="${dataUrl}" alt="Recipe photo">`;
      });
    }

    this.renderRecipeIngredients();
    this.openModal('recipe-modal');
  }

  renderRecipeIngredients() {
    const container = document.getElementById('recipe-ingredients-list');

    if (this.recipeIngredients.length === 0) {
      container.innerHTML = '<p class="empty-state">No ingredients added</p>';
    } else {
      container.innerHTML = this.recipeIngredients.map((ing, i) => `
        <div class="ingredient-row" data-index="${i}">
          <span class="ingredient-name">${ing.name}</span>
          <span class="ingredient-amount">${ing.amount}${ing.unit}</span>
          <span class="ingredient-cals">${Math.round(ing.calories)} cal</span>
          <button class="ingredient-delete" data-index="${i}">&times;</button>
        </div>
      `).join('');
    }

    this.updateRecipeTotals();
  }

  updateRecipeTotals() {
    const servings = parseInt(document.getElementById('recipe-servings').value) || 1;
    let totalCal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

    this.recipeIngredients.forEach(ing => {
      totalCal += ing.calories || 0;
      totalProtein += ing.protein || 0;
      totalCarbs += ing.carbs || 0;
      totalFat += ing.fat || 0;
    });

    document.getElementById('recipe-cal-per').textContent = Math.round(totalCal / servings);
    document.getElementById('recipe-pro-per').textContent = Math.round(totalProtein / servings);
    document.getElementById('recipe-carb-per').textContent = Math.round(totalCarbs / servings);
    document.getElementById('recipe-fat-per').textContent = Math.round(totalFat / servings);
  }

  addRecipeIngredient(food, amount, unit) {
    // Calculate nutrition based on amount
    let multiplier = amount / 100;
    if (unit === 'oz') {
      multiplier = (amount * 28.35) / 100;
    } else if (unit === 'serving') {
      multiplier = amount * ((food.serving || 100) / 100);
    }

    this.recipeIngredients.push({
      foodId: food.id,
      name: food.name,
      amount: amount,
      unit: unit,
      calories: food.calories * multiplier,
      protein: food.protein * multiplier,
      carbs: food.carbs * multiplier,
      fat: food.fat * multiplier
    });

    this.renderRecipeIngredients();
  }

  removeRecipeIngredient(index) {
    this.recipeIngredients.splice(index, 1);
    this.renderRecipeIngredients();
  }

  setRecipePhoto(blob) {
    this.recipePhoto = blob;
    camera.blobToDataUrl(blob).then(dataUrl => {
      document.getElementById('recipe-photo-preview').innerHTML = `<img src="${dataUrl}" alt="Recipe photo">`;
    });
  }

  // Recipes list
  renderRecipes(recipes) {
    const container = document.getElementById('recipes-list');

    if (recipes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <p>No recipes yet</p>
          <button class="btn-primary" id="empty-new-recipe">Create Recipe</button>
        </div>
      `;
      return;
    }

    container.innerHTML = recipes.map(recipe => {
      const perServing = recipe.perServing || {};
      return `
        <div class="recipe-card" data-id="${recipe.id}">
          <div class="recipe-thumb" data-recipe-id="${recipe.id}"></div>
          <div class="recipe-info">
            <div class="recipe-name">${recipe.name}</div>
            <div class="recipe-meta">${recipe.servings} servings · ${Math.round(perServing.calories || 0)} cal/serving</div>
          </div>
          <button class="recipe-add-btn" data-id="${recipe.id}">+ Add</button>
        </div>
      `;
    }).join('');

    // Load recipe photos
    recipes.forEach(async recipe => {
      if (recipe.photoBlob) {
        const thumb = container.querySelector(`.recipe-thumb[data-recipe-id="${recipe.id}"]`);
        if (thumb) {
          const dataUrl = await camera.blobToDataUrl(recipe.photoBlob);
          thumb.style.backgroundImage = `url(${dataUrl})`;
          thumb.style.backgroundSize = 'cover';
        }
      }
    });
  }

  // Progress view
  renderProgress(weights, settings, chart) {
    const latestWeight = weights.length > 0 ? weights[weights.length - 1] : null;

    document.getElementById('current-weight').textContent = latestWeight ? latestWeight.weight.toFixed(1) : '--';
    document.getElementById('target-weight').textContent = settings.targetWeight || '--';
    document.getElementById('weight-unit-display').textContent = settings.weightUnit || 'lbs';
    document.querySelectorAll('.weight-unit').forEach(el => el.textContent = settings.weightUnit || 'lbs');

    // Chart data
    const chartData = weights.slice(-30).map(w => ({
      label: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: w.weight
    }));

    chart.setData(chartData, settings.targetWeight || null);
  }

  // Weight modal
  openWeightModal() {
    document.getElementById('weight-input').value = '';
    document.getElementById('weight-date').value = this.formatDate(new Date());
    this.openModal('weight-modal');
    document.getElementById('weight-input').focus();
  }

  // Settings
  renderSettings(settings) {
    document.getElementById('setting-calories').value = settings.dailyCalorieGoal || 1800;
    document.getElementById('setting-protein').value = settings.proteinGoal || 120;
    document.getElementById('setting-carbs').value = settings.carbGoal || 180;
    document.getElementById('setting-fat').value = settings.fatGoal || 60;
    document.getElementById('setting-start-weight').value = settings.startWeight || '';
    document.getElementById('setting-target-weight').value = settings.targetWeight || '';
    document.getElementById('setting-weight-unit').value = settings.weightUnit || 'lbs';

    // Update weight input unit label
    document.getElementById('weight-input-unit').textContent = settings.weightUnit || 'lbs';
  }

  // Onboarding
  showOnboarding() {
    this.openModal('onboarding-modal');
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchView(btn.dataset.view);
      });
    });

    // Date navigation
    document.getElementById('prev-day').addEventListener('click', () => {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
      app.loadDayEntries();
    });

    document.getElementById('next-day').addEventListener('click', () => {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
      app.loadDayEntries();
    });

    // Add food buttons
    document.querySelectorAll('.add-food-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openFoodModal(btn.dataset.meal);
      });
    });

    // Close modal buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeAllModals();
        camera.closeCamera();
      });
    });

    // Modal tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        modal.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
      });
    });

    // Food search
    let searchTimeout;
    document.getElementById('food-search-input').addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const results = searchFoods(e.target.value);
        this.renderSearchResults(results);
      }, 200);
    });

    // Search result click
    document.getElementById('food-search-results').addEventListener('click', (e) => {
      const result = e.target.closest('.search-result');
      if (result) {
        const food = getFoodById(result.dataset.id);
        if (food) this.openServingModal(food);
      }
    });

    // Recent food click
    document.getElementById('recent-foods-list').addEventListener('click', (e) => {
      const item = e.target.closest('.recent-food-item');
      if (item) {
        const food = JSON.parse(item.dataset.food);
        this.openServingModal(food);
      }
    });

    // Serving amount/unit changes
    document.getElementById('serving-amount').addEventListener('input', () => this.updateServingNutrition());
    document.getElementById('serving-unit').addEventListener('change', () => this.updateServingNutrition());

    // Add photo to serving
    document.getElementById('serving-add-photo').addEventListener('click', () => {
      camera.openCamera((blob) => this.setServingPhoto(blob));
    });

    // Camera from modal
    document.getElementById('modal-camera-btn').addEventListener('click', () => {
      camera.openCamera((blob) => this.setServingPhoto(blob));
    });

    // Add serving to diary
    document.getElementById('add-serving-btn').addEventListener('click', () => {
      app.addFoodEntry();
    });

    // Custom food form
    document.getElementById('custom-food-form').addEventListener('submit', (e) => {
      e.preventDefault();
      app.addCustomFood();
    });

    // Delete food entry
    document.getElementById('meals-container').addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.food-delete');
      if (deleteBtn) {
        app.deleteEntry(deleteBtn.dataset.id);
      }
    });

    // Recipes
    document.getElementById('new-recipe-btn').addEventListener('click', () => {
      this.openRecipeModal();
    });

    document.getElementById('recipes-list').addEventListener('click', (e) => {
      const addBtn = e.target.closest('.recipe-add-btn');
      const card = e.target.closest('.recipe-card');

      if (addBtn) {
        app.addRecipeToMeal(addBtn.dataset.id);
      } else if (card && !addBtn) {
        app.editRecipe(card.dataset.id);
      }

      // Empty state button
      if (e.target.id === 'empty-new-recipe') {
        this.openRecipeModal();
      }
    });

    // Recipe photo
    document.getElementById('recipe-add-photo').addEventListener('click', () => {
      camera.openCamera((blob) => this.setRecipePhoto(blob));
    });

    // Add ingredient to recipe
    document.getElementById('recipe-add-ingredient').addEventListener('click', () => {
      // Open food search in a special mode for recipe ingredients
      this.openFoodModal('recipe-ingredient');
    });

    // Delete recipe ingredient
    document.getElementById('recipe-ingredients-list').addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.ingredient-delete');
      if (deleteBtn) {
        this.removeRecipeIngredient(parseInt(deleteBtn.dataset.index));
      }
    });

    // Recipe servings change
    document.getElementById('recipe-servings').addEventListener('input', () => {
      this.updateRecipeTotals();
    });

    // Save recipe
    document.getElementById('save-recipe-btn').addEventListener('click', () => {
      app.saveRecipe();
    });

    // Progress - log weight
    document.getElementById('log-weight-btn').addEventListener('click', () => {
      this.openWeightModal();
    });

    document.getElementById('save-weight-btn').addEventListener('click', () => {
      app.saveWeight();
    });

    // Settings
    document.getElementById('save-settings-btn').addEventListener('click', () => {
      app.saveSettings();
    });

    document.getElementById('export-data-btn').addEventListener('click', () => {
      app.exportData();
    });

    document.getElementById('import-data-btn').addEventListener('click', () => {
      document.getElementById('import-file').click();
    });

    document.getElementById('import-file').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) app.importData(file);
      e.target.value = '';
    });

    // Onboarding
    document.querySelectorAll('.onboard-next').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentStep = btn.closest('.onboarding-step');
        const stepNum = parseInt(currentStep.dataset.step);

        if (stepNum < 3) {
          currentStep.style.display = 'none';
          document.querySelector(`.onboarding-step[data-step="${stepNum + 1}"]`).style.display = 'block';
        } else {
          app.completeOnboarding();
        }
      });
    });
  }
}

// Global UI instance
const ui = new UI();
