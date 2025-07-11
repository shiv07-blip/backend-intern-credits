const db = require("../db/pool");

const getCreditById = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await db.query(
      "SELECT credits, last_updated FROM credits WHERE user_id = $1",
      [user_id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found in credits table" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET credits error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addCreditsByUserId = async (req, res) => {
  const { user_id } = req.params;
  const { amount } = req.body;
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "Invalid credit amount" });
  }

  try {
    const result = await db.query(
      "UPDATE credits SET credits = credits + $1, last_updated = NOW() WHERE user_id = $2 RETURNING credits, last_updated",
      [amount, user_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("ADD credits error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deductCreditsByUserId = async (req, res) => {
  const { user_id } = req.params;
  const { amount } = req.body;
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "Invalid deduction amount" });
  }

  try {
    const { rows } = await db.query(
      "SELECT credits FROM credits WHERE user_id = $1",
      [user_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentCredits = rows[0].credits;
    if (currentCredits < amount) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    const result = await db.query(
      "UPDATE credits SET credits = credits - $1, last_updated = NOW() WHERE user_id = $2 RETURNING credits, last_updated",
      [amount, user_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("DEDUCT credits error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetCredit = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await db.query(
      "UPDATE credits SET credits = 0, last_updated = NOW() WHERE user_id = $1 RETURNING credits, last_updated",
      [user_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("RESET credits error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCreditById,
  addCreditsByUserId,
  deductCreditsByUserId,
  resetCredit,
};
