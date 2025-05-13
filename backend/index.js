const express = require("express");
const cors = require("cors");
const weatherRoute = require("./weather");
const quoteRoute = require("./quote");

const app = express();
const PORT = 5001;

app.use(cors());
app.use("/api/weather", weatherRoute);
app.use("/api/quote", quoteRoute);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
