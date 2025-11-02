interface DiscogsFolder {
  id: number;
  name: string;
  count: number;
  resource_url: string;
}

interface DiscogsFoldersResponse {
  folders: DiscogsFolder[];
}

export type { DiscogsFolder, DiscogsFoldersResponse };

