import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Dashboard</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink
          end={true}
          to="/"
          className={({ isActive }) =>
            `nav-link ${isActive ? "nav-link--active" : ""}`
          }
        >
          <img src={assets.home_icon} alt="Home" className="nav-icon" />
          <span className="nav-text">Home</span>
        </NavLink>

        <NavLink
          to="/addBlog"
          className={({ isActive }) =>
            `nav-link ${isActive ? "nav-link--active" : ""}`
          }
        >
          <img src={assets.add_icon} alt="Add Blog" className="nav-icon" />
          <span className="nav-text">Add Blog</span>
        </NavLink>

        <NavLink
          to="/listBlog"
          className={({ isActive }) =>
            `nav-link ${isActive ? "nav-link--active" : ""}`
          }
        >
          <img src={assets.list_icon} alt="Blog List" className="nav-icon" />
          <span className="nav-text">Blog List</span>
        </NavLink>

        <NavLink
          to="/comments"
          className={({ isActive }) =>
            `nav-link ${isActive ? "nav-link--active" : ""}`
          }
        >
          <img src={assets.comment_icon} alt="Comments" className="nav-icon" />
          <span className="nav-text">Comments</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
