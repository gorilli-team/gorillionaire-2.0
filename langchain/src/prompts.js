import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

async function main() {
    try {
        const openAIApiKey = process.env.OPENAI_API_KEY;

        const embeddings = new OpenAIEmbeddings({openAIApiKey});
        const sbApiKey = process.env.SUPABASE_API_KEY;
        const sbUrl = process.env.SUPABASE_URL_GORILLIONAIRE;

        const client = createClient(sbUrl, sbApiKey);

        const vectorStore = new SupabaseVectorStore(embeddings, {
            client,
            tableName: 'documents',
            queryName: 'match_documents'
        });

        const retreiver = vectorStore.asRetriever()
    
        const llm = new ChatOpenAI({ openAIApiKey });
        
        const standaloneQuestionTemplate = 'Given a question, convert it into a standalone question. question: {question} standalone quesiton:';
        
        const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

        const answerTemplate = "You are an AI Agent that gives accurate trading signals. Whenever a user asks you a question you will evaluate the recent transfers in your context and respond with HODL or BUY or SELL, only these three signals. These responses will have to reflect the exact market situation in which the user is operating and will have to allow the user to maximize the profit from their trades. context: {context} question: {question} answer:"

        const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

        const standaloneQuestionChain = standaloneQuestionPrompt
            .pipe(llm)
            .pipe(new StringOutputParser());
        const retreiverChain = RunnableSequence.from([
            prevResult => prevResult.standalone_question,
            retreiver,
            combineDocuments    
        ])
        const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

        function combineDocuments(docs) {
            return docs.map((doc) => doc.pageContent).join('n\n')
        }
        
        const chain = RunnableSequence.from([
            {
                standalone_question: standaloneQuestionChain,
                original_input: new RunnablePassthrough()
            },
            {
                context: retreiverChain,
                question: ({ original_input }) => original_input.question
            },
            answerChain
        ])
        
        const response = await chain.invoke({
            question: "What should I do if I want to sell a large quantity of CHOG in this moment?"
        })

        
        console.log(response);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();