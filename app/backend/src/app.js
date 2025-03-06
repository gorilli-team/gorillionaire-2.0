// app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-Auth, admin, Authorization"
  );
  next();
});

// Routes
app.use("/events/spike", require("./routes/events/spike"));
app.use("/events/token", require("./routes/events/token"));
app.use("/events/listings", require("./routes/events/listings"));
app.use("/events/transfers", require("./routes/events/transfers"));

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

module.exports = app;
