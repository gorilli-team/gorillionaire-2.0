import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_CONNECTION_STRING;

let client;
let db;

async function connectDB() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db('signals');
    }
    return db;
}

export async function fetchData() {
    try {
        const db = await connectDB();
        const collection = db.collection('transfers');

        const documents = await collection.find().toArray();

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
