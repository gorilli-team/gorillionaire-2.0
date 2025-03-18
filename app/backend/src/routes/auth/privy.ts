import express from "express";
import UserAuth from "../../models/UserAuth";
const router = express.Router();

router.post("/", async (req, res) => {
  const { address, privyToken } = req.body;
  if (!address || !privyToken) {
    res.status(400).json({ error: "No address or privy token provided" });
    return;
  }

  const user = await UserAuth.findOne({ userAddress: address });
  if (!user) {
    const newUser = new UserAuth({
      userAddress: address,
      privyAccessToken: privyToken,
    });
    await newUser.save();
    res.json({ message: "User authenticated" });
  } else {
    user.privyAccessToken = privyToken;
    await user.save();
    res.json({ message: "User authenticated" });
  }
});

export default router;
