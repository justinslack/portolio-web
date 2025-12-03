// Re-export show functions from markdown-renderer for backward compatibility
export { 
  getShowBySlug, 
  getAllShows,
  generateSlug 
} from './markdown-renderer';

import type { ShowMetadata } from '@/app/types/Show';
import { getAllShows } from './markdown-renderer';

/**
 * Get paginated shows
 */
export interface PaginatedShows {
  shows: ShowMetadata[];
  currentPage: number;
  totalPages: number;
  totalShows: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function getPaginatedShows(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedShows> {
  let shows = await getAllShows();
  
  const totalShows = shows.length;
  const totalPages = Math.ceil(totalShows / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  shows = shows.slice(startIndex, endIndex);
  
  return {
    shows,
    currentPage,
    totalPages,
    totalShows,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
