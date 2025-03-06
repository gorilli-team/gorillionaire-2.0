import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_CONNECTION_STRING;

let client;
let db;

/**
 * Connect to MongoDB database
 * @returns {Promise<Db>} MongoDB database instance
 */
async function connectDB() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db('signals');
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
        const collection = db.collection('transfers');

        const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

        const documents = await collection.find({
            blockTimestamp: {
                $gte: twentyFourHoursAgo,
            },
        }).toArray();

        if (documents.length === 0) {
            console.warn("No documents found in the 'transfers' collection.");
            return '';
        }

        return documents.map((doc) => 
            `Token Name: ${doc.tokenName}, Token Symbol: ${doc.tokenSymbol}, ` +
            `Transaction Hash: ${doc.transactionHash}, From: ${doc.fromAddress}, ` +
            `To: ${doc.toAddress}, Amount: ${doc.amount}`
        ).join('\n');
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
        return '';
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

