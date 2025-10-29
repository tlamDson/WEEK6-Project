import React from "react";
import TableItems from "./TableItems";
import "./FavoritesList.css";

const FavoritesList = ({ favorites, onRemoveFromFavorites }) => {
  const handleRemoveFromFavorites = (recipe) => {
    onRemoveFromFavorites(recipe.id);
  };

  const favoritesWithRemoveAction = favorites.map((recipe) => ({
    ...recipe,
    removeAction: true,
  }));

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2 className="favorites-title">❤️ My Favorite Recipes</h2>
        <p className="favorites-subtitle">
          You have {favorites.length} favorite recipe
          {favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">🍽️</div>
          <h3>No favorites yet!</h3>
          <p>Start adding recipes to your favorites from the search results.</p>
        </div>
      ) : (
        <div className="favorites-table-wrapper">
          <FavoritesTable
            recipes={favoritesWithRemoveAction}
            onRemoveFromFavorites={handleRemoveFromFavorites}
          />
        </div>
      )}
    </div>
  );
};

const FavoritesTable = ({ recipes, onRemoveFromFavorites }) => {
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: "asc",
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedRecipes = () => {
    if (!sortConfig.key) return recipes;

    return [...recipes].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case "title":
          aValue = a.title?.toLowerCase() || "";
          bValue = b.title?.toLowerCase() || "";
          break;
        case "readyInMinutes":
          aValue = a.readyInMinutes || 0;
          bValue = b.readyInMinutes || 0;
          break;
        case "servings":
          aValue = a.servings || 0;
          bValue = b.servings || 0;
          break;
        case "healthScore":
          aValue = a.healthScore || 0;
          bValue = b.healthScore || 0;
          break;
        case "pricePerServing":
          aValue = a.pricePerServing || 0;
          bValue = b.pricePerServing || 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string") {
        if (sortConfig.direction === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else {
        if (sortConfig.direction === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return "↕️";
    }
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const truncateSummary = (summary, maxLength = 150) => {
    if (!summary) return "No summary available";
    const cleanSummary = summary.replace(/<[^>]*>/g, "");
    if (cleanSummary.length <= maxLength) return cleanSummary;
    return cleanSummary.substring(0, maxLength) + "...";
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="favorites-table-container">
      <div className="table-wrapper">
        <table className="favorites-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("title")}
                className="sortable-header"
              >
                Recipe Name {getSortIcon("title")}
              </th>
              <th className="summary-header">Summary</th>
              <th
                onClick={() => handleSort("readyInMinutes")}
                className="sortable-header"
              >
                Ready Time (min) {getSortIcon("readyInMinutes")}
              </th>
              <th
                onClick={() => handleSort("servings")}
                className="sortable-header"
              >
                Servings {getSortIcon("servings")}
              </th>
              <th
                onClick={() => handleSort("healthScore")}
                className="sortable-header"
              >
                Health Score {getSortIcon("healthScore")}
              </th>
              <th
                onClick={() => handleSort("pricePerServing")}
                className="sortable-header"
              >
                Price/Serving {getSortIcon("pricePerServing")}
              </th>
              <th className="action-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {getSortedRecipes().map((recipe) => (
              <tr key={recipe.id} className="recipe-row">
                <td className="recipe-name">
                  <div className="name-cell">
                    <h4>{recipe.title}</h4>
                    <small>ID: {recipe.id}</small>
                  </div>
                </td>
                <td className="recipe-summary">
                  <div className="summary-cell">
                    {truncateSummary(recipe.summary)}
                  </div>
                </td>
                <td className="recipe-time">
                  <div className="time-cell">
                    <span className="time-value">
                      {recipe.readyInMinutes || "N/A"}
                    </span>
                    {recipe.readyInMinutes && <small>minutes</small>}
                  </div>
                </td>
                <td className="recipe-servings">
                  <div className="servings-cell">
                    <span className="servings-value">
                      {recipe.servings || "N/A"}
                    </span>
                    {recipe.servings && <small>people</small>}
                  </div>
                </td>
                <td className="recipe-health">
                  <div className="health-cell">
                    <span className="health-value">
                      {recipe.healthScore || "N/A"}
                    </span>
                    {recipe.healthScore && <small>/100</small>}
                  </div>
                </td>
                <td className="recipe-price">
                  <div className="price-cell">
                    {formatPrice(recipe.pricePerServing)}
                  </div>
                </td>
                <td className="recipe-action">
                  <button
                    onClick={() => onRemoveFromFavorites(recipe)}
                    className="remove-btn"
                  >
                    🗑️ Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FavoritesList;
