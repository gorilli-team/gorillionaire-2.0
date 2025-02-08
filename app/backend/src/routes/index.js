// routes/index.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Get all collections
router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.db.databaseName !== "gorillionaire") {
      throw new Error(
        "Connected to wrong database: " + mongoose.connection.db.databaseName
      );
    }

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((collection) => collection.name);

    res.json({
      database: mongoose.connection.db.databaseName,
      collections: collectionNames,
    });
  } catch (error) {
    console.error("Error listing collections:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all documents from a specific collection
router.get("/tweets", async (req, res) => {
  try {
    const collectionName = "cache";

    if (mongoose.connection.db.databaseName !== "gorillionaire") {
      throw new Error(
        "Connected to wrong database: " + mongoose.connection.db.databaseName
      );
    }

    const collection = mongoose.connection.db.collection(collectionName);
    const documents = await collection
      .find({ key: { $regex: "twitter/tweets/" } })
      .sort({ createdAt: -1 }) // -1 for descending order
      .toArray();

    res.json({
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error(
      `Error fetching documents from ${req.params.collectionName}:`,
      error
    );
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
