"use client"
import React, { useState } from 'react';
import { Search, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import SearchSummary from '@/app/components/SearchPanel/SearchSummary';
import { useVectorSearch } from '@/hooks/useVectorSearch';
import { useSummaryGen } from '@/hooks/useSummaryGen';

const SemanticSearchPage = () => {
  const [query, setQuery] = useState('');
  const { 
    performSearch, 
    results, 
    isLoading: isSearching, 
    error: searchError,
    setResults
  } = useVectorSearch();
  
  const {
    generateSummary,
    summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    setSummary
  } = useSummaryGen();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Reset states
    setResults([]);
    setSummary(null);

    try {
      // Perform vector search
      // TODO: Correct the vector search input variable
      const searchResults = await performSearch("Hello World");
      console.log('Vector search results:', searchResults);

      // Generate summary if we have results
      if (searchResults?.length > 0) {
        const summaryText = await generateSummary(query, searchResults);
        console.log('Generated summary:', summaryText);
      }
    } catch (err) {
      console.error('Error during search:', err);
    }
  };

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="mt-2 text-gray-600">Searching documentation...</p>
        </div>
      );
    }

    if (searchError) {
      return (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{searchError}</p>
        </div>
      );
    }

    if (results.length === 0 && query && !isSearching) {
      return (
        <div className="text-center py-12 text-gray-500">
          No results found. Try refining your search query.
        </div>
      );
    }

    return results.map((result, index) => (
      <div
        key={`${result.documentId}-${index}`}
        className="bg-white rounded-lg shadow-md p-6 transition-shadow hover:shadow-lg"
      >
        {result.metadata?.title && (
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {result.metadata.title}
          </h2>
        )}
        {result.metadata?.section && (
          <p className="text-sm text-gray-500 mb-2">
            Section: {result.metadata.section}
          </p>
        )}
        <p className="text-gray-600 mb-4">{result.content}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Relevance Score: {(1 - result.score).toFixed(2)}
          </span>
          <a
            href={`https://cloud.google.com/${result.documentId.replace(/-/g, '/')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
          >
            View Documentation
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-gray-900">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GCP Documentation Search</h1>
          <p className="mt-2 text-gray-600">
            Search through indexed Google Cloud documentation using semantic search
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., How to configure automated backups in Cloud SQL?"
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>

        {/* Summary Section */}
        <SearchSummary
          summary={summary}
          isLoading={isSummaryLoading}
          error={summaryError}
        />

        {/* Search Results */}
        <div className="space-y-6">
          {renderSearchResults()}
        </div>
      </div>
    </div>
  );
};

export default SemanticSearchPage;