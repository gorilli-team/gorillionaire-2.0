//add a route to our backend that will receive the transfer data and store it in the database

const express = require("express");
const router = express.Router();
const Transfer = require("../../models/Transfer");
const Spike = require("../../models/Spike");
const { v4: uuidv4 } = require("uuid");
const { broadcastEvent } = require("../../websocket");

//get all tokens
router.get("/", async (req, res) => {
  try {
    // Get all tokens with their event counts
    const tokenStats = await Transfer.aggregate([
      {
        $group: {
          _id: "$tokenName",
          totalEvents: { $sum: 1 },
          tokenSymbol: { $first: "$tokenSymbol" },
          tokenAddress: { $first: "$tokenAddress" },
          firstEventDate: { $min: "$blockTimestamp" }, //make it in this format Feb 25, 2025 // Get the oldest event timestamp
        },
      },
    ]);

    const spikeStats = await Spike.aggregate([
      {
        $group: {
          _id: "$tokenName",
          totalEvents: { $sum: 1 },
          tokenSymbol: { $first: "$tokenSymbol" },
          tokenAddress: { $first: "$tokenAddress" },
          firstEventDate: { $min: "$blockTimestamp" }, //make it in this format Feb 25, 2025 // Get the oldest event timestamp
        },
      },
    ]);

    const tokensWithStats = tokenStats.map((token) => {
      // Find matching spike stats for this token
      const matchingSpike = spikeStats.find((spike) => spike._id === token._id);

      return {
        name: token._id,
        symbol: token.tokenSymbol,
        address: token.tokenAddress,
        totalEvents: token.totalEvents + (matchingSpike?.totalEvents || 0),
        trackedSince: token.firstEventDate
          ? formatDate(token.firstEventDate)
          : "Unknown",
        trackingTime: token.firstEventDate
          ? getTrackingTimeString(parseInt(token.firstEventDate))
          : "Unknown",
      };
    });

    res.json(tokensWithStats);
  } catch (error) {
    console.error("Error fetching token stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Helper function to calculate tracking time
function getTrackingTimeString(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  const diffInSeconds = now - timestamp;
  const diffInDays = Math.floor(diffInSeconds / (24 * 60 * 60));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInSeconds / (60 * 60));
    return `${diffInHours} hours`;
  }

  return `${diffInDays} days`;
}

function formatDate(timestamp) {
  const date = new Date(parseInt(timestamp) * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date
    .getDate()
    .toString()
    .padStart(2, "0")}, ${date.getFullYear()}`;
}

router.get("/:token", async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query object for the token
    const query = {
      tokenName: req.params.token,
    };

    let filteredTransfers = [];
    let filteredSpikes = [];

    if (
      req.query.type === "TRANSFER" ||
      req.query.type === "ALL" ||
      !req.query.type
    ) {
      // Fetch all transfers for this token (we'll filter by impact later)
      const transfers = await Transfer.find(query).sort({ blockTimestamp: -1 });

      // Map transfers to events and calculate impact
      const allTransfers = transfers.map((transfer) => {
        const amount = Number(transfer.amount) / 1e18;
        let impact =
          amount > 1000000 ? "HIGH" : amount > 500000 ? "MEDIUM" : "LOW";

        if (req.params.token === "Moyaki") {
          impact =
            amount > 10000000 ? "HIGH" : amount > 5000000 ? "MEDIUM" : "LOW";
        }

        return {
          id: transfer.id,
          type: "TRANSFER",
          blockTimestamp: transfer.blockTimestamp, // Keep original for sorting
          timestamp: transfer.blockTimestamp
            ? new Date(
                parseInt(transfer.blockTimestamp) * 1000
              ).toLocaleString()
            : new Date(transfer.timestamp).toLocaleString(),
          description: `Transferred ${amount.toLocaleString()} ${
            transfer.tokenSymbol
          }`,
          value: amount.toLocaleString(),
          impact: impact,
        };
      });

      // Apply impact filter if provided
      filteredTransfers = allTransfers;
      if (
        req.query.impact &&
        ["HIGH", "MEDIUM", "LOW"].includes(req.query.impact)
      ) {
        filteredTransfers = allTransfers.filter(
          (transfer) => transfer.impact === req.query.impact
        );
      }
    }

    if (
      req.query.type === "ACTIVITY_SPIKE" ||
      req.query.type === "ALL" ||
      !req.query.type
    ) {
      //get all spikes
      const allSpikes = await Spike.find(query).sort({ blockTimestamp: -1 });

      //map spikes to events
      const allSpikesEvents = allSpikes.map((spike) => {
        const increasePercentage =
          ((spike.thisHourTransfers - spike.previousHourTransfers) /
            spike.previousHourTransfers) *
          100;
        return {
          id: spike.id,
          type: "ACTIVITY_SPIKE",
          blockTimestamp: spike.blockTimestamp, // Keep original for sorting
          timestamp: spike.blockTimestamp
            ? new Date(parseInt(spike.blockTimestamp) * 1000).toLocaleString()
            : new Date(spike.timestamp).toLocaleString(),
          description: `${
            spike.tokenSymbol
          } Spike: ${spike.thisHourTransfers.toLocaleString()} transfers. Previous hour: ${spike.previousHourTransfers.toLocaleString()} 
(+${increasePercentage.toFixed(2)}%)`,
          value: spike.thisHourTransfers.toLocaleString(),
          impact:
            increasePercentage > 100
              ? "HIGH"
              : increasePercentage > 50
              ? "MEDIUM"
              : "LOW",
        };
      });

      // Apply impact filter if provided
      filteredSpikes = allSpikesEvents;
      if (
        req.query.impact &&
        ["HIGH", "MEDIUM", "LOW"].includes(req.query.impact)
      ) {
        filteredSpikes = allSpikesEvents.filter(
          (spike) => spike.impact === req.query.impact
        );
      }
    }
    //add spikes to events
    let filteredEvents = [...filteredTransfers, ...filteredSpikes];

    //sort events by blockTimestamp
    filteredEvents.sort((a, b) => b.blockTimestamp - a.blockTimestamp);

    // Apply pagination
    const totalCount = filteredEvents.length;
    const paginatedEvents = filteredEvents.slice(skip, skip + limit);

    // Get the oldest timestamp from all events
    const oldestEvent = filteredEvents.reduce((oldest, current) => {
      return parseInt(current.blockTimestamp) < parseInt(oldest.blockTimestamp)
        ? current
        : oldest;
    }, filteredEvents[0]);

    const tokenInfo = {
      name: req.params.token,
      symbol: req.params.token,
      address: req.params.token,
      totalEvents: totalCount,
      trackedSince: oldestEvent
        ? formatDate(oldestEvent.blockTimestamp)
        : "Unknown",
      trackingTime: oldestEvent
        ? getTrackingTimeString(oldestEvent.blockTimestamp)
        : "Unknown",
    };

    // Return events with pagination metadata
    res.status(200).json({
      tokenInfo: tokenInfo,
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
