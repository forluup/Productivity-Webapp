const express = require("express");

const router = express.Router();

const API_KEY = process.env.OPENWEATHER_API_KEY;

router.get("/", async (req, res) => {
  const city = req.query.city || "Coquitlam";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;

  try {
    const apiRes = await fetch(apiUrl);
    if (!apiRes.ok) {
      return res
        .status(apiRes.status)
        .json({ error: "Failed to fetch weather" });
    }
    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
