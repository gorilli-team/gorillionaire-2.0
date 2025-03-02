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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query object for the token
    const query = { tokenName: req.params.token };

    // Fetch all transfers for this token (we'll filter by impact later)
    const transfers = await Transfer.find(query).sort({ blockTimestamp: -1 });

    // Map transfers to events and calculate impact
    const allEvents = transfers.map((transfer) => {
      const amount = Number(transfer.amount) / 1e18;
      const impact =
        amount > 1000000 ? "HIGH" : amount > 500000 ? "MEDIUM" : "LOW";

      return {
        id: transfer.id,
        type: "TRANSFER",
        blockTimestamp: transfer.blockTimestamp, // Keep original for sorting
        timestamp: transfer.blockTimestamp
          ? new Date(parseInt(transfer.blockTimestamp) * 1000).toLocaleString()
          : new Date(transfer.timestamp).toLocaleString(),
        description: `Transferred ${amount.toLocaleString()} ${
          transfer.tokenSymbol
        }`,
        value: amount.toLocaleString(),
        impact: impact,
      };
    });

    // Apply impact filter if provided
    let filteredEvents = allEvents;
    if (
      req.query.impact &&
      ["HIGH", "MEDIUM", "LOW"].includes(req.query.impact)
    ) {
      filteredEvents = allEvents.filter(
        (event) => event.impact === req.query.impact
      );
    }

    // Apply pagination
    const totalCount = filteredEvents.length;
    const paginatedEvents = filteredEvents.slice(skip, skip + limit);

    // Return events with pagination metadata
    res.status(200).json({
      events: paginatedEvents,
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
