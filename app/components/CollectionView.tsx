'use client';

import { useState } from 'react';
import AlgoliaSearch from './AlgoliaSearch';
import {Search} from "lucide-react";
import {Button} from "@/components/ui/button";

interface CollectionViewProps {
  readonly folderId: number;
  readonly regularView: React.ReactNode;
}

export default function CollectionView({ folderId, regularView }: CollectionViewProps) {
  const [searchMode, setSearchMode] = useState(false);

  // Only show search in "All" folder (id = 0)
  const canSearch = folderId === 0;

  return (
    <div>
      {canSearch && (
        <div className="mb-6 flex items-center gap-4">
          <Button
            onClick={() => setSearchMode(false)}
            variant={searchMode ? 'outline' : 'default'}
          >
            Browse All
          </Button>
          <Button
            onClick={() => setSearchMode(true)}
            variant={searchMode ? 'default' : 'outline'}
          >
            <Search /> Search Collection
          </Button>
        </div>
      )}

      {searchMode && canSearch ? (
        <AlgoliaSearch />
      ) : (
        regularView
      )}
    </div>
  );
}
