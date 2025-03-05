//add a route to our backend that will receive the transfer data and store it in the database

const express = require("express");
const router = express.Router();
const Transfer = require("../../models/Transfer");
const { v4: uuidv4 } = require("uuid");
const { broadcastEvent } = require("../../websocket");

//get all tokens
router.get("/", async (req, res) => {
  try {
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error fetching token stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:token", async (req, res) => {
  try {
    console.log("req.params.token", req.params.token);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({ error: "Failed to fetch transfers" });
  }
});

// Example of how to broadcast a new event when it's created
router.post("/:token", async (req, res) => {
  try {
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

module.exports = router;
