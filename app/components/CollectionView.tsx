'use client';

import { useState, lazy, Suspense, memo, useCallback } from 'react';
import {Search} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';

// Lazy load AlgoliaSearch component for better initial bundle size
const AlgoliaSearch = lazy(() => import('./AlgoliaSearch'));

interface CollectionViewProps {
  readonly folderId: number;
  readonly regularView: React.ReactNode;
}

// Loading skeleton for search component
function SearchLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 bg-gray-200 rounded-lg h-16" />
      <div className="grid grid-cols-3 gap-16">
        {Array.from({ length: 21 }, (_, i) => (
          <div key={`skeleton-${i}`} className="bg-gray-200 rounded-lg h-96" />
        ))}
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
function CollectionView({ folderId, regularView }: CollectionViewProps) {
  const [searchMode, setSearchMode] = useState(false);

  // Only show search in "All" folder (id = 0)
  const canSearch = folderId === 0;

  // Memoize callbacks to prevent re-creation on every render
  const enableSearchMode = useCallback(() => setSearchMode(true), []);
  const disableSearchMode = useCallback(() => setSearchMode(false), []);

  return (
    <div>
      {canSearch && (
        <div className="mb-6 flex items-center gap-4">
          <Button
            onClick={disableSearchMode}
            variant={searchMode ? 'outline' : 'default'}
            aria-label="Switch to browse mode"
          >
            Browse All
          </Button>
          <Button
            onClick={enableSearchMode}
            variant={searchMode ? 'default' : 'outline'}
            aria-label="Switch to search mode"
          >
            <Search aria-hidden="true" /> Search Collection
          </Button>
          <div className="mb-4 flex justify-end gap-2 w-full items-center">
            <span className="text-sm text-gray-600">Search powered by</span>
            <Link href="https://www.algolia.com/" target="_blank" rel="noopener noreferrer">
              <Image src="/Algolia-logo-blue.svg" alt="Algolia" width={80} height={20} />
            </Link>
          </div>
        </div>
      )}

      {searchMode && canSearch ? (
        <Suspense fallback={<SearchLoadingSkeleton />}>
          <AlgoliaSearch />
        </Suspense>
      ) : (
        regularView
      )}
    </div>
  );
}

// Export memoized version to prevent re-renders when parent updates
export default memo(CollectionView);
