# Challenge 3: Simple RAG - "The Question Answering Machine" 🤖

In this challenge, you'll implement a Retrieval-Augmented Generation (RAG) system to power accurate, context-aware answers about GCP documentation. RAG combines the power of large language models with your own knowledge base to provide more accurate, up-to-date, and relevant responses.

## Understanding RAG 🧠

Before diving in, let's understand what RAG is and why it's important:

- [Google Cloud's Guide to RAG](https://cloud.google.com/use-cases/retrieval-augmented-generation?hl=en) explains how RAG combines traditional information retrieval with generative AI
- [NVIDIA's RAG 101](https://developer.nvidia.com/blog/rag-101-demystifying-retrieval-augmented-generation-pipelines/) provides a technical deep-dive into RAG pipeline components

Key benefits of RAG:
- Provides up-to-date information from your knowledge base
- Reduces AI hallucinations through factual grounding
- Maintains data privacy by using your controlled data sources
- Enables domain-specific expertise


## Step 1: Explore the Search Codebase 🕵️‍♀️

Before implementing the search functionality, let's explore the existing codebase to understand the key components involved in the search and result display process.

### Core Components for a simple RAG Q&A implementation

1.  **Search Page (`src/app/search/page.tsx`)**:
    -   This is the page component for the semantic search feature.
    -   It integrates the `useVectorSearch` hook to perform searches and display results.
    -   It also uses the `useSummaryGen` hook to generate summaries.
    -   Key elements to examine:
        -   State variable `query`: Manages the user's search input.
        -   `handleSearch` function: Initiated when the user submits the search form. It calls `performSearch` from the `useVectorSearch` hook.
        -   `renderSearchResults` function:  This function is responsible for rendering the search results fetched by `useVectorSearch`. It iterates through the `results` array and displays each result with its title, section, content snippet, and a link to the documentation.

2.  **Search Summary Component (`src/app/components/SearchPanel/SearchSummary.tsx`)**:
    -   This component is dedicated to displaying the AI-generated summary of the search results.
    -   It handles different states: loading, error, and displaying the summary content.

3.  **Search Hook (`src/hooks/useVectorSearch.tsx`)**:
    -   This hook is responsible for handling the vector search logic on the frontend.
    -   It manages the state for search results, loading status, and errors.
    -   The `performSearch` function in this hook is the core function that sends the search query to the backend and processes the response.
    -   Key elements to examine:
        -   `performSearch` function: This function currently fetches data from `/api/test-vectorsearch`. You'll need to understand how this API route is implemented in the backend later.

4.  **Summary Generation Hook (`src/hooks/useSummaryGen.tsx`)**:
    -   This hook manages the generation of AI summaries based on search results.
    -   It handles state for the summary content, loading status, and potential errors.
    -   Key elements to examine:
        -   `generateSummary` function: Takes a query and search results, sends them to `/api/generate-summary` endpoint.
        -   State management for `summary`, `isLoading`, and `error` states.
        -   Proper error handling and type definitions for search results and options.

5.  **Vector Search Route (`src/app/api/test-vectorsearch/route.ts`)**:
    -   This Backend route (`route.ts` file) is the endpoint for handling vector searches.
    -   It receives the user's query from the frontend, generates an embedding for it, and performs a vector similarity search against the Firestore database.
    -   *This is where the core RAG logic lives.* 
    -   Key elements to examine:
        -   `Firestore`, `VectorQuery`, `VectorQuerySnapshot` from `@google-cloud/firestore` are used for interacting with Firestore and performing vector searches.
        -   `EmbeddingService` from  `@/app/api/indexing/embedding` is used to generate embeddings for the search query.
        -   `POST` function: This function handles the incoming search request.
        -   It extracts the `query` from the request body.
        -   It uses `embeddingService.getEmbeddings` to generate vector embeddings for the search query.
        -   It constructs a `VectorQuery` to perform a nearest neighbor search in the `chunks` collection, using the generated query vector and the `embedding` field.
        -   It executes the vector query using `vectorQuery.get()` and processes the results to extract relevant information like `documentId`, `content`, `metadata`, and `score`.
        -   Finally, it returns the search results as a JSON response.


## Step 2: Implement Query Embeddings 🧮

Now that we understand the codebase, let's implement the query embedding functionality in the vector search route. This will convert user queries into vector representations that can be used to find similar documents in our knowledge base.

### Background

In [Challenge 002](https://github.com/jakobap/aaron/blob/002-build-knowledgebase/002-build-knowledgebase.md), we created a knowledge base by:
1. Breaking documents into chunks
2. Converting those chunks into embeddings
3. Storing them in Firestore with vector search capabilities

Now we need to implement the query side of this equation by converting user questions into the same vector space.

### Implementation Details

The `test-vectorsearch` route needs to:
1. Receive the search query from the frontend
2. Generate an embedding for that query using the `EmbeddingService`
3. Use that embedding to perform a vector similarity search

We already have the `EmbeddingService` class implemented (see `src/app/api/indexing/embedding.tsx`), which handles the interaction with [Google Cloud's Text Embeddings API](https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-text-embeddings).

### Your Task
Use the `EmbeddingService` to implement the generation of query embeddings the vector search route.


## Step 3: Implement Vector Search 🔍

Now that we have our query embeddings, let's implement the nearest neighbor search functionality to find the most relevant documents in our knowledge base.

### Background

To complete the search functionality, we still need to:
1. Use these embeddings to find similar documents in our Firestore collection
2. Return the most relevant results based on vector similarity
3. Configure appropriate distance measures and thresholds

You can refer to the [Firestore Vector Search Documentation](https://firebase.google.com/docs/firestore/vector-search#make_a_nearest-neighbor_query).

### Your Task

Implement the nearest neighbor search in the vector search route.


## Step 4: Implement Summary Generation 📝

Now that we have relevant search results, let's implement the final response generation to provide concise, accurate answers based on the retrieved context.
The Summary prompt is the core, user facing piece of the RAG pipeline.

### Background

The summary generation is the final piece of our RAG pipeline. It:
1. Takes the user's question and retrieved context
2. Uses a carefully crafted prompt to guide the model
3. Generates a coherent, accurate response
4. Includes proper citations and source attribution

### Your Task

Write the prompt template to create effective result summaries. The prompt template requires two input variables. Considering the summary generation codebase, identify which variables are required in the prompt. Finally, implement the prompt accordingly

Consider:

1. **System Role and Context**
   - Define a clear expert persona
   - Set expectations for response format
   - Specify citation requirements

2. **Response Structure**
   - Direct answer to the question
   - Technical details and examples
   - Source citations
   - Confidence level
   - Follow-up suggestions

3. **Edge Cases**
   - Handling incomplete information
   - Managing contradictory sources
   - Dealing with ambiguous queries
langchain 

### Need Help?

- Review Google's [Prompt Engineering Best Practices](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/prompt-engineering)
- Understand [RAG-specific prompting techniques](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/rag)
- [Langchain Prompt Templates](https://python.langchain.com/docs/concepts/prompt_templates/)


## Step 5: Complete the Prompt Parameters & Log Input and Output

In the `generate-summary/route.tsx` file, we need to correctly pass the parameters to the prompt template. The `formattedPrompt` is currently missing its required parameters. Update the parameters accordingly.

These parameters will be used by the prompt template to generate the appropriate summary response.

Next, add a logging functionality that prints the full prompt that is send to the LLM every time a user triggers a search. Also, add the full output that the model returns given your prompt.

You should use a syntax similar to:
```typescript
console.log("Hello World")
```

## Next Steps
Run the appliction with:
```bash
npm run dev
```

Once the app is running visit `/search`.

That will bring you to the search interface
1. Test with a variety of queries that require information from your knowledge base to provide accurate answers
2. Experiment with the summary prompt based on results, to cater the result summary to your preference


**Challenge Complete!** 🎉

Congratulations! You've built a complete RAG-based Q&A system that can:
- Perform semantic search over GCP documentation
- Generate accurate, well-structured summaries
- Provide proper source attribution
- Handle various types of technical queries

On to the next one...!