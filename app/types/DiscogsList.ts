export interface DiscogsListItem {
  id: number;
  type: string; // "label", "release", "artist", etc.
  uri: string;
  resource_url: string;
  display_title: string;
  image_url?: string;
  comment?: string;
  // For releases, may include additional info
  basic_information?: {
    id: number;
    title: string;
    year: number;
    cover_image: string;
    thumb: string;
    artists: Array<{
      name: string;
      anv: string;
      id: number;
      resource_url: string;
    }>;
    formats: Array<{
      name: string;
      qty: string;
      descriptions?: string[];
    }>;
  };
}

export interface DiscogsList {
  id: number;
  name: string;
  description: string;
  items: DiscogsListItem[];
  public: boolean;
  image_url?: string;
  date_added: string;
  date_changed: string;
  uri: string;
  resource_url: string;
}

export interface DiscogsListsResponse {
  lists: Array<{
    id: number;
    name: string;
    description: string;
    public: boolean;
    image_url?: string;
    date_added: string;
    date_changed: string;
    uri: string;
    resource_url: string;
  }>;
}

export interface DiscogsListDetailsResponse {
  id: number;
  name: string;
  description: string;
  items: DiscogsListItem[];
  public: boolean;
  image_url?: string;
  date_added: string;
  date_changed: string;
  uri: string;
  resource_url: string;
}

