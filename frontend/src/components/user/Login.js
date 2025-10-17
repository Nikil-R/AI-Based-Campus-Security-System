import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

function Login({ setCurrentUser }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId.trim() || !password.trim()) {
      setError("❌ Please enter both User ID and password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          user_id: userId.trim(),
          password: password.trim(),
        }
      );

      const { user, token } = response.data;

      if (!user || !token) {
        setError("❌ Invalid credentials");
        setLoading(false);
        return;
      }

      // Save token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin/home");
      } else {
        navigate("/user/home");
      }
    } catch (err) {
      console.error("Login error:", err.response || err.message);

      if (err.response) {
        // Server responded with status code outside 2xx
        setError(err.response.data.message || "❌ Login failed");
      } else if (err.request) {
        // Request made but no response
        setError("❌ Server not responding. Check backend!");
      } else {
        // Other errors
        setError(`❌ ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        {[...Array(6)].map((_, i) => (
          <span key={i}></span>
        ))}
      </div>
      <div className="login-container">
        <h2>Campus Security Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>User ID:</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your User ID"
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
