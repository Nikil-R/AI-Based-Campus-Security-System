import React, { useEffect, useState } from "react";
import '../css/ManageUsers.css';


// Utility: Export users as CSV
const exportCSV = (users) => {
  const headers = ["ID", "Name", "User ID", "Department", "Role"];
  const rows = users.map((u) => [u.id, u.name, u.user_id, u.department, u.role]);

  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "users_export.csv";
  link.click();
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);

  // Fetch all users except admins
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
      else setUsers([]);
    } catch (err) {
      console.error("❌ Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (user_id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://localhost:5000/api/users/${user_id}`, { method: "DELETE" });
      setUsers(users.filter((u) => u.user_id !== user_id));
    } catch (err) {
      console.error("❌ Failed to delete user", err);
    }
  };

  // Save updated user
  const handleSaveEdit = async () => {
    try {
      const body = { ...editUser };
      if (!body.password) delete body.password; // don't update password if empty

      const res = await fetch(`http://localhost:5000/api/users/${editUser.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setUsers(users.map((u) => (u.user_id === editUser.user_id ? editUser : u)));
      setEditUser(null);
    } catch (err) {
      console.error("❌ Failed to update user", err);
      alert("Failed to update user: " + err.message);
    }
  };

  // Search + Filter
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.user_id.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="manage-users" style={{ padding: "20px" }}>
      <h2>👥 Manage Users</h2>

      {/* Search + Filter + Export */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="visitor">Visitor</option>
          <option value="guard">Guard</option>
        </select>
        <button onClick={() => exportCSV(filteredUsers)}>⬇️ Export CSV</button>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>User ID</th>
              <th>Department</th>
              <th>Role</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.user_id}>
                <td>{user.id}</td>

                {/* Edit Mode */}
                {editUser?.user_id === user.user_id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editUser.name}
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editUser.user_id}
                        onChange={(e) => setEditUser({ ...editUser, user_id: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editUser.department}
                        onChange={(e) => setEditUser({ ...editUser, department: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        value={editUser.role}
                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                      >
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                        <option value="visitor">Visitor</option>
                        <option value="guard">Guard</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="password"
                        placeholder="New password (optional)"
                        value={editUser.password || ""}
                        onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                      />
                    </td>
                    <td>
                      <button onClick={handleSaveEdit}>💾 Save</button>
                      <button onClick={() => setEditUser(null)}>❌ Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.name}</td>
                    <td>{user.user_id}</td>
                    <td>{user.department}</td>
                    <td>{user.role}</td>
                    <td>******</td>
                    <td>
                      <button onClick={() => setEditUser(user)}>✏️ Edit</button>
                      <button onClick={() => handleDelete(user.user_id)}>🗑️ Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
