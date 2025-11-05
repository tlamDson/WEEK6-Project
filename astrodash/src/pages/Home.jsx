import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TableItems from "../components/TableItems";
import { toast } from "react-toastify";
import "./Home.css";
import {
  getFavoriteRecipes,
  saveFavoriteRecipes,
  addToFavorites as addToFavoritesStorage,
  removeFromFavorites as removeFromFavoritesStorage,
} from "../utils/localStorage";

const Home = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;

  // Favorites state
  const [favorites, setFavorites] = useState(() => getFavoriteRecipes());
  const [favoriteIds, setFavoriteIds] = useState(() =>
    getFavoriteRecipes().map((recipe) => recipe.id)
  );

  // Recipe search state
  const [recipe, setRecipe] = useState({
    results: [],
    offset: 0,
    number: 12,
    totalResults: 0,
  });
  const [detailedRecipes, setDetailedRecipes] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [lastQuery, setLastQuery] = useState("");
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);

  const [filters, setFilters] = useState({
    servings: "",
    healthScore: "",
    maxPrice: "",
  });

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    saveFavoriteRecipes(favorites);
  }, [favorites]);

  // Fetch initial recipes on mount
  useEffect(() => {
    fetchRecipes("miso-soup");
    setHasSearched(true);
  }, []);

  const fetchRecipes = async (query, offset = 0, isLoadMore = false) => {
    if (!query || !query.trim()) {
      setError("Please enter a search term");
      return;
    }

    if (isApiCallInProgress) {
      console.log("⏳ API call already in progress, please wait...");
      setError("Another search is in progress, please wait...");
      return;
    }

    setIsApiCallInProgress(true);

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setCurrentOffset(0);
    }
    setError("");

    try {
      let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
        query
      )}&number=3&offset=${offset}&apiKey=${API_KEY}&addRecipeInformation=true&fillIngredients=true`;

      if (filters.healthScore) {
        apiUrl += `&minHealthScore=${filters.healthScore}`;
      }
      if (filters.maxPrice) {
        apiUrl += `&maxPricePerServing=${filters.maxPrice * 100}`;
      }

      const searchResponse = await fetch(apiUrl);

      if (!searchResponse.ok) {
        if (searchResponse.status === 402) {
          toast.error("⚠️ API quota exceeded! Please try again tomorrow.", {
            autoClose: 5000,
          });
          throw new Error(
            "API quota exceeded. Please try again tomorrow or upgrade your plan."
          );
        } else if (searchResponse.status === 401) {
          toast.error("❌ Invalid API key! Check your configuration.", {
            autoClose: 5000,
          });
          throw new Error("Invalid API key. Please check your configuration.");
        } else {
          toast.error(`❌ Error: ${searchResponse.status}`, {
            autoClose: 5000,
          });
          throw new Error(`HTTP error! status: ${searchResponse.status}`);
        }
      }

      const searchData = await searchResponse.json();

      if (!isLoadMore) {
        toast.success(`🎉 Found ${searchData.totalResults} recipes!`, {
          autoClose: 2000,
        });
      }

      if (isLoadMore) {
        setRecipe((prev) => ({
          ...searchData,
          results: [...prev.results, ...searchData.results],
        }));
      } else {
        setRecipe(searchData);
      }

      const detailedData = searchData.results.map((recipe) => ({
        ...recipe,
        summary: recipe.summary || `Delicious ${recipe.title} recipe`,
        readyInMinutes: recipe.readyInMinutes || null,
        servings: recipe.servings || null,
        healthScore: recipe.healthScore || null,
        pricePerServing: recipe.pricePerServing || null,
        extendedIngredients: recipe.extendedIngredients || [],
      }));

      let filteredData = detailedData;

      if (filters.servings) {
        const targetServings = parseInt(filters.servings);
        filteredData = filteredData.filter((recipe) => {
          if (!recipe.servings) return false;
          if (targetServings === 6) {
            return recipe.servings >= 6;
          }
          return (
            recipe.servings <= targetServings + 1 &&
            recipe.servings >= targetServings - 1
          );
        });
      }

      if (isLoadMore) {
        setDetailedRecipes((prev) => [...prev, ...filteredData]);
        setCurrentOffset(offset + 3);
      } else {
        setDetailedRecipes(filteredData);
        setCurrentOffset(3);
      }

      setLastQuery(query);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setIsApiCallInProgress(false);
    }
  };

  const handleSearch = () => {
    if (input.trim().length >= 2) {
      fetchRecipes(input);
      setHasSearched(true);
    } else {
      setError("Please enter at least 2 characters to search");
      toast.warning("⚠️ Please enter at least 2 characters to search", {
        autoClose: 2000,
      });
    }
  };

  const handleLoadMore = () => {
    if (lastQuery && !loadingMore && !isApiCallInProgress) {
      fetchRecipes(lastQuery, currentOffset, true);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const applyFilters = () => {
    if (lastQuery && !isApiCallInProgress) {
      fetchRecipes(lastQuery);
      toast.info("🔍 Applying filters...", {
        autoClose: 1500,
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      servings: "",
      healthScore: "",
      maxPrice: "",
    });
    toast.info("🔄 Filters cleared!", {
      autoClose: 1500,
    });
    if (lastQuery && !isApiCallInProgress) {
      setTimeout(() => {
        if (!isApiCallInProgress) {
          fetchRecipes(lastQuery);
        }
      }, 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (error) {
      setError("");
    }

    if (value.trim() === "") {
      setRecipe({
        results: [],
        offset: 0,
        number: 12,
        totalResults: 0,
      });
      setDetailedRecipes([]);
      setHasSearched(false);
    }
  };

  const clearSearch = () => {
    setInput("");
    setRecipe({
      results: [],
      offset: 0,
      number: 12,
      totalResults: 0,
    });
    setDetailedRecipes([]);
    setError("");
    setHasSearched(false);
    setCurrentOffset(0);
    setLastQuery("");
  };

  const getDataSummary = () => {
    if (detailedRecipes.length === 0) return null;

    const totalRecipes = detailedRecipes.length;
    const avgHealthScore =
      detailedRecipes
        .filter((r) => r.healthScore)
        .reduce((sum, r) => sum + r.healthScore, 0) /
      detailedRecipes.filter((r) => r.healthScore).length;

    const avgReadyTime =
      detailedRecipes
        .filter((r) => r.readyInMinutes)
        .reduce((sum, r) => sum + r.readyInMinutes, 0) /
      detailedRecipes.filter((r) => r.readyInMinutes).length;

    const avgPrice =
      detailedRecipes
        .filter((r) => r.pricePerServing)
        .reduce((sum, r) => sum + r.pricePerServing, 0) /
      detailedRecipes.filter((r) => r.pricePerServing).length;

    return {
      totalRecipes,
      avgHealthScore: isNaN(avgHealthScore) ? 0 : Math.round(avgHealthScore),
      avgReadyTime: isNaN(avgReadyTime) ? 0 : Math.round(avgReadyTime),
      avgPrice: isNaN(avgPrice) ? 0 : (avgPrice / 100).toFixed(2),
    };
  };

  const handleAddToFavorites = (recipe) => {
    if (!favoriteIds.includes(recipe.id)) {
      const updatedFavorites = addToFavoritesStorage(recipe);
      setFavorites(updatedFavorites);
      setFavoriteIds(updatedFavorites.map((fav) => fav.id));
      toast.success(`✨ "${recipe.title}" added to favorites!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.info(`"${recipe.title}" is already in your favorites!`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleRemoveFromFavorites = (recipeId) => {
    const updatedFavorites = removeFromFavoritesStorage(recipeId);
    setFavorites(updatedFavorites);
    setFavoriteIds(updatedFavorites.map((fav) => fav.id));
    toast.success(`🗑️ Recipe removed from favorites!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-view">
        <div className="main-content">
          <div className="search-header-section">
            <div className="search-container">
              <h2 className="search-title">
                Discover Delicious <span>Recipes</span> 🍳
              </h2>
              <p className="search-subtitle">
                Search thousands of recipes and find your next favorite dish
              </p>
              <div className="search-section">
                <div className="input-container">
                  <input
                    className="find-recipe"
                    placeholder="Enter the food you want to make (e.g., pasta, chicken, cake)"
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                  />
                  {input && (
                    <button
                      className="clear-btn"
                      onClick={clearSearch}
                      type="button"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  disabled={
                    loading || input.trim().length < 2 || isApiCallInProgress
                  }
                  className="search-btn"
                >
                  {isApiCallInProgress
                    ? "API Busy..."
                    : loading
                    ? "Searching..."
                    : "Find Recipes"}
                </button>
              </div>

              <div className="filter-section">
                <div className="filter-group">
                  <label htmlFor="servings">Servings:</label>
                  <select
                    id="servings"
                    value={filters.servings}
                    onChange={(e) =>
                      handleFilterChange("servings", e.target.value)
                    }
                    className="filter-select"
                  >
                    <option value="">Any</option>
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                    <option value="4">4 people</option>
                    <option value="6">6+ people</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="healthScore">Min Health Score:</label>
                  <select
                    id="healthScore"
                    value={filters.healthScore}
                    onChange={(e) =>
                      handleFilterChange("healthScore", e.target.value)
                    }
                    className="filter-select"
                  >
                    <option value="">Any</option>
                    <option value="30">30+</option>
                    <option value="50">50+</option>
                    <option value="70">70+</option>
                    <option value="90">90+</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="maxPrice">Max Price ($):</label>
                  <select
                    id="maxPrice"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="filter-select"
                  >
                    <option value="">Any</option>
                    <option value="1">Under $1</option>
                    <option value="2">Under $2</option>
                    <option value="5">Under $5</option>
                    <option value="10">Under $10</option>
                  </select>
                </div>

                <button
                  onClick={applyFilters}
                  className="apply-filters-btn"
                  disabled={loading || isApiCallInProgress}
                >
                  {isApiCallInProgress ? "API Busy..." : "Apply Filters"}
                </button>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear
                </button>
              </div>
            </div>
          </div>

          {getDataSummary() && (
            <div className="data-summary-section">
              <div className="summary-container">
                <h3 className="summary-title">📊 Search Results Summary</h3>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <div className="stat-icon">📝</div>
                    <div className="stat-info">
                      <div className="stat-number">
                        {getDataSummary().totalRecipes}
                      </div>
                      <div className="stat-label">Total Recipes</div>
                    </div>
                  </div>
                  <div className="summary-stat">
                    <div className="stat-icon">💚</div>
                    <div className="stat-info">
                      <div className="stat-number">
                        {getDataSummary().avgHealthScore}/100
                      </div>
                      <div className="stat-label">Avg Health Score</div>
                    </div>
                  </div>
                  <div className="summary-stat">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-info">
                      <div className="stat-number">
                        {getDataSummary().avgReadyTime}min
                      </div>
                      <div className="stat-label">Avg Cook Time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="results-container">
            {loading && <p className="loading-message">Loading recipes...</p>}

            {error && (
              <div className="error-message">
                <p>❌ {error}</p>
              </div>
            )}

            {recipe.totalResults > 0 && (
              <p className="results-count">
                Found {recipe.totalResults} recipes
              </p>
            )}

            {detailedRecipes.length > 0 && !loading && (
              <>
                <TableItems
                  recipes={detailedRecipes}
                  onAddToFavorites={handleAddToFavorites}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                  favoriteIds={favoriteIds}
                />

                <div className="load-more-section">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore || isApiCallInProgress}
                    className="load-more-btn"
                  >
                    {isApiCallInProgress
                      ? "API Busy..."
                      : loadingMore
                      ? "Loading..."
                      : "🔄 Load 3 More Recipes"}
                  </button>
                  <p className="load-more-info">
                    Showing {detailedRecipes.length} of {recipe.totalResults}{" "}
                    total results
                  </p>
                </div>
              </>
            )}

            {recipe.results.length === 0 && !loading && hasSearched && (
              <p className="no-results">
                No recipes found. Try a different search term!
              </p>
            )}

            {!hasSearched && !loading && (
              <div className="welcome-message">
                <h3>🍳 Welcome to Recipe Finder!</h3>
                <p>
                  Enter a food name above and click "Find Recipes" to get
                  started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
