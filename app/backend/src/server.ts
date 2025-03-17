// server.js
import http from "http";
import app from "./app";
import { initWebSocketServer } from "./websocket";
import { initTokenHoldersCron } from "./cron/blockvision";
import { initPriceUpdateCron } from "./cron/prices";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { env } from "./services/Env";

dotenv.config();
const PORT = env.port;

async function startServer() {
  try {
    // Ensure we're connecting to the right database
    const baseConnectionString = env.mongodbUri;
    if (!baseConnectionString) {
      throw new Error("MONGODB_CONNECTION_STRING is not defined");
    }

    // Remove any existing database name from the connection string
    const cleanConnectionString = baseConnectionString
      .split("/")
      .slice(0, -1)
      .join("/");
    const connectionString = `${cleanConnectionString}/gorillionaire-v2`;

    console.log("Attempting to connect to gorillionaire database...");

    await mongoose.connect(connectionString);

    // Verify connection
    console.log("Connected to database:", mongoose.connection.db?.databaseName);

    // List collections to verify access
    const collections = await mongoose.connection.db
      ?.listCollections()
      .toArray();
    console.log(
      "Available collections in gorillionaire:",
      collections?.map((c) => c.name)
    );

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize WebSocket server
    const wss = initWebSocketServer(server);

    // Initialize cron jobs
    initTokenHoldersCron();
    initPriceUpdateCron();
    // Start server
    server.listen(PORT, () => {
      console.log(`HTTP server running on port ${PORT}`);
      console.log(`WebSocket server initialized`);
    });

    // Error handling for the server
    server.on("error", (error) => {
      console.error("Server error:", error);
      restartServer();
    });

    // Handle unexpected errors
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      restartServer();
    });

    process.on("unhandledRejection", (error) => {
      console.error("Unhandled Rejection:", error);
      restartServer();
    });

    // Return the server instance
    return server;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    restartServer();
  }
}

async function restartServer() {
  console.log("Attempting to restart server...");

  try {
    // Close existing connections
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");

    // Wait a bit before restarting
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Restarting server...");
    try {
      await startServer();
    } catch (error) {
      console.error("Failed to restart server:", error);
      // If restart fails, wait longer and try again
      setTimeout(restartServer, 10000);
    }
  } catch (error) {
    console.error("Error during server restart:", error);
    setTimeout(restartServer, 10000);
  }
}

// Start the server and store the instance
let serverInstance: http.Server | undefined;
startServer().then((server) => {
  serverInstance = server;
});

// Export the server instance and the startServer function
export default {
  get server() {
    return serverInstance;
  },
  startServer,
};
