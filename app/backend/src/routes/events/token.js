//add a route to our backend that will receive the transfer data and store it in the database

const express = require("express");
const router = express.Router();
const Transfer = require("../../models/Transfer");
const { v4: uuidv4 } = require("uuid");

router.get("/:token", async (req, res) => {
  try {
    console.log("req.params.token", req.params.token);

    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await Transfer.countDocuments({
      tokenName: req.params.token,
    });

    // Fetch paginated transfers
    const transfers = await Transfer.find({ tokenName: req.params.token })
      .sort({ blockTimestamp: -1 })
      .skip(skip)
      .limit(limit);

    const events = transfers.map((transfer) => {
      return {
        id: transfer.id,
        type: "TRANSFER",
        timestamp: transfer.blockTimestamp
          ? new Date(parseInt(transfer.blockTimestamp) * 1000).toLocaleString()
          : new Date(transfer.timestamp).toLocaleString(),
        description: `Transferred ${(
          Number(transfer.amount) / 1e18
        ).toLocaleString()} ${transfer.tokenSymbol}`,
        value: (Number(transfer.amount) / 1e18).toLocaleString(),
        impact:
          Number(transfer.amount) / 1e18 > 1000000
            ? "HIGH"
            : Number(transfer.amount) / 1e18 > 500000
            ? "MEDIUM"
            : "LOW",
      };
    });

    // Return transfers with pagination metadata
    res.status(200).json({
      events,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({ error: "Failed to fetch transfers" });
  }
});

module.exports = router;
