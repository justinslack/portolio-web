'use client';

import { memo } from 'react';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { InstantSearch, SearchBox, InfiniteHits, Configure, Stats } from 'react-instantsearch';
import Image from 'next/image';
import Link from 'next/link';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);

interface HitProps {
  readonly hit: {
    readonly objectID: string;
    readonly title: string;
    readonly artist: string;
    readonly year: number;
    readonly styles: string[];
    readonly genres: string[];
    readonly coverImage: string;
    readonly thumb: string;
    readonly uri: string;
    readonly labels: string[];
  };
}

// Memoize Hit component to prevent re-renders of unchanged items
const Hit = memo(function Hit({ hit }: HitProps) {
  const hasImage = hit.coverImage && hit.coverImage !== '';
  
  return (
    <div className="bg-white rounded-lg p-6 flex flex-col gap-3 shadow-sm">
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
        {hasImage ? (
          <Image
            src={hit.coverImage}
            alt={`${hit.artist} - ${hit.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
            className="object-cover"
          />
        ) : (
          <svg
            width="150"
            height="150"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-300"
            aria-label="No album artwork available"
          >
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
            <path
              d="M50 2 L52 10 M50 2 L48 10"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        )}
      </div>
      <h2 className="text-lg font-bold">
        {hit.artist} - {hit.title}
      </h2>
      {hit.labels && hit.labels.length > 0 && (
        <p className="text-sm font-medium text-blue-600">
          {hit.labels[0]}
        </p>
      )}
      <p className="text-sm text-gray-600">{hit.year}</p>
      <p className="text-sm text-gray-600">{hit.styles.join(', ')}</p>
      <p>
        <Link 
          className="text-blue-500 hover:text-blue-700 transition-colors" 
          href={hit.uri} 
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Discogs
        </Link>
      </p>
    </div>
  );
});

export default function AlgoliaSearch() {
  return (
    <InstantSearch searchClient={searchClient} indexName="discogs_collection">
      <div className="mb-6 bg-white rounded-lg p-6 shadow-sm">
        <SearchBox
          placeholder="Search collection by artist, title, year, genre, style, etc..."
          classNames={{
            root: 'relative',
            form: 'relative',
            input: 'w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            submit: 'absolute right-3 top-1/2 -translate-y-1/2',
            reset: 'absolute right-12 top-1/2 -translate-y-1/2',
            submitIcon: 'w-5 h-5 text-gray-400',
            resetIcon: 'w-5 h-5 text-gray-400',
            loadingIndicator: 'absolute right-3 top-1/2 -translate-y-1/2',
            loadingIcon: 'w-5 h-5 text-blue-500'
          }}
        />
      </div>

      <div className="mb-4">
        <Stats
          classNames={{
            root: 'text-sm text-gray-600'
          }}
        />
      </div>

      <Configure hitsPerPage={21} />

      <InfiniteHits
        hitComponent={Hit}
        showPrevious={false}
        classNames={{
          root: '',
          list: 'grid md:grid-cols-3 gap-8',
          item: '',
          loadMore: 'mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer mx-auto block',
          disabledLoadMore: 'mt-8 px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed mx-auto block'
        }}
        translations={{
          showMoreButtonText: 'Load More Records'
        }}
      />
    </InstantSearch>
  );
}
