import { NextRequest, NextResponse } from 'next/server';
import { DocumentScraper } from '../indexing/scraping';
import { initializeGeminiService } from '@/lib/google-ai-studio/gemini';
import { PromptTemplate } from "@langchain/core/prompts";

const docScraper = new DocumentScraper();

// Create extraction prompt template

// TODO: Write html extraction prompt template
const extractionPrompt = PromptTemplate.fromTemplate(`
  You are an specialized content extraction expert, who has the ability to extract relevant data from HTML websites.
You are provided with the description of the entity, this entity represents overall topics of the HTML website.
You are also provided with the raw html content of a web page.
Your job is to use your expert ability to find all the relevant content, and return it as a Markdown.
Follow the next steps:
1. Remove navigation content and tags like menus
2. Extra full original content, don't make a summary
3. Preserve technical details like code snippets
4. Remove all HTML tags from the website 
5. Remove all images and content that is not relevant to the entity.
6. After all the steps above, make sure to just take the content relevant that is defined in the "entity description". This is the most important step.
7. Format the output as markdown
This is important, so make sure that you only return valid Markdown.
Entity description: {entityDescription}

Here is the html of the website:
{htmlContent}
  `);

export async function POST(request: NextRequest) {
  try {
    const { urls, entityDescription } = await request.json();
    console.log("Content Extraction for: ", urls, entityDescription)

    // TODO: Adjust to more powerful Gemini version for better extraction results
    const geminiService = initializeGeminiService("gemini-2.0-flash-lite-preview-02-05");

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({
        error: 'Valid URLs array is required'
      }, { status: 400 });
    }

    if (!entityDescription) {
      return NextResponse.json({
        error: 'Entity description is required'
      }, { status: 400 });
    }

    const results = await Promise.all(urls.map(async (url) => {
      try {
        // Scrape the URL
        const scrapedContent = await docScraper.scrapeUrl(url);

        // console.log("Scraped Content (" , url ,"): ", scrapedContent)

        // Format the prompt
        const formattedPrompt = await extractionPrompt.format({
          entityDescription,
          htmlContent: scrapedContent.rawHTML,
        });

        // Get structured response from Gemini
        const extractionResult = await geminiService.generateWithRetry(formattedPrompt);

        // console.log('Extraction Result:', extractionResult);

        return {
          url,
          status: 'success',
          data: extractionResult,
        };

      } catch (error) {
        console.error(`Error processing URL ${url}:`, error);
        return {
          url,
          status: 'error',
          error: error instanceof Error ? error.message : 'Failed to process URL'
        };
      }
    }));

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error) {
    console.error('Content extraction error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to extract content',
      status: 'error'
    }, { status: 500 });
  }
}