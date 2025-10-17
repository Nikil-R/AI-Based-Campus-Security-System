const { spawn } = require("child_process");
const path = require("path");

exports.registerPerson = (req, res) => {
  const { name, user_id, role } = req.body;

  if (!name || !user_id || !role) {
    return res.status(400).json({ status: "error", message: "Missing fields" });
  }

  // Path to your Python file in Campus folder
  const scriptPath = path.join(
    "C:",
    "Users",
    "nikil",
    "PycharmProjects",
    "Campus",
    "register_student.py"
  );

  const python = spawn("python", [scriptPath, name, user_id, role]);

  let output = "";
  let errorOutput = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  python.on("close", (code) => {
    if (code === 0) {
      res.json({ status: "success", message: output.trim() });
    } else {
      res
        .status(500)
        .json({ status: "error", message: errorOutput || "Unknown error" });
    }
  });
};
