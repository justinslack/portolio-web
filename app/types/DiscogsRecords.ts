interface DiscogsRecord {
  id: number;
  instance_id: number;
  date_added: string;
  rating: 0;
  basic_information: BasicInformation;
  uri?: string;
}

interface BasicInformation {
  cover_image: string;
  id: number;
  thumb: string;
  year: number;
  title: string;
  genres: string[];
  styles: string[];
  artists: Artist[];
  master_url: string;
  resource_url: string;
  uri: string;
  formats: Formats[];
  labels: string[];
}

interface Formats {
  descriptions: string[];
  name: string;
  qty: string;
  text: string;
}

export interface Artist {
  anv: string;
  id: string;
  name: string;
  resource_url: string;
  role: string;
  tracks: string;
}

export default DiscogsRecord;