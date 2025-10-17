import React, { useState } from "react";
import '../css/AddPerson.css'
const AddPerson = () => {
  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    department: "",
    role: "student",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("📸 Starting face scan... Please wait 10 seconds.");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/add-person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ " + data.message);
        setFormData({
          name: "",
          userId: "",
          department: "",
          role: "student",
          password: "",
        });
      } else {
        setMessage("❌ " + (data.error || "Registration failed"));
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("⚠️ Backend not reachable. Please check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Person</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="userId"
          placeholder="User ID / USN"
          value={formData.userId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department / Zone"
          value={formData.department}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="guard">Guard</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 chars)"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Person"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddPerson;
