import express, { Request, Response } from "express";
import TokenHolders from "../../models/TokenHolders";
import Blockvision from "../../api/blockvision";

const router = express.Router();

router.get("/:tokenAddress", async (req: Request, res: Response) => {
  try {
    const tokenAddress = req.params.tokenAddress;
    const tokenHolders = await TokenHolders.findOne({
      tokenAddress: tokenAddress,
    });

    res.json(tokenHolders);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({ error: "Failed to fetch transfers" });
  }
});

router.get("/user/:userAddress", async (req, res) => {
  try {
    const userAddress = req.params.userAddress;
    const data = await Blockvision.retrieveAddressTokens({
      address: userAddress,
    });

    console.log(data);

    res.json(data);
  } catch (error) {
    console.error("Error fetching holders:", error);
    res.status(500).json({ error: "Failed to fetch holders" });
  }
});

export default router;
