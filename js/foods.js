// NutriSnap - USDA Food Database (Common Foods)
// Nutritional values per 100g unless noted

const FOOD_DATABASE = [
  // PROTEINS - Meat
  { id: 'usda_1', name: 'Chicken Breast, cooked', category: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_2', name: 'Chicken Thigh, cooked', category: 'Protein', calories: 209, protein: 26, carbs: 0, fat: 10.9, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_3', name: 'Ground Beef (90% lean), cooked', category: 'Protein', calories: 217, protein: 26, carbs: 0, fat: 11.7, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_4', name: 'Ground Beef (80% lean), cooked', category: 'Protein', calories: 254, protein: 26, carbs: 0, fat: 17.1, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_5', name: 'Ribeye Steak, cooked', category: 'Protein', calories: 291, protein: 24, carbs: 0, fat: 21, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_6', name: 'Sirloin Steak, cooked', category: 'Protein', calories: 206, protein: 27, carbs: 0, fat: 10, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_7', name: 'Pork Chop, cooked', category: 'Protein', calories: 231, protein: 26, carbs: 0, fat: 13, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_8', name: 'Pork Tenderloin, cooked', category: 'Protein', calories: 143, protein: 26, carbs: 0, fat: 3.5, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_9', name: 'Bacon, cooked', category: 'Protein', calories: 541, protein: 37, carbs: 1.4, fat: 42, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_10', name: 'Ham, sliced', category: 'Protein', calories: 145, protein: 21, carbs: 1.5, fat: 5.5, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_11', name: 'Turkey Breast, cooked', category: 'Protein', calories: 135, protein: 30, carbs: 0, fat: 0.7, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_12', name: 'Ground Turkey, cooked', category: 'Protein', calories: 203, protein: 27, carbs: 0, fat: 10, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_13', name: 'Lamb Chop, cooked', category: 'Protein', calories: 294, protein: 25, carbs: 0, fat: 21, fiber: 0, serving: 100, unit: 'g' },

  // PROTEINS - Seafood
  { id: 'usda_20', name: 'Salmon, cooked', category: 'Protein', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_21', name: 'Tuna, canned in water', category: 'Protein', calories: 116, protein: 26, carbs: 0, fat: 0.8, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_22', name: 'Shrimp, cooked', category: 'Protein', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_23', name: 'Cod, cooked', category: 'Protein', calories: 105, protein: 23, carbs: 0, fat: 0.9, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_24', name: 'Tilapia, cooked', category: 'Protein', calories: 128, protein: 26, carbs: 0, fat: 2.7, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_25', name: 'Crab, cooked', category: 'Protein', calories: 97, protein: 19, carbs: 0, fat: 1.5, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_26', name: 'Lobster, cooked', category: 'Protein', calories: 98, protein: 21, carbs: 0.5, fat: 0.6, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_27', name: 'Scallops, cooked', category: 'Protein', calories: 111, protein: 21, carbs: 3, fat: 1, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_28', name: 'Mahi Mahi, cooked', category: 'Protein', calories: 109, protein: 24, carbs: 0, fat: 1, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_29', name: 'Halibut, cooked', category: 'Protein', calories: 140, protein: 27, carbs: 0, fat: 3, fiber: 0, serving: 100, unit: 'g' },

  // PROTEINS - Eggs & Dairy
  { id: 'usda_40', name: 'Egg, whole, cooked', category: 'Protein', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, serving: 50, unit: 'g' },
  { id: 'usda_41', name: 'Egg White, cooked', category: 'Protein', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, serving: 33, unit: 'g' },
  { id: 'usda_42', name: 'Greek Yogurt, plain', category: 'Dairy', calories: 97, protein: 9, carbs: 3.6, fat: 5, fiber: 0, serving: 150, unit: 'g' },
  { id: 'usda_43', name: 'Greek Yogurt, nonfat', category: 'Dairy', calories: 59, protein: 10, carbs: 3.6, fat: 0.7, fiber: 0, serving: 150, unit: 'g' },
  { id: 'usda_44', name: 'Cottage Cheese, 2%', category: 'Dairy', calories: 84, protein: 11, carbs: 4.3, fat: 2.3, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_45', name: 'Milk, whole', category: 'Dairy', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, serving: 240, unit: 'ml' },
  { id: 'usda_46', name: 'Milk, 2%', category: 'Dairy', calories: 50, protein: 3.3, carbs: 4.8, fat: 2, fiber: 0, serving: 240, unit: 'ml' },
  { id: 'usda_47', name: 'Milk, skim', category: 'Dairy', calories: 34, protein: 3.4, carbs: 5, fat: 0.1, fiber: 0, serving: 240, unit: 'ml' },
  { id: 'usda_48', name: 'Cheddar Cheese', category: 'Dairy', calories: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0, serving: 28, unit: 'g' },
  { id: 'usda_49', name: 'Mozzarella Cheese', category: 'Dairy', calories: 280, protein: 28, carbs: 3.1, fat: 17, fiber: 0, serving: 28, unit: 'g' },
  { id: 'usda_50', name: 'Parmesan Cheese', category: 'Dairy', calories: 431, protein: 38, carbs: 4.1, fat: 29, fiber: 0, serving: 28, unit: 'g' },
  { id: 'usda_51', name: 'Cream Cheese', category: 'Dairy', calories: 342, protein: 6, carbs: 4.1, fat: 34, fiber: 0, serving: 28, unit: 'g' },
  { id: 'usda_52', name: 'Butter', category: 'Dairy', calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, serving: 14, unit: 'g' },

  // PROTEINS - Plant-based
  { id: 'usda_60', name: 'Tofu, firm', category: 'Protein', calories: 144, protein: 17, carbs: 3, fat: 8, fiber: 2, serving: 100, unit: 'g' },
  { id: 'usda_61', name: 'Tempeh', category: 'Protein', calories: 192, protein: 20, carbs: 8, fat: 11, fiber: 0, serving: 100, unit: 'g' },
  { id: 'usda_62', name: 'Edamame, shelled', category: 'Protein', calories: 121, protein: 11, carbs: 9, fat: 5, fiber: 5, serving: 100, unit: 'g' },
  { id: 'usda_63', name: 'Black Beans, cooked', category: 'Legume', calories: 132, protein: 9, carbs: 24, fat: 0.5, fiber: 8, serving: 100, unit: 'g' },
  { id: 'usda_64', name: 'Chickpeas, cooked', category: 'Legume', calories: 164, protein: 9, carbs: 27, fat: 2.6, fiber: 8, serving: 100, unit: 'g' },
  { id: 'usda_65', name: 'Lentils, cooked', category: 'Legume', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8, serving: 100, unit: 'g' },
  { id: 'usda_66', name: 'Kidney Beans, cooked', category: 'Legume', calories: 127, protein: 9, carbs: 22, fat: 0.5, fiber: 7, serving: 100, unit: 'g' },
  { id: 'usda_67', name: 'Pinto Beans, cooked', category: 'Legume', calories: 143, protein: 9, carbs: 26, fat: 0.6, fiber: 9, serving: 100, unit: 'g' },

  // GRAINS & CARBS
  { id: 'usda_100', name: 'White Rice, cooked', category: 'Grain', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, serving: 100, unit: 'g' },
  { id: 'usda_101', name: 'Brown Rice, cooked', category: 'Grain', calories: 123, protein: 2.7, carbs: 26, fat: 1, fiber: 1.6, serving: 100, unit: 'g' },
  { id: 'usda_102', name: 'Quinoa, cooked', category: 'Grain', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, serving: 100, unit: 'g' },
  { id: 'usda_103', name: 'Oatmeal, cooked', category: 'Grain', calories: 71, protein: 2.5, carbs: 12, fat: 1.5, fiber: 1.7, serving: 100, unit: 'g' },
  { id: 'usda_104', name: 'Pasta, cooked', category: 'Grain', calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, serving: 100, unit: 'g' },
  { id: 'usda_105', name: 'Whole Wheat Pasta, cooked', category: 'Grain', calories: 124, protein: 5, carbs: 26, fat: 0.5, fiber: 4.5, serving: 100, unit: 'g' },
  { id: 'usda_106', name: 'Bread, white', category: 'Grain', calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, serving: 30, unit: 'g' },
  { id: 'usda_107', name: 'Bread, whole wheat', category: 'Grain', calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, serving: 30, unit: 'g' },
  { id: 'usda_108', name: 'Tortilla, flour', category: 'Grain', calories: 304, protein: 8, carbs: 50, fat: 8, fiber: 2, serving: 45, unit: 'g' },
  { id: 'usda_109', name: 'Tortilla, corn', category: 'Grain', calories: 218, protein: 6, carbs: 44, fat: 3, fiber: 5, serving: 26, unit: 'g' },
  { id: 'usda_110', name: 'Bagel, plain', category: 'Grain', calories: 257, protein: 10, carbs: 50, fat: 1.6, fiber: 2.1, serving: 98, unit: 'g' },
  { id: 'usda_111', name: 'English Muffin', category: 'Grain', calories: 227, protein: 8, carbs: 44, fat: 1.8, fiber: 2.4, serving: 57, unit: 'g' },
  { id: 'usda_112', name: 'Couscous, cooked', category: 'Grain', calories: 112, protein: 3.8, carbs: 23, fat: 0.2, fiber: 1.4, serving: 100, unit: 'g' },
  { id: 'usda_113', name: 'Barley, cooked', category: 'Grain', calories: 123, protein: 2.3, carbs: 28, fat: 0.4, fiber: 3.8, serving: 100, unit: 'g' },

  // VEGETABLES
  { id: 'usda_150', name: 'Broccoli, raw', category: 'Vegetable', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, serving: 100, unit: 'g' },
  { id: 'usda_151', name: 'Broccoli, cooked', category: 'Vegetable', calories: 35, protein: 2.4, carbs: 7, fat: 0.4, fiber: 3.3, serving: 100, unit: 'g' },
  { id: 'usda_152', name: 'Spinach, raw', category: 'Vegetable', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, serving: 100, unit: 'g' },
  { id: 'usda_153', name: 'Spinach, cooked', category: 'Vegetable', calories: 23, protein: 3, carbs: 3.8, fat: 0.3, fiber: 2.4, serving: 100, unit: 'g' },
  { id: 'usda_154', name: 'Kale, raw', category: 'Vegetable', calories: 35, protein: 2.9, carbs: 4.4, fat: 1.5, fiber: 4.1, serving: 100, unit: 'g' },
  { id: 'usda_155', name: 'Lettuce, romaine', category: 'Vegetable', calories: 17, protein: 1.2, carbs: 3.3, fat: 0.3, fiber: 2.1, serving: 100, unit: 'g' },
  { id: 'usda_156', name: 'Lettuce, iceberg', category: 'Vegetable', calories: 14, protein: 0.9, carbs: 3, fat: 0.1, fiber: 1.2, serving: 100, unit: 'g' },
  { id: 'usda_157', name: 'Tomato, raw', category: 'Vegetable', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, serving: 100, unit: 'g' },
  { id: 'usda_158', name: 'Cherry Tomatoes', category: 'Vegetable', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, serving: 100, unit: 'g' },
  { id: 'usda_159', name: 'Cucumber', category: 'Vegetable', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, serving: 100, unit: 'g' },
  { id: 'usda_160', name: 'Bell Pepper, red', category: 'Vegetable', calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, serving: 100, unit: 'g' },
  { id: 'usda_161', name: 'Bell Pepper, green', category: 'Vegetable', calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, fiber: 1.7, serving: 100, unit: 'g' },
  { id: 'usda_162', name: 'Carrot, raw', category: 'Vegetable', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, serving: 100, unit: 'g' },
  { id: 'usda_163', name: 'Carrot, cooked', category: 'Vegetable', calories: 35, protein: 0.8, carbs: 8, fat: 0.2, fiber: 3, serving: 100, unit: 'g' },
  { id: 'usda_164', name: 'Celery', category: 'Vegetable', calories: 14, protein: 0.7, carbs: 3, fat: 0.2, fiber: 1.6, serving: 100, unit: 'g' },
  { id: 'usda_165', name: 'Onion, raw', category: 'Vegetable', calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7, serving: 100, unit: 'g' },
  { id: 'usda_166', name: 'Garlic', category: 'Vegetable', calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, serving: 3, unit: 'g' },
  { id: 'usda_167', name: 'Mushrooms, raw', category: 'Vegetable', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, serving: 100, unit: 'g' },
  { id: 'usda_168', name: 'Zucchini', category: 'Vegetable', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, serving: 100, unit: 'g' },
  { id: 'usda_169', name: 'Asparagus', category: 'Vegetable', calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1, serving: 100, unit: 'g' },
  { id: 'usda_170', name: 'Green Beans', category: 'Vegetable', calories: 31, protein: 1.8, carbs: 7, fat: 0.1, fiber: 3.4, serving: 100, unit: 'g' },
  { id: 'usda_171', name: 'Cauliflower', category: 'Vegetable', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, serving: 100, unit: 'g' },
  { id: 'usda_172', name: 'Brussels Sprouts', category: 'Vegetable', calories: 43, protein: 3.4, carbs: 9, fat: 0.3, fiber: 3.8, serving: 100, unit: 'g' },
  { id: 'usda_173', name: 'Cabbage, raw', category: 'Vegetable', calories: 25, protein: 1.3, carbs: 6, fat: 0.1, fiber: 2.5, serving: 100, unit: 'g' },
  { id: 'usda_174', name: 'Eggplant', category: 'Vegetable', calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3, serving: 100, unit: 'g' },
  { id: 'usda_175', name: 'Corn, sweet', category: 'Vegetable', calories: 86, protein: 3.2, carbs: 19, fat: 1.2, fiber: 2, serving: 100, unit: 'g' },
  { id: 'usda_176', name: 'Peas, green', category: 'Vegetable', calories: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5, serving: 100, unit: 'g' },
  { id: 'usda_177', name: 'Sweet Potato, cooked', category: 'Vegetable', calories: 90, protein: 2, carbs: 21, fat: 0.1, fiber: 3, serving: 100, unit: 'g' },
  { id: 'usda_178', name: 'Potato, baked', category: 'Vegetable', calories: 93, protein: 2.5, carbs: 21, fat: 0.1, fiber: 2.2, serving: 100, unit: 'g' },
  { id: 'usda_179', name: 'Potato, mashed', category: 'Vegetable', calories: 113, protein: 2, carbs: 16, fat: 4.5, fiber: 1.5, serving: 100, unit: 'g' },

  // FRUITS
  { id: 'usda_200', name: 'Apple', category: 'Fruit', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, serving: 182, unit: 'g' },
  { id: 'usda_201', name: 'Banana', category: 'Fruit', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, serving: 118, unit: 'g' },
  { id: 'usda_202', name: 'Orange', category: 'Fruit', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, serving: 131, unit: 'g' },
  { id: 'usda_203', name: 'Strawberries', category: 'Fruit', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, serving: 100, unit: 'g' },
  { id: 'usda_204', name: 'Blueberries', category: 'Fruit', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, serving: 100, unit: 'g' },
  { id: 'usda_205', name: 'Raspberries', category: 'Fruit', calories: 52, protein: 1.2, carbs: 12, fat: 0.7, fiber: 6.5, serving: 100, unit: 'g' },
  { id: 'usda_206', name: 'Grapes', category: 'Fruit', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, serving: 100, unit: 'g' },
  { id: 'usda_207', name: 'Watermelon', category: 'Fruit', calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, serving: 100, unit: 'g' },
  { id: 'usda_208', name: 'Cantaloupe', category: 'Fruit', calories: 34, protein: 0.8, carbs: 8, fat: 0.2, fiber: 0.9, serving: 100, unit: 'g' },
  { id: 'usda_209', name: 'Pineapple', category: 'Fruit', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4, serving: 100, unit: 'g' },
  { id: 'usda_210', name: 'Mango', category: 'Fruit', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, serving: 100, unit: 'g' },
  { id: 'usda_211', name: 'Peach', category: 'Fruit', calories: 39, protein: 0.9, carbs: 10, fat: 0.3, fiber: 1.5, serving: 150, unit: 'g' },
  { id: 'usda_212', name: 'Pear', category: 'Fruit', calories: 57, protein: 0.4, carbs: 15, fat: 0.1, fiber: 3.1, serving: 178, unit: 'g' },
  { id: 'usda_213', name: 'Grapefruit', category: 'Fruit', calories: 42, protein: 0.8, carbs: 11, fat: 0.1, fiber: 1.6, serving: 123, unit: 'g' },
  { id: 'usda_214', name: 'Kiwi', category: 'Fruit', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, fiber: 3, serving: 69, unit: 'g' },
  { id: 'usda_215', name: 'Cherries', category: 'Fruit', calories: 63, protein: 1.1, carbs: 16, fat: 0.2, fiber: 2.1, serving: 100, unit: 'g' },
  { id: 'usda_216', name: 'Avocado', category: 'Fruit', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, serving: 100, unit: 'g' },
  { id: 'usda_217', name: 'Lemon', category: 'Fruit', calories: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8, serving: 58, unit: 'g' },
  { id: 'usda_218', name: 'Lime', category: 'Fruit', calories: 30, protein: 0.7, carbs: 11, fat: 0.2, fiber: 2.8, serving: 67, unit: 'g' },

  // NUTS & SEEDS
  { id: 'usda_250', name: 'Almonds', category: 'Nut', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, serving: 28, unit: 'g' },
  { id: 'usda_251', name: 'Almond Butter', category: 'Nut', calories: 614, protein: 21, carbs: 19, fat: 56, fiber: 10, serving: 32, unit: 'g' },
  { id: 'usda_252', name: 'Peanuts', category: 'Nut', calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5, serving: 28, unit: 'g' },
  { id: 'usda_253', name: 'Peanut Butter', category: 'Nut', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, serving: 32, unit: 'g' },
  { id: 'usda_254', name: 'Walnuts', category: 'Nut', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, serving: 28, unit: 'g' },
  { id: 'usda_255', name: 'Cashews', category: 'Nut', calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3, serving: 28, unit: 'g' },
  { id: 'usda_256', name: 'Pecans', category: 'Nut', calories: 691, protein: 9, carbs: 14, fat: 72, fiber: 9.6, serving: 28, unit: 'g' },
  { id: 'usda_257', name: 'Pistachios', category: 'Nut', calories: 560, protein: 20, carbs: 28, fat: 45, fiber: 10, serving: 28, unit: 'g' },
  { id: 'usda_258', name: 'Macadamia Nuts', category: 'Nut', calories: 718, protein: 8, carbs: 14, fat: 76, fiber: 8.6, serving: 28, unit: 'g' },
  { id: 'usda_259', name: 'Chia Seeds', category: 'Seed', calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, serving: 28, unit: 'g' },
  { id: 'usda_260', name: 'Flax Seeds', category: 'Seed', calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27, serving: 28, unit: 'g' },
  { id: 'usda_261', name: 'Sunflower Seeds', category: 'Seed', calories: 584, protein: 21, carbs: 20, fat: 51, fiber: 8.6, serving: 28, unit: 'g' },
  { id: 'usda_262', name: 'Pumpkin Seeds', category: 'Seed', calories: 559, protein: 30, carbs: 11, fat: 49, fiber: 6, serving: 28, unit: 'g' },
  { id: 'usda_263', name: 'Hemp Seeds', category: 'Seed', calories: 553, protein: 32, carbs: 9, fat: 49, fiber: 4, serving: 28, unit: 'g' },

  // OILS & FATS
  { id: 'usda_280', name: 'Olive Oil', category: 'Oil', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, serving: 14, unit: 'ml' },
  { id: 'usda_281', name: 'Coconut Oil', category: 'Oil', calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, serving: 14, unit: 'ml' },
  { id: 'usda_282', name: 'Vegetable Oil', category: 'Oil', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, serving: 14, unit: 'ml' },
  { id: 'usda_283', name: 'Avocado Oil', category: 'Oil', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, serving: 14, unit: 'ml' },

  // BEVERAGES
  { id: 'usda_300', name: 'Coffee, black', category: 'Beverage', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, serving: 240, unit: 'ml' },
  { id: 'usda_301', name: 'Coffee with cream', category: 'Beverage', calories: 52, protein: 0.6, carbs: 1, fat: 5, fiber: 0, serving: 240, unit: 'ml' },
  { id: 'usda_302', name: 'Latte (whole milk)', category: 'Beverage', calories: 135, protein: 6.8, carbs: 10, fat: 7, fiber: 0, serving: 240, unit: 'ml' },
  { id: 'usda_303', name: 'Tea, unsweetened', category: 'Beverage', calories: 2, protein: 0, carbs: 0.5, fat: 0, fiber: 0, serving: 240, unit: 'ml' },
  { id: 'usda_304', name: 'Orange Juice', category: 'Beverage', calories: 45, protein: 0.7, carbs: 10, fat: 0.2, fiber: 0.2, serving: 240, unit: 'ml' },
  { id: 'usda_305', name: 'Apple Juice', category: 'Beverage', calories: 46, protein: 0.1, carbs: 11, fat: 0.1, fiber: 0.2, serving: 240, unit: 'ml' },
  { id: 'usda_306', name: 'Soda, cola', category: 'Beverage', calories: 41, protein: 0, carbs: 11, fat: 0, fiber: 0, serving: 355, unit: 'ml' },
  { id: 'usda_307', name: 'Beer, regular', category: 'Beverage', calories: 43, protein: 0.5, carbs: 3.5, fat: 0, fiber: 0, serving: 355, unit: 'ml' },
  { id: 'usda_308', name: 'Wine, red', category: 'Beverage', calories: 85, protein: 0.1, carbs: 2.6, fat: 0, fiber: 0, serving: 150, unit: 'ml' },
  { id: 'usda_309', name: 'Wine, white', category: 'Beverage', calories: 82, protein: 0.1, carbs: 2.6, fat: 0, fiber: 0, serving: 150, unit: 'ml' },
  { id: 'usda_310', name: 'Almond Milk, unsweetened', category: 'Beverage', calories: 17, protein: 0.6, carbs: 1.4, fat: 1.1, fiber: 0.2, serving: 240, unit: 'ml' },
  { id: 'usda_311', name: 'Oat Milk', category: 'Beverage', calories: 50, protein: 1, carbs: 9, fat: 1.5, fiber: 0.8, serving: 240, unit: 'ml' },
  { id: 'usda_312', name: 'Soy Milk, unsweetened', category: 'Beverage', calories: 33, protein: 3.3, carbs: 1.2, fat: 1.8, fiber: 0.4, serving: 240, unit: 'ml' },
  { id: 'usda_313', name: 'Protein Shake', category: 'Beverage', calories: 120, protein: 24, carbs: 3, fat: 1, fiber: 0, serving: 300, unit: 'ml' },

  // SNACKS & SWEETS
  { id: 'usda_350', name: 'Chips, potato', category: 'Snack', calories: 536, protein: 7, carbs: 53, fat: 35, fiber: 4.8, serving: 28, unit: 'g' },
  { id: 'usda_351', name: 'Chips, tortilla', category: 'Snack', calories: 489, protein: 7, carbs: 63, fat: 24, fiber: 5, serving: 28, unit: 'g' },
  { id: 'usda_352', name: 'Popcorn, air-popped', category: 'Snack', calories: 387, protein: 13, carbs: 78, fat: 4.5, fiber: 15, serving: 28, unit: 'g' },
  { id: 'usda_353', name: 'Popcorn, buttered', category: 'Snack', calories: 535, protein: 9, carbs: 55, fat: 31, fiber: 10, serving: 28, unit: 'g' },
  { id: 'usda_354', name: 'Pretzels', category: 'Snack', calories: 380, protein: 9, carbs: 79, fat: 3.5, fiber: 3, serving: 28, unit: 'g' },
  { id: 'usda_355', name: 'Crackers, saltine', category: 'Snack', calories: 418, protein: 9, carbs: 71, fat: 10, fiber: 2.5, serving: 28, unit: 'g' },
  { id: 'usda_356', name: 'Granola Bar', category: 'Snack', calories: 471, protein: 10, carbs: 64, fat: 20, fiber: 5, serving: 42, unit: 'g' },
  { id: 'usda_357', name: 'Trail Mix', category: 'Snack', calories: 462, protein: 12, carbs: 44, fat: 29, fiber: 4, serving: 40, unit: 'g' },
  { id: 'usda_358', name: 'Dark Chocolate (70%)', category: 'Snack', calories: 598, protein: 8, carbs: 46, fat: 43, fiber: 11, serving: 28, unit: 'g' },
  { id: 'usda_359', name: 'Milk Chocolate', category: 'Snack', calories: 535, protein: 8, carbs: 59, fat: 30, fiber: 3.4, serving: 28, unit: 'g' },
  { id: 'usda_360', name: 'Ice Cream, vanilla', category: 'Snack', calories: 207, protein: 3.5, carbs: 24, fat: 11, fiber: 0.7, serving: 100, unit: 'g' },
  { id: 'usda_361', name: 'Ice Cream, chocolate', category: 'Snack', calories: 216, protein: 3.8, carbs: 28, fat: 11, fiber: 1.2, serving: 100, unit: 'g' },
  { id: 'usda_362', name: 'Cookie, chocolate chip', category: 'Snack', calories: 488, protein: 6, carbs: 64, fat: 24, fiber: 2.4, serving: 30, unit: 'g' },
  { id: 'usda_363', name: 'Brownie', category: 'Snack', calories: 466, protein: 6, carbs: 56, fat: 26, fiber: 2, serving: 56, unit: 'g' },
  { id: 'usda_364', name: 'Donut, glazed', category: 'Snack', calories: 452, protein: 5, carbs: 51, fat: 25, fiber: 1, serving: 60, unit: 'g' },
  { id: 'usda_365', name: 'Muffin, blueberry', category: 'Snack', calories: 377, protein: 6, carbs: 49, fat: 18, fiber: 1.5, serving: 80, unit: 'g' },

  // CONDIMENTS & SAUCES
  { id: 'usda_400', name: 'Ketchup', category: 'Condiment', calories: 112, protein: 1.7, carbs: 26, fat: 0.4, fiber: 0.3, serving: 17, unit: 'g' },
  { id: 'usda_401', name: 'Mustard, yellow', category: 'Condiment', calories: 66, protein: 4, carbs: 6, fat: 4, fiber: 3, serving: 5, unit: 'g' },
  { id: 'usda_402', name: 'Mayonnaise', category: 'Condiment', calories: 680, protein: 1, carbs: 0.6, fat: 75, fiber: 0, serving: 13, unit: 'g' },
  { id: 'usda_403', name: 'Ranch Dressing', category: 'Condiment', calories: 455, protein: 1.5, carbs: 5, fat: 47, fiber: 0.3, serving: 30, unit: 'g' },
  { id: 'usda_404', name: 'Italian Dressing', category: 'Condiment', calories: 250, protein: 0.3, carbs: 7, fat: 25, fiber: 0, serving: 30, unit: 'g' },
  { id: 'usda_405', name: 'Balsamic Vinaigrette', category: 'Condiment', calories: 200, protein: 0.3, carbs: 10, fat: 18, fiber: 0, serving: 30, unit: 'g' },
  { id: 'usda_406', name: 'Soy Sauce', category: 'Condiment', calories: 53, protein: 8, carbs: 5, fat: 0, fiber: 0.4, serving: 15, unit: 'ml' },
  { id: 'usda_407', name: 'Hot Sauce', category: 'Condiment', calories: 12, protein: 0.3, carbs: 2.5, fat: 0.1, fiber: 0.2, serving: 5, unit: 'ml' },
  { id: 'usda_408', name: 'BBQ Sauce', category: 'Condiment', calories: 172, protein: 0.8, carbs: 41, fat: 0.6, fiber: 0.5, serving: 28, unit: 'g' },
  { id: 'usda_409', name: 'Hummus', category: 'Condiment', calories: 166, protein: 8, carbs: 14, fat: 10, fiber: 6, serving: 28, unit: 'g' },
  { id: 'usda_410', name: 'Guacamole', category: 'Condiment', calories: 150, protein: 2, carbs: 8, fat: 13, fiber: 6, serving: 30, unit: 'g' },
  { id: 'usda_411', name: 'Salsa', category: 'Condiment', calories: 36, protein: 2, carbs: 7, fat: 0.2, fiber: 2, serving: 30, unit: 'g' },
  { id: 'usda_412', name: 'Sour Cream', category: 'Condiment', calories: 193, protein: 2.4, carbs: 4.6, fat: 19, fiber: 0, serving: 30, unit: 'g' },
  { id: 'usda_413', name: 'Honey', category: 'Condiment', calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2, serving: 21, unit: 'g' },
  { id: 'usda_414', name: 'Maple Syrup', category: 'Condiment', calories: 260, protein: 0, carbs: 67, fat: 0.1, fiber: 0, serving: 30, unit: 'ml' },
  { id: 'usda_415', name: 'Sugar, white', category: 'Condiment', calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, serving: 4, unit: 'g' },
  { id: 'usda_416', name: 'Pesto', category: 'Condiment', calories: 510, protein: 6, carbs: 6, fat: 51, fiber: 2, serving: 28, unit: 'g' },

  // FAST FOOD & PREPARED
  { id: 'usda_450', name: 'Cheeseburger', category: 'Fast Food', calories: 300, protein: 15, carbs: 33, fat: 12, fiber: 2, serving: 113, unit: 'g' },
  { id: 'usda_451', name: 'French Fries, medium', category: 'Fast Food', calories: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8, serving: 117, unit: 'g' },
  { id: 'usda_452', name: 'Pizza, cheese slice', category: 'Fast Food', calories: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3, serving: 107, unit: 'g' },
  { id: 'usda_453', name: 'Pizza, pepperoni slice', category: 'Fast Food', calories: 298, protein: 13, carbs: 30, fat: 14, fiber: 2, serving: 107, unit: 'g' },
  { id: 'usda_454', name: 'Chicken Nuggets (6pc)', category: 'Fast Food', calories: 280, protein: 13, carbs: 16, fat: 18, fiber: 1, serving: 96, unit: 'g' },
  { id: 'usda_455', name: 'Taco, beef', category: 'Fast Food', calories: 210, protein: 9, carbs: 21, fat: 10, fiber: 3, serving: 81, unit: 'g' },
  { id: 'usda_456', name: 'Burrito, bean and cheese', category: 'Fast Food', calories: 290, protein: 11, carbs: 38, fat: 11, fiber: 5, serving: 175, unit: 'g' },
  { id: 'usda_457', name: 'Sandwich, turkey', category: 'Fast Food', calories: 280, protein: 18, carbs: 29, fat: 10, fiber: 2, serving: 150, unit: 'g' },
  { id: 'usda_458', name: 'Hot Dog', category: 'Fast Food', calories: 290, protein: 11, carbs: 24, fat: 17, fiber: 1, serving: 98, unit: 'g' },
  { id: 'usda_459', name: 'Chicken Sandwich, grilled', category: 'Fast Food', calories: 350, protein: 28, carbs: 40, fat: 9, fiber: 2, serving: 200, unit: 'g' },
  { id: 'usda_460', name: 'Salad, Caesar with chicken', category: 'Fast Food', calories: 350, protein: 25, carbs: 15, fat: 22, fiber: 4, serving: 250, unit: 'g' },

  // BREAKFAST ITEMS
  { id: 'usda_480', name: 'Cereal, corn flakes', category: 'Breakfast', calories: 357, protein: 8, carbs: 84, fat: 0.4, fiber: 3, serving: 30, unit: 'g' },
  { id: 'usda_481', name: 'Cereal, granola', category: 'Breakfast', calories: 489, protein: 15, carbs: 64, fat: 20, fiber: 7, serving: 55, unit: 'g' },
  { id: 'usda_482', name: 'Pancake', category: 'Breakfast', calories: 227, protein: 6, carbs: 28, fat: 10, fiber: 1, serving: 77, unit: 'g' },
  { id: 'usda_483', name: 'Waffle', category: 'Breakfast', calories: 291, protein: 8, carbs: 33, fat: 14, fiber: 1.5, serving: 75, unit: 'g' },
  { id: 'usda_484', name: 'French Toast', category: 'Breakfast', calories: 229, protein: 8, carbs: 24, fat: 11, fiber: 1, serving: 65, unit: 'g' },
  { id: 'usda_485', name: 'Sausage, breakfast link', category: 'Breakfast', calories: 339, protein: 13, carbs: 1, fat: 31, fiber: 0, serving: 48, unit: 'g' },
  { id: 'usda_486', name: 'Hash Browns', category: 'Breakfast', calories: 326, protein: 3, carbs: 35, fat: 20, fiber: 3, serving: 100, unit: 'g' },
  { id: 'usda_487', name: 'Yogurt, fruit flavored', category: 'Breakfast', calories: 102, protein: 3.5, carbs: 19, fat: 1.5, fiber: 0, serving: 150, unit: 'g' },

  // SOUPS
  { id: 'usda_500', name: 'Chicken Noodle Soup', category: 'Soup', calories: 62, protein: 3.2, carbs: 7, fat: 2.4, fiber: 0.5, serving: 245, unit: 'g' },
  { id: 'usda_501', name: 'Tomato Soup', category: 'Soup', calories: 74, protein: 2, carbs: 14, fat: 1.5, fiber: 1.5, serving: 245, unit: 'g' },
  { id: 'usda_502', name: 'Vegetable Soup', category: 'Soup', calories: 65, protein: 2, carbs: 10, fat: 2, fiber: 2, serving: 245, unit: 'g' },
  { id: 'usda_503', name: 'Minestrone Soup', category: 'Soup', calories: 82, protein: 4.3, carbs: 11, fat: 2.5, fiber: 1, serving: 245, unit: 'g' },
  { id: 'usda_504', name: 'Clam Chowder', category: 'Soup', calories: 163, protein: 5, carbs: 17, fat: 9, fiber: 1, serving: 245, unit: 'g' },
  { id: 'usda_505', name: 'Beef Stew', category: 'Soup', calories: 117, protein: 8, carbs: 11, fat: 5, fiber: 2, serving: 245, unit: 'g' },
  { id: 'usda_506', name: 'Chili con Carne', category: 'Soup', calories: 125, protein: 8, carbs: 12, fat: 5, fiber: 4, serving: 245, unit: 'g' },
];

// Score a food against a search query
function _scoreFoodMatch(food, lowerQuery, words) {
  const lowerName = food.name.toLowerCase();
  const lowerCategory = (food.category || '').toLowerCase();
  let score = 0;

  if (lowerName === lowerQuery) {
    score = 1000;
  } else if (lowerName.startsWith(lowerQuery)) {
    score = 500;
  } else if (lowerName.includes(lowerQuery)) {
    score = 200;
  } else if (words.every(w => lowerName.includes(w) || lowerCategory.includes(w))) {
    score = 100;
  } else {
    const matchCount = words.filter(w => lowerName.includes(w) || lowerCategory.includes(w)).length;
    score = matchCount * 30;
  }

  return score;
}

// Food search with fuzzy matching (includes custom foods from IndexedDB)
async function searchFoods(query, limit = 20) {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/);

  // Score USDA foods
  const scored = FOOD_DATABASE.map(food => ({
    food, score: _scoreFoodMatch(food, lowerQuery, words)
  }));

  // Also score custom foods from IndexedDB
  try {
    const customFoods = await nutriDB.getCustomFoods();
    for (const food of customFoods) {
      const score = _scoreFoodMatch(food, lowerQuery, words);
      if (score > 0) {
        scored.push({ food, score: score + 1 }); // slight boost so custom foods rank above ties
      }
    }
  } catch (e) {
    // DB not ready yet, skip custom foods
  }

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.food);
}

// Get food by ID
function getFoodById(id) {
  return FOOD_DATABASE.find(f => f.id === id);
}

// Get all categories
function getCategories() {
  const cats = new Set();
  FOOD_DATABASE.forEach(f => cats.add(f.category));
  return [...cats].sort();
}

// Get foods by category
function getFoodsByCategory(category) {
  return FOOD_DATABASE.filter(f => f.category === category);
}
