import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_CONNECTION_STRING;

let client;
let db;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("signals");
    console.log("Connected to MongoDB database");
  }
  return db;
}

export async function fetchData(currentDateISO) {
  try {
    const db = await connectDB();
    const generatedSignals = db.collection("generated-signals");

    console.log("Current date ISO:", currentDateISO);

    const generatedSignalsDocuments = await generatedSignals.find({created_at: {$gte: new Date(currentDateISO)}}).toArray();

    if (generatedSignalsDocuments.length === 0) {
      return "";
    }

    const formattedSignalData = generatedSignalsDocuments.map((doc) => {
      let rawCreatedAt = new Date(doc.created_at);
      let formattedCreatedAt = rawCreatedAt.toISOString();

      return {
        created_at: formattedCreatedAt,
        signal_text: { "%allot": doc.signal_text },
        events: { "%allot": doc.events },
      };
    });
    return formattedSignalData;
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    return "";
  }
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("MongoDB connection closed");
  }
}
