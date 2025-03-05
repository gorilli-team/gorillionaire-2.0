import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { fetchData } from "./mongodb.js";

async function processText() {
    try {
        const text = await fetchData();

        if (!text) {
            console.warn("Nessun dato trovato nel database.");
            return;
        }

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50,
        });

        const output = await splitter.createDocuments([text]);
        console.log(output);
    } catch (err) {
        console.error("Errore:", err);
    }
}

processText();
