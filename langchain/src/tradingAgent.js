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

// Environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL_GORILLIONAIRE;

// Templates for prompts
const TEMPLATES = {
  standaloneQuestion:
    "Given a question, convert it into a standalone question. question: {question} standalone question:",
  answer: `You are an AI Agent that gives accurate trading signals about three tokens on the Monad Testnet. 
These three tokens are Molandak (DAK), Moyaki (YAKI), and Chog (CHOG). Keep an eye on the new token listing, as there could be new trading possibilities from that side.
Whenever a user asks you a question you will evaluate the recent transfers in your context and respond with 
HODL or BUY or SELL, followed by the symbol of the token, followed by the suggested quantity (only for BUY or SELL signals) of that token 
converted in a readable number with max 6 decimals, along with a Confidence Score, a measurement that goes 
from 0 to 10, with two decimals, that represents how much you feel confident about the signal you gave. 
These responses will have to reflect the exact market situation in which the user is operating and will have 
to allow the user to maximize the profit from their trades.

context: {context}
question: {question}
answer:`,
};

function combineDocuments(docs) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}

function initializeServices() {
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });
  const llm = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY });

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

  return RunnableSequence.from([
    {
      standalone_question: standaloneQuestionChain,
      original_input: new RunnablePassthrough(),
    },
    {
      context: retrieverChain,
      question: ({ original_input }) => original_input.question,
    },
    answerChain,
  ]);
}

export async function getTradingSignal(question) {
  try {
    const chain = createTradingChain();
    return await chain.invoke({ question });
  } catch (error) {
    console.error("Error generating trading signal:", error);
    throw error;
  }
}

export async function generateSignal() {
  const timestamp = new Date().toISOString();

  try {
    console.log(`\n[${timestamp}] Generating trading signal...`);

    const signal = await getTradingSignal(
      "Give me the best trading advice based on the most recent information you have in your context."
    );

    console.log(`[${timestamp}] TRADING SIGNAL:`);
    console.log("-".repeat(50));
    console.log(signal);
    console.log("-".repeat(50));
  } catch (error) {
    console.error(`[${timestamp}] Error generating signal:`, error);
  }
}

export function startSignalPolling(interval = 60000) {
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
