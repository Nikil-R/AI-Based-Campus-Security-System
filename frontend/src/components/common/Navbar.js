// src/components/Navbar.js
import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaEnvelope, FaUserCircle, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = ({ users = [], handleLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // ⏰ Clock update
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔍 Handle search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
    } else {
      const filtered = users
        .filter(
          (user) =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            String(user.user_id).toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));

      setSearchResults(filtered);
    }
  };

  // ✅ Select user from dropdown
  const handleSelect = (user) => {
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/user/users/${user.user_id}`);
  };

  // 🛑 Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚪 Logout handled by App.js state
  const onLogout = () => {
    if (handleLogout) handleLogout(); // notify App.js
    navigate("/login"); // redirect to login
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <img src="/images/Sec.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-title">Campus Security AI</span>
      </div>

      {/* CENTER */}
      <div className="navbar-center">
        <div className="search-container" ref={searchRef}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users or IDs..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {(searchResults.length > 0 || searchQuery) && (
            <ul className="search-dropdown">
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <li
                    key={user.id || user.user_id}
                    className="search-item"
                    onClick={() => handleSelect(user)}
                  >
                    {user.name} ({user.user_id})
                  </li>
                ))
              ) : (
                <li className="no-results">No results found</li>
              )}
            </ul>
          )}
        </div>
        <div className="clock">
          {currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <button className="icon-btn" title="Notifications">
          <FaBell />
          <span className="badge">3</span>
        </button>
        <button className="icon-btn" title="Messages">
          <FaEnvelope />
          <span className="badge">1</span>
        </button>
        <div className="profile-dropdown">
          <FaUserCircle className="profile-icon" />
          <div className="dropdown-content">
            <button onClick={() => navigate("/user/profile")} className="dropdown-link">
              View Profile
            </button>
            <button onClick={() => navigate("/change-password")} className="dropdown-link">
              Change Password
            </button>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
