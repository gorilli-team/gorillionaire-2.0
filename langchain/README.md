# Signal agent (Langchain)

## Overview
The signal agent is the core part of the signal generation process. We used the Langchain framework, in order to create a coherent chain of prompts that translates into a useful trading signal for the user.

## How to run the project locally
1- Install the dependencies
```
cd langchain
npm install
```

2- Clone the .env.example and add all the variables listed
```
mv .env.example .env
```

3- Run the index.js script
```
cd src
node --env-file=../.env index.js
```

## Integration logic

### Data polling & Text splitting

**1- Fetching data generated in the previous hour from MongoDB**<br>
New data are fetched from these three collections on "signals" database in MongoDB:

- transfers
- spikes
- pricedatas<br>

The query filters the data generated with a timestamp within the previous hour, in order to ensure only the most up to date events are used for signal generation.

**2- The documents that matches the query are joined into a single string**<br>
This step is necessary for the TextSplitter to chunk it into coherent pieces to be retrived later in the chain of prompts.

**3- The TextSplitter splits the string into small chunks**<br>
The chunks are set to a chunkSize of 50, which has demonstrated to be the most suitable for our case, as the chunks will contain only one event, as expected.

**4- The chunks are translated into vectors and stored in Supabase**<br>
Through the OpenAI Embeddings, all the chunks are translated into their vector representation and stored in the "documents" database on Supabase, in order to facilitate the match_document function which will be responsible to find the best match between the input prompt and the chunks stored on Supabase.

![Data polling & Text splitting](./img/Data%20polling%20&%20Text%20splitting.png)

### Signal generation
The trading signals are generated through the combination of three smaller chains into one major prompt chain. The components of the chain are the following:
- **Standalone question**: this prompt is responsible for summing up the input prompt, which contains all the details about the signals to be generated, into a single standalone question. This way, it will be easier for the LLM (OpenAI) to match the input prompt with the chunks of events that will represents the context for the generated signal.<br>

- **Retriever**: this prompt is responsible for running the match_documents function on the Supabase database, for retrieving exactly 2 documents that best match the standalone question. This process is made by comparing the vector representations of both the standalone question and the chunk of events stored on Supabase.<br>

- **Answer**: this prompt is responsible for generating the trading signal. The response will take the original question (not the standalone one), and the context, which will be a unique string composed by the 2 documents retrived in the previous step, and will generate a trading signal based on the instructions outlined in the answer template. All the generated signals are then stored in the "generated-signals" collection on MongoDB.<br>
<br>

![Signal agent](./img/Signal%20agent.png)