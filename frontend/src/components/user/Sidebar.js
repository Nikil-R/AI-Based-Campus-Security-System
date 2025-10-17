// src/components/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaClipboardList,
  FaUser,
  FaBell,
  FaCog,
  FaLifeRing,
  FaBars,
} from "react-icons/fa";
import "../css/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="menu-icon">
        <FaBars />
      </div>

      <NavLink to="/login" className="logo-link">
        <h2 className="logo">Campus AI</h2>
      </NavLink>

      <ul className="menu">
        <li>
          <NavLink to="/user/incidents" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FaClipboardList className="icon" />
            <span className="menu-text">My Incidents</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/user/profile" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FaUser className="icon" />
            <span className="menu-text">Profile</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/user/alerts" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FaBell className="icon" />
            <span className="menu-text">Alerts</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/user/settings" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FaCog className="icon" />
            <span className="menu-text">Settings</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/user/help" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FaLifeRing className="icon" />
            <span className="menu-text">Help / Panic</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
