import DiscogsRecord from "../types/DiscogsRecords";
import DiscogsResponse from "../types/DiscogsResponse";
import { DiscogsFolder, DiscogsFoldersResponse } from "../types/DiscogsFolder";
import { discogsAuthFetch } from "./discogs-auth";

interface RecordsData {
  records: DiscogsRecord[];
  currentPage: number;
  totalPages: number;
}

export async function getFolders(): Promise<DiscogsFolder[]> {
  try {
    const response = await discogsAuthFetch(
      'https://api.discogs.com/users/justinslack/collection/folders',
      {
        next: { revalidate: 3600 }
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
}

export async function getRecords(page: number = 1, folderId: number = 0): Promise<RecordsData> {
  try {
    const response = await discogsAuthFetch(
      `https://api.discogs.com/users/justinslack/collection/folders/${folderId}/releases?per_page=21&page=${page}&sort=added&sort_order=desc`,
      {
        next: { revalidate: 3600 }
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
}
