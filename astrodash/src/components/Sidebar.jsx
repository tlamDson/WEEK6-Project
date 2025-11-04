import React from "react";
import { assets } from "../assets/assets";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-section">
          <h1 className="logo-title">Recipe Explorer</h1>
        </div>
      </div>
      <nav className="sidebar-nav">
        <button onClick={() => navigate("/")}>
          <img
            src={assets.home_icon}
            alt="Home"
            className="min-w-4 w-5 nav-icon"
          />
          <p className="hidden md:inline-block nav-text">Recipe Search</p>
        </button>

        <button onClick={() => navigate("/favourite")}>
          <span className="min-w-4 w-5 nav-icon fav-icon">❤️</span>
          <p className="hidden md:inline-block nav-text">Favorite Recipes</p>
        </button>

        <button onClick={() => navigate("/apiInfo")}>
          <span className="min-w-4 w-5 nav-icon info-icon">ℹ️</span>
          <p className="hidden md:inline-block nav-text">API Information</p>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
