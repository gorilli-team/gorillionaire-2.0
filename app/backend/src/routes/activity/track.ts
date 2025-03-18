import express, { Request, Response } from "express";
const router = express.Router();
import { ethers } from "ethers";
import UserActivity from "../../models/UserActivity";
import Intent from "../../models/Intent";
import { broadcastNotification } from "../../websocket";
import UserAuth from "../../models/UserAuth";

//track user signin
router.post("/signin", async (req, res) => {
  try {
    const { address } = req.body;
    const privyToken = req.headers.authorization?.replace("Bearer ", "");

    if (!address) {
      res.status(400).json({ error: "No address provided" });
      return;
    }

    const userAuth = await UserAuth.findOne({
      userAddress: address,
      privyAccessToken: privyToken,
    });

    if (!userAuth) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const userActivity = await UserActivity.findOne({
      address: address.toLowerCase(),
    });

    if (!userActivity) {
      //create user activity
      const newUserActivity = new UserActivity({
        address: address.toLowerCase(),
        points: 50,
        lastSignIn: new Date(),
        streak: 1,
        activitiesList: [
          {
            name: "Account Connected",
            points: 50,
            date: new Date(),
          },
        ],
      });
      await newUserActivity.save();
      res.json({ message: "User activity created" });
    } else {
      //update user activity
      userActivity.lastSignIn = new Date();
      //check if the user has connected their account in the last 24 hours
      const lastSignIn = new Date(userActivity.lastSignIn);
      const oneDayAgo = new Date();
      const twoDaysAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      if (lastSignIn < twoDaysAgo) {
        // More than 48 hours ago - reset streak to 1
        userActivity.streak = 1;
      } else if (lastSignIn < oneDayAgo) {
        // Between 24 and 48 hours ago - increment streak
        userActivity.streak += 1;
        userActivity.points += 10;
        userActivity.activitiesList.push({
          name: "Streak Extended",
          points: 10,
          date: new Date(),
        });
      } else {
        // Less than 24 hours ago - keep same streak
        // Do nothing to maintain current streak
      }
      await userActivity.save();
      res.json({ message: "User activity updated" });
    }
  } catch (error) {
    console.error("Error fetching points:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/trade-points", async (req, res) => {
  try {
    const { address, txHash, intentId } = req.body;
    const privyToken = req.headers.authorization?.replace("Bearer ", "");
    if (!address || !txHash || !intentId) {
      res.status(400).json({
        error: "Missing required fields: address, txHash, intentId",
      });
      return;
    }

    const userAuth = await UserAuth.findOne({
      userAddress: address,
      privyAccessToken: privyToken,
    });

    if (!userAuth) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const userActivity = await UserActivity.findOne({
      address: address.toLowerCase(),
    });

    if (!userActivity) {
      res.status(400).json({ error: "User activity not found" });
      return;
    }

    //check if the txHash is already in the userActivity.activitiesList
    if (
      userActivity.activitiesList.some((activity) => activity.txHash === txHash)
    ) {
      res.status(400).json({ error: "TxHash already exists" });
      return;
    }

    const intent = await Intent.findById(intentId);
    if (!intent) {
      res.status(400).json({ error: "Intent not found" });
      return;
    }

    if (intent.status !== "pending") {
      res.status(400).json({ error: "Intent already completed" });
      return;
    }
    if (intent.userAddress !== address) {
      res.status(400).json({ error: "Intent not for this address" });
      return;
    }

    const provider = new ethers.JsonRpcProvider(
      "https://testnet-rpc.monad.xyz"
    );
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      res.status(400).json({ error: "Tx not found" });
      return;
    }

    if (!tx.data.includes(intent.data)) {
      res.status(400).json({ error: "Intent not corresponding to tx data" });
      return;
    }

    //add the txHash to the userActivity.activitiesList
    const points = Math.floor(intent.usdValue);
    userActivity.activitiesList.push({
      name: "Trade",
      points: points,
      date: new Date(),
      txHash: txHash,
    });
    userActivity.points += points;
    await userActivity.save();

    //update intent status to completed
    intent.status = "completed";
    intent.txHash = txHash;
    await intent.save();

    //broadcast notification to all clients
    broadcastNotification({
      type: "NOTIFICATION",
      data: intent.toObject(),
    });

    res.json({ message: "Points added" });
  } catch (error) {
    console.error("Error fetching points:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user points
router.get(
  "/points",
  async (req: Request<{}, {}, {}, { address: string }>, res: Response) => {
    try {
      const { address } = req.query;
      if (!address) {
        res.status(400).json({ error: "No address provided" });
        return;
      }

      const userActivity = await UserActivity.findOne({
        address: address.toLowerCase(),
      });

      if (!userActivity) {
        res.json({ points: 0 });
        return;
      }

      res.json({
        points: userActivity.points,
        lastSignIn: userActivity.lastSignIn,
        nextRewardAvailable: userActivity.isRewarded
          ? new Date(userActivity.lastSignIn.getTime() + 24 * 60 * 60 * 1000)
          : new Date(),
      });
    } catch (error) {
      console.error("Error fetching points:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/leaderboard",
  async (
    req: Request<{}, {}, {}, { page: string; limit: string }>,
    res: Response
  ) => {
    try {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        UserActivity.find().sort({ points: -1 }).skip(skip).limit(limit),
        UserActivity.countDocuments(),
      ]);

      // Calculate the real rank by adding the skip value
      const usersWithRank = users.map((user, index) => {
        // Create a new object with all user properties plus the rank
        return {
          ...user.toObject(), // Convert Mongoose document to plain object
          rank: skip + index + 1, // Adjust rank based on pagination
        };
      });

      res.json({
        users: usersWithRank,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + users.length < total,
        },
      });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/me",
  async (req: Request<{}, {}, {}, { address: string }>, res: Response) => {
    try {
      const { address } = req.query;
      if (!address) {
        res.status(400).json({ error: "No address provided" });
        return;
      }
      const userActivity = await UserActivity.findOne({
        address: address.toLowerCase(),
      });
      if (!userActivity) {
        res.status(400).json({ error: "User activity not found" });
        return;
      }

      if (userActivity.activitiesList) {
        userActivity.activitiesList.sort((a, b) => {
          return (
            new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
          );
        });
      }
      //count the number of users with more points than the user
      const count = await UserActivity.countDocuments({
        $or: [
          { points: { $gt: userActivity.points } },
          {
            points: userActivity.points,
            createdAt: { $lt: userActivity.createdAt },
          },
        ],
      });
      //rank is the number of users with more points than the user + 1
      const result = {
        ...userActivity.toObject(),
        rank: count + 1,
      };

      res.json({
        userActivity: result,
      });
    } catch (error) {
      console.error("Error fetching user activity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
