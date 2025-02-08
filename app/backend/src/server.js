// server.js
const app = require("./app");
require("dotenv").config();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3003;

async function startServer() {
  try {
    // Ensure we're connecting to the right database
    const baseConnectionString = process.env.MONGODB_CONNECTION_STRING;
    // Remove any existing database name from the connection string
    const cleanConnectionString = baseConnectionString
      .split("/")
      .slice(0, -1)
      .join("/");
    const connectionString = `${cleanConnectionString}/gorillionaire`;

    console.log("Attempting to connect to gorillionaire database...");

    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Verify connection
    console.log("Connected to database:", mongoose.connection.db.databaseName);

    // List collections to verify access
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available collections in gorillionaire:",
      collections.map((c) => c.name)
    );

    app.listen(PORT, () => console.log(`Server running on port: ${PORT} 🚀`));
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
