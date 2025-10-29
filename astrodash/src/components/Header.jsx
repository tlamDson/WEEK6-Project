import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1 className="logo-text">🍳 AstroDash</h1>
        </div>
        <nav className="header-nav">
          <a href="/" className="nav-link">
            Home
          </a>
          <a href="/recipes" className="nav-link">
            Recipes
          </a>
          <a href="/favorites" className="nav-link">
            Favorites
          </a>
        </nav>
        <div className="header-actions">
          <div className="user-profile">
            <div className="user-avatar">
              <span className="avatar-initial">U</span>
            </div>
            <span className="user-name">User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
