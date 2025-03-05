import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

async function main() {
    try {
        const openAIApiKey = process.env.OPENAI_API_KEY;
        const llm = new ChatOpenAI({ openAIApiKey });
        
        const standaloneQuestionTemplate = 'Given a question, convert it into a standalone question. question: {question} standalone quesiton:';
        
        const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);
        
        const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm);
        
        const response = await standaloneQuestionChain.invoke({
            question: "In the current hyper-dynamic cryptoeconomic landscape, characterized by unprecedented market volatility and asymmetric information flows, what sophisticated, multi-variable quantitative and qualitative strategies would you recommend for optimizing potential return profiles across diverse token ecosystems, taking into account not just immediate price momentum, but also underlying technological fundamentals, network adoption metrics, developer activity, market capitalization trends, and potential disruptive technological innovations that could generate alpha in a high-uncertainty investment environment?"
        })
        
        console.log(response);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();