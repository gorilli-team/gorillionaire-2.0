const express = require("express");
const router = express.Router();
const { retrieveGorilliNftHolders } = require("../../api/blockvision");

router.get("/", async (req, res) => {
  try {
    const data = await retrieveGorilliNftHolders();
    res.json(data);
  } catch (error) {
    console.error("Error fetching holders:", error);
    res.status(500).json({ error: "Failed to fetch holders" });
  }
});

module.exports = router;
