import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { MongoClient } from "mongodb";

// Environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL_GORILLIONAIRE;
const POLLING_INTERVAL = 60 * 60 * 1000; // 1 hour

// Templates for prompts
const TEMPLATES = {
  standaloneQuestion:
    "Given a question, convert it into a standalone question. question: {question} standalone question:",
  answer: `You are an AI Agent that gives accurate trading signals about three tokens on the Monad Testnet. 
These three tokens are Molandak (DAK), Moyaki (YAKI), and Chog (CHOG).
Whenever a user asks you a question, you will evaluate the spike events and transfer events available in your context and respond with 
BUY or SELL, followed by the symbol of the token (if you give a signal about Molandak, ALWAYS refer to it as DAK, if you give a signal about Moyaki, ALWAYS refer to it as YAKI, if you give a signal about Chog, ALWAYS refer to it as CHOG), followed by the suggested quantity (for BUY signals please comunicate the nominal value, with max 2 decimals, for SELL signals please express the percentage of the tokens hold by the user that you suggest to sell) of that token, along with a Confidence Score, a measurement that goes 
from 0 to 10, with two decimals, that represents how much you feel confident about the signal you gave. 
These responses will have to reflect the exact market situation in which the user is operating and will have 
to allow the user to maximize profits from their trades.
Provide a mix of BUY and SELL signals, don't always give the same signal.
Consider that we want the user to spend an average of 5 MON per signal and that 1 MON is approximately 140 CHOG, 1600 YAKI and 8 DAK.

context: {context}
question: {question}
answer:`,
};

function combineDocuments(docs) {
  const combinedDocs = docs.map((doc) => doc.pageContent).join("\n\n");
  return combinedDocs;
}

function initializeServices() {
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });
  const llm = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0 });

  const client = createClient(SUPABASE_URL, SUPABASE_API_KEY);
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "documents",
    queryName: "match_documents",
  });

  const retriever = vectorStore.asRetriever();

  return { llm, retriever };
}

function createTradingChain() {
  const { llm, retriever } = initializeServices();
  const outputParser = new StringOutputParser();

  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    TEMPLATES.standaloneQuestion
  );
  const answerPrompt = PromptTemplate.fromTemplate(TEMPLATES.answer);

  const standaloneQuestionChain = standaloneQuestionPrompt
    .pipe(llm)
    .pipe(outputParser);
  const retrieverChain = RunnableSequence.from([
    (prevResult) => prevResult.standalone_question,
    retriever,
    combineDocuments,
  ]);

  const answerChain = answerPrompt.pipe(llm).pipe(outputParser);

  const saveSignalStep = async ({ context, answer }) => {
    await saveSignal(answer, context);
    return { context, answer };
  };

  return RunnableSequence.from([
    {
      standalone_question: standaloneQuestionChain,
      original_input: new RunnablePassthrough(),
    },
    {
      context: retrieverChain,
      question: ({ original_input }) => original_input.question,
    },
    {
      answer: answerChain,
      context: ({ context }) => context,
    },
    saveSignalStep,
  ]);
}

export async function getTradingSignal(question) {
  try {
    const chain = createTradingChain();
    const result = await chain.invoke({ question });

    return {
      signal: result,
      context: result.context || "No context available",
    };
  } catch (error) {
    console.error("Error generating trading signal:", error);
    throw error;
  }
}

export async function generateSignal() {
  const timestamp = new Date().toISOString();

  try {
    console.log(`\n[${timestamp}] Generating trading signal...`);

    const answer = await getTradingSignal(
      "Give me the best trading signal you can deduce from the context you have, do not repeat yourself, every signal must be different from the previous one, we want to make money."
    );

    console.log(`[${timestamp}] TRADING SIGNAL:`);
    console.log("-".repeat(50));
    console.log(answer.signal.answer);
    console.log("-".repeat(50));
  } catch (error) {
    console.error(`[${timestamp}] Error generating signal:`, error);
  }
}

async function saveSignal(signal, events) {
  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
  try {
    await client.connect();
    const db = client.db("signals");
    const generatedSignals = db.collection("generated-signals");

    const data = {
      created_at: new Date(),
      ...(signal && { signal_text: signal }),
      ...(events && { events }),
    };

    const result = await generatedSignals.insertOne(data);
    console.log("Signal saved to MongoDB: ", result.insertedId);
  } catch (error) {
    console.error("Error saving signal to MongoDB:", error);
  } finally {
    await client.close();
  }
}

export function startSignalPolling(interval = POLLING_INTERVAL) {
  console.log(
    `Starting trading signal generator with interval: ${
      interval / 1000
    } seconds`
  );

  generateSignal();
  const intervalId = setInterval(generateSignal, interval);

  process.on("SIGINT", () => {
    console.log("\nStopping trading signal generator...");
    clearInterval(intervalId);
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\nStopping trading signal generator...");
    clearInterval(intervalId);
    process.exit(0);
  });
}
