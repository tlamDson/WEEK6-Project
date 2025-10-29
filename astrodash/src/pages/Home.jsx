import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import FavoritesList from "../components/FavoritesList";
import ApiInfo from "../components/ApiInfo";
import "./Home.css";

const Home = () => {
  const [currentView, setCurrentView] = useState("home");
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const mainComponentRef = useRef(null);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("recipesFavorites");
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
        setFavoriteIds(parsedFavorites.map((recipe) => recipe.id));
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("recipesFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleAddToFavorites = (recipe) => {
    if (!favoriteIds.includes(recipe.id)) {
      const newFavorites = [...favorites, recipe];
      setFavorites(newFavorites);
      setFavoriteIds([...favoriteIds, recipe.id]);

      // Show a brief success message (optional)
      console.log(`Added "${recipe.title}" to favorites!`);
    }
  };

  const handleRemoveFromFavorites = (recipeId) => {
    const newFavorites = favorites.filter((recipe) => recipe.id !== recipeId);
    setFavorites(newFavorites);
    setFavoriteIds(favoriteIds.filter((id) => id !== recipeId));

    console.log(`Removed recipe from favorites!`);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return (
          <Main
            ref={mainComponentRef}
            onAddToFavorites={handleAddToFavorites}
            favoriteIds={favoriteIds}
          />
        );
      case "favorites":
        return (
          <FavoritesList
            favorites={favorites}
            onRemoveFromFavorites={handleRemoveFromFavorites}
          />
        );
      case "apiInfo":
        return <ApiInfo />;
      default:
        return (
          <Main
            ref={mainComponentRef}
            onAddToFavorites={handleAddToFavorites}
            favoriteIds={favoriteIds}
          />
        );
    }
  };

  return (
    <div className="home-container">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      <div className="main-view">{renderCurrentView()}</div>
    </div>
  );
};

export default Home;
