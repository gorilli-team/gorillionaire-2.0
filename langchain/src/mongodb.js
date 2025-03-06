import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_CONNECTION_STRING;

let client;
let db;

/**
 * Connect to MongoDB database
 * @returns {Promise<Db>} MongoDB database instance
 */
export async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("signals");
    console.log("Connected to MongoDB database");
  }
  return db;
}

/**
 * Fetch data from MongoDB transfers collection
 * @returns {Promise<string>} Formatted string with transfer data
 */
export async function fetchData() {
  try {
    const db = await connectDB();
    const spikes = db.collection("spikes");
    const transfers = db.collection("transfers");
    const listings = db.collection("listings");

    const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

    const spikesDocuments = await spikes
      .find({
        blockTimestamp: {
          $gte: twentyFourHoursAgo,
        },
      })
      .toArray();

    const transfersDocuments = await transfers
      .find({
        blockTimestamp: {
          $gte: twentyFourHoursAgo,
        },
      })
      .toArray();

    const listingsDocuments = await listings
      .find()
      .toArray();


    return (
      spikesDocuments
        .map(
          (doc) =>
            `Spike Event: Token Name: ${doc.tokenName}, Token Symbol: ${doc.tokenSymbol}, ` +
            `Hourly Transfers: ${doc.thisHourTransfers}, Previous Hour Transfers: ${doc.previousHourTransfers}`
        )
        .join("\n") +
      "\n" +
      transfersDocuments
        .map(
          (doc) =>
            `Transfer Event: Token Name: ${doc.tokenName}, Token Symbol: ${doc.tokenSymbol}, ` +
            `Amount: ${doc.amount}, From: ${doc.fromAddress}, To: ${doc.toAddress}`
        )
        .join("\n") +
      "\n" +
      listingsDocuments
        .map(
          (doc) =>
            `Listing Event: Token Name: ${doc.tokenName}, Token Symbol: ${doc.tokenSymbol}, Listing Date: ${doc.blockTimestamp}`
        )
        .join("\n")
    );
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    return "";
  }
}

/**
 * Close MongoDB connection
 */
export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("MongoDB connection closed");
  }
}
