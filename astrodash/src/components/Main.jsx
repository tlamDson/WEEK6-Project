import React, { useEffect, useState } from "react";

const Main = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [recipe, setRecipe] = useState({
    results: [],
    offset: 0,
    number: 12,
    totalResults: 0,
  });
  const [input, setInput] = useState("");
  const fetchRecipes = async (query) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=20&apiKey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    fetchRecipes("miso-soup");
  }, []);
  console.log(recipe);

  return (
    <div className="container">
      <h1 className="hi">HI</h1>
      <input
        className="find-recipe"
        placeholder="Enter the food you want to make"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button>Find</button>
      {recipe.results.map(
        (
          item // ✅ Use recipe.results instead
        ) => (
          <div key={item.id}>
            <div>{item.title}</div>
            <img src={item.image} alt="" />
          </div>
        )
      )}
    </div>
  );
};

export default Main;
