import DiscogsRecord from "../types/DiscogsRecords";
import DiscogsResponse from "../types/DiscogsResponse";
import { DiscogsFolder, DiscogsFoldersResponse } from "../types/DiscogsFolder";
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
