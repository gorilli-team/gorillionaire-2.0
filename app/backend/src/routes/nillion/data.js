const express = require("express");
const router = express.Router();
const { readSignalsData } = require("./lib/secretVault");

function convertBigIntToString(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    })
  );
}

router.get("/", async (req, res) => {
  try {
    const schemaId = req.query.schemaId;
    if (!schemaId) {
      throw new Error("Schema ID is required");
    }

    const data = await readSignalsData(schemaId);
    res.json({ success: true, data: convertBigIntToString(data) });
  } catch (error) {
    console.error("Failed to read signals data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
