import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "./RecipeCharts.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const RecipeCharts = ({ recipes }) => {
  const [showCharts, setShowCharts] = useState(false);
  const [activeChart, setActiveChart] = useState("all"); // 'all', 'health', 'price'

  if (!recipes || recipes.length === 0) {
    return null;
  }

  // Prepare data for Health Score Distribution Chart
  const healthScoreData = {
    labels: recipes.map((r) => r.title.substring(0, 20) + "..."),
    datasets: [
      {
        label: "Health Score",
        data: recipes.map((r) => r.healthScore || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const healthScoreOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "📊 Health Score Comparison",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Health Score: ${context.parsed.y}/100`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Health Score (out of 100)",
        },
      },
    },
  };

  // Prepare data for Price Distribution Chart
  const priceRanges = {
    "Under $1": 0,
    "$1-$2": 0,
    "$2-$5": 0,
    "Over $5": 0,
  };

  recipes.forEach((recipe) => {
    const price = (recipe.pricePerServing || 0) / 100;
    if (price < 1) priceRanges["Under $1"]++;
    else if (price < 2) priceRanges["$1-$2"]++;
    else if (price < 5) priceRanges["$2-$5"]++;
    else priceRanges["Over $5"]++;
  });

  const priceData = {
    labels: Object.keys(priceRanges),
    datasets: [
      {
        label: "Number of Recipes",
        data: Object.values(priceRanges),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const priceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "💰 Price Range Distribution",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} recipes (${percentage}%)`;
          },
        },
      },
    },
  };

  const shouldShowChart = (chartName) => {
    return activeChart === "all" || activeChart === chartName;
  };

  return (
    <div className="charts-section">
      <div className="charts-header">
        <div className="charts-header-content">
          <div className="charts-title-section">
            <h3 className="charts-title">📈 Recipe Analytics Dashboard</h3>
            <p className="charts-subtitle">
              Visualize and compare recipe metrics to make better cooking
              choices
            </p>
          </div>

          <div className="charts-controls">
            <button
              className={`toggle-charts-btn ${showCharts ? "active" : ""}`}
              onClick={() => setShowCharts(!showCharts)}
            >
              {showCharts ? "📊 Hide Charts" : "📊 Show Charts"}
            </button>

            {showCharts && (
              <>
                <button
                  className={`chart-filter-btn ${
                    activeChart === "all" ? "active" : ""
                  }`}
                  onClick={() => setActiveChart("all")}
                >
                  All Charts
                </button>
                <button
                  className={`chart-filter-btn ${
                    activeChart === "health" ? "active" : ""
                  }`}
                  onClick={() => setActiveChart("health")}
                >
                  Health
                </button>
                <button
                  className={`chart-filter-btn ${
                    activeChart === "price" ? "active" : ""
                  }`}
                  onClick={() => setActiveChart("price")}
                >
                  Price
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showCharts && (
        <div className="charts-container">
          <div className="charts-info-box">
            <h4>💡 Chart Insights</h4>
            <ul>
              <li>
                <strong>Health Score:</strong> Compare nutritional value across
                recipes (higher is healthier)
              </li>
              <li>
                <strong>Price Distribution:</strong> Understand the cost
                breakdown of your search results
              </li>
            </ul>
          </div>

          <div className="charts-grid">
            {shouldShowChart("health") && (
              <div className="chart-card">
                <div className="chart-wrapper">
                  <Bar data={healthScoreData} options={healthScoreOptions} />
                </div>
                <div className="chart-description">
                  <p>
                    📊 <strong>Health Score Analysis:</strong> Higher bars
                    indicate healthier recipes with better nutritional profiles.
                  </p>
                </div>
              </div>
            )}

            {shouldShowChart("price") && (
              <div className="chart-card chart-card-pie">
                <div className="chart-wrapper-pie">
                  <Pie data={priceData} options={priceOptions} />
                </div>
                <div className="chart-description">
                  <p>
                    💰 <strong>Price Breakdown:</strong> See how recipes are
                    distributed across price ranges for budget planning.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCharts;
