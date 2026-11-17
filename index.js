const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/zombies/purged", (req, res) => {
  res.json([]);
});

app.get("/", (req, res) => {
  res.send("Rare Apepes API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
