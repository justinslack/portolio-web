import DiscogsRecord from "./DiscogsRecords";

interface DiscogsResponse {
  pagination: Pagination;
  releases: DiscogsRecord[];
}

interface Pagination {
  page: number;
  pages: number;
  per_page: number;
  items: number;
  urls: unknown;
}
export default DiscogsResponse;