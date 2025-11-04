// localStorage utility functions for the recipe app

/**
 * Safely get data from localStorage
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if key doesn't exist or parsing fails
 * @returns {any} Parsed data or default value
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely set data to localStorage
 * @param {string} key - The localStorage key
 * @param {any} value - The value to store
 * @returns {boolean} Success status
 */
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - The localStorage key
 * @returns {boolean} Success status
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all localStorage data
 * @returns {boolean} Success status
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} Availability status
 */
export const isStorageAvailable = () => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

// Recipe-specific localStorage functions
export const STORAGE_KEYS = {
  FAVORITES: "recipesFavorites",
  RECENT_SEARCHES: "recentSearches",
  USER_PREFERENCES: "userPreferences",
  RECIPE_CACHE: "recipeCache",
};

/**
 * Get favorite recipes from localStorage
 * @returns {Array} Array of favorite recipes
 */
export const getFavoriteRecipes = () => {
  return getFromStorage(STORAGE_KEYS.FAVORITES, []);
};

/**
 * Save favorite recipes to localStorage
 * @param {Array} favorites - Array of favorite recipes
 * @returns {boolean} Success status
 */
export const saveFavoriteRecipes = (favorites) => {
  return setToStorage(STORAGE_KEYS.FAVORITES, favorites);
};

/**
 * Add a recipe to favorites
 * @param {Object} recipe - Recipe object to add
 * @returns {Array} Updated favorites array
 */
export const addToFavorites = (recipe) => {
  const favorites = getFavoriteRecipes();
  const isAlreadyFavorite = favorites.some((fav) => fav.id === recipe.id);

  if (!isAlreadyFavorite) {
    const updatedFavorites = [...favorites, recipe];
    saveFavoriteRecipes(updatedFavorites);
    return updatedFavorites;
  }

  return favorites;
};

/**
 * Remove a recipe from favorites
 * @param {number|string} recipeId - ID of recipe to remove
 * @returns {Array} Updated favorites array
 */
export const removeFromFavorites = (recipeId) => {
  const favorites = getFavoriteRecipes();
  const updatedFavorites = favorites.filter((recipe) => recipe.id !== recipeId);
  saveFavoriteRecipes(updatedFavorites);
  return updatedFavorites;
};

/**
 * Check if a recipe is in favorites
 * @param {number|string} recipeId - ID of recipe to check
 * @returns {boolean} Whether recipe is favorited
 */
export const isFavoriteRecipe = (recipeId) => {
  const favorites = getFavoriteRecipes();
  return favorites.some((recipe) => recipe.id === recipeId);
};

/**
 * Get recent search terms
 * @param {number} limit - Maximum number of recent searches to return
 * @returns {Array} Array of recent search terms
 */
export const getRecentSearches = (limit = 10) => {
  const searches = getFromStorage(STORAGE_KEYS.RECENT_SEARCHES, []);
  return searches.slice(0, limit);
};

/**
 * Add a search term to recent searches
 * @param {string} searchTerm - Search term to add
 * @param {number} maxItems - Maximum number of items to keep
 */
export const addRecentSearch = (searchTerm, maxItems = 10) => {
  if (!searchTerm.trim()) return;

  const searches = getRecentSearches();
  const filteredSearches = searches.filter(
    (term) => term.toLowerCase() !== searchTerm.toLowerCase()
  );

  const updatedSearches = [searchTerm, ...filteredSearches].slice(0, maxItems);
  setToStorage(STORAGE_KEYS.RECENT_SEARCHES, updatedSearches);
};
