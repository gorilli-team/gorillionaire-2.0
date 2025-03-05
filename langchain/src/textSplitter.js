import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { fetchData } from "./mongodb.js";

async function processText() {
  try {
    const text = await fetchData();

    if (!text) {
      console.warn("Nessun dato trovato nel database.");
      return;
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 350,
      chunkOverlap: 50,
    });

    const output = await splitter.createDocuments([text]);

    const sbApiKey = process.env.SUPABASE_API_KEY;
    const sbUrl = process.env.SUPABASE_URL_GORILLIONAIRE;
    const openAIApiKey = process.env.OPENAI_API_KEY;

    const client = createClient(sbUrl, sbApiKey);

    await SupabaseVectorStore.fromDocuments(
      output,
      new OpenAIEmbeddings({ openAIApiKey }),
      {
        client,
        tableName: 'documents',
      }
    );
  } catch (err) {
    console.error("Error:", err);
  }
}

processText();
