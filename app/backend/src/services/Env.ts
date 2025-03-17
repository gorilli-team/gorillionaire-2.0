import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvs = [
  "MONGODB_CONNECTION_STRING",
  "PORT",
  "BLOCKVISION_API_URL",
  "BLOCKVISION_API_KEY",
  "ORG_SECRET_KEY",
  "ORG_DID",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "INDEXER_API_KEY",
  "CODEX_API_KEY",
  "ZEROX_API_KEY",
  "SCHEMA_ID",
];

// Check if all required environment variables are set
const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

if (missingEnvs.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvs.join(", ")}`
  );
}

// Export environment variables with types
export const env = {
  mongodbUri: process.env.MONGODB_CONNECTION_STRING!,
  port: parseInt(process.env.PORT!, 10),
  blockvision: {
    apiUrl: process.env.BLOCKVISION_API_URL!,
    apiKey: process.env.BLOCKVISION_API_KEY!,
  },
  nillion: {
    orgSecretKey: process.env.ORG_SECRET_KEY!,
    orgDid: process.env.ORG_DID!,
    schemaId: process.env.SCHEMA_ID!,
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
    chatId: process.env.TELEGRAM_CHAT_ID!,
  },
  indexer: {
    apiKey: process.env.INDEXER_API_KEY!,
  },
  codex: {
    apiKey: process.env.CODEX_API_KEY!,
  },
  zeroX: {
    apiKey: process.env.ZEROX_API_KEY!,
  },
};
