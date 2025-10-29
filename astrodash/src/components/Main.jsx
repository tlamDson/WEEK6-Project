import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import TableItems from "./TableItems";
import "./Main.css";

const Main = forwardRef(({ onAddToFavorites, favoriteIds = [] }, ref) => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [recipe, setRecipe] = useState({
    results: [],
    offset: 0,
    number: 12,
    totalResults: 0,
  });
  const [detailedRecipes, setDetailedRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [lastQuery, setLastQuery] = useState("");

  const [filters, setFilters] = useState({
    servings: "",
    healthScore: "",
    maxPrice: "",
  });

  const fetchRecipes = async (query, offset = 0, isLoadMore = false) => {
    if (!query || !query.trim()) {
      setError("Please enter a search term");
      return;
    }

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
      )}&number=5&offset=${offset}&apiKey=${API_KEY}&addRecipeInformation=true&fillIngredients=true`;

      if (filters.healthScore) {
        apiUrl += `&minHealthScore=${filters.healthScore}`;
      }
      if (filters.maxPrice) {
        apiUrl += `&maxPricePerServing=${filters.maxPrice * 100}`; // API expects cents
      }

      const searchResponse = await fetch(apiUrl);

      if (!searchResponse.ok) {
        if (searchResponse.status === 402) {
          throw new Error(
            "API quota exceeded. Please try again tomorrow or upgrade your plan."
          );
        } else if (searchResponse.status === 401) {
          throw new Error("Invalid API key. Please check your configuration.");
        } else {
          throw new Error(`HTTP error! status: ${searchResponse.status}`);
        }
      }

      const searchData = await searchResponse.json();

      if (isLoadMore) {
        setRecipe((prev) => ({
          ...searchData,
          results: [...prev.results, ...searchData.results],
        }));
      } else {
        setRecipe(searchData);
      }

      const detailedData = await Promise.all(
        searchData.results.map(async (recipe) => {
          try {
            const detailResponse = await fetch(
              `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`
            );

            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              return {
                ...recipe,
                ...detailData,
                summary:
                  detailData.summary || `Delicious ${recipe.title} recipe`,
                readyInMinutes:
                  detailData.readyInMinutes || recipe.readyInMinutes || null,
                servings: detailData.servings || recipe.servings || null,
                healthScore: detailData.healthScore || null,
                pricePerServing: detailData.pricePerServing || null,
                extendedIngredients: detailData.extendedIngredients || [],
              };
            } else {
              return {
                ...recipe,
                summary: `Delicious ${recipe.title} recipe`,
                readyInMinutes: recipe.readyInMinutes || null,
                servings: recipe.servings || null,
                healthScore: null,
                pricePerServing: null,
                extendedIngredients: [],
              };
            }
          } catch (detailError) {
            console.warn(
              `Failed to fetch details for recipe ${recipe.id}:`,
              detailError
            );
            return {
              ...recipe,
              summary: `Delicious ${recipe.title} recipe`,
              readyInMinutes: recipe.readyInMinutes || null,
              servings: recipe.servings || null,
              healthScore: null,
              pricePerServing: null,
              extendedIngredients: [],
            };
          }
        })
      );

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
        setCurrentOffset(offset + 5);
      } else {
        setDetailedRecipes(filteredData);
        setCurrentOffset(5);
      }

      setLastQuery(query);
      console.log("Fetched and filtered recipes:", filteredData);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = () => {
    if (input.trim().length >= 2) {
      fetchRecipes(input);
      setHasSearched(true);
    } else {
      setError("Please enter at least 2 characters to search");
    }
  };

  const handleLoadMore = () => {
    if (lastQuery && !loadingMore) {
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
    if (lastQuery) {
      fetchRecipes(lastQuery);
    }
  };

  const clearFilters = () => {
    setFilters({
      servings: "",
      healthScore: "",
      maxPrice: "",
    });
    if (lastQuery) {
      setTimeout(() => {
        fetchRecipes(lastQuery);
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
    setFilteredRecipes([]);
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

  useEffect(() => {
    fetchRecipes("miso-soup");
    setHasSearched(true);
  }, []);

  useImperativeHandle(ref, () => ({
    getSearchData: () => ({
      recipes: detailedRecipes,
      input,
      hasSearched,
      loading,
      error,
    }),
    setSearchData: (data) => {
      if (data.recipes) setDetailedRecipes(data.recipes);
      if (data.input !== undefined) setInput(data.input);
      if (data.hasSearched !== undefined) setHasSearched(data.hasSearched);
    },
  }));

  return (
    <div className="main-content">
      <div className="search-header-section">
        <div className="search-container">
          <h2 className="search-title">🍳 Recipe Finder</h2>
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
              disabled={loading || input.trim().length < 2}
              className="search-btn"
            >
              {loading ? "Searching..." : "Find Recipes"}
            </button>
          </div>

          <div className="filter-section">
            <div className="filter-group">
              <label htmlFor="servings">Servings:</label>
              <select
                id="servings"
                value={filters.servings}
                onChange={(e) => handleFilterChange("servings", e.target.value)}
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
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
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
              disabled={loading}
            >
              Apply Filters
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
          <p className="results-count">Found {recipe.totalResults} recipes</p>
        )}

        {detailedRecipes.length > 0 && !loading && (
          <>
            <TableItems
              recipes={detailedRecipes}
              onAddToFavorites={onAddToFavorites}
              favoriteIds={favoriteIds}
            />

            <div className="load-more-section">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="load-more-btn"
              >
                {loadingMore ? "Loading..." : "🔄 Load 5 More Recipes"}
              </button>
              <p className="load-more-info">
                Showing {detailedRecipes.length} of {recipe.totalResults} total
                results
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
              Enter a food name above and click "Find Recipes" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

Main.displayName = "Main";

export default Main;
