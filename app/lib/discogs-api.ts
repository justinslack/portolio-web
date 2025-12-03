import DiscogsRecord from "../types/DiscogsRecords";
import DiscogsResponse from "../types/DiscogsResponse";
import { DiscogsFolder, DiscogsFoldersResponse } from "../types/DiscogsFolder";
import { DiscogsListsResponse, DiscogsListDetailsResponse } from "../types/DiscogsList";
import { discogsAuthFetch } from "./discogs-auth";
import { unstable_cache } from 'next/cache';

interface RecordsData {
  records: DiscogsRecord[];
  currentPage: number;
  totalPages: number;
}

// Next.js 16: Use unstable_cache for better control over caching
// Folders don't change often, cache for 1 hour with longer stale-while-revalidate
export const getFolders = unstable_cache(
  async (): Promise<DiscogsFolder[]> => {
    try {
      const response = await discogsAuthFetch(
        'https://api.discogs.com/users/justinslack/collection/folders',
        {
          next: { 
            revalidate: 3600, // 1 hour
            tags: ['discogs-folders']
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch folders');
      }

      const data = (await response.json()) as DiscogsFoldersResponse;
      return data.folders || [];
    } catch (error) {
      console.error('Error fetching folders:', error);
      return [];
    }
  },
  ['discogs-folders'],
  {
    revalidate: 3600, // 1 hour
    tags: ['discogs-folders']
  }
);

// Records change more frequently, cache for 10 minutes
export const getRecords = unstable_cache(
  async (page: number = 1, folderId: number = 0): Promise<RecordsData> => {
    try {
      const response = await discogsAuthFetch(
        `https://api.discogs.com/users/justinslack/collection/folders/${folderId}/releases?per_page=21&page=${page}&sort=added&sort_order=desc`,
        {
          next: { 
            revalidate: 600, // 10 minutes
            tags: [`discogs-records-${folderId}-${page}`]
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }

      const data = (await response.json()) as DiscogsResponse;
      return {
        records: data.releases,
        currentPage: data.pagination.page,
        totalPages: data.pagination.pages,
      };
    } catch (error) {
      console.error('Error fetching records:', error);
      return {
        records: [],
        currentPage: 1,
        totalPages: 1,
      };
    }
  },
  ['discogs-records'],
  {
    revalidate: 600, // 10 minutes
  }
);

// Lists don't change as frequently, cache for 30 minutes
export const getLists = unstable_cache(
  async (): Promise<DiscogsListsResponse['lists']> => {
    try {
      const response = await discogsAuthFetch(
        'https://api.discogs.com/users/justinslack/lists',
        {
          next: { 
            revalidate: 1800, // 30 minutes
            tags: ['discogs-lists']
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch lists');
      }

      const data = (await response.json()) as DiscogsListsResponse;
      return data.lists || [];
    } catch (error) {
      console.error('Error fetching lists:', error);
      return [];
    }
  },
  ['discogs-lists'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['discogs-lists']
  }
);

// Get details for a specific list
export const getListDetails = unstable_cache(
  async (listId: string): Promise<DiscogsListDetailsResponse | null> => {
    try {
      const response = await discogsAuthFetch(
        `https://api.discogs.com/lists/${listId}`,
        {
          next: { 
            revalidate: 1800, // 30 minutes
            tags: [`discogs-list-${listId}`]
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch list details');
      }

      const data = (await response.json()) as DiscogsListDetailsResponse;
      return data;
    } catch (error) {
      console.error('Error fetching list details:', error);
      return null;
    }
  },
  ['discogs-list-details'],
  {
    revalidate: 1800, // 30 minutes
  }
);

// Get full release details including videos
// Cache for 1 hour as release details don't change often
export const getReleaseDetails = unstable_cache(
  async (releaseId: number): Promise<DiscogsReleaseDetails | null> => {
    try {
      const response = await discogsAuthFetch(
        `https://api.discogs.com/releases/${releaseId}`,
        {
          next: { 
            revalidate: 3600, // 1 hour
            tags: [`discogs-release-${releaseId}`]
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch release details');
      }

      const data = (await response.json()) as DiscogsReleaseDetails;
      return data;
    } catch (error) {
      console.error('Error fetching release details:', error);
      return null;
    }
  },
  ['discogs-release-details'],
  {
    revalidate: 3600, // 1 hour
  }
);

// Interface for full release details
export interface DiscogsReleaseDetails {
  id: number;
  title: string;
  artists: Array<{
    name: string;
    anv: string;
    join: string;
    role: string;
    tracks: string;
    id: number;
    resource_url: string;
  }>;
  videos?: Array<{
    uri: string;
    title: string;
    description: string;
    duration: number;
    embed: boolean;
  }>;
  tracklist?: Array<{
    position: string;
    type_: string;
    title: string;
    duration: string;
  }>;
  year: number;
  genres: string[];
  styles: string[];
  images: Array<{
    type: string;
    uri: string;
    resource_url: string;
    uri150: string;
    width: number;
    height: number;
  }>;
}
