import express, { Request, Response } from "express";
import Blockvision from "../../api/blockvision";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await Blockvision.retrieveGorilliNftHolders();
    res.json(data);
  } catch (error) {
    console.error("Error fetching holders:", error);
    res.status(500).json({ error: "Failed to fetch holders" });
  }
});

export default router;
