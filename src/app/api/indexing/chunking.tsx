// src/app/api/indexing/chunking.ts

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


export interface ChunkingConfig {
  maxChunkSize: number;
  overlapSize: number;
  minChunkSize?: number;
}

export class DocumentChunker {
  
  // TODO: Implement Splitter (e.g. RecursiveCharacterTextSplitter)
  private splitter = 

  async chunkText(text: string): Promise<string[]> {
    
    if (!text || typeof text !== 'string') {
      return [];
    }

    const outputDocuments = await this.splitter.createDocuments([text]);
    return outputDocuments.map(d => d.pageContent);
  }

}