// src/components/AdminSidebar.js
import React from "react";
import "../css/AdminSidebar.css";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaVideo,
  FaUserCheck,
  FaUserPlus,
  FaUsers,
  FaBell,
  FaExclamationTriangle,
  FaBars,
} from "react-icons/fa";
import "../css/Sidebar.css";

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <div className="menu-icon">
        <FaBars />
      </div>

      <NavLink to="/admin/home" className="logo-link">
        <h2 className="logo">Campus AI</h2>
      </NavLink>

      <ul className="menu">
        <li>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FaTachometerAlt className="icon" />
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/live-feed" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FaVideo className="icon" />
            <span className="menu-text">Live Feed</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/visitors" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FaUsers className="icon" />
            <span className="menu-text">Visitors</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/add-person" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FaUserPlus className="icon" />
            <span className="menu-text">Add Person</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/manage-users" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FaUserCheck className="icon" />
            <span className="menu-text">Manage Users</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/incidents" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FaExclamationTriangle className="icon" />
            <span className="menu-text">Incidents</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/alerts" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FaBell className="icon" />
            <span className="menu-text">Alerts</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
