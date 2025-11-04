// RecipeDetail.jsx component structure
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RecipeDetail = ({ recipeId }) => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState();
  const [loading, setLoading] = useState(true);
  const API_KEY = import.meta.env.VITE_API_KEY;
  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
        );
        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
          console.log(data);
        }
      } catch (error) {
        console.error("Error");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchRecipeDetail();
    }
  }, [id]);
  if (loading) return <div>Loading Recipe</div>;
  if (!recipe) return <div>Recipe not found</div>;
  return <div className="recipe-detail-page">HIHIHIH</div>;
};
export default RecipeDetail;
