import dotenv from 'dotenv';
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

export async function fetchData() {
    try {
        const db = await connectDB();
        const generatedSignals = db.collection("generated-signals");

        const generatedSignalsDocuments = await generatedSignals.find().toArray();

        if (generatedSignalsDocuments.length === 0) {
            return "";
        }
        await closeConnection();
        return generatedSignalsDocuments;
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