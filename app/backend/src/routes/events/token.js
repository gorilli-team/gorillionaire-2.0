//add a route to our backend that will receive the transfer data and store it in the database

const express = require("express");
const router = express.Router();
const Transfer = require("../../models/Transfer");
const { v4: uuidv4 } = require("uuid");
const { broadcastEvent } = require("../../websocket");

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

// Example of how to broadcast a new event when it's created
router.post("/:token", async (req, res) => {
  try {
    // Process the new event
    //make an example of a new transfer
    const newTransfer = new Transfer({
      // ... transfer data from request
      id: uuidv4(),
      amount: 334443444333433333,
      tokenAddress: "0xE0590015A873bF326bd645c3E1266d4db41C4E6B",
      tokenDecimals: 18,
      tokenName: "Chog",
      tokenSymbol: "CHOG",
      blockTimestamp: 1714550400,
      timestamp: 1714550400,
      fromAddress: "0x1234567890123456789012345678901234567890",
      toAddress: "0x0987654321098765432109876543210987654321",
      transactionHash: "0x1234567890123456789012345678901234567890",
      blockNumber: 1,
      blockTimestamp: Math.floor(Date.now() / 1000),
    });

    await newTransfer.save();

    // Create event object
    const newEvent = {
      id: newTransfer._id.toString(),
      type: "TRANSFER",
      blockTimestamp: newTransfer.blockTimestamp,
      timestamp: new Date().toISOString(),
      description: `Transferred ${(
        Number(newTransfer.amount) / 1e18
      ).toLocaleString()} ${newTransfer.tokenSymbol}`,
      value: (Number(newTransfer.amount) / 1e18).toLocaleString(),
      impact:
        Number(newTransfer.amount) / 1e18 > 1000000
          ? "HIGH"
          : Number(newTransfer.amount) / 1e18 > 500000
          ? "MEDIUM"
          : "LOW",
    };

    // Broadcast to WebSocket clients
    broadcastEvent(req.params.token, newEvent);

    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

module.exports = router;
