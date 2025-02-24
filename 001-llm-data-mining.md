 # Challenge 1: LLM Powered Data Mining - "Web Detective" 🕵️‍♀️

**Welcome, CE Intern!** For your first mission, you'll become a "Web Detective"! This challenge focuses on harnessing the power of Large Language Models (LLMs) to intelligently extract specific information from websites. Imagine you need to mine technical documentation from from the GCP website. Instead of building scrapers manually for every type of website we will use Gemini to evlauate the scraped content and make it ready to feed our knowledge base.

## Learning Objectives 🎯

In this challenge, you will:

*   **Text Prompting Basics:** Learn how to write a strong text prompt to have Gemini follow your instructions.
*   **Integrate Gemini API for Content Extraction:** Integrate the Gemini API into your programmatic workflow.

Good Luck!

### Step 1: Explore the Codebase 🕵️‍♀️

Familiarize yourself with the following files:
*   **`src/app/admin/page.tsx`**: (src/app/admin/page.tsx) This is the Admin Panel page built with React and Next.js. It provides a user interface to trigger content extraction from URLs by calling the content-extraction API endpoint. It also displays the extracted content and allows for indexing of documents. It contains the `handleExtractContent` function that contains the actual extraction logic. Review this code and try to undertand the logic.
*   **`src/app/components/AdminPanel/URLManager.tsx`**: (src/app/components/AdminPanel/URLManager.tsx) This React component provides the input form in the Admin Panel for users to enter URLs and an entity description for content extraction. It handles user input and submission to trigger the extraction process.
*   **`src/app/api/content-extraction/route.ts`**: (src/app/api/content-extraction/route.ts: startLine: 1, endLine: 91) This Next.js route handles the API endpoint for content extraction. It receives URLs and an entity description, scrapes content from the URLs, and is intended to use the Gemini API to extract relevant information. It also is home to the extraction prompt template.
*   **`src/app/api/indexing/scraping.tsx`**: (src/app/api/indexing/scraping.tsx: startLine: 1, endLine: 79) This file contains the `DocumentScraper` class, responsible for scraping HTML content.
*   **`src/lib/google-ai-studio/gemini.ts`**: (src/lib/google-ai-studio/gemini.ts: startLine: 1, endLine: 206) This file defines the `GeminiService` class, which provides an interface for interacting with the Google Gemini API. You'll use this service to process the scraped content.

Tip: If you are having trouble understanding what's going on in the code, why not connect [Gemini Code Assist](https://cloud.google.com/products/gemini/code-assist?hl=en) to ask for help?


### Step 2: Write an HTML to Text Extraction Prompt 📝

In this step, you will be creating the prompt that guides Gemini in extracting content from HTML.  You'll be defining the `extractionPrompt` variable in  `src/app/api/content-extraction/route.ts`. Currently, this part of the code is **missing**.

**Your Task:**

**Write the `extractionPrompt` from scratch.** You need to create a Langchain `PromptTemplate` that instructs the LLM to act as a "specialized content extraction expert" and extract relevant content from HTML based on an `entityDescription`.  Consider the following requirements for your prompt:
-   **Role Definition:** Clearly instruct the LLM to act as a specialized content extraction expert.
-   **Input Variables:**  The prompt should accept two input variables: `{entityDescription}` and `{htmlContent}`.
-   **Instructions for Extraction:** Provide detailed instructions on how to analyze the HTML content and extract relevant information.  Think about including instructions to:
    *   Identify sections matching the `entityDescription`.
    *   Extract the full original content, preserving structure.
    *   Remove navigation and boilerplate.
    *   Preserve technical details and code snippets.
    *   Format the output as clean, structured text.
    *   Avoid summarization and return full text.
    *   Evaluate all parts of the HTML input.
    *   Return cleaned text, not HTML code.

**Hints:**
To write an effective prompt, review the following Google Cloud & Langchain documentation:
*   [Introduction to Prompt Design](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/introduction-prompt-design)
*   [Design text prompts](https://cloud.google.com/vertex-ai/generative-ai/docs/text/text-prompts)
*   Use the [Prompt Testing UI](https://console.cloud.google.com/vertex-ai/studio/freeform) in Vertex AI to test your prompt performance.
*   Refer to the Langchain documentation for `PromptTemplate` syntax if needed: [Langchain Prompt Templates](https://python.langchain.com/docs/concepts/prompt_templates/). (Note: while the backend is in Typescript, the PromptTemplate concept is the same as in Python Langchain).

After writing your `extractionPrompt`, include it into the code as Prompt Template.


### Step 3: Fix the Gemini Content Generation 🔧

Now that you have your prompt template ready, let's make sure the Gemini service can actually process it! There's a bug in `gemini.ts` (our gemini api interface) that needs your attention.

Open `src/lib/google-ai-studio/gemini.ts` and locate the `generateContent` method. You'll notice that the actual call to generate content is commented out:

**Understanding the Call Hierarchy:**
- Exmine `src/app/api/content-extraction/route.ts` and understand the call hierchy and integration of the Gemini API. 
- Locate the code that actually calls the Gemini API and find the missing part.


**Your Task:**
1. Fix the Gemini Content Generation Method

**Hints:**
- Review the Gemini API documentation for the correct method call syntax:
  - [Gemini API Reference](https://ai.google.dev/gemini-api/docs/quickstart?lang=node)
  - [Text Generation Guide](https://ai.google.dev/gemini-api/docs/text-generation?lang=node)

**Testing Your Fix:**
1. You are now able to run Aaron locally using `npm run dev`.
2. Try our the Admin Panel's URL content extraction feature. For example you could try to extract the addresses and names of berlins top toy shops [from this website](https://www.visitberlin.de/en/blog/top-11-childrens-stores-berlin-christmas-shopping)


### Step 4: Explore Gemini Models for Enhanced Extraction 🚀

Currently, the application is not using the most powerful model by default. To optimize the content extraction process, especially for accuracy and handling complex content, it's beneficial to explore if a more powerful Gemini model is available and suitable for our task.

**Your Task:**

1.  **Explore Available Gemini Models:**
    *   Visit the [Gemini API documentation on models](https://ai.google.dev/gemini-api/docs/models/gemini) to understand the different Gemini models available. Pay attention to their capabilities, strengths, and use cases.
    *   Also, check the [documentation for experimental models](https://ai.google.dev/gemini-api/docs/models/experimental-models). Experimental models often offer the latest advancements and might provide better performance, but come with the caveat of potential instability or changes.

2.  **Identify a More Powerful Model (If Available):**
    *   Based on the documentation, indentify the model that might be best suited for the HTML to text extraction task. Consider factors like:
        *   **Multimodal Input:** Does the model support multimodal inputs if we decide to expand beyond text in the future?
        *   **Context Window:** Does it offer a larger context window for processing longer web pages?
        *   **Reasoning Capabilities:** Is it designed for complex reasoning tasks that might be beneficial for understanding and extracting information from diverse web content?
        *   **Speed and Cost:** While power is the focus, also consider the balance between performance, speed, and potential cost implications if different models have varying pricing.

3.  **Migrate to new model (if needed):**
    *   Decide if you want to upgrade to a more powerful model for content extraction. If you identify a suitable candidate apply the change in the code the change.


Congratulations, you finished Challenge 1! On to the next one (by switching to the next challenge branch).