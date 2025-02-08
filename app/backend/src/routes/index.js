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

// Get tweets
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
      .find({
        key: {
          $regex: /^twitter\/tweets\/.*/,
        },
      })
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

// Get prices
router.get("/prices", async (req, res) => {
  try {
    const collectionName = "cache";

    if (mongoose.connection.db.databaseName !== "gorillionaire") {
      throw new Error(
        "Connected to wrong database: " + mongoose.connection.db.databaseName
      );
    }

    const collection = mongoose.connection.db.collection(collectionName);
    const documents = await collection
      .find({ key: { $regex: "coinmarketcap:getprice" } })
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

// Get prices
router.get("/token", async (req, res) => {
  try {
    const collectionName = "cache";
    if (mongoose.connection.db.databaseName !== "gorillionaire") {
      throw new Error(
        "Connected to wrong database: " + mongoose.connection.db.databaseName
      );
    }

    const collection = mongoose.connection.db.collection(collectionName);
    const documents = await collection
      .find({
        key: {
          $in: [
            "percentChange1h",
            "percentChange24h",
            "volume24h",
            "volumeChange24h",
          ],
        },
      })
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

// Get prices
router.get("/signal", async (req, res) => {
  try {
    const collectionName = "cache";
    if (mongoose.connection.db.databaseName !== "gorillionaire") {
      throw new Error(
        "Connected to wrong database: " + mongoose.connection.db.databaseName
      );
    }

    const collection = mongoose.connection.db.collection(collectionName);
    const documents = await collection
      .find({ key: { $regex: "signal" } })
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

// Get prices
router.get("/feed", async (req, res) => {
  try {
    const collectionName = "cache";

    if (mongoose.connection.db.databaseName !== "gorillionaire") {
      throw new Error(
        "Connected to wrong database: " + mongoose.connection.db.databaseName
      );
    }

    const collection = mongoose.connection.db.collection(collectionName);
    const documents = await collection
      .find({
        $or: [
          { key: { $regex: /^twitter\/tweets\// } },
          { key: { $regex: /^coinmarketcap:getprice/ } },
          {
            key: {
              $in: [
                "percentChange1h",
                "percentChange24h",
                "volume24h",
                "volumeChange24h",
                "signal",
              ],
            },
          },
        ],
      })
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
