import React from "react";
import { assets } from "../assets/assets";
import "./Sidebar.css";

const Sidebar = ({ currentView, onViewChange }) => {
  const handleNavClick = (view) => {
    onViewChange(view);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-section">
          <h1 className="logo-title">Recipe Explorer</h1>
        </div>
      </div>
      <nav className="sidebar-nav">
        <button
          onClick={() => handleNavClick("home")}
          className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer w-full text-left ${
            currentView === "home" && "bg-primary/10 border-r-4 border-primary"
          }`}
        >
          <img
            src={assets.home_icon}
            alt="Home"
            className="min-w-4 w-5 nav-icon"
          />
          <p className="hidden md:inline-block nav-text">Recipe Search</p>
        </button>

        <button
          onClick={() => handleNavClick("favorites")}
          className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer w-full text-left ${
            currentView === "favorites" &&
            "bg-primary/10 border-r-4 border-primary"
          }`}
        >
          <span className="min-w-4 w-5 nav-icon fav-icon">❤️</span>
          <p className="hidden md:inline-block nav-text">Favorite Recipes</p>
        </button>

        <button
          onClick={() => handleNavClick("apiInfo")}
          className={`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer w-full text-left ${
            currentView === "apiInfo" &&
            "bg-primary/10 border-r-4 border-primary"
          }`}
        >
          <span className="min-w-4 w-5 nav-icon info-icon">ℹ️</span>
          <p className="hidden md:inline-block nav-text">API Information</p>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
