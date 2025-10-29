import React from "react";
import "./ApiInfo.css";

const ApiInfo = () => {
  return (
    <div className="api-info-container">
      <div className="api-info-header">
        <h2 className="api-info-title">🍽️ Spoonacular Food API</h2>
        <p className="api-info-subtitle">
          Powering your recipe discovery experience
        </p>
      </div>

      <div className="api-info-content">
        <div className="api-overview">
          <h3>About Our Data Source</h3>
          <p>
            We use the <strong>Spoonacular Food API</strong> to provide you with
            comprehensive recipe information. This powerful API offers access to
            over 5,000 recipes with detailed nutritional information, cooking
            instructions, and ingredient lists.
          </p>
          <div className="api-link">
            <a
              href="https://spoonacular.com/food-api"
              target="_blank"
              rel="noopener noreferrer"
              className="api-external-link"
            >
              🔗 Visit Spoonacular API Documentation
            </a>
          </div>
        </div>

        <div className="api-characteristics">
          <h3>Top 3 Key Data Characteristics</h3>
          <div className="characteristics-grid">
            <div className="characteristic-card">
              <div className="char-icon">🧬</div>
              <h4>Nutritional Analysis</h4>
              <p>
                Each recipe includes detailed nutritional information including
                health scores (0-100), calorie counts, macronutrients, and
                dietary compatibility markers (vegan, gluten-free, etc.).
              </p>
              <ul>
                <li>Health Score Rating</li>
                <li>Calorie Information</li>
                <li>Dietary Restrictions</li>
                <li>Allergen Information</li>
              </ul>
            </div>

            <div className="characteristic-card">
              <div className="char-icon">⏱️</div>
              <h4>Time & Serving Data</h4>
              <p>
                Comprehensive timing information helps you plan your cooking,
                including preparation time, cooking time, and serving size
                details for accurate meal planning.
              </p>
              <ul>
                <li>Ready in Minutes</li>
                <li>Preparation Time</li>
                <li>Cooking Time</li>
                <li>Serving Portions</li>
              </ul>
            </div>

            <div className="characteristic-card">
              <div className="char-icon">💰</div>
              <h4>Cost & Ingredients</h4>
              <p>
                Detailed ingredient lists with pricing information per serving,
                helping you budget your meals and understand the
                cost-effectiveness of each recipe.
              </p>
              <ul>
                <li>Price Per Serving</li>
                <li>Complete Ingredient List</li>
                <li>Measurement Details</li>
                <li>Shopping Information</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="api-stats">
          <h3>API Usage Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Available Recipes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Data Points per Recipe</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">20+</div>
              <div className="stat-label">Dietary Categories</div>
            </div>
          </div>
        </div>

        <div className="api-features">
          <h3>Additional Features</h3>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <span>Advanced Recipe Search</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏷️</span>
              <span>Ingredient Recognition</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Nutritional Analysis</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🍷</span>
              <span>Wine Pairing Suggestions</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <span>Mobile-Friendly Data</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌍</span>
              <span>International Cuisines</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiInfo;
