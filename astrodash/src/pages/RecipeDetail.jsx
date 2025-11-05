// RecipeDetail.jsx component structure
import { useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./RecipeDetail.css";
import Sidebar from "../components/Sidebar";

const RecipeDetail = ({ recipeId }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(true);
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        setLoading(true);
        toast.info("🔍 Loading recipe details...", {
          autoClose: 1500,
        });
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
        );
        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
          toast.success(`✅ Recipe loaded: ${data.title}`, {
            autoClose: 2000,
          });
          console.log(data);
        } else {
          toast.error("❌ Failed to load recipe details", {
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Error", error);
        toast.error("❌ Error loading recipe. Please try again.", {
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchRecipeDetail();
    }
  }, [id]);

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) return <div className="loading">Loading Recipe...</div>;
  if (!recipe) return <div className="error">Recipe not found</div>;

  return (
    <div>
      <Sidebar />
      <button onClick={() => navigate("/")}>Return</button>
      <div className="recipe-detail-page">
        <div className="recipe-header">
          <div className="recipe-image-container">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="recipe-image"
            />
          </div>
          <div className="recipe-info">
            <h1 className="recipe-title">{recipe.title}</h1>
            <div className="recipe-meta">
              <div className="meta-item">
                <span className="meta-label">Ready in:</span>
                <span className="meta-value">
                  {formatTime(recipe.readyInMinutes)}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Servings:</span>
                <span className="meta-value">{recipe.servings}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Health Score:</span>
                <span className="meta-value">{recipe.healthScore}/100</span>
              </div>
              {recipe.pricePerServing && (
                <div className="meta-item">
                  <span className="meta-label">Price per serving:</span>
                  <span className="meta-value">
                    ${(recipe.pricePerServing / 100).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {recipe.dishTypes && recipe.dishTypes.length > 0 && (
              <div className="dish-types">
                {recipe.dishTypes.map((type, index) => (
                  <span key={index} className="dish-type-tag">
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="recipe-content">
          {recipe.summary && (
            <section className="recipe-summary">
              <h2>Summary</h2>
              <div
                className="summary-text"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              />
            </section>
          )}

          <section className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.extendedIngredients?.map((ingredient, index) => (
                <li
                  key={`${ingredient.id}-${index}`}
                  className="ingredient-item"
                >
                  <div className="ingredient-content">
                    <span className="ingredient-amount">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                    <span className="ingredient-name">{ingredient.name}</span>
                  </div>
                  <div className="ingredient-original">
                    {ingredient.original}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {recipe.analyzedInstructions &&
            recipe.analyzedInstructions.length > 0 && (
              <section className="instructions-section">
                <h2>Instructions</h2>
                <ol className="instructions-list">
                  {recipe.analyzedInstructions[0]?.steps?.map((step, index) => (
                    <li
                      key={`step-${step.number}-${index}`}
                      className="instruction-step"
                    >
                      <div className="step-number">{step.number}</div>
                      <div className="step-content">{step.step}</div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

          {recipe.nutrition && (
            <section className="nutrition-section">
              <h2>Nutrition Information</h2>
              <div className="nutrition-grid">
                {recipe.nutrition.nutrients
                  ?.slice(0, 8)
                  .map((nutrient, index) => (
                    <div
                      key={`${nutrient.name}-${index}`}
                      className="nutrition-item"
                    >
                      <span className="nutrient-name">{nutrient.name}</span>
                      <span className="nutrient-value">
                        {Math.round(nutrient.amount)}
                        {nutrient.unit}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
export default RecipeDetail;
