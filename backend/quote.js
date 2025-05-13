const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const apiRes = await fetch("https://zenquotes.io/api/random");
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: "Failed to fetch quote" });
    }
    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    console.error("Quote API error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
