import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

// Initialize Supabase and OpenAI clients
const sbApiKey = process.env.SUPABASE_API_KEY;
const sbUrl = process.env.SUPABASE_URL_GORILLIONAIRE;
const openAIApiKey = process.env.OPENAI_API_KEY;
const client = createClient(sbUrl, sbApiKey);

/**
 * Process text data and store in Supabase vector store
 * @param {string} text - Text data to process
 * @returns {Promise<void>}
 */
export async function processAndStoreData(text) {
  try {
    if (!text) {
      console.warn("No data provided to process.");
      return;
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 350,
      chunkOverlap: 50,
    });

    const output = await splitter.createDocuments([text]);
    console.log(`Processing ${output.length} chunks of data`);

    await SupabaseVectorStore.fromDocuments(
      output,
      new OpenAIEmbeddings({ openAIApiKey }),
      {
        client,
        tableName: 'documents',
      }
    );
    
    console.log("Data successfully processed and stored in Supabase");
  } catch (err) {
    console.error("Error processing and storing data:", err);
  }
}