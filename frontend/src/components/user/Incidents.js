import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Incidents() {
  const token = localStorage.getItem("token");
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [message, setMessage] = useState("");

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/incidents/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncidents(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return setMessage("❌ Fill all fields");

    try {
      await axios.post("http://localhost:5000/api/incidents", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Incident logged successfully");
      setForm({ title: "", description: "" });
      fetchIncidents();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Failed to log incident");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Log New Incident</h2>
      <form className="grid gap-2 mb-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Incident Title"
          value={form.title}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Describe the issue"
          value={form.description}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Submit
        </button>
      </form>
      {message && <p className="text-green-700 mb-4">{message}</p>}

      <h2 className="text-xl font-bold mb-2">My Incidents</h2>
      <table className="min-w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr key={inc.id}>
              <td className="border p-2">{inc.id}</td>
              <td className="border p-2">{inc.title}</td>
              <td className="border p-2">{inc.description}</td>
              <td className="border p-2">{inc.status}</td>
              <td className="border p-2">{new Date(inc.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
