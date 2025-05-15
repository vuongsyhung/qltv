require("dotenv").config();
const express = require("express");
const userController = require("./controller/userController");
const loginController = require("./controller/loginController");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the QLSach API!");
});

app.use("/api", userController);
app.use("/api", loginController);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});