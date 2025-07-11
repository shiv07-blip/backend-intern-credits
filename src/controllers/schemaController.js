const pool = require("../db/pool");
require("dotenv").config("./src/.env");

function isDangerousSQL(sql) {
  return /\b(drop\s+table|truncate\s+table|delete\s+from)\b/i.test(sql);
}

const updateSchema = async (req, res) => {
  const { sql } = req.body;

  if (!sql || typeof sql !== "string") {
    return res
      .status(400)
      .json({ message: "Invalid or missing SQL statement." });
  }

  if (isDangerousSQL(sql)) {
    return res
      .status(403)
      .json({ message: "Dangerous SQL operations are not allowed." });
  }

  try {
    const result = await pool.query(sql);
    res.status(200).json({
      message: "Schema updated successfully.",
      command: result.command,
      rowCount: result.rowCount || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Schema update failed.",
      error: error.message,
    });
  }
};

module.exports = {
  updateSchema,
};
